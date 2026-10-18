import { NextResponse } from 'next/server';

/**
 * Endpoint de bootstrap desativado por política de segurança (QA-02).
 * O provisionamento de administradores deve ocorrer via CLI do Supabase
 * ou migrações controladas, sem exposição de rotas públicas de elevação.
 */
export async function POST() {
  return NextResponse.json(
    { ok: false, message: 'Endpoint de provisionamento desativado. Utilize migrações administrativas seguras.' },
    { status: 404 },
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, message: 'Endpoint não encontrado.' },
    { status: 404 },
  );
}
