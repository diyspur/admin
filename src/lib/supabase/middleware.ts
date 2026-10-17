import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function refreshSupabaseSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.next({ request });

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (updates, headers) => {
        updates.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        updates.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
      },
    },
  });

  const devAuth = process.env.NEXT_PUBLIC_ADMIN_DEV_AUTH === 'true' || request.cookies.get('admin_dev_session')?.value === 'true';

  // Se auto-login / dev auth estiver ativo, garante o cookie admin_dev_session
  if (devAuth && !request.cookies.get('admin_dev_session')) {
    response.cookies.set('admin_dev_session', 'true', { path: '/', httpOnly: false, sameSite: 'lax' });
  }

  // Refresh session se houver tokens
  await supabase.auth.getClaims();

  return response;
}
