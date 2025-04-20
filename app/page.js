'use client'; 
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '../lib/authHelpers';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-10 max-w-md w-full text-center">
        {user ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Welcome to Your Dashboard</h1>
            <p className="text-gray-600 mb-6">
              You're logged in as <span className="font-medium text-blue-600">{user.email}</span>.
            </p>
            <p className="text-sm text-gray-500">Use the navigation above to explore your secret pages.</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">You're not logged in</h1>
            <p className="text-gray-600 mb-6">
              Use the navigation bar above to log in or register to access your dashboard.
            </p>
           
          </>
        )}
      </div>
    </div>
  );
}