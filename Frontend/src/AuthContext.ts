import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  signup: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
}

interface User {
  email: string;
  name?: string;
  password: string;
  userId: number;
}

export const AuthStatusContext = createContext<AuthContextType | null>(null);
