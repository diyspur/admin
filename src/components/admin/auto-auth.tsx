'use client';

import { useEffect } from 'react';

export function AutoAuth() {
  useEffect(() => {
    // Garante que o cookie de sessão administrativa esteja presente
    if (!document.cookie.includes('admin_dev_session')) {
      fetch('/api/auth/auto-login', { method: 'POST' }).catch(() => {});
    }
  }, []);

  return null;
}
