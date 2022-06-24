import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useState
} from 'react';

export type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => null
});

const AuthContextProvider: FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
