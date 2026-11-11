import React, { useEffect, useRef } from 'react';

interface PulseWaveformProps {
  bpm?: number;
  height?: number;
}

export const PulseWaveform: React.FC<PulseWaveformProps> = ({ bpm = 75, height = 120 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const points: number[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const width = canvas.width;
      const midY = height / 2;

      // Calculate wave phase based on time
      const time = Date.now() / 1000;
      const freq = (bpm / 60) * 2 * Math.PI;

      // ECG wave formula
      let y = Math.sin(time * freq) * 12;
      const cyclePos = (time * freq) % (2 * Math.PI);

      // Add sharp QRS peak simulation
      if (cyclePos > 1.2 && cyclePos < 1.6) {
        y -= Math.sin((cyclePos - 1.2) * (Math.PI / 0.4)) * 38;
      } else if (cyclePos >= 1.6 && cyclePos < 1.8) {
        y += Math.sin((cyclePos - 1.6) * (Math.PI / 0.2)) * 18;
      }

      points.push(midY + y);
      if (points.length > width) {
        points.shift();
      }

      ctx.clearRect(0, 0, width, height);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.5)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 25) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 20) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw Wave Path
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#22d3ee'; // Cyan glow
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;

      for (let i = 0; i < points.length; i++) {
        const px = i;
        const py = points[i];
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      x = (x + 1) % width;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [bpm, height]);

  return (
    <div className="w-full relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 p-2 shadow-inner">
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
        <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
          MAX30102 PPG Waveform ({bpm} BPM)
        </span>
      </div>
      <canvas ref={canvasRef} className="w-full block" style={{ height }} />
    </div>
  );
};
