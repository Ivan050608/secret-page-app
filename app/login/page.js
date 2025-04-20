// // app/login/page.js
// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabase';

// export default function LoginPage() {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) {
//       setError(error.message);
//     } else {
//       router.push('/secret-page-1');
//     }
//   };

//   return (
//     <main className="p-6 max-w-md mx-auto">
//       <h2 className="text-xl font-bold mb-4">Login</h2>
//       <form onSubmit={handleLogin} className="space-y-4">
//         <input type="email" placeholder="Email" required className="w-full p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <input type="password" placeholder="Password" required className="w-full p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />
//         {error && <p className="text-red-500">{error}</p>}
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
//       </form>
//     </main>
//   );
// }
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authHelpers';

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth(); // Auth state from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/secret-page-1');
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError('');
      // Wait for auth context to update, which will trigger the redirect in useEffect
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}
