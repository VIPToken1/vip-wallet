import { Loader } from 'components/Loader';
import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useState
} from 'react';

export type LoaderContextType = {
  isLoaderVisible: boolean;
  setLoader: Dispatch<SetStateAction<boolean>>;
};

const LoaderContext = createContext<LoaderContextType>({
  isLoaderVisible: false,
  setLoader: () => null
});

const LoaderContextProvider: FC = ({ children }) => {
  const [isLoaderVisible, setLoader] = useState(false);
  return (
    <LoaderContext.Provider value={{ isLoaderVisible, setLoader }}>
      <Loader isLoaderVisible={isLoaderVisible} />
      {children}
    </LoaderContext.Provider>
  );
};

export { LoaderContext, LoaderContextProvider };
