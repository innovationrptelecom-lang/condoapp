
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) return;

    const role = session.user.role || session.user.email === 'admin@condoapp.com' ? 'ADMIN' : 'MORADOR';
    switch (role) {
      case 'ADMIN':
      case 'SUPERVISOR':
        router.replace('/admin');
        break;
      case 'ZELADOR':
        router.replace('/zelador');
        break;
      case 'PRESTADOR':
        router.replace('/prestador');
        break;
      default:
        router.replace('/morador');
    }
  }, [session, status]);

  return <p className="p-6">Redirecionando...</p>;
}
