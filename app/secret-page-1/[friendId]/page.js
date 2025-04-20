// import { supabase } from '@/lib/supabase';
// import { useAuth } from '../../../lib/authHelpers';
// import SecretLayout from '../../../components/SecretLayout';

// // Server Component: Fetch data during SSR (server-side rendering)
// export default async function SecretPage1({ params }) {
//   const { friendId } = params; // Get friendId from the URL params
//   const { user } = useAuth();

//   // Check if the user is logged in
//   if (!user) {
//     return <div>Please log in to access this page.</div>;
//   }

//   // Fetch the secret message from Supabase server-side
//   try {
//     const { data, error } = await supabase
//       .from('secret_messages')
//       .select('message')
//       .eq('user_id', friendId || user.id) // Use friendId or user.id for self message
//       .single();

//     if (error) {
//       throw error;
//     }

//     const secretMessage = data?.message || 'No secret message set.';
//     return (
//       <SecretLayout>
//         <h1>{friendId ? "Friend's Secret Message" : 'Your Secret Message'}</h1>
//         <p>{secretMessage}</p>
//       </SecretLayout>
//     );
//   } catch (error) {
//     return <div className="text-red-500">Error: {error.message}</div>;
//   }
// }
// app/secret-page-1/[friendId]/page.js
import SecretPage1Client from '../../../components/SecretPage1Client';

export default function SecretPage1({ params }) {
  const { friendId } = params; // Extract friendId from the URL
  return <SecretPage1Client friendId={friendId} />; // Pass it to the client component
}
