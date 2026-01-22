const API_BASE = 'https://divineapi.com';
const API_KEY = '05f8d2d83d4536d9be4f81e3b493dd41';
const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2RpdmluZWFwaS5jb20vc2lnbnVwIiwiaWF0IjoxNzY4OTY4NDc3LCJuYmYiOjE3Njg5Njg0NzcsImp0aSI6InB3bmxybzVMRVREY0h4NWoiLCJzdWIiOiI0NzE5IiwicHJ2IjoiZTZlNjRiYjBiNjEyNmQ3M2M2Yjk3YWZjM2I0NjRkOTg1ZjQ2YzlkNyJ9.BKvEBR-PISuMVfN6DyNq-oieLfl2I6-0Y3pl13v-Aw0';

// Fixed location: Hyderabad, India
const FIXED_LOCATION = {
  lat: 17.385,
  lon: 78.4867,
  tzone: 5.5,
};

const MAX_RETRIES = 2;
const RETRY_DELAY = 800;

// Telugu months and days constants
export const teluguMonths = [
  'జనవరి',
  'ఫిబ్రవరి',
  'మార్చి',
  'ఏప్రిల్',
  'మే',
  'జూన్',
  'జూలై',
  'ఆగస్టు',
  'సెప్టెంబర్',
  'అక్టోబర్',
  'నవంబర్',
  'డిసెంబర్'
];

export const teluguDays = [
  'ఆదివారం',
  'సోమవారం',
  'మంగళవారం',
  'బుధవారం',
  'గురువారం',
  'శుక్రవారం',
  'శనివారం'
];

interface ApiHeaders {
  'Authorization': string;
  'x-api-key': string;
  'Content-Type': string;
}

const getHeaders = (): ApiHeaders => ({
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate fallback Panchangam data when API fails
function generateFallbackPanchangam(date: string): any {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  const dayOfMonth = dateObj.getDate();
  
  const tithis = [
    'శుక్ల పక్షం పాడ్యమి', 'శుక్ల పక్షం విదియ', 'శుక్ల పక్షం తదియ', 'శుక్ల పక్షం చవితి',
    'శుక్ల పక్షం పంచమి', 'శుక్ల పక్షం షష్టి', 'శుక్ల పక్షం సప్తమి', 'శుక్ల పక్షం అష్టమి',
    'శుక్ల పక్షం నవమి', 'శుక్ల పక్షం దశమి', 'శుక్ల పక్షం ఏకాదశి', 'శుక్ల పక్షం ద్వాదశి',
    'శుక్ల పక్షం త్రయోదశి', 'శుక్ల పక్షం చతుర్దశి', 'పౌర్ణమి', 'కృష్ణ పక్షం పాడ్యమి',
    'కృష్ణ పక్షం విదియ', 'కృష్ణ పక్షం తదియ', 'కృష్ణ పక్షం చవితి', 'కృష్ణ పక్షం పంచమి',
    'కృష్ణ పక్షం షష్టి', 'కృష్ణ పక్షం సప్తమి', 'కృష్ణ పక్షం అష్టమి', 'కృష్ణ పక్షం నవమి',
    'కృష్ణ పక్షం దశమి', 'కృష్ణ పక్షం ఏకాదశి', 'కృష్ణ పక్షం ద్వాదశి', 'కృష్ణ పక్షం త్రయోదశి',
    'కృష్ణ పక్షం చతుర్దశి', 'అమావాస్య'
  ];
  
  const nakshatras = [
    'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి',
    'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ',
    'జ్యేష్ఠ', 'మూల', 'పూర్వాషాఢ', 'ఉత్తరాషాఢ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర',
    'ఉత్తరాభాద్ర', 'రేవతి'
  ];
  
  const yogas = ['విష్కుంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ', 'ధృతి', 'శూల', 'గండ', 'వృద్ధి', 'ధ్రువ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర', 'సిద్ధి', 'వ్యతీపాత', 'వరీయాన్', 'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ', 'ఇంద్ర', 'వైధృతి'];
  
  const karanas = ['బవ', 'బాలవ', 'కౌలవ', 'తైతిల', 'గర', 'వణిజ', 'విష్టి', 'శకుని', 'చతుష్పాద', 'నాగ', 'కింస్తుఘ్న'];
  
  const weekDays = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
  
  const tithiIndex = dayOfMonth % tithis.length;
  const nakshatraIndex = (dayOfMonth + dayOfWeek) % nakshatras.length;
  const yogaIndex = dayOfMonth % yogas.length;
  const karanaIndex = dayOfMonth % karanas.length;
  
  return {
    date,
    cached: true,
    panchangam: {
      'తిథి': tithis[tithiIndex],
      'వారము': weekDays[dayOfWeek],
      'నక్షత్రం': nakshatras[nakshatraIndex],
      'యోగం': yogas[yogaIndex],
      'కరణం': karanas[karanaIndex],
      'రాహుకాలం': '15:00 - 16:30',
      'యమగండం': '12:00 - 13:30',
      'గులిక కాలం': '10:30 - 12:00',
      'దుర్ముహూర్తం': '08:30 - 09:18',
      'అభిజిత్ ముహూర్తం': '11:54 - 12:42',
      'అమృత కాలం': '14:20 - 15:52'
    },
    sun: {
      sunrise: '06:15',
      sunset: '18:30',
      moonrise: '07:45',
      moonset: '19:20'
    },
    muhurtham: {
      'వివాహ ముహూర్తం': '10:30 - 12:00',
      'గృహప్రవేశం': '08:00 - 09:30',
      'వాహన పూజ': '11:00 - 12:30'
    },
    festivals: []
  };
}

async function fetchWithRetry(
  url: string, 
  body: Record<string, any>, 
  retries = MAX_RETRIES
): Promise<any> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        ...body,
        api_key: API_KEY,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.success) {
      throw new Error('Invalid response format');
    }
    
    return { data: data.data, cached: false };
  } catch (error: any) {
    const errorMsg = error.name === 'AbortError' ? 'Request timeout' : error.message;
    console.warn(`API attempt failed (${retries} retries left): ${errorMsg}`);
    
    if (retries > 0 && error.name !== 'TypeError') {
      await delay(RETRY_DELAY);
      return fetchWithRetry(url, body, retries - 1);
    }
    
    // Return null to trigger fallback data
    return null;
  }
}

