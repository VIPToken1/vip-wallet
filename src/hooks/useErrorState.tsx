import { useEffect, useRef, useState } from 'react';

const DEFAULT_TIMEOUT = 3e3;

type ErrorStateConfig = {
  timeout?: number;
};

const useErrorState = (
  initialError: string = '',
  config?: ErrorStateConfig
) => {
  const [error, setError] = useState(initialError);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      () => setError(''),
      config?.timeout || DEFAULT_TIMEOUT
    );
    return () => clearTimeout(timeoutRef.current as NodeJS.Timeout);
  }, [error, config?.timeout]);

  return [error, setError] as const;
};

export default useErrorState;
