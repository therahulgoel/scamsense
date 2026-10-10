import './globals.css';
export const metadata = {
  title: 'ScamSense — Nice try, scammer.',
  description: 'Five fictional SMS messages. You versus AI. Spot the trap, learn the clue, and challenge a friend. Built by @therahulgoel.',
  openGraph: { title: 'Can you outsmart a scammer?', description: 'Play ScamSense: five messages, your instincts, one AI opponent.', type: 'website' },
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
