import { useEffect, useState, useMemo, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { AuthContext } from '../contexts/AuthContext';
import supabase from '../services/SupabaseClient';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the initial session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Subscribe to auth state changes (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup the subscription when the component unmounts
    return () => subscription?.unsubscribe();
  }, []);

  const value = useMemo(() => ({ session, user, isLoading }), [session, user, isLoading]);

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};
