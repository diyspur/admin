'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function AdminLoginCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('admin@diyspur.com');
  const [password, setPassword] = useState('Admin@Diyspur2026!');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('Autenticando automaticamente...');

  const performAutoLogin = async () => {
    setLoading(true);
    setStatus('Conectando como Administrador...');
    try {
      const res = await fetch('/api/auth/auto-login', { method: 'POST' });
      if (res.ok) {
        setStatus('Autenticado com sucesso! Redirecionando...');
        setTimeout(() => {
          router.replace(redirectTarget);
          router.refresh();
        }, 500);
      } else {
        setStatus('Auto-login aguardando confirmação. Clique abaixo.');
        setLoading(false);
      }
    } catch {
      setStatus('Erro de conexão no auto-login. Clique para tentar novamente.');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Dispara auto-login imediato na chegada
    performAutoLogin();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Autenticando...');
    try {
      const res = await fetch('/api/auth/auto-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setStatus('Sucesso! Redirecionando...');
        router.replace(redirectTarget);
        router.refresh();
      } else {
        setStatus('Falha na autenticação.');
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

      <button
        type="button"
        className="button"
        disabled={loading}
        onClick={performAutoLogin}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {loading ? 'Entrando…' : '⚡ Entrar como Administrador (1 clique)'}
      </button>

      <form onSubmit={handleManualSubmit}>
        <label>
          Email
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </label>
        <button type="submit" className="button button-quiet" disabled={loading} style={{ width: '100%' }}>
          Entrar com credenciais
        </button>
      </form>
    </div>
  );
}
