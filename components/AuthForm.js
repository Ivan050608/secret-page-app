// components/AuthForm.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, registerUser } from '@/lib/authHelpers';

export default function AuthForm({ type }) {
  const router = useRouter();
  const isLogin = type === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isLogin ? loginUser : registerUser;
    const { error } = await action(email, password);
    if (error) {
      setError(error.message);
    } else {
      router.push('/secret-page-1'); // Redirect after successful login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full p-2 border"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full p-2 border"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
