import React, { useEffect, useRef } from "react";

export function Snow() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Dimensions du canvas
        const W = window.innerWidth;
        const H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        // Flocons de neige
        const mp = 25; // Nombre max de particules
        const particles = Array.from({ length: mp }, () => ({
            x: Math.random() * W, // Coordonnée X
            y: Math.random() * H, // Coordonnée Y
            r: Math.random() * 4 + 1, // Rayon
            d: Math.random() * mp, // Densité
        }));

        // Dessiner les flocons
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath();

            particles.forEach((p) => {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
            });

            ctx.fill();
            update();
        };

        // Mettre à jour les positions
        let angle = 0;
        const update = () => {
            angle += 0.01;
            particles.forEach((p, i) => {
                p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
                p.x += Math.sin(angle) * 2;

                // Réinitialiser les flocons qui sortent de l'écran
                if (p.x > W + 5 || p.x < -5 || p.y > H) {
                    if (i % 3 > 0) {
                        particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d };
                    } else {
                        if (Math.sin(angle) > 0) {
                            particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d };
                        } else {
                            particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d };
                        }
                    }
                }
            });
        };

        // Lancer l'animation
        const interval = setInterval(draw, 33);

        // Nettoyage
        return () => clearInterval(interval);
    }, []);

    return (
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{ backgroundColor: "transparent" }}
        />
      );
}
