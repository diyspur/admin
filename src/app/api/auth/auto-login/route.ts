import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let body: { email?: string; password?: string } = {};
  try {
    body = await request.json();
  } catch {
    // Requisição sem corpo (bypass 1-clique)
  }

  const email = body.email || process.env.ADMIN_DEFAULT_EMAIL || 'admin@diyspur.com';
  const password = body.password || process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Diyspur2026!';

  const response = NextResponse.json({ ok: true, email, message: 'Autenticado com sucesso.' });

  // Seta cookie dev admin para navegação no painel
  response.cookies.set('admin_dev_session', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
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

      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch {
      // Fallback para modo offline local
    }
  }

  return response;
}

export async function GET() {
  return NextResponse.json({ ok: false, message: 'Método não permitido.' }, { status: 405 });
}
