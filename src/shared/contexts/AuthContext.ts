import type { User, Session } from '@supabase/supabase-js';
import { createContext } from 'react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
