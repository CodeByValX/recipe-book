import { useCallback, useEffect, useState } from 'react';

// Runs an async function on mount / when deps change, with loading + error state.
// The cleanup flag prevents state updates after unmount (or after deps changed).
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    fetcher()
      .then((result) => active && setData(result))
      .catch((err) => active && setError(err.message || 'Failed to load data.'))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, setData, loading, error, reload };
}
