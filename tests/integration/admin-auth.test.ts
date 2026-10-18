import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAdmin } from '@/lib/auth/require-admin';

vi.mock('@/lib/supabase/clients', () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from '@/lib/supabase/clients';

describe('requireAdmin guard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when there is no authenticated session', async () => {
    vi.mocked(createServerSupabase).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: null, error: new Error('unauthenticated') }),
      },
    } as any);

    const result = await requireAdmin();
    expect(result).toBeNull();
  });

  it('returns null when claims do not contain a valid sub string', async () => {
    vi.mocked(createServerSupabase).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({ data: { claims: {} }, error: null }),
      },
    } as any);

    const result = await requireAdmin();
    expect(result).toBeNull();
  });

  it('returns null when user is authenticated but not an admin', async () => {
    vi.mocked(createServerSupabase).mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: 'user-123', role: 'authenticated' } },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
    } as any);

    const result = await requireAdmin();
    expect(result).toBeNull();
  });

  it('returns client and userId when user is verified admin', async () => {
    const mockClient = {
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: 'admin-456', role: 'authenticated' } },
          error: null,
        }),
      },
      rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
    };
    vi.mocked(createServerSupabase).mockResolvedValue(mockClient as any);

    const result = await requireAdmin();
    expect(result).not.toBeNull();
    expect(result?.userId).toBe('admin-456');
    expect(result?.client).toBe(mockClient);
  });
});
