import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_DEFAULT_EMAIL || 'admin@diyspur.com';
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@Diyspur2026!';

  if (!url || !serviceKey) {
    return NextResponse.json({
      ok: false,
      message: 'SUPABASE_SERVICE_ROLE_KEY não configurada no servidor. O login automático usará o modo dev integrado.',
    }, { status: 200 });
  }

  try {
    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Procura usuário
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    let adminUser = users.users.find((u) => u.email === email);

    if (!adminUser) {
      const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: 'Administrador DIYSPUR', username: 'admin' },
      });
      if (createError) throw createError;
      adminUser = created.user;
    }

    if (adminUser) {
      // Atualiza role no profile
      await supabaseAdmin.from('profiles').update({ role: 'admin' }).eq('id', adminUser.id);
    }

    return NextResponse.json({
      ok: true,
      message: `Conta admin ${email} verificada e configurada no Supabase com sucesso.`,
      userId: adminUser?.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao gerenciar conta admin via Supabase Admin API.';
    return NextResponse.json({
      ok: false,
      message,
    }, { status: 500 });
  }
}
