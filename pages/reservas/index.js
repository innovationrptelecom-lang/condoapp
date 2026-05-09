
import useSWR from 'swr';
import Layout from '@/components/Layout';

const fetcher = (url) => fetch(url).then(r=>r.json());

export default function ReservasPage() {
  const { data, error } = useSWR('/api/reservas', fetcher);
  if (error) return <Layout><p>Erro ao carregar</p></Layout>;
  if (!data) return <Layout><p>Carregando...</p></Layout>;
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Reservas de Espaços</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  );
}
