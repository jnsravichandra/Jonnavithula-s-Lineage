import type { User, Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};