import { useEffect, useState, RefObject } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

interface UseCursorEffectOptions {
  smoothing?: number;
  magneticStrength?: number;
  magneticRadius?: number;
}

export const useCursorEffect = (
  elementRef?: RefObject<HTMLElement>,
  options: UseCursorEffectOptions = {}
) => {
  const {
    smoothing = 0.15,
    magneticStrength = 0.3,
    magneticRadius = 100
  } = options;

  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over element
      if (elementRef?.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < magneticRadius) {
          setIsHovering(true);
          
          // Apply magnetic effect
          const force = (magneticRadius - distance) / magneticRadius;
          const offsetX = deltaX * force * magneticStrength;
          const offsetY = deltaY * force * magneticStrength;
          
          if (elementRef.current) {
            elementRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
          }
        } else {
          setIsHovering(false);
          if (elementRef.current) {
            elementRef.current.style.transform = 'translate(0, 0)';
          }
        }
      }
    };

    // Smooth cursor animation
    const animate = () => {
      setCursorPos(prev => ({
        x: prev.x + (targetPos.x - prev.x) * smoothing,
        y: prev.y + (targetPos.y - prev.y) * smoothing
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      if (elementRef?.current) {
        elementRef.current.style.transform = 'translate(0, 0)';
      }
    };
  }, [targetPos, smoothing, elementRef, magneticStrength, magneticRadius]);

  return {
    cursorPos,
    isHovering,
    targetPos
  };
};