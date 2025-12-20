import supabase from '../services/SupabaseClient';

const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin, // Redirects back to your app after login
    },
  });
  if (error) throw error;
};

const signInWithEmail = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const signInWithEmail_RC = async () => {
  await signInWithEmail('ravichandra.uk9@gmail.com', 'Torrents9!');
};

export const AuthAPI = {
  signInWithGoogle,
  signInWithEmail,
  signOut,
  getSession,
};
