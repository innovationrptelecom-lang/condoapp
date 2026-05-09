
import { useEffect } from 'react';
import useSWR
import { getSocket } from '@/lib/socket'
import toast from 'react-hot-toast' from 'swr';
import Layout from '@/components/Layout';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Chamados() {
  const { data, error, mutate } = useSWR(' `/api/calls?status=${filters.status}&type=${filters.type}&responsible=${filters.responsible}&q=${filters.q}&startDate=${filters.startDate}&endDate=${filters.endDate}`, fetcher);
  const [desc, setDesc] = useState('');
  const [filters, setFilters] = useState({ status: '', type: '', responsible: '', q: '', startDate: '', endDate: '' });

  const handleApprove = async (id) => {
    await fetch(`/api/calls/${id}/approve`, { method: 'PUT' });
    mutate();
  };

  if (error) return <div>Falha ao carregar</div>;
  if (!data) return <Layout><p>Carregando...</p></Layout>;


  // socket real-time
  useEffect(() => {
    fetch('/api/socket'); // init
    const socket = getSocket();
    socket.on('calls:update', () => mutate());
    return () => socket.disconnect();
  }, []);

  const createCall = async () => {
    await fetch('/api/calls', { method: 'POST', body: JSON.stringify({ type: 'servico', description: desc }) });
    setDesc('');
    mutate();
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Chamados</h2>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="border px-3 py-2"
          />
          <input type="date" value={filters.startDate} onChange={(e)=>setFilters({...filters,startDate:e.target.value})} className="border px-2 py-2" />
          <input type="date" value={filters.endDate} onChange={(e)=>setFilters({...filters,endDate:e.target.value})} className="border px-2 py-2" />
          <select
            value={filters.type}
            onChange={(e)=>setFilters({...filters,type:e.target.value})}
            className="border px-3 py-2"
          >
            <option value="">Tipo</option>
            <option value="servico">Serviço</option>
            <option value="terceiro">Terceiro</option>
            <option value="ocorrencia">Ocorrência</option>
            <option value="compra">Compra</option>
          </select>
          <input
            type="text"
            placeholder="Responsável"
            value={filters.responsible}
            onChange={(e)=>setFilters({...filters,responsible:e.target.value})}
            className="border px-3 py-2"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="APROVADO">Aprovado</option>
          </select>
        </div>
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="border px-3 py-2 mr-2"
          placeholder="Descrição"
        />
        <button onClick={createCall} className="bg-primary text-white px-4 py-2 rounded">
          Criar
        </button>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const file = e.target.file.files[0];
            if (!file) return;
            const formData = new FormData();
            formData.append('file', file);
            formData.append('entityId', 1); // demo: attach to call 1
            await fetch('/api/upload', { method: 'POST', body: formData });
            toast.success('Arquivo enviado!');
          }}
          className="mt-4 flex items-center gap-2"
        >
          <input type="file" name="file" className="border" />
          <button className="bg-primary text-white px-3 py-1 rounded">Upload</button>
        </form>
      </div>

      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Descrição</th>
            <th className="p-2">Responsável</th>
            <th className="p-2">Anexos</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>

{data.map((c) => (
  <tr key={c.id} className="border-t">
    <td className="p-2">{c.id}</td>
    <td className="p-2">{c.description}</td>
    <td className="p-2">{c.responsible || '-'}</td>
    <td className="p-2">
      <button
        className="text-blue-600 underline text-xs"
        onClick={async () => {
          const list = await fetch(`/api/calls/${c.id}/attachments`).then(r=>r.json());
          if (list.length===0) return toast('Sem anexos');
          list.forEach(a=>{
            window.open(`https://${process.env.NEXT_PUBLIC_S3_PUBLIC}/${a.filePath}`,'_blank');
          });
        }}
      >
        Anexos
      </button>
    </td>

    <td className="p-2 text-center">{c.status}</td>
    <td className="p-2">
      {c.status !== 'APROVADO' && (
        <button
          onClick={() => handleApprove(c.id)}
          className="text-xs bg-green-600 text-white px-2 py-1 rounded"
        >
          Aprovar
        </button>
      )}
    </td>
  </tr>
))}
</tbody>
      </table>
    </Layout>
  );
}
