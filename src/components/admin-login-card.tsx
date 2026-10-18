'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminLoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const performDevBypassLogin = async () => {
    setLoading(true);
    setStatus('Conectando em modo de desenvolvimento...');
    try {
      const res = await fetch('/api/auth/auto-login', { method: 'POST' });
      if (res.ok) {
        setStatus('Sessão administrativa iniciada. Redirecionando...');
        setTimeout(() => {
          router.replace(redirectTarget);
          router.refresh();
        }, 400);
      } else {
        setStatus('Não foi possível iniciar o modo desenvolvimento.');
        setLoading(false);
      }
    } catch {
      setStatus('Erro de conexão com o servidor.');
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Autenticando credenciais...');
    try {
      const res = await fetch('/api/auth/auto-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setStatus('Autenticado com sucesso! Redirecionando...');
        router.replace(redirectTarget);
        router.refresh();
      } else {
        setStatus('Credenciais inválidas ou acesso não autorizado.');
        setLoading(false);
      }
    } catch {
      setStatus('Erro ao comunicar com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-card member-card" style={{ maxWidth: '420px', margin: '40px auto', padding: '32px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#000',
            fontWeight: 900,
            fontSize: '1.4rem',
            marginBottom: '12px',
          }}
        >
          D
        </span>
        <h1 style={{ fontSize: '1.4rem', margin: '0 0 6px' }}>DIYSPUR Admin</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Acesso Editorial & Administrativo
        </p>
      </div>

      {status && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            marginBottom: '20px',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}
        >
          <span>{status}</span>
        </div>
      )}

      <button
        type="button"
        className="button"
        disabled={loading}
        onClick={performDevBypassLogin}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {loading ? 'Aguarde…' : '⚡ Entrar como Administrador (Dev Bypass)'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle, rgba(255,255,255,0.1))' }} />
        <span>ou com email e senha</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle, rgba(255,255,255,0.1))' }} />
      </div>

      <form onSubmit={handleManualSubmit}>
        <label>
          Email
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@diyspur.com"
            required
          />
        </label>
        <label>
          Senha
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
          />
        </label>
        <button type="submit" className="button button-quiet" disabled={loading} style={{ width: '100%', marginTop: '12px' }}>
          Entrar com credenciais
        </button>
      </form>
    </div>
  );
}
