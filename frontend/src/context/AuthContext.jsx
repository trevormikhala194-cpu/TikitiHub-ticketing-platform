import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  isAuthenticated,
  clearAuth,
} from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD AUTHENTICATION
  // =========================

  useEffect(() => {
    const authenticated = isAuthenticated();
    const currentUser = getCurrentUser();

    if (authenticated && currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  // =========================
  // LOGIN / REGISTER
  // =========================

  const login = (userData) => {
    if (userData) {
      setUser(userData);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  // =========================
  // AUTH STATE
  // =========================

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =========================
// CUSTOM HOOK
// =========================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}