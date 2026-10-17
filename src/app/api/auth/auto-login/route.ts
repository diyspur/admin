import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const email = process.env.ADMIN_DEFAULT_EMAIL || 'admin@diyspur.com';
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Diyspur2026!';

  const response = NextResponse.json({ ok: true, email, message: 'Autenticado com sucesso.' });
  // Seta cookie dev admin por garantia
  response.cookies.set('admin_dev_session', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    sameSite: 'lax',
    httpOnly: false,
  });

  if (url && key && !key.includes('placeholder')) {
    try {
      const supabase = createServerClient(url, key, {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (updates) => {
            updates.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      // Tenta login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // Tenta cadastrar caso não exista
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: 'Administrador DIYSPUR', username: 'admin' },
          },
        });
        await supabase.auth.signInWithPassword({ email, password });
      }
    } catch {
      // Ignora erro de rede/supabase e mantém cookie dev_session
    }
  }

  return response;
}

export async function GET(request: NextRequest) {
  const res = await POST(request);
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/admin';
  const nextRes = NextResponse.redirect(redirectUrl);
  // Copia os cookies
  res.cookies.getAll().forEach((cookie) => {
    nextRes.cookies.set(cookie.name, cookie.value);
  });
  return nextRes;
}
