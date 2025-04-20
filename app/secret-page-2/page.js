'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/authHelpers';
import SecretLayout from '../../components/SecretLayout';
import { supabase } from '@/lib/supabase';

export default function SecretPage2() {
  const { user } = useAuth();
  const [secretMessage, setSecretMessage] = useState(''); // State for the secret message
  const [error, setError] = useState('');

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  const handleSaveMessage = async (e) => {
    e.preventDefault();
    try {
      // Save the secret message to Supabase
      const { data, error } = await supabase
        .from('secret_messages')
        .upsert(
          { user_id: user.id, message: secretMessage },
          { onConflict: ['user_id'] } // Ensure we don't duplicate messages for the same user
        );

      if (error) {
        setError(error.message);
      } else {
        alert('Secret message saved!');
      }
    } catch (error) {
      setError('Something went wrong.');
    }
  };

  return (
    <SecretLayout>
      <h1>Add/Update Your Secret Message</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSaveMessage} className="space-y-4">
        <textarea
          value={secretMessage}
          onChange={(e) => setSecretMessage(e.target.value)}
          placeholder="Enter your secret message"
          className="w-full p-2 border"
          rows="5"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Message
        </button>
      </form>
    </SecretLayout>
  );
}
