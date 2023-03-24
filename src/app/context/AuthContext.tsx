"use client";

import axios from "axios";
import { getCookie } from "cookies-next";
import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  phone: string;
}

interface State {
  loading: boolean;
  error: string | null;
  data: User | null;
}

interface AuthState extends State {
  setAuthState: Dispatch<SetStateAction<State>>;
}
const initialAuthState = {
  loading: false,
  data: null,
  error: null,
  setAuthState: () => {},
};

export const AuthenticationContext = createContext<AuthState>(initialAuthState);

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<State>({
    loading: true,
    data: null,
    error: null,
  });

  const fetchUser = async () => {
    setAuthState({ data: null, error: null, loading: true });
    try {
      const jwt = getCookie("jwt");

      if (!jwt) {
        setAuthState({ data: null, error: null, loading: false });
      }

      const res = await axios.get("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      setAuthState({ data: res.data, error: null, loading: false });
    } catch (e: any) {
      setAuthState({
        data: null,
        error: e.response.data.errorMessage,
        loading: false,
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthenticationContext.Provider value={{ ...authState, setAuthState }}>
      {children}
    </AuthenticationContext.Provider>
  );
}
