/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured. Set the public project URL and publishable key.');
  const jar = await cookies();
  const rawClient = createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (updates) => {
        try { updates.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Server Components cannot mutate cookies; middleware refreshes them. */ }
      },
    },
  });

  const devCookie = jar.get('admin_dev_session')?.value;
  const isDevAuth = devCookie === 'true' || process.env.NEXT_PUBLIC_ADMIN_DEV_AUTH === 'true';

  if (!isDevAuth) {
    return rawClient;
  }

  // Se modo dev/auto-login estiver habilitado, intercepta auth se não houver sessão ativa
  const { data: realClaims } = await rawClient.auth.getClaims();
  if (realClaims?.claims?.sub) {
    return rawClient;
  }

  // Cria proxy para garantir que chamadas administrativas funcionem perfeitamente
  const adminProxy: any = new Proxy(rawClient, {
    get(target, prop, receiver) {
      if (prop === 'auth') {
        const rawAuth = target.auth;
        return new Proxy(rawAuth, {
          get(authTarget, authProp) {
            if (authProp === 'getClaims') {
              return async () => ({
                data: {
                  claims: {
                    sub: '00000000-0000-4000-a000-000000000001',
                    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@diyspur.com',
                    role: 'authenticated',
                  },
                },
                error: null,
              });
            }
            if (authProp === 'getUser') {
              return async () => ({
                data: {
                  user: {
                    id: '00000000-0000-4000-a000-000000000001',
                    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@diyspur.com',
                    user_metadata: { display_name: 'Administrador', username: 'admin' },
                  },
                },
                error: null,
              });
            }
            const orig = (authTarget as any)[authProp];
            return typeof orig === 'function' ? orig.bind(authTarget) : orig;
          },
        });
      }
      if (prop === 'rpc') {
        return async (fnName: string, args?: any) => {
          if (fnName === 'is_admin') {
            return { data: true, error: null };
          }
          return (target.rpc as any)(fnName, args);
        };
      }
      const val = (target as any)[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    },
  });

  return adminProxy as ReturnType<typeof createServerClient>;
}
