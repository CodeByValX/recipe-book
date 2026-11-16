import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.session?.user ?? null);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));

    // Грешка 1: В Supabase v2 в data се намира { subscription }, а не самият listener
    const listener = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    // Грешка 2: Липсва await — error винаги ще е undefined, а грешките при вход няма да се хващат
    const { error } = supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  }

  async function register(username, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) throw new Error(error.message);
    return { needsConfirmation: !data.session };
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Anonymous',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}