export function safeLocalRedirect(value: string | null | undefined, fallback = '/perfil'): string {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  try {
    const parsed = new URL(trimmed, 'https://local.invalid');
    if (parsed.origin !== 'https://local.invalid' || !parsed.pathname.startsWith('/')) {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

/**
 * Sanitiza parâmetros de redirecionamento garantindo que sejam estritamente
 * caminhos relativos internos da aplicação, mitigando ataques de Open Redirect (SEC-01).
 */
export function getSafeRedirectUrl(redirectParam: string | null | undefined, fallback = '/'): string {
  return safeLocalRedirect(redirectParam, fallback);
}
