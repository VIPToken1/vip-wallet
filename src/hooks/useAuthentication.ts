import { useContext } from 'react';
import { AuthContext } from 'contexts/AuthContext';
import type { AuthContextType } from 'contexts/AuthContext';

export const useAuthentication = (): AuthContextType => {
  const auth = useContext(AuthContext);
  return auth;
};

export default useAuthentication;
