import { useEffect, useState, useMemo, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AuthContext } from '../contexts/AuthContext';
import supabase from '../services/SupabaseClient';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes (login, logout, etc.)
    // This listener also fires immediately with the initial session state.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription?.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, isLoading, isLoggedIn: !!session }),
    [session, isLoading]
  );

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
