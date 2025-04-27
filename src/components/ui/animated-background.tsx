
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

    // Particle system with more interesting properties
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
    }> = [];

    // Color palette based on the company's green theme
    const colors = [
      'rgba(26, 192, 115, 0.2)',  // primary green
      'rgba(22, 148, 97, 0.2)',   // darker green
      'rgba(77, 198, 149, 0.2)',  // lighter green
      'rgba(128, 214, 179, 0.2)', // very light green
    ];

    // Create initial particles
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Animation loop with enhanced particle behavior
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position with smooth movement
        particle.x += Math.sin(particle.angle) * particle.speedX;
        particle.y += Math.cos(particle.angle) * particle.speedY;
        particle.angle += particle.rotationSpeed;

        // Create flowing effect
        particle.y += Math.sin(Date.now() * 0.001) * 0.5;

        // Wrap around screen with smooth transition
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;

        // Draw particle with rotation
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        // Draw diamond shape
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

