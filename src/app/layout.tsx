import type { Metadata, Viewport } from 'next';
import '@/styles/global.css';
import { AdminNav } from '@/components/admin/admin-nav';
import { AutoAuth } from '@/components/admin/auto-auth';

export const metadata: Metadata = {
  title: {
    default: 'DIYSPUR · Painel de Administração',
    template: '%s · DIYSPUR Admin',
  },
  description: 'Painel editorial e administrativo do clube de leitura DIYSPUR.',
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
  width: 'device-width',
  initialScale: 1,
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <AutoAuth />
        <AdminNav />
        <main id="conteudo" style={{ minHeight: 'calc(100vh - 70px)', paddingBottom: '60px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
