'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Painel Geral', icon: '📊', description: 'Visão geral e atalhos' },
  { href: '/admin/books', label: 'Livros', icon: '📚', description: 'Catálogo e fichas' },
  { href: '/admin/seasons', label: 'Temporadas', icon: '🗓️', description: 'Capítulos e cronograma' },
  { href: '/admin/moderation', label: 'Moderação', icon: '🛡️', description: 'Denúncias comunitárias' },
];

export function AdminNav() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.1))',
        background: 'var(--bg-surface, rgba(18, 20, 29, 0.85))',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '14px',
          paddingBottom: '14px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: 'var(--text-primary, #ffffff)',
              letterSpacing: '-0.02em',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#000',
                fontWeight: 900,
                fontSize: '0.9rem',
              }}
            >
              D
            </span>
            <span>DIYSPUR</span>
            <span
              style={{
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              Admin
            </span>
          </Link>
        </div>

        {/* Menu Principal Clicável */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
          aria-label="Navegação administrativa"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? '#ffffff'
                    : 'var(--text-secondary, rgba(255, 255, 255, 0.7))',
                  backgroundColor: isActive
                    ? 'rgba(245, 158, 11, 0.18)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(245, 158, 11, 0.4)'
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status / Ações */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
            title="Sessão autenticada no servidor"
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981',
              }}
            />
            <span>Admin Conectado</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.15))',
              color: 'var(--text-primary, #ffffff)',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
            title="Alternar tema"
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>
      </div>
    </header>
  );
}
