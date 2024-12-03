// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { User } from "../components/booking/Slot";
import { Alert, Snackbar } from "@mui/material";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AlertState {
  error: boolean;
  isOpen: boolean;
  message: string;
}

const defaultAlert: AlertState = {
  error: false,
  isOpen: false,
  message: "",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [alert, setAlert] = useState<AlertState>(defaultAlert);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<void> => {
    try {
      const response = await axios.get<{ user: User }>("/api/user/verify");
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await axios.post<{ user: User }>(
        `/api/user/login`,
        credentials
      );

      if (!response) return false;
      setAlert({
        message: "Successfully signed in",
        error: false,
        isOpen: true,
      });
      setTimeout(() => {
        setUser(response.data.user);
        setIsAuthenticated(true);
        setAlert(defaultAlert);
      }, 1500);
      return true;
    } catch (error) {
      setAlert({
        error: true,
        message: (error as any).response.data.message,
        isOpen: true,
      });
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(`/api/user/logout`);
      setAlert({
        error: false,
        message: "Successfully logged out",
        isOpen: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      <Snackbar
        open={alert.isOpen}
        autoHideDuration={2000}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alert.error ? "error" : "success"}
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
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
