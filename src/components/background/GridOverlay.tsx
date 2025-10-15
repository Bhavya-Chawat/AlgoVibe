import React from 'react';

interface GridOverlayProps {
  className?: string;
  opacity?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ 
  className = '', 
  opacity = 0.15 
}) => {
  return (
    <div 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity }}
    >
      {/* Vertical lines */}
      <div className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(28, 171, 242, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Horizontal lines */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(28, 171, 242, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Glow effect at intersections */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50px 50px, rgba(28, 171, 242, 0.05) 2px, transparent 2px),
            radial-gradient(circle at 100px 100px, rgba(28, 171, 242, 0.05) 2px, transparent 2px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
};