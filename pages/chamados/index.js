import useSWR from "swr";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import getSocket from "@/lib/socket";                // ajuste se não usar alias "@"
import Layout     from "../../components/Layout";    // caminho relativo seguro

/* util simples para GET */
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Chamados() {
  /* filtros vêm **antes** do useSWR, pois a URL depende deles            */
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    responsible: "",
    q: "",
    startDate: "",
    endDate: "",
  });

  /* descrição do chamado a criar */
  const [desc, setDesc] = useState("");

  /* dados remotos */
  const { data, error, mutate } = useSWR(
    `/api/calls?status=${filters.status}&type=${filters.type}&responsible=${filters.responsible}&q=${filters.q}&startDate=${filters.startDate}&endDate=${filters.endDate}`,
    fetcher
  );

  /* aprovar um chamado */
  const handleApprove = async (id) => {
    await fetch(`/api/calls/${id}/approve`, { method: "PUT" });
    mutate();
  };

  /* feedback de carregamento/erro */
  if (error)  return <div>Falha ao carregar</div>;
  if (!data)  return (
    <Layout>
      <p>Carregando…</p>
    </Layout>
  );

  /* socket real-time */
  useEffect(() => {
    fetch("/api/socket");      // init
    const socket = getSocket();
    socket.on("calls:update", () => mutate());
    return () => socket.disconnect();
  }, [mutate]);

  /* criar novo chamado */
  const createCall = async () => {
    await fetch("/api/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "servico", description: desc }),
    });
    setDesc("");
    mutate();
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Chamados</h2>

      {/* filtros + criação */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {/* busca texto */}
          <input
            type="text"
            placeholder="Buscar..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            className="border px-3 py-2"
          />

          {/* intervalo de datas */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="border px-2 py-2"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="border px-2 py-2"
          />

          {/* tipo */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border px-3 py-2"
          >
            <option value="">Tipo</option>
            <option value="servico">Serviço</option>
            <option value="terceiro">Terceiro</option>
            <option value="ocorrencia">Ocorrência</option>
            <option value="compra">Compra</option>
          </select>

          {/* responsável */}
          <input
            type="text"
            placeholder="Responsável"
            value={filters.responsible}
            onChange={(e) => setFilters({ ...filters, responsible: e.target.value })}
            className="border px-3 py-2"
          />

          {/* status */}
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

        {/* input & botão para novo chamado */}
        <div className="flex gap-2">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="flex-1 border px-3 py-2"
            placeholder="Descrição do chamado"
          />
          <button
            onClick={createCall}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Criar
          </button>
        </div>
      </div>

      {/* tabela de chamados */}
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Descrição</th>
            <th className="p-2">Responsável</th>
            <th className="p-2">Anexos</th>
            <th className="p-2">Status</th>
            <th className="p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.id}</td>
              <td className="p-2">{c.description}</td>
              <td className="p-2">{c.responsible || "-"}</td>
              <td className="p-2">
                <button
                  className="text-blue-600 underline text-xs"
                  onClick={async () => {
                    const list = await fetch(
                      `/api/calls/${c.id}/attachments`
                    ).then((r) => r.json());
                    if (list.length === 0)
                      return toast("Sem anexos");
                    list.forEach((a) =>
                      window.open(
                        `https://${process.env.NEXT_PUBLIC_S3_PUBLIC}/${a.filePath}`,
                        "_blank"
                      )
                    );
                  }}
                >
                  Ver
                </button>
              </td>
              <td className="p-2 text-center">{c.status}</td>
              <td className="p-2">
                {c.status !== "APROVADO" && (
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