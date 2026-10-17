import type { Metadata } from 'next';
import { redirect, notFound } from 'next/navigation';
import { ChapterEditor, SeasonEditor } from '@/components/admin/admin-controls';
import { createServerSupabase } from '@/lib/supabase/clients';

export const metadata: Metadata = { title: 'Temporada · Administração', robots: { index: false, follow: false } };

export default async function AdminSeasonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await createServerSupabase();
  const { data: claims } = await client.auth.getClaims();
  if (typeof claims?.claims?.sub !== 'string') redirect(`/entrar?redirect=/admin/seasons/${id}`);

  const { data: authorized } = await client.rpc('is_admin');
  if (authorized !== true) {
    return (
      <section className="container" style={{ marginTop: '32px' }}>
        <div className="notice">Acesso restrito à equipe editorial.</div>
      </section>
    );
  }

  const [{ data: season }, { data: chapters }] = await Promise.all([
    client.from('seasons').select('id,title,description,status').eq('id', id).maybeSingle(),
    client.from('chapters').select('id,title,reading_range,summary,youtube_url,published_at').eq('season_id', id).order('number'),
  ]);

  const chapterList = (chapters ?? []) as Array<{ id: string; title: string; reading_range: string | null; summary: string | null; youtube_url: string | null; published_at: string | null }>;

  if (!season) notFound();

  return (
    <section className="container" style={{ marginTop: '32px' }}>
      <header className="page-intro">
        <span className="eyebrow">Editor de temporada</span>
        <h1>{season.title}</h1>
        <p>Publique em etapas, agende capítulos e mantenha o contexto de leitura consistente.</p>
      </header>
      <SeasonEditor season={season as { id: string; title: string; description: string | null; status: 'planned' | 'enrolling' | 'active' | 'finished' }} />
      <section className="section" style={{ marginTop: '32px' }}>
        <div className="section-head" style={{ marginBottom: '16px' }}>
          <div>
            <span className="eyebrow">Conteúdo</span>
            <h2>Capítulos</h2>
          </div>
        </div>
        <div className="timeline">
          {chapterList.map((chapter) => (
            <ChapterEditor key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </section>
    </section>
  );
}
