import { PanchangamData } from './api';

const DB_NAME = 'TeluguCalendarDB';
const DB_VERSION = 1;
const STORE_NAME = 'panchangam';
const FESTIVALS_STORE = 'festivals';

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'date' });
      }
      
      if (!db.objectStoreNames.contains(FESTIVALS_STORE)) {
        db.createObjectStore(FESTIVALS_STORE, { keyPath: 'year' });
      }
    };
  });
}

export async function savePanchangam(data: PanchangamData): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.put(data);
  } catch (error) {
    console.error('Cache save error:', error);
  }
}

export async function getPanchangam(date: string): Promise<PanchangamData | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.get(date);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

export async function saveFestivals(year: number, festivals: any[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([FESTIVALS_STORE], 'readwrite');
    const store = transaction.objectStore(FESTIVALS_STORE);
    
    // Ensure the object has the correct structure with year as key
    const festivalRecord = {
      year: year,
      data: festivals,
      timestamp: Date.now()
    };
    
    store.put(festivalRecord);
    
    // Wait for transaction to complete
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Festivals cache error:', error);
  }
}

export async function getFestivals(year: number): Promise<any[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([FESTIVALS_STORE], 'readonly');
    const store = transaction.objectStore(FESTIVALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(year);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.data || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Festivals get error:', error);
    return null;
  }
}

export async function preloadYearData(year: number): Promise<void> {
  const promises: Promise<void>[] = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      promises.push(
        (async () => {
          const cached = await getPanchangam(date);
          if (!cached) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        })()
      );
    }
  }
  
  await Promise.all(promises);
}
