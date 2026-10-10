import './globals.css';
export const metadata = {
  metadataBase: new URL('https://scamsense-lemon.vercel.app'),
  title: 'ScamSense — Think you’re unscammable?',
  description: 'Five texts. Two minutes. You versus the real OpenAI Decisions API. Learn the scam, challenge a friend. Built by @therahulgoel.',
  openGraph: {
    title: 'Think you’re unscammable? Take on the AI.',
    description: 'Five fictional SMS. Real OpenAI decisions. Play ScamSense and challenge your family group.',
    url: 'https://scamsense-lemon.vercel.app',
    siteName: 'ScamSense',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'ScamSense — Five texts. You versus AI.', description: 'Think you’re unscammable? Play the two-minute scam showdown.' },
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
