
import { useEffect, useRef } from 'react';

export const ParticleLogoBackground = () => {
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
      targetX: number;
      targetY: number;
      dx: number;
      dy: number;
      color: string;
    }> = [];

    // Brand colors with varying opacity
    const colors = [
      'rgba(26, 192, 115, 0.2)',  // primary green
      'rgba(22, 148, 97, 0.15)',  // dark green
      'rgba(77, 198, 149, 0.12)', // medium green
    ];

    // Create particle for each point in the logo
    const createLogoParticles = () => {
      particles.length = 0; // Clear existing particles
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.15;

      // Generate "IP" logo points
      const logoPoints = [];

      // Letter I
      for (let y = -2; y <= 2; y += 0.1) {
        logoPoints.push({ x: -2, y });
      }

      // Letter P vertical line
      for (let y = -2; y <= 2; y += 0.1) {
        logoPoints.push({ x: 0, y });
      }

      // Letter P curved part
      for (let angle = 0; angle <= Math.PI; angle += 0.1) {
        logoPoints.push({
          x: 1 + Math.cos(angle),
          y: -1 + Math.sin(angle),
        });
      }

      // Create particles for each logo point
      logoPoints.forEach(point => {
        const particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          targetX: centerX + point.x * scale,
          targetY: centerY + point.y * scale,
          dx: 0,
          dy: 0,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        particles.push(particle);
      });
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Calculate direction to target
        const dx = (particle.targetX - particle.x) * 0.05;
        const dy = (particle.targetY - particle.y) * 0.05;

        // Update position
        particle.x += dx;
        particle.y += dy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    // Initial setup
    createLogoParticles();
    animate();

    // Periodically recreate particles for continuous animation
    const interval = setInterval(() => {
      createLogoParticles();
    }, 5000);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setSize);
      clearInterval(interval);
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
