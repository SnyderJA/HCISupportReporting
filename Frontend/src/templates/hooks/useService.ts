import { useCallback, useEffect, useState } from 'react';

const useService = <T, E = string>(service: any, immediate = false) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(
    async (params?: any) => {
      setLoading(true);
      setValue(null);
      setError(null);
      const [error, res] = await service(params);
      setError(error);
      setValue(res.data);
      setLoading(false);
      return [error, res];
    },
    [service]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate]);
  return { execute, loading, value, error };
};
export default useService;
