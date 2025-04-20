// // components/SecretPage1Client.js
// import { useAuth } from '../../../lib/authHelpers';
// import SecretPage1Server from './SecretPage1Server'; // Import the server-side component

// export default function SecretPage1Client({ friendId }) {
//   const { user } = useAuth();

//   if (!user) {
//     return <div>Please log in to access this page.</div>;
//   }

//   return <SecretPage1Server friendId={friendId} user={user} />;
// }
// components/SecretPage1Client.js
'use client';

import { useAuth } from '@/lib/authHelpers';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SecretLayout from './SecretLayout';

export default function SecretPage1Client({ friendId }) {
  const { user } = useAuth();
  const [secretMessage, setSecretMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSecretMessage = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('secret_messages')
        .select('message')
        .eq('user_id', friendId || user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setSecretMessage(data?.message || 'No secret message set.');
      }

      setLoading(false);
    };

    fetchSecretMessage();
  }, [friendId, user]);

  if (!user) {
    return <div className="p-4 text-red-600">Please log in to access this page.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading secret message...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <SecretLayout>
      <h1 className="text-xl font-bold mb-2">
        {friendId ? "Friend's Secret Message" : 'Your Secret Message'}
      </h1>
      <p className="text-lg">{secretMessage}</p>
    </SecretLayout>
  );
}
