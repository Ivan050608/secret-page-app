// components/SecretPage1Server.js
import { supabase } from '../../../lib/supabase';
import SecretLayout from '../../../components/SecretLayout';


export default async function SecretPage1Server({ friendId, user }) {
  // Fetch the secret message from Supabase server-side
  try {
    const { data, error } = await supabase
      .from('secret_messages')
      .select('message')
      .eq('user_id', friendId || user.id) 
      .single();

    if (error) {
      throw error;
    }

    const secretMessage = data?.message || 'No secret message set.';
    return (
      <SecretLayout>
        <h1>{friendId ? "Friend's Secret Message" : 'Your Secret Message'}</h1>
        <p>{secretMessage}</p>
      </SecretLayout>
    );
  } catch (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
}
