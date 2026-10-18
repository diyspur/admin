import 'server-only';
import { createServerSupabase } from '@/lib/supabase/clients';

export async function requireAdmin() {
  const client = await createServerSupabase();
  const { data: claimsData, error: claimsError } = await client.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== 'string' || !userId) {
    return null;
  }

  const { data: isUserAdmin, error: roleError } = await client.rpc('is_admin');
  if (roleError || isUserAdmin !== true) {
    return null;
  }

  return { client, userId };
}
