import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'EduTrust-Chain — NITDA Digital Skills Platform',
    template: '%s · EduTrust-Chain | NITDA',
  },
  description:
    'EduTrust-Chain is NITDA’s AI-assisted, blockchain-backed e-learning and content management platform. Verifiable soulbound credentials, eNaira and stablecoin payments, built for the National Blockchain Policy.',
  applicationName: 'EduTrust-Chain',
  authors: [{ name: 'National Information Technology Development Agency' }],
  keywords: ['NITDA', 'EduTrust-Chain', 'eNaira', 'blockchain', 'soulbound token', 'LMS', 'Nigeria', 'JosNOG'],
  openGraph: {
    title: 'EduTrust-Chain — NITDA Digital Skills Platform',
    description: 'Verifiable credentials on-chain. eNaira and stablecoin payments. AI-assisted course authoring.',
    siteName: 'EduTrust-Chain',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#1B7339',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-nitda-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
