import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase/clients';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Painel Geral · Administração', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const client = await createServerSupabase();
  const { data: claims } = await client.auth.getClaims();
  if (typeof claims?.claims?.sub !== 'string') redirect('/entrar?redirect=/admin');

  const { data: authorized, error } = await client.rpc('is_admin');
  if (error || authorized !== true) {
    return (
      <section className="container" style={{ marginTop: '32px' }}>
        <header className="page-intro">
          <span className="eyebrow">Área restrita</span>
          <h1>Acesso somente para a equipe.</h1>
        </header>
        <div className="notice" role="alert">
          Seu perfil não possui autorização administrativa. O acesso foi negado no servidor.
        </div>
      </section>
    );
  }

  // Busca temporadas para atalhos
  const { data: seasons } = await client
    .from('seasons')
    .select('id,number,title,status')
    .order('number');

  const seasonList = (seasons ?? []) as Array<{ id: string; number: number; title: string; status: string }>;
  const activeSeason = seasonList.find((s) => s.status === 'active') || seasonList[0];

  return (
    <section className="container" style={{ marginTop: '32px' }}>
      <header className="page-intro">
        <span className="eyebrow">Equipe editorial</span>
        <h1>Painel de administração</h1>
        <p>Conteúdo, comunidade e agenda em um único lugar, com autorização no servidor.</p>
      </header>

      <div className="season-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <Link className="member-card" href="/admin/books" style={{ textDecoration: 'none' }}>
          <h2>📚 Livros</h2>
          <p>Cadastre novos títulos ou revise ficha, sinopse, capa e paginação.</p>
        </Link>

        <Link
          className="member-card"
          href={activeSeason ? `/admin/seasons/${activeSeason.id}` : '/admin/seasons'}
          style={{ textDecoration: 'none' }}
        >
          <h2>🗓️ Temporadas & Capítulos</h2>
          <p>
            {activeSeason
              ? `Editor ativo: ${activeSeason.title} (Temporada ${activeSeason.number}).`
              : 'Gerencie as temporadas e publique capítulos.'}
          </p>
        </Link>

        <Link className="member-card" href="/admin/moderation" style={{ textDecoration: 'none' }}>
          <h2>🛡️ Moderação</h2>
          <p>Fila de denúncias, ocultação de conteúdo e histórico de revisão.</p>
        </Link>
      </div>

      <div style={{ marginTop: '32px' }}>
        <p className="notice">
          Abra uma temporada pelo editor para publicar capítulos, agendar replay e revisar o conteúdo antes de colocá-lo no ar. Todas as alterações são salvas com auditoria no banco.
        </p>
      </div>
    </section>
  );
}
