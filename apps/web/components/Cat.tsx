import React, { useEffect, useRef } from 'react';

export default function Cat({ active = false }: { active?: boolean }) {
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) return;
    // play a short descending 'meow-ish' sound using WebAudio
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioRef.current = ctx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(500, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.6);
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.8);
    const cleanup = () => {
      try { ctx.close(); } catch (e) {}
    };
    const t = setTimeout(cleanup, 900);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div style={{ position: 'fixed', bottom: 20, left: 0, zIndex: 999 }} className={active ? 'cat active' : 'cat'}>
      <div style={{ display: 'flex', alignItems: 'center', transform: 'translateX(0)' }}>
        <div style={{ fontSize: 30 }}>🐱</div>
      </div>
      <style jsx>{`
        .cat { transition: transform 1s linear; }
        .cat.active { animation: walk 8s linear infinite; }
        @keyframes walk {
          0% { transform: translateX(-10%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(-10%); }
        }
      `}</style>
    </div>
  );
}
