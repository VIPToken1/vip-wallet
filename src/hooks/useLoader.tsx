import { useContext } from 'react';
import { LoaderContext } from 'contexts/LoaderContext';
import type { LoaderContextType } from 'contexts/LoaderContext';

export const useLoader = (): LoaderContextType => {
  const loader = useContext(LoaderContext);
  return loader;
};

export default useLoader;
