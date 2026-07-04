import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, RotateCcw, Heart, Flame, Settings, Star, Layers, Activity } from 'lucide-react';

// Baking stages description
const STAGES = [
  { id: 0, name: "Batter Whipping", desc: "Whisking premium flour, butter, and raw sugar into a fluffy, organic batter.", color: "from-amber-400 to-amber-600" },
  { id: 1, name: "Convection Rise", desc: "Thermo-active convection baking inside our oven at exactly 175°C.", color: "from-orange-500 to-red-600" },
  { id: 2, name: "Cream Frosting", desc: "Applying a dreamy, velvety coating of fresh cow's butter whipped cream.", color: "from-pink-400 to-rose-500" },
  { id: 3, name: "Crowning Toppings", desc: "Scattering sweet organic strawberry slices, star crystals, and the final flame candle.", color: "from-violet-500 to-purple-600" },
  { id: 4, name: "Luxury Showroom", desc: "Interactive display. Spin and rotate our baked masterpiece in full 3D aspect!", color: "from-emerald-400 to-teal-600" }
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface BakingAnimationProps {
  isAdminAuthenticated?: boolean;
  onLoginClick?: () => void;
}

export default function BakingAnimation({ isAdminAuthenticated = false, onLoginClick }: BakingAnimationProps) {
  const [currentStage, setCurrentStage] = useState<number>(4);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [flavourType, setFlavourType] = useState<'vanilla' | 'chocolate' | 'strawberry'>('strawberry');

  const rotationAngleRef = useRef<number>(0);
  const spongeRisingRef = useRef<number>(1.0);
  const frostingCoverageRef = useRef<number>(1.0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const autoRotateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  // Synchronize stage transitions to initialize refs
  useEffect(() => {
    if (currentStage === 0) {
      spongeRisingRef.current = 0.1;
      frostingCoverageRef.current = 0;
    } else if (currentStage === 1) {
      spongeRisingRef.current = 0.1;
      frostingCoverageRef.current = 0;
    } else if (currentStage === 2) {
      spongeRisingRef.current = 1.0;
      frostingCoverageRef.current = 0;
    } else if (currentStage >= 3) {
      spongeRisingRef.current = 1.0;
      frostingCoverageRef.current = 1.0;
    }
  }, [currentStage]);

  useEffect(() => {
    return () => {
      if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
    };
  }, []);

  // Update particles and draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localParticles = particlesRef.current;

    // Canvas size adjustment
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Increment rotation angle if auto-rotating
      if (isAutoRotating) {
        rotationAngleRef.current = (rotationAngleRef.current + 0.015) % (Math.PI * 2);
      }

      const rotationAngle = rotationAngleRef.current;
      const spongeRising = spongeRisingRef.current;
      const frostingCoverage = frostingCoverageRef.current;
      const toppingsAdded = currentStage >= 3;

      // Draw beautiful stylized bakery blueprint grid background
      ctx.strokeStyle = 'rgba(135, 78, 88, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // 3D Perspective constants
      const cx = width / 2;
      const cy = height / 2 + 30;

      // Color scheme according to selected flavor
      const baseColors = {
        strawberry: { sponge: '#E89CA9', crust: '#FFB6C1', shading: '#C9184A', top: '#FFE5EC' },
        chocolate: { sponge: '#5C3A21', crust: '#3D2515', shading: '#2B1A0F', top: '#8A5D3F' },
        vanilla: { sponge: '#FFF3A8', crust: '#E5D182', shading: '#A08F52', top: '#FFFDE8' }
      }[flavourType];

      // Update particles
      if (currentStage === 0) {
        // Flour/egg particles pouring into mixing bowl
        if (Math.random() < 0.3) {
          localParticles.push({
            x: cx - 40 + Math.random() * 80,
            y: cy - 140,
            vx: -1 + Math.random() * 2,
            vy: 4 + Math.random() * 3,
            size: 2 + Math.random() * 4,
            color: Math.random() > 0.5 ? '#FFFDD0' : '#FFF', // Flour, cream, egg yellow
            alpha: 1,
            life: 45
          });
        }
      } else if (currentStage === 1) {
        // Rising heat particles from convection oven
        if (Math.random() < 0.25) {
          localParticles.push({
            x: cx - 60 + Math.random() * 120,
            y: cy + 10,
            vx: -0.5 + Math.random() * 1,
            vy: -1.5 - Math.random() * 2,
            size: 1.5 + Math.random() * 3,
            color: 'rgba(255, 165, 0, 0.4)', // Amber thermal glow
            alpha: 0.8,
            life: 60
          });
        }
      } else if (currentStage === 2) {
        // Frosting drops
        if (Math.random() < 0.2 && frostingCoverageRef.current < 1) {
          frostingCoverageRef.current = Math.min(1, frostingCoverageRef.current + 0.005);
          localParticles.push({
            x: cx - 50 + Math.sin(rotationAngle * 3) * 40,
            y: cy - 80,
            vx: 0,
            vy: 2 + Math.random() * 2,
            size: 3 + Math.random() * 3,
            color: '#FFFFFF', // Whipped sweet cream
            alpha: 1,
            life: 30
          });
        }
      } else if (currentStage === 4) {
        // Magic sparks / confetti while in showroom
        if (Math.random() < 0.08) {
          localParticles.push({
            x: cx - 110 + Math.random() * 220,
            y: cy + 30 - Math.random() * 140,
            vx: -0.5 + Math.random() * 1,
            vy: -0.5 - Math.random() * 1,
            size: 2 + Math.random() * 3,
            color: ['#FFD700', '#FFB6C1', '#87CEEB', '#D8BFD8'][Math.floor(Math.random() * 4)],
            alpha: 0.9,
            life: 80
          });
        }
      }

      // Animate current particles
      localParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = Math.max(0, p.life / 60);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      particlesRef.current = localParticles.filter(p => p.life > 0);

      // START GRAPHICAL RENDER OVERLAYS ACCORDING TO STATE
      if (currentStage === 0) {
        // --- STAGE 0: BATTER MIXING BOWL (Perspective) ---
        // Stand base shadow
        ctx.fillStyle = 'rgba(135, 78, 88, 0.08)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 50, 90, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Whisk rotating stand
        ctx.fillStyle = '#E5D182';
        ctx.fillRect(cx - 5, cy - 130, 10, 40);

        // Render mixing bowl body with depth
        ctx.fillStyle = '#7DD1B9'; // Pastel Mint
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 70, 0, Math.PI, false);
        ctx.lineTo(cx - 70, cy - 10);
        ctx.fill();

        // Inside bowl golden creamy batter liquid rotation
        ctx.fillStyle = '#FFF3A8';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 10, 68, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mixing Swirl spiral lines
        ctx.strokeStyle = '#E89CA9';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.15) {
          const r = 5 + a * 3.8;
          if (r > 64) break;
          const sx = cx + Math.cos(a + rotationAngle * 8) * r;
          const sy = cy - 10 + Math.sin(a + rotationAngle * 8) * r * 0.24;
          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Dynamic Whisk blades rotating in bowl
        const whiskAngle = rotationAngle * 9;
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 4; i++) {
          const angleOffset = (i * Math.PI) / 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 90);
          ctx.quadraticCurveTo(
            cx + Math.cos(whiskAngle + angleOffset) * 32,
            cy - 50,
            cx + Math.cos(whiskAngle + angleOffset) * 12,
            cy - 10
          );
          ctx.stroke();
        }

        // Bowl rim
        ctx.strokeStyle = '#1D8B6F';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 10, 70, 18, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Hand mixers cute kawaii expression
        ctx.fillStyle = '#1D8B6F';
        ctx.beginPath();
        ctx.arc(cx - 20, cy + 15, 3.5, 0, Math.PI * 2);
        ctx.arc(cx + 20, cy + 15, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1D8B6F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy + 20, 5, 0, Math.PI);
        ctx.stroke();

      } else if (currentStage === 1) {
        // --- STAGE 1: CONVECTION OVEN ACTIVE ---
        // Dynamically increment rise (using Ref)
        if (spongeRisingRef.current < 1.0) {
          spongeRisingRef.current = Math.min(1.0, spongeRisingRef.current + 0.003);
        }
        const currentSpongeRising = spongeRisingRef.current;

        // Draw oven body (Cuboid Perspective)
        ctx.fillStyle = '#3E2723'; // Dark chocolate brown metal
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#2D1D1B';
        
        ctx.fillRect(cx - 110, cy - 100, 220, 150);
        ctx.strokeRect(cx - 110, cy - 100, 220, 150);

        // Inside the glass window
        ctx.fillStyle = 'rgba(26, 17, 16, 0.95)';
        ctx.fillRect(cx - 85, cy - 70, 170, 100);

        // Red/Orange Convection Oven Glow
        const pulse = 0.35 + Math.sin(rotationAngle * 10) * 0.15;
        const gradient = ctx.createRadialGradient(cx, cy - 10, 10, cx, cy - 10, 95);
        gradient.addColorStop(0, `rgba(255, 99, 71, ${pulse})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(cx - 85, cy - 70, 170, 100);

        // Rising cake sponge inside
        const riseHeight = 15 + currentSpongeRising * 35; // rises up
        ctx.fillStyle = baseColors.sponge;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 60, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(cx - 60, cy + 20 - riseHeight, 120, riseHeight);
        ctx.fillStyle = baseColors.crust;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20 - riseHeight, 60, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Control Panel LEDs
        ctx.fillStyle = '#10B981'; // Green active LED
        ctx.beginPath();
        ctx.arc(cx + 95, cy - 85, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F59E0B'; // Orange heat LED
        ctx.beginPath();
        ctx.arc(cx + 95, cy - 73, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#EE5C42';
        ctx.font = "bold 9px monospace";
        ctx.fillText("175°C", cx - 80, cy - 82);

        // Glass reflection line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy - 60);
        ctx.lineTo(cx + 40, cy + 20);
        ctx.stroke();

        // Handle on oven
        ctx.fillStyle = '#696969';
        ctx.fillRect(cx - 50, cy - 90, 100, 8);

      } else {
        // --- STAGES 2, 3, 4: BEAUTIFUL PERSPECTIVE ROTATING CAKE ---
        // Rotating cake renderer

        // Glass pedestal stand shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 70, 120, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Master Glass Stand Leg
        ctx.fillStyle = 'rgba(224, 242, 254, 0.7)'; // Translucent sky blue glass
        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - 15, cy + 60);
        ctx.lineTo(cx - 8, cy + 25);
        ctx.lineTo(cx + 8, cy + 25);
        ctx.lineTo(cx + 15, cy + 60);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pedestal Round Dish Tray
        ctx.fillStyle = 'rgba(240, 249, 255, 0.82)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 105, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 18, 100, 16, 0, 0, Math.PI * 2);
        ctx.fill();

        // --- LOWER BASE TIER (Rotating Cylinder) ---
        const rBase = 72; // Horizontal radius
        const hBase = 52; // Height
        const baseCenterY = cy + 5; // Base vertical center
        
        // Solid base tier core
        const baseGrad = ctx.createLinearGradient(cx - rBase, 0, cx + rBase, 0);
        baseGrad.addColorStop(0, baseColors.crust);
        baseGrad.addColorStop(0.3, baseColors.sponge);
        baseGrad.addColorStop(0.75, baseColors.top);
        baseGrad.addColorStop(1, baseColors.shading);

        ctx.fillStyle = baseGrad;
        // Draw the curved cylinder body
        ctx.beginPath();
        ctx.ellipse(cx, baseCenterY, rBase, rBase * 0.22, 0, 0, Math.PI, false);
        ctx.lineTo(cx + rBase, baseCenterY - hBase);
        ctx.ellipse(cx, baseCenterY - hBase, rBase, rBase * 0.22, 0, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();

        // Cream spread between layers (Dynamic frosting coverage)
        if (currentStage >= 2 && frostingCoverage > 0) {
          ctx.fillStyle = 'rgba(255, 252, 250, 0.95)';
          const coatH = hBase * frostingCoverage;
          ctx.beginPath();
          ctx.ellipse(cx, baseCenterY, rBase + 0.5, (rBase + 0.5) * 0.22, 0, 0, Math.PI, false);
          ctx.lineTo(cx + rBase + 0.5, baseCenterY - coatH);
          ctx.ellipse(cx, baseCenterY - coatH, rBase + 0.5, (rBase + 0.5) * 0.22, 0, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();

          // Drips of cream on base tier
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';
          for (let i = 0; i < 6; i++) {
            const ratio = i / 5;
            const dripy = baseCenterY - coatH + Math.sin(rotationAngle * 3 + ratio * Math.PI * 2) * 6;
            const dripx = cx - rBase + 12 + ratio * (rBase * 2 - 24);
            ctx.beginPath();
            ctx.arc(dripx, dripy, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Tier separator lines
        ctx.fillStyle = baseColors.top;
        ctx.beginPath();
        ctx.ellipse(cx, baseCenterY - hBase, rBase, rBase * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(135, 78, 88, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // --- UPPER TOP TIER (Rotating Cylinder) ---
        const rTop = 48; // Smaller tier horizontal radius
        const hTop = 42; // Tier height
        const topCenterY = baseCenterY - hBase - 8;

        const topGrad = ctx.createLinearGradient(cx - rTop, 0, cx + rTop, 0);
        topGrad.addColorStop(0, baseColors.crust);
        topGrad.addColorStop(0.3, baseColors.sponge);
        topGrad.addColorStop(0.75, baseColors.top);
        topGrad.addColorStop(1, baseColors.shading);

        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.ellipse(cx, topCenterY, rTop, rTop * 0.23, 0, 0, Math.PI, false);
        ctx.lineTo(cx + rTop, topCenterY - hTop);
        ctx.ellipse(cx, topCenterY - hTop, rTop, rTop * 0.23, 0, Math.PI, 0, true);
        ctx.closePath();
        ctx.fill();

        // Upper Tier Frosting coat
        if (currentStage >= 2 && frostingCoverage > 0) {
          ctx.fillStyle = 'rgba(255, 252, 250, 0.98)';
          const coatH = hTop * frostingCoverage;
          ctx.beginPath();
          ctx.ellipse(cx, topCenterY, rTop + 0.5, (rTop + 0.5) * 0.23, 0, 0, Math.PI, false);
          ctx.lineTo(cx + rTop + 0.5, topCenterY - coatH);
          ctx.ellipse(cx, topCenterY - coatH, rTop + 0.5, (rTop + 0.5) * 0.23, 0, Math.PI, 0, true);
          ctx.closePath();
          ctx.fill();

          // Smooth frosting swirl top
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(cx, topCenterY - coatH, rTop, rTop * 0.23, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw top tier rim / cap
        ctx.strokeStyle = 'rgba(135, 78, 88, 0.08)';
        ctx.beginPath();
        ctx.ellipse(cx, topCenterY - hTop, rTop, rTop * 0.23, 0, 0, Math.PI * 2);
        ctx.stroke();

        // --- STAGE 3 & 4: PREMIUM DECORATIVE TOPPINGS ---
        if (toppingsAdded) {
          // Whipped Cream Swirls around base and middle rims
          ctx.fillStyle = '#FFFFFF';
          const creamCount = 8;
          for (let i = 0; i < creamCount; i++) {
            const angle = (i * Math.PI * 2) / creamCount + rotationAngle;
            // Base layer cream swirls
            const bx = cx + Math.cos(angle) * rBase;
            const by = baseCenterY - hBase + Math.sin(angle) * rBase * 0.22;
            
            ctx.beginPath();
            ctx.arc(bx, by, 6.5, 0, Math.PI * 2);
            ctx.fill();

            // Tiny chocolate sprinkles / strawberries sitting on cream
            ctx.fillStyle = '#E63946';
            ctx.beginPath();
            ctx.arc(bx, by - 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Top tier cream swirls and strawberries
          const topCreamCount = 6;
          ctx.fillStyle = '#FFF5EE';
          for (let i = 0; i < topCreamCount; i++) {
            const angle = (i * Math.PI * 2) / topCreamCount + rotationAngle;
            const tx = cx + Math.cos(angle) * (rTop - 8);
            const ty = topCenterY - hTop + Math.sin(angle) * (rTop - 8) * 0.23;

            ctx.beginPath();
            ctx.arc(tx, ty, 5.5, 0, Math.PI * 2);
            ctx.fill();

            // Mini golden star sprinkles
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(tx, ty - 2, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Center topper: Wax birthday candle with glowing fire
          const candleX = cx;
          const candleY = topCenterY - hTop - 25;
          
          // Candle body
          ctx.fillStyle = '#AF1B3F';
          ctx.fillRect(candleX - 3.5, candleY, 7, 26);
          // Spiral stripes
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(candleX - 3, candleY + 2);
          ctx.lineTo(candleX + 3, candleY + 8);
          ctx.moveTo(candleX - 3, candleY + 12);
          ctx.lineTo(candleX + 3, candleY + 18);
          ctx.stroke();

          // Wick
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(candleX, candleY);
          ctx.lineTo(candleX, candleY - 5);
          ctx.stroke();

          // Fire Flame Glow (Thermal animated scaling)
          const flameScale = 1.0 + Math.sin(rotationAngle * 18) * 0.12;
          const flameY = candleY - 6;

          const flameGrad = ctx.createRadialGradient(candleX, flameY, 1, candleX, flameY, 14);
          flameGrad.addColorStop(0, '#FFFFFF');
          flameGrad.addColorStop(0.2, '#FFD700'); // Yellow
          flameGrad.addColorStop(0.5, '#FF8C00'); // Orange
          flameGrad.addColorStop(1, 'rgba(255, 69, 0, 0)');
          
          ctx.fillStyle = flameGrad;
          ctx.beginPath();
          ctx.arc(candleX, flameY, 12 * flameScale, 0, Math.PI * 2);
          ctx.fill();

          // Intrinsic Flame teardrop vector
          ctx.fillStyle = '#FFA500';
          ctx.beginPath();
          ctx.moveTo(candleX - 4 * flameScale, flameY);
          ctx.quadraticCurveTo(candleX - 5 * flameScale, flameY - 10 * flameScale, candleX, flameY - 16 * flameScale);
          ctx.quadraticCurveTo(candleX + 5 * flameScale, flameY - 10 * flameScale, candleX + 4 * flameScale, flameY);
          ctx.closePath();
          ctx.fill();
        }

        // --- STAGE 2: PROCESS PIPING BAG ANIM (Squeezing cream) ---
        if (currentStage === 2 && frostingCoverage < 1.0) {
          const nozzleX = cx + Math.sin(rotationAngle * 3.5) * 50;
          const nozzleY = topCenterY - 15;

          // Cream streams falling
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(nozzleX, nozzleY);
          ctx.lineTo(nozzleX, nozzleY + 24);
          ctx.stroke();

          // Sieve / Piping cone
          ctx.fillStyle = '#FDA4AF';
          ctx.strokeStyle = '#F43F5E';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(nozzleX - 16, nozzleY - 45);
          ctx.lineTo(nozzleX + 16, nozzleY - 45);
          ctx.lineTo(nozzleX + 2, nozzleY);
          ctx.lineTo(nozzleX - 2, nozzleY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [currentStage, flavourType, isAutoRotating]);

  // Pointer/mouse drag rotation controls
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsAutoRotating(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    rotationAngleRef.current = (rotationAngleRef.current + deltaX * 0.01) % (Math.PI * 2);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
    // Resume auto rotating after brief release wait
    if (autoRotateTimeoutRef.current) clearTimeout(autoRotateTimeoutRef.current);
    autoRotateTimeoutRef.current = setTimeout(() => {
      setIsAutoRotating(true);
    }, 1500);
  };

  return (
    <section className="py-20 bg-[#FFF8F5] select-none" id="baking-laboratory">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        
        {/* Header content */}
        <div className="text-center mb-10 space-y-3">
          <span className="p-1.5 px-4 bg-primary/10 text-primary text-[10px] font-black rounded-full tracking-widest uppercase inline-flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 animate-pulse text-primary" /> Multi-Stage 3D Confection Studio <Activity className="w-3.5 h-3.5 animate-pulse text-primary" />
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-[#5C3A21] tracking-tight">
            Interactive 3D Craftsmanship
          </h2>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-lg mx-auto">
            Click, hold and drag the rotating slab models below. Follow our real live process from the mixing bowl to final packaging.
          </p>
        </div>

        {/* 3D Lab Arena Wrapper Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Panel left column */}
          <div className="lg:col-span-4 relative overflow-hidden flex flex-col justify-between gap-5 bg-white border border-primary-container/20 rounded-3xl p-6 shadow-pink text-left">
            {/* Owner Lock Overlay */}
            {!isAdminAuthenticated && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-[#e0566d] mb-4 shadow-md animate-bounce">
                  <Settings className="w-6 h-6 animate-spin-slow" />
                </div>
                <span className="bg-pink-100 text-[#e0566d] text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-2xs select-none mb-2">
                  🔒 Owner Access Only
                </span>
                <h4 className="font-display text-sm font-black text-[#5C2A31]">
                  Laboratory Controls Locked
                </h4>
                <p className="font-sans text-[11px] leading-relaxed text-slate-600 mt-2 max-w-[220px]">
                  Only the bakery owner or Head Pastry Chef can adjust sponge flavors, skip simulation blueprints, and monitor vector outputs.
                </p>
                <button
                  type="button"
                  onClick={onLoginClick}
                  className="mt-5 px-4 py-2.5 bg-[#e0566d] hover:bg-[#c93b52] active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg hover:translate-y-[-1px] select-none shrink-0 animate-pulse"
                >
                  Authenticate as Owner
                </button>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest">
                <Settings className="w-4 h-4 animate-spin-slow text-primary" /> Laboratory Controls
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-[#847375] tracking-wider block">
                  Select Sponge Base Flavour
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFlavourType('strawberry')}
                    className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border transition-all ${
                      flavourType === 'strawberry'
                        ? 'bg-rose-50 border-rose-350 text-rose-700 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    🌸 Berry
                  </button>
                  <button
                    onClick={() => setFlavourType('chocolate')}
                    className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border transition-all ${
                      flavourType === 'chocolate'
                        ? 'bg-amber-100/40 border-amber-800/45 text-amber-950 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    🍫 Cocoa
                  </button>
                  <button
                    onClick={() => setFlavourType('vanilla')}
                    className={`py-2 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border transition-all ${
                      flavourType === 'vanilla'
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-800 shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                    }`}
                  >
                    🍯 Vanilla
                  </button>
                </div>
              </div>

              {/* Progress Steps Flow */}
              <div className="pt-2">
                <span className="text-[10px] font-black uppercase text-[#847375] tracking-wider block mb-2.5">
                  Simulation Stage Blueprint
                </span>
                <div className="space-y-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentStage(s.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        currentStage === s.id
                          ? 'bg-primary/5 border-primary/20 shadow-xs'
                          : 'bg-white border-zinc-150 hover:bg-zinc-50/50'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full bg-gradient-to-tr ${s.color} text-white flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 shadow-sm`}>
                        {s.id + 1}
                      </span>
                      <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-wide leading-none text-slate-800">
                          {s.name}
                        </div>
                        {currentStage === s.id && (
                          <p className="text-[9.5px] font-medium text-slate-500 leading-normal mt-1 animate-fadeIn">
                            {s.desc}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live interaction stats indicator */}
            <div className="p-3 bg-secondary/15 rounded-2xl flex items-center justify-between text-xs font-semibold text-secondary">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">3D Model Resolution</span>
              </div>
              <span className="text-[9px] bg-white px-2 py-0.5 rounded-lg text-secondary font-black shadow-inner">
                Vector 60FPS
              </span>
            </div>

          </div>

          {/* Interactive 3D Canvas center column */}
          <div className="lg:col-span-8 bg-white border border-primary-container/20 rounded-3xl p-4 md:p-6 shadow-pink flex flex-col items-center justify-between relative overflow-hidden">
            
            {/* Top Interactive Banner */}
            <div className="w-full flex items-center justify-between bg-zinc-50 border border-zinc-200/80 px-4 py-2.5 rounded-2xl text-[10px] font-bold text-zinc-500 uppercase tracking-wider z-10">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#ffb6c1] animate-ping" />
                Drag to rotate aspect
              </span>
              <span className="text-primary font-black lowercase text-xs">
                {STAGES[currentStage].name} active
              </span>
              <button
                onClick={() => {
                  rotationAngleRef.current = 0;
                  setIsAutoRotating(true);
                }}
                className="flex items-center gap-1 bg-white hover:bg-zinc-100 border border-zinc-200/90 text-slate-700 px-2.5 py-1 rounded-lg shadow-2xs cursor-pointer text-[9px] font-black transition-all"
              >
                <RotateCcw size={9} /> Reset View
              </button>
            </div>

            {/* HTML5 Canvas Stage */}
            <div className="w-full flex-1 flex items-center justify-center min-h-[360px] relative">
              <canvas
                ref={canvasRef}
                width={500}
                height={360}
                className="w-full max-w-[500px] h-full object-contain cursor-grab active:cursor-grabbing relative z-10"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              />

              {/* Convection Oven digital temp overlay */}
              {currentStage === 1 && (
                <div className="absolute inset-0 bg-orange-600/5 backdrop-blur-[0.5px] pointer-events-none rounded-2xl flex flex-col items-center justify-center">
                  <div className="animate-pulse bg-zinc-900/96 text-orange-400 border border-orange-500/30 px-5 py-2.5 rounded-xl flex items-center gap-2 font-mono text-[11px] font-bold shadow-2xl">
                    <Flame className="w-4 h-4 text-orange-500 animate-bounce" /> OVEN HEAT CYCLE ACTIVE: 175°C
                  </div>
                </div>
              )}

              {/* Mixing whirring splash glow */}
              {currentStage === 0 && (
                <div className="absolute bottom-5 inset-x-5 pointer-events-none flex justify-center">
                  <span className="text-[9px] bg-primary text-white font-black px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-bounce">
                    🌪️ Whipping Batter Air Injection...
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Status text */}
            <div className="w-full text-center mt-3 p-3.5 bg-[#FFF8F5] border border-primary/5 rounded-2xl z-10">
              <span className="text-[10px] text-primary font-black uppercase tracking-wider block">
                Chef Instruction Tip
              </span>
              <p className="font-sans text-[11px] font-medium text-slate-700 leading-normal max-w-md mx-auto mt-1">
                {currentStage === 0 && "We whip raw dairy cow butter for 12 minutes to aerate the sponge naturally without artificial stabilizers."}
                {currentStage === 1 && "Convection rotation distributes high temperature evenly, producing velvety textures that melt instantly."}
                {currentStage === 2 && "Each layer receives a consistent coating thickness using clinical-grade frosting nozzles."}
                {currentStage === 3 && "Our fresh sweet strawberries are harvested early morning from our organic Delhi green groves."}
                {currentStage === 4 && "Try dragging left or right to inspect vertical icing layers. Click on other stages to change configuration!"}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
