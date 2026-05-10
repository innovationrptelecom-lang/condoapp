
import useSWR from 'swr';
import Layout from '@/components/Layout';

const fetcher = (url) => fetch(url).then(r=>r.json());

export default function VisitantesPage() {
  const { data, error } = useSWR('/api/visitantes', fetcher);
  if (error) return <Layout><p>Erro ao carregar</p></Layout>;
  if (!data) return <Layout><p>Carregando...</p></Layout>;
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Visitantes Registrados</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  );
}
