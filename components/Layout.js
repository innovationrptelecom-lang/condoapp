
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-primary text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Condomínio App</h1>
        {session && (
          <div className="flex items-center gap-4 text-sm">
            <span>{session.user.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-white/20 hover:bg-white/30 rounded px-3 py-1"
            >
              Sair
            </button>
          </div>
        )}
      </nav>

      <div className="flex flex-1">
        <aside className="w-60 bg-primary-dark text-white p-4 space-y-4 hidden md:block">
        {session && (
          <>
            {['ADMIN','SUPERVISOR'].includes(session.user.role) && (
              <>
                <NavLink href="/">Dashboard</NavLink>
                <NavLink href="/chamados">Chamados</NavLink>
                <NavLink href="/periodicos">Periódicos</NavLink>
                <NavLink href="/orcamentos">Orçamentos</NavLink>
                <NavLink href="/financeiro">Financeiro</NavLink>
                <NavLink href="/reservas">Reservas</NavLink>
                <NavLink href="/visitantes">Visitantes</NavLink>
              </>
            )}
            {session.user.role === 'ZELADOR' && (
              <NavLink href="/zelador">Meus Chamados</NavLink>
            )}
            {session.user.role === 'PRESTADOR' && (
              <NavLink href="/prestador">Orçamentos</NavLink>
            )}
            {session.user.role === 'MORADOR' && (
              <NavLink href="/morador">Minhas Solicitações</NavLink>
            )}
          </>
        )}
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>

      <footer className="text-center text-gray-500 text-sm py-4">
        © 2026 Condomínio App
      </footer>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <Link href={href} legacyBehavior>
      <a className="block hover:text-primary-light">{children}</a>
    </Link>
  );
}
