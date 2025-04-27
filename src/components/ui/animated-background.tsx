
import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
      rotationSpeed: number;
      angle: number;
      targetX?: number;
      targetY?: number;
    }> = [];

    // Even lighter color palette
    const colors = [
      'rgba(26, 192, 115, 0.06)',  // extremely light primary green
      'rgba(22, 148, 97, 0.06)',   // extremely light dark green
      'rgba(77, 198, 149, 0.06)',  // extremely light medium green
      'rgba(178, 234, 209, 0.06)', // barely visible light green
    ];

    // Create initial particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        angle: Math.random() * Math.PI * 2,
        targetX: undefined,
        targetY: undefined,
      });
    }

    // Function to create logo formation points
    const createLogoFormation = (centerX: number, centerY: number, size: number) => {
      const points = [];
      const scale = size;
      
      // Create points for "IP" letters
      // Letter I
      for (let y = 0; y < 5; y++) {
        points.push({
          x: centerX - scale * 2,
          y: centerY - scale * 2 + y * scale,
        });
      }
      
      // Letter P
      points.push(
        // Vertical line
        ...Array.from({ length: 5 }, (_, i) => ({
          x: centerX,
          y: centerY - scale * 2 + i * scale,
        })),
        // Top horizontal line
        ...Array.from({ length: 2 }, (_, i) => ({
          x: centerX + i * scale,
          y: centerY - scale * 2,
        })),
        // Middle horizontal line
        ...Array.from({ length: 2 }, (_, i) => ({
          x: centerX + i * scale,
          y: centerY,
        })),
        // Curve point
        {
          x: centerX + scale,
          y: centerY - scale,
        }
      );

      // Add some scattered points for a more dynamic effect
      for (let i = 0; i < 10; i++) {
        points.push({
          x: centerX + (Math.random() - 0.5) * size * 4,
          y: centerY + (Math.random() - 0.5) * size * 4,
        });
      }

      return points;
    };

    // Formation management
    const updateFormation = () => {
      const formationPoints = createLogoFormation(canvas.width / 2, canvas.height / 2, 30);
      
      particles.forEach((particle, index) => {
        const pointIndex = index % formationPoints.length;
        particle.targetX = formationPoints[pointIndex].x;
        particle.targetY = formationPoints[pointIndex].y;
      });
    };

    // Initial formation
    updateFormation();

    // Recreate formation periodically with slight variations
    setInterval(() => {
      updateFormation();
    }, 5000);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        if (particle.targetX !== undefined && particle.targetY !== undefined) {
          // Move towards formation position
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.x += dx * 0.05;
          particle.y += dy * 0.05;
        }

        // Wrap around screen
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.moveTo(0, -particle.size);
        ctx.lineTo(particle.size, 0);
        ctx.lineTo(0, particle.size);
        ctx.lineTo(-particle.size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200"
      style={{ background: 'transparent' }}
    />
  );
};
