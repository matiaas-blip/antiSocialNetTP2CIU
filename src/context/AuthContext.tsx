import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }

      if (savedToken && savedToken !== "undefined") {
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Error parseando user:", err);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(null);
      setToken(null);
    }
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};