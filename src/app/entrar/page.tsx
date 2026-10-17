import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AdminLoginCard } from '@/components/admin-login-card';

export const metadata: Metadata = {
  title: 'Entrar · DIYSPUR Admin',
  robots: { index: false, follow: false },
};

export default function SigninPage() {
  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Suspense fallback={<div className="notice">Carregando painel de acesso…</div>}>
        <AdminLoginCard />
      </Suspense>
    </div>
  );
}
