import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateSeason, updateChapter } from '@/app/admin/actions';
import * as sessionModule from '@/lib/auth/session';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('Admin Editorial Atomic Actions (QA-27)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('updateSeason', () => {
    it('rejects unauthenticated or non-admin user', async () => {
      vi.spyOn(sessionModule, 'requireSession').mockResolvedValue({
        userId: 'regular-user',
        client: {
          rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
        } as any,
      } as any);

      const res = await updateSeason({
        id: '11111111-1111-4111-a111-111111111111',
        title: 'Temporada 1',
        description: 'Descrição',
        status: 'active',
      });

      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.code).toBe('forbidden');
    });

    it('invokes update_editorial_season RPC atomically when admin', async () => {
      const rpcMock = vi.fn((fnName) => {
        if (fnName === 'is_admin') return Promise.resolve({ data: true, error: null });
        if (fnName === 'update_editorial_season') return Promise.resolve({ data: true, error: null });
        return Promise.resolve({ data: null, error: null });
      });

      vi.spyOn(sessionModule, 'requireSession').mockResolvedValue({
        userId: 'admin-1',
        client: { rpc: rpcMock } as any,
      } as any);

      const res = await updateSeason({
        id: '11111111-1111-4111-a111-111111111111',
        title: 'Temporada Renovada',
        description: 'Ciclo em andamento',
        status: 'active',
      });

      expect(res.ok).toBe(true);
      expect(res.message).toBe('Temporada salva com sucesso.');
      expect(rpcMock).toHaveBeenCalledWith('update_editorial_season', {
        p_id: '11111111-1111-4111-a111-111111111111',
        p_title: 'Temporada Renovada',
        p_description: 'Ciclo em andamento',
        p_status: 'active',
      });
    });
  });

  describe('updateChapter', () => {
    it('invokes update_editorial_chapter RPC atomically for draft save', async () => {
      const rpcMock = vi.fn((fnName) => {
        if (fnName === 'is_admin') return Promise.resolve({ data: true, error: null });
        if (fnName === 'update_editorial_chapter') return Promise.resolve({ data: true, error: null });
        return Promise.resolve({ data: null, error: null });
      });

      vi.spyOn(sessionModule, 'requireSession').mockResolvedValue({
        userId: 'admin-1',
        client: { rpc: rpcMock } as any,
      } as any);

      const res = await updateChapter({
        id: '22222222-2222-4222-a222-222222222222',
        title: 'Capítulo 1 · Início',
        readingRange: 'pág. 1-20',
        summary: 'Resumo inicial',
        youtubeUrl: '',
        publishedAt: null,
        isDraft: true,
      });

      expect(res.ok).toBe(true);
      expect(res.message).toBe('Rascunho salvo.');
      expect(rpcMock).toHaveBeenCalledWith('update_editorial_chapter', {
        p_id: '22222222-2222-4222-a222-222222222222',
        p_title: 'Capítulo 1 · Início',
        p_reading_range: 'pág. 1-20',
        p_summary: 'Resumo inicial',
        p_youtube_url: null,
        p_published_at: null,
        p_is_draft: true,
      });
    });
  });
});
