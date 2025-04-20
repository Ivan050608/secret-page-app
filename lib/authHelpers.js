'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';

// Create AuthContext to store user information
const AuthContext = createContext();

// AuthProvider component that will provide user context to the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Use the correct method to get the current session
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchSession();

    // Listen for changes in the authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener when the component unmounts
    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe(); // Safely unsubscribe
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to access user context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Other helper functions for login, register, and logout
export const loginUser = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const registerUser = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const logoutUser = async () => {
  return await supabase.auth.signOut();
};

export const getUserSession = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user || null;
};
