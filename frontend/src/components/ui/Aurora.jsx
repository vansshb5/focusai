import { useEffect, useRef } from "react";

export default function Aurora() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const blobs = [
        { x: 0.2, y: 0.3, r: 0.5, color: "rgba(15,110,86,0.13)", speed: 0.0008 },
        { x: 0.7, y: 0.2, r: 0.45, color: "rgba(127,119,221,0.10)", speed: 0.0006 },
        { x: 0.5, y: 0.7, r: 0.55, color: "rgba(29,158,117,0.09)", speed: 0.0010 },
        { x: 0.85, y: 0.6, r: 0.4, color: "rgba(83,74,183,0.08)", speed: 0.0007 },
      ];

      blobs.forEach((b, i) => {
        const x = (b.x + Math.sin(t * b.speed * 1000 + i) * 0.15) * canvas.width;
        const y = (b.y + Math.cos(t * b.speed * 800 + i) * 0.12) * canvas.height;
        const r = b.r * Math.max(canvas.width, canvas.height);
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      t += 16;
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none", opacity: 1
      }}
    />
  );
}