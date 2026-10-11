import React, { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "../lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authClient.getSession().then((result) => {
      if (result.data?.user) {
        setUser(result.data.user);
      }
      setLoading(false);
    });
  }, []);

  const signUp = async (email, password) => {
    const result = await authClient.signUp.email({
      name: email.split("@")[0],
      email,
      password,
    });
    if (result.error) return { error: result.error.message };
    const session = await authClient.getSession();
    if (session.data?.user) setUser(session.data.user);
    return {};
  };

  const signIn = async (email, password) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) return { error: result.error.message };
    const session = await authClient.getSession();
    if (session.data?.user) setUser(session.data.user);
    return {};
  };

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
  };

  const signInWithGoogle = async (callbackURL = "/") => {
    await authClient.signIn.social({ provider: "google", callbackURL });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
