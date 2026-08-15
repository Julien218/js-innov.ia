import { createContext, useContext } from 'react';

const AuthContext = createContext(null);
const cockpitUrl = import.meta.env.VITE_COCKPIT_URL || 'https://cockpit.jsinnovia.com';

export const AuthProvider = ({ children }) => (
  <AuthContext.Provider value={{
    user: null,
    isAuthenticated: false,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: null,
    logout: () => undefined,
    navigateToLogin: () => window.location.assign(cockpitUrl),
    checkAppState: async () => undefined,
  }}>
    {children}
  </AuthContext.Provider>
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return context;
};
