
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const authRoutes = ['/login'];

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {authRoutes.includes(typeof window !== 'undefined' ? window.location.pathname : '') ? (
        <Component {...pageProps} />
      ) : (
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      )}
    </SessionProvider>
      <Toaster position="top-right" />
  );
}

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return children;
}
