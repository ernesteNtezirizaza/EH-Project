import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of user data
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Define the shape of the AuthContext value
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userData: UserData | null;
  login: (newToken: string, newData: UserData) => void;
  logout: () => void;
}

// Create AuthContext with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedData = localStorage.getItem('user_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.userToken && parsedData?.user) {
          setToken(parsedData.userToken);
          setUserData(parsedData.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  const login = (newToken: string, newData: UserData) => {
    localStorage.setItem(
      'user_data',
      JSON.stringify({ userToken: newToken, user: newData })
    );

    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('user_data');
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};