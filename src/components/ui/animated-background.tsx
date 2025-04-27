
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

    // Particle system for shamrock formation
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
      formationIndex: number;
    }> = [];

    // Even lighter color palette
    const colors = [
      'rgba(26, 192, 115, 0.1)',   // very light primary green
      'rgba(22, 148, 97, 0.1)',    // very light dark green
      'rgba(77, 198, 149, 0.1)',   // extremely light green
      'rgba(178, 234, 209, 0.1)',  // almost transparent green
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
        formationIndex: -1,
      });
    }

    // Function to create shamrock formation points
    const createShamrockFormation = (centerX: number, centerY: number, size: number) => {
      const points = [];
      const leafCount = 3;
      const leafSize = size * 0.8;
      
      // Create three leaves
      for (let i = 0; i < leafCount; i++) {
        const angle = (i * 2 * Math.PI) / leafCount;
        points.push({
          x: centerX + Math.cos(angle) * leafSize,
          y: centerY + Math.sin(angle) * leafSize,
        });
      }
      
      // Add stem points
      points.push({
        x: centerX,
        y: centerY + size,
      });

      // Add center points for more density
      points.push({
        x: centerX,
        y: centerY,
      });

      return points;
    };

    // Formation management
    let formations: Array<{ x: number; y: number; points: Array<{ x: number; y: number }> }> = [];

    // Create new formations periodically
    const createNewFormation = () => {
      const centerX = Math.random() * canvas.width;
      const centerY = Math.random() * canvas.height;
      const formationPoints = createShamrockFormation(centerX, centerY, 50);
      
      formations.push({
        x: centerX,
        y: centerY,
        points: formationPoints,
      });

      // Assign available particles to the new formation
      const availableParticles = particles.filter(p => p.formationIndex === -1);
      const pointsPerPosition = Math.ceil(availableParticles.length / formationPoints.length);
      
      availableParticles.forEach((particle, index) => {
        const pointIndex = Math.floor(index / pointsPerPosition) % formationPoints.length;
        particle.targetX = formationPoints[pointIndex].x;
        particle.targetY = formationPoints[pointIndex].y;
        particle.formationIndex = formations.length - 1;
      });
    };

    // Initial formations
    for (let i = 0; i < 5; i++) {
      createNewFormation();
    }

    // Create new formations periodically
    setInterval(() => {
      // Remove oldest formation and create a new one
      if (formations.length > 4) {
        formations.shift();
        // Reset particles from the removed formation
        particles.forEach(particle => {
          if (particle.formationIndex === 0) {
            particle.formationIndex = -1;
          } else if (particle.formationIndex > 0) {
            particle.formationIndex--;
          }
        });
      }
      createNewFormation();
    }, 4000);

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        if (particle.formationIndex !== -1 && particle.targetX !== undefined && particle.targetY !== undefined) {
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
