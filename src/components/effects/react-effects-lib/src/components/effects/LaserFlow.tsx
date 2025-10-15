import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
}

export const LaserFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trail, setTrail] = useState<Point[]>([]);
  const maxTrailLength = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      setTrail(prev => {
        const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
        return newTrail.slice(-maxTrailLength);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trail.length > 1) {
        ctx.strokeStyle = 'rgba(28, 171, 242, 0.6)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw gradient trail
        for (let i = 0; i < trail.length - 1; i++) {
          const opacity = (i / trail.length) * 0.6;
          ctx.strokeStyle = `rgba(28, 171, 242, ${opacity})`;
          
          ctx.beginPath();
          ctx.moveTo(trail[i].x, trail[i].y);
          ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
          ctx.stroke();
        }

        // Draw glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(28, 171, 242, 0.8)';
        ctx.strokeStyle = 'rgba(28, 171, 242, 1)';
        ctx.lineWidth = 1;
        
        if (trail.length > 0) {
          const last = trail[trail.length - 1];
          ctx.beginPath();
          ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(28, 171, 242, 1)';
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [trail]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};