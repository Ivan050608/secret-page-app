// app/layout.js
import './globals.css'; // if you use global styles
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/lib/authHelpers'; 

export const metadata = {
  title: 'Secret Page App',
  description: 'A private area with Supabase and Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
