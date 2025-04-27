
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

    // Particle system with shamrock formation behavior
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
      inFormation: boolean;
    }> = [];

    // Lighter color palette
    const colors = [
      'rgba(26, 192, 115, 0.15)',  // lighter primary green
      'rgba(22, 148, 97, 0.15)',   // lighter dark green
      'rgba(77, 198, 149, 0.15)',  // very light green
      'rgba(178, 234, 209, 0.15)', // extremely light green
    ];

    // Create initial particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1.5,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        angle: Math.random() * Math.PI * 2,
        inFormation: false,
      });
    }

    // Function to create shamrock formation points
    const createShamrockFormation = (centerX: number, centerY: number, size: number) => {
      const points = [];
      const leafCount = 3;
      for (let i = 0; i < leafCount; i++) {
        const angle = (i * 2 * Math.PI) / leafCount;
        points.push({
          x: centerX + Math.cos(angle) * size,
          y: centerY + Math.sin(angle) * size,
        });
      }
      // Add stem point
      points.push({
        x: centerX,
        y: centerY + size * 1.2,
      });
      return points;
    };

    // Periodically create new formations
    setInterval(() => {
      const centerX = Math.random() * canvas.width;
      const centerY = Math.random() * canvas.height;
      const formationPoints = createShamrockFormation(centerX, centerY, 50);
      
      // Assign some particles to the formation
      const availableParticles = particles.filter(p => !p.inFormation);
      const particlesToAssign = Math.min(formationPoints.length * 5, availableParticles.length);
      
      for (let i = 0; i < particlesToAssign; i++) {
        const particle = availableParticles[i];
        const point = formationPoints[i % formationPoints.length];
        particle.targetX = point.x;
        particle.targetY = point.y;
        particle.inFormation = true;
      }
    }, 5000);

    // Release particles from formation
    setInterval(() => {
      particles.forEach(particle => {
        if (particle.inFormation && Math.random() < 0.1) {
          particle.inFormation = false;
          particle.targetX = undefined;
          particle.targetY = undefined;
        }
      });
    }, 1000);

    // Animation loop with enhanced particle behavior
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        if (particle.inFormation && particle.targetX !== undefined && particle.targetY !== undefined) {
          // Move towards formation position
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.x += dx * 0.05;
          particle.y += dy * 0.05;
        } else {
          // Free floating movement
          particle.x += Math.sin(particle.angle) * particle.speedX;
          particle.y += Math.cos(particle.angle) * particle.speedY;
          particle.angle += particle.rotationSpeed;
          particle.y += Math.sin(Date.now() * 0.001) * 0.3;
        }

        // Wrap around screen with smooth transition
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
