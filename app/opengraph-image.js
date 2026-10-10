import { ImageResponse } from 'next/og';

export const alt = 'ScamSense — Think you’re unscammable? Five texts. You versus AI. Built by @therahulgoel.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#f5f0ff', color: '#211f2c', padding: '55px 64px', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: '#6543db' }}>scamsense.</span>
        <span style={{ fontSize: 21, background: '#211f2c', color: 'white', borderRadius: 30, padding: '12px 22px' }}>YOU vs OPENAI DECISIONS</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 78, fontWeight: 700, letterSpacing: -4 }}>Think you’re</span>
        <span style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, color: '#6543db' }}>unscammable?</span>
        <span style={{ fontSize: 29, marginTop: 22 }}>Five texts. Two minutes. Can you beat the AI?</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 23, background: '#ffdf82', borderRadius: 16, padding: '15px 22px' }}>Play free. Challenge a friend.</span>
        <span style={{ fontSize: 21 }}>Built by @therahulgoel</span>
      </div>
    </div>,
    size,
  );
}
