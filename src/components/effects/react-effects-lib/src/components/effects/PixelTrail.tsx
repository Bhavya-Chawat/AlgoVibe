import React, { useEffect, useRef } from 'react';

interface Pixel {
  x: number;
  y: number;
  opacity: number;
  life: number;
}

export const PixelTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);

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
      const pixelSize = 8;
      
      // Add new pixels
      for (let i = 0; i < 3; i++) {
        pixelsRef.current.push({
          x: Math.floor(e.clientX / pixelSize) * pixelSize + Math.random() * pixelSize,
          y: Math.floor(e.clientY / pixelSize) * pixelSize + Math.random() * pixelSize,
          opacity: 1,
          life: 30
        });
      }
      
      // Limit total pixels
      if (pixelsRef.current.length > 100) {
        pixelsRef.current = pixelsRef.current.slice(-100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw pixels
      pixelsRef.current = pixelsRef.current.filter(pixel => {
        pixel.life--;
        pixel.opacity = pixel.life / 30;

        if (pixel.life > 0) {
          ctx.fillStyle = `rgba(28, 171, 242, ${pixel.opacity})`;
          ctx.fillRect(pixel.x, pixel.y, 8, 8);
          
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(28, 171, 242, 0.5)';
          ctx.fillRect(pixel.x, pixel.y, 8, 8);
          ctx.shadowBlur = 0;
          
          return true;
        }
        return false;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
    />
  );
};