import { useEffect, useRef } from 'react';
import type { Theme } from '../lib/theme';

const MATRIX_CHARS = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@*+-'.split('');

export default function MatrixRain({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Light theme fades to white and uses a deeper green so the rain stays
    // legible on a white page; the dark theme keeps the original look.
    const isLight = theme === 'light';
    const fadeColor = isLight ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.08)';
    const inkColor = isLight ? 'rgba(16, 185, 129, 0.55)' : 'rgba(34, 197, 94, 0.65)';

    const canvas = canvasRef.current;
    if (!canvas) return;

    let context: CanvasRenderingContext2D | null = null;
    try {
      context = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!context) return;
    const ctx = context;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      columns = Math.max(1, Math.floor(width / 18));
      drops = Array.from({ length: columns }, () => Math.random() * height);
    };

    const draw = () => {
      ctx.fillStyle = fadeColor;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = inkColor;
      ctx.font = '16px monospace';

      for (let column = 0; column < columns; column += 1) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = column * 18;
        const y = drops[column];

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[column] = 0;
        } else {
          drops[column] += 18;
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-30"
    />
  );
}
