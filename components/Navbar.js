// // components/Navbar.js
// 'use client';
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { getUserSession, logoutUser } from '@/lib/authHelpers';
// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkUser = async () => {
//       const currentUser = await getUserSession();
//       setUser(currentUser);
//     };
//     checkUser();
//   }, []);

//   const handleLogout = async () => {
//     await logoutUser();
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <nav className="bg-gray-800 text-white p-4 flex justify-between">
//       <div className="space-x-4">
//         <Link href="/">Home</Link>
//         {user && (
//           <>
//             <Link href="/secret-page-1">Page 1</Link>
//             <Link href="/secret-page-2">Page 2</Link>
//             <Link href="/secret-page-3">Page 3</Link>
//           </>
//         )}
//       </div>
//       <div>
//         {user ? (
//           <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
//             Logout
//           </button>
//         ) : (
//           <>
//             <Link href="/login" className="mr-4">Login</Link>
//             <Link href="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
// components/Navbar.js
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authHelpers'; // use the context
import { supabase } from '@/lib/supabase';

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth(); // get the user from global context

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link href="/">Home</Link>
        {user && (
          <>
            <Link href="/secret-page-1">Page 1</Link>
            <Link href="/secret-page-2">Page 2</Link>
            <Link href="/secret-page-3">Page 3</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link href="/login" className="mr-4">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
