import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/clients';

export const metadata: Metadata = { title: 'Temporadas · Administração', robots: { index: false, follow: false } };

export default async function AdminSeasonsIndexPage() {
  const client = await createServerSupabase();
  const { data: claims } = await client.auth.getClaims();
  if (typeof claims?.claims?.sub !== 'string') redirect('/entrar?redirect=/admin/seasons');

  const { data: authorized } = await client.rpc('is_admin');
  if (authorized !== true) {
    return (
      <section className="container" style={{ marginTop: '32px' }}>
        <div className="notice">Acesso restrito à equipe editorial.</div>
      </section>
    );
  }

  const { data: seasons, error } = await client
    .from('seasons')
    .select('id,number,title,description,status,starts_at,ends_at')
    .order('number');

  const seasonList = (seasons ?? []) as Array<{ id: string; number: number; title: string; description: string | null; status: string }>;

  return (
    <section className="container" style={{ marginTop: '32px' }}>
      <header className="page-intro">
        <span className="eyebrow">Equipe editorial</span>
        <h1>Temporadas de Leitura</h1>
        <p>Selecione uma temporada para gerenciar capítulos, agendamentos e conteúdos.</p>
      </header>

      {error ? (
        <div className="notice" role="alert">Não foi possível carregar as temporadas.</div>
      ) : seasonList.length ? (
        <div className="season-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {seasonList.map((season) => (
            <Link
              key={season.id}
              className="member-card"
              href={`/admin/seasons/${season.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span className="eyebrow">Temporada {season.number}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: season.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: season.status === 'active' ? '#10b981' : 'inherit',
                  }}
                >
                  {season.status}
                </span>
              </div>
              <h2>{season.title}</h2>
              <p>{season.description || 'Sem descrição.'}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Nenhuma temporada cadastrada</h2>
        </div>
      )}
    </section>
  );
}
