
import { useState, useEffect } from 'react';
import { fetchPanchangam } from '../services/api';
import { getPanchangam, savePanchangam } from '../services/cache';

export function usePanchangam(date: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Try cache first
        const cached = await getPanchangam(date);
        
        if (cached && mounted) {
          setData({ ...cached, cached: true });
          setLoading(false);
        }

        // Fetch fresh data (will use fallback if API fails)
        const fresh = await fetchPanchangam(date);
        
        if (fresh && mounted) {
          setData(fresh);
          
          // Only save to cache if it's not already fallback data
          if (!fresh.cached) {
            await savePanchangam(fresh);
          }
          setLoading(false);
        }
      } catch (err) {
        console.warn('Data load error:', err);
        if (mounted) {
          setError(null); // Don't show error, fallback data is used
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [date]);

  return { data, loading, error };
}
