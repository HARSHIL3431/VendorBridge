'use client';

import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Floating blob 1 — accent top-left */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-accent/8 blur-3xl animate-pulse pointer-events-none"
        style={{ animationDuration: '6s' }}
      />

      {/* Floating blob 2 — primary bottom-right */}
      <div
        className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary/8 blur-3xl animate-pulse pointer-events-none"
        style={{ animationDuration: '8s', animationDelay: '1s' }}
      />

      {/* Floating blob 3 — accent center-right */}
      <div
        className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-accent/5 blur-2xl animate-pulse pointer-events-none"
        style={{ animationDuration: '10s', animationDelay: '2s' }}
      />

      {/* Floating blob 4 — primary center-left */}
      <div
        className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-primary/6 blur-2xl animate-pulse pointer-events-none"
        style={{ animationDuration: '7s', animationDelay: '3s' }}
      />

      {/* Page content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
