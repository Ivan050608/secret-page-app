'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '../../lib/authHelpers';
import SecretLayout from '../../components/SecretLayout';

export default function SecretPage1() {
  const { user } = useAuth();
  const [secretMessage, setSecretMessage] = useState('');
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSecretMessage = async () => {
      if (!user) {
        setError('User not found.');
        setLoading(false); 
        return;
      }

      const { data, error } = await supabase
        .from('secret_messages')
        .select('message')
        .eq('user_id', user.id)
        .single(); 

      if (error) {
        setError(error.message); 
        setLoading(false); 
      } else {
        setSecretMessage(data?.message || 'No secret message set.');
        setLoading(false); 
      }
    };

    
    if (user) {
      fetchSecretMessage();
    } else {
      setLoading(false); 
    }
  }, [user]); 

  if (!user) {
    return <div>Please log in to access this page.</div>;
  }

  
  if (loading) {
    return <div>Loading secret message...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <SecretLayout>
      <h1>Your Secret Message</h1>
      <p>{secretMessage}</p>
    </SecretLayout>
  );
}
