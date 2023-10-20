'use client'

import { SessionProvider } from "next-auth/react";
import { Session } from 'next-auth';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

interface AuthenticationContextType {
  userEmail: string | null;
  authenticationLevel: number | null;
  login: (email: string, level: number) => void;
  logout: () => void;
}

type ProvidersResponse = {
  [providerName: string]: {
    id: string;
    name: string;
    type: string;
  };
};

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

export function AuthenticationProvider({ children, session }: { children: ReactNode, session: Session | null }) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [providers, setProviders] = useState<ProvidersResponse | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authenticationLevel, setAuthenticationLevel] = useState<number | null>(null);

  const login = (email: string, level: number) => {
    setUserEmail(email);
    setAuthenticationLevel(level);
  };

  const logout = () => {
    setUserEmail(null);
    setAuthenticationLevel(null);
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const response = await getProviders();
      setProviders(response);
    }

    fetchProviders();
  }, []);

  return (
    <SessionProvider session={session}>
      <AuthenticationContext.Provider value={{ userEmail, authenticationLevel, login, logout }}>
        {children}
      </AuthenticationContext.Provider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthenticationProvider');
  }
  return context;
}
