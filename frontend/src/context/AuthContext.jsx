import { createContext, useEffect, useMemo, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';
import { getToken, parseJwt, removeToken, setToken } from '../utils/token';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const payload = parseJwt(token);
    if (!payload?.sub) {
      removeToken();
      setTokenState(null);
      setUser(null);
      return;
    }

    setUser({
      id: payload.sub,
      email: payload.email,
      username: payload.username
    });
  }, [token]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const response = await loginApi(payload);
      const receivedToken = response?.data?.token;
      if (!receivedToken) {
        throw new Error('Token not received from server');
      }
      setToken(receivedToken);
      setTokenState(receivedToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await registerApi(payload);
      const receivedToken = response?.data?.token;
      if (!receivedToken) {
        throw new Error('Token not received from server');
      }
      setToken(receivedToken);
      setTokenState(receivedToken);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