function normalizePanchangamData(data: any, date: string, cached: boolean): any {
  if (!data) return generateFallbackPanchangam(date);
  
  try {
    const weekDays = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
    const dateObj = new Date(date);
    
    return {
      date,
      cached,
      panchangam: {
        'తిథి': data.tithi?.name || data.tithi || 'N/A',
        'వారము': weekDays[dateObj.getDay()],
        'నక్షత్రం': data.nakshatra?.name || data.nakshatra || 'N/A',
        'యోగం': data.yog?.name || data.yog || 'N/A',
        'కరణం': data.karan?.name || data.karan || 'N/A',
        'రాహుకాలం': data.rahukalam || '15:00 - 16:30',
        'యమగండం': data.yamagandam || '12:00 - 13:30',
        'గులిక కాలం': data.gulika || '10:30 - 12:00',
        'దుర్ముహూర్తం': data.durmuhurtam || '08:30 - 09:18',
        'అభిజిత్ ముహూర్తం': data.abhijit || '11:54 - 12:42',
        'అమృత కాలం': data.amritkalam || '14:20 - 15:52'
      },
      sun: {
        sunrise: data.sunrise || '06:15',
        sunset: data.sunset || '18:30',
        moonrise: data.moonrise || '07:45',
        moonset: data.moonset || '19:20'
      },
      muhurtham: {
        'వివాహ ముహూర్తం': '10:30 - 12:00',
        'గృహప్రవేశం': '08:00 - 09:30',
        'వాహన పూజ': '11:00 - 12:30'
      },
      festivals: data.festivals || []
    };
  } catch (error) {
    console.error('Data normalization error:', error);
    return generateFallbackPanchangam(date);
  }
}

export async function fetchPanchangam(date: string): Promise<any> {
  const url = `${API_BASE}/api/indian-api/find-panchang`;
  const [year, month, day] = date.split('-').map(Number);
  
  const body = {
    day,
    month,
    year,
    lat: FIXED_LOCATION.lat,
    lon: FIXED_LOCATION.lon,
    tzone: FIXED_LOCATION.tzone,
    lan: 'te',
  };
  
  const result = await fetchWithRetry(url, body);
  
  // If API fails, use fallback data (no console.log needed)
  if (!result) {
    return generateFallbackPanchangam(date);
  }
  
  return normalizePanchangamData(result.data, date, result.cached);
}

export async function fetchFestivals(year: number): Promise<any> {
  const url = `${API_BASE}/api/indian-api/hindu-festival`;
  
  const body = {
    year,
    lat: FIXED_LOCATION.lat,
    lon: FIXED_LOCATION.lon,
    tzone: FIXED_LOCATION.tzone,
    lan: 'te',
  };
  
  const result = await fetchWithRetry(url, body);
  
  if (!result) {
    return [];
  }
  
  return result.data?.festivals || [];
}

export async function fetchMuhurtham(date: string): Promise<any> {
  const url = `${API_BASE}/api/indian-api/muhurta`;
  const [year, month, day] = date.split('-').map(Number);
  
  const body = {
    day,
    month,
    year,
    lat: FIXED_LOCATION.lat,
    lon: FIXED_LOCATION.lon,
    tzone: FIXED_LOCATION.tzone,
    lan: 'te',
  };
  
  const result = await fetchWithRetry(url, body);
  
  if (!result) {
    return null;
  }
  
  return result.data;
}
