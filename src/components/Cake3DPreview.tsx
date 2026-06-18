import React, { useEffect, useRef, useState } from 'react';

interface Cake3DPreviewProps {
  customization: {
    category?: string;
    shape?: string;
    baseColor?: string;
    frostingType?: string;
    fillings?: string;
    toppings?: string[];
    messageOnCake?: string;
    dietary?: string[];
  }
}

export default function Cake3DPreview({ customization }: Cake3DPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const rotationAngleRef = useRef<number>(0);
  const [isRotating, setIsRotating] = useState(true);
  const dragStartRef = useRef<{ x: number, y: number } | null>(null);
  const isRotatingRef = useRef(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const darkenColor = (hex: string, percent: number): string => {
      if (hex.startsWith('rgba')) return hex;
      let r = 255, g = 255, b = 255;
      if (hex.startsWith('#')) {
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c+c).join('');
        r = parseInt(cleanHex.slice(0, 2), 16) || 255;
        g = parseInt(cleanHex.slice(2, 4), 16) || 255;
        b = parseInt(cleanHex.slice(4, 6), 16) || 255;
      } else if (hex.startsWith('rgb')) {
         const nums = hex.match(/\d+/g);
         if (nums && nums.length >= 3) {
            r = parseInt(nums[0]);
            g = parseInt(nums[1]);
            b = parseInt(nums[2]);
         }
      }
      r = Math.floor(r * (1 - percent));
      g = Math.floor(g * (1 - percent));
      b = Math.floor(b * (1 - percent));
      return `rgb(${r},${g},${b})`;
    };

    const render = () => {
      if (isRotatingRef.current) {
         rotationAngleRef.current = (rotationAngleRef.current + 0.015) % (Math.PI * 2);
      }
      const angle = rotationAngleRef.current;
      
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 20;

      const category = (customization.category || 'cake').toLowerCase();
      const rawShape = (customization.shape || 'round').toLowerCase();
      
      let baseColor = customization.baseColor || '#FFB6C1';
      
      if (category === 'brownie') baseColor = '#3E1C00';
      if (category === 'cookies') baseColor = '#D2691E';

      let isSquare = rawShape.includes('square') || category === 'brownie';
      let isHeart = rawShape.includes('heart');

      // Drop Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 60, 110, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal
      if (category === 'cake' || category === 'tres_leches' || category === 'cupcake' || category === 'muffin') {
        ctx.fillStyle = 'rgba(240, 249, 255, 0.9)';
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 100, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        // Wooden board
        ctx.fillStyle = '#D2B48C';
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 90, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#C19A6B';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 18, 90, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const getShapePoints = (radius: number, ptCount: number, rot: number) => {
        const pts = [];
        if (isSquare) {
          for (let i = 0; i < 4; i++) {
            const a = rot + (i * Math.PI / 2) + Math.PI/4;
            pts.push({ x: cx + Math.cos(a) * radius * 1.2, y: Math.sin(a) * radius * 0.4 });
          }
        } else if (isHeart) {
          for (let i = 0; i < ptCount; i++) {
            const a = (i / ptCount) * Math.PI * 2;
            const hr = radius * 0.06;
            const hx = 16 * Math.pow(Math.sin(a), 3);
            const hy = -(13 * Math.cos(a) - 5 * Math.cos(2*a) - 2 * Math.cos(3*a) - Math.cos(4*a));
            
            const rx = hx * Math.cos(rot) - hy * Math.sin(rot);
            const ry = hx * Math.sin(rot) + hy * Math.cos(rot);
            
            pts.push({ x: cx + rx * hr, y: ry * hr * 0.4 });
          }
        } else {
          for (let i = 0; i < ptCount; i++) {
            const a = rot + (i / ptCount) * Math.PI * 2;
            pts.push({ x: cx + Math.cos(a) * radius, y: Math.sin(a) * radius * 0.35 });
          }
        }
        return pts;
      };

      const draw3DShape = (yBase: number, shapeHeight: number, radius: number, topColor: string, sideColor: string) => {
        const ptCount = isHeart ? 50 : (isSquare ? 4 : 40);
        const pts = getShapePoints(radius, ptCount, -angle);
        
        const segments = [];
        for (let i = 0; i < ptCount; i++) {
           const p1 = pts[i];
           const p2 = pts[(i+1)%ptCount];
           segments.push({ p1, p2, midY: (p1.y + p2.y) / 2 });
        }
        
        segments.sort((a, b) => b.midY - a.midY);

        segments.forEach(seg => {
           let dx = seg.p2.x - seg.p1.x;
           if (isHeart) {
              const nx = seg.p2.y - seg.p1.y;
              dx = -nx; 
           }
           if (seg.midY > 0) {
              ctx.fillStyle = dx > 0 ? sideColor : darkenColor(sideColor, 0.2); 
              ctx.beginPath();
              ctx.moveTo(seg.p1.x, yBase + seg.p1.y);
              ctx.lineTo(seg.p2.x, yBase + seg.p2.y);
              ctx.lineTo(seg.p2.x, yBase - shapeHeight + seg.p2.y);
              ctx.lineTo(seg.p1.x, yBase - shapeHeight + seg.p1.y);
              ctx.closePath();
              ctx.fill();
              
              ctx.strokeStyle = darkenColor(sideColor, 0.4);
              ctx.lineWidth = 0.5;
              ctx.stroke();
           }
        });

        const topGrad = ctx.createLinearGradient(cx - radius, 0, cx + radius, 0);
        topGrad.addColorStop(0, topColor);
        topGrad.addColorStop(0.5, darkenColor(topColor, -0.1) || '#ffffff33');
        topGrad.addColorStop(1, darkenColor(topColor, 0.2));

        ctx.fillStyle = topGrad;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, yBase - shapeHeight + pts[0].y);
        for (let i = 1; i < ptCount; i++) {
           ctx.lineTo(pts[i].x, yBase - shapeHeight + pts[i].y);
        }
        ctx.closePath();
        ctx.fill();

        return { pts, topY: yBase - shapeHeight };
      };

      let tiers = [];
      if (category === 'cake') {
         tiers = [
           { r: 75, h: 50 },
           { r: 55, h: 45 }
         ];
      } else if (category === 'brownie') {
         tiers = [ { r: 80, h: 30 } ];
      } else if (category === 'cookies') {
         tiers = [ { r: 60, h: 10 } ];
      } else if (category === 'cupcake' || category === 'muffin') {
         tiers = [ { r: 40, h: 40 } ];
      } else if (category === 'tres_leches') {
         tiers = [ { r: 70, h: 40 } ];
      } else {
         tiers = [ { r: 75, h: 50 } ];
      }

      let currentY = cy + 10;
      let topYPos = cy;

      tiers.forEach((tier, index) => {
         const isBottom = index === 0;
         let tierColor = baseColor;
         if ((category === 'cupcake' || category === 'muffin') && isBottom) tierColor = '#E3C19F'; // Cupcake wrapper
         
         const { topY } = draw3DShape(currentY, tier.h, tier.r, tierColor, darkenColor(tierColor, 0.1));
         
         const hasCream = customization.frostingType || (customization.fillings && customization.fillings !== 'None');
         if (hasCream && category !== 'cookies' && category !== 'brownie' && category !== 'cupcake' && category !== 'muffin') {
            draw3DShape(topY, 6, tier.r + 1, '#FFFFFF', '#F0F0F0');
         }

         if ((category === 'cupcake' || category === 'muffin') && isBottom) {
             const mColor = category === 'cupcake' ? '#FFFFFF' : baseColor;
             draw3DShape(topY, 15, tier.r - 5, darkenColor(mColor, 0.05), darkenColor(mColor, 0.15));
             draw3DShape(topY - 15, 12, tier.r - 15, darkenColor(mColor, 0.02), darkenColor(mColor, 0.1));
             if (category === 'cupcake') {
                draw3DShape(topY - 27, 10, tier.r - 25, mColor, darkenColor(mColor, 0.1));
             }
         }

         currentY = topY;
         topYPos = category === 'cupcake' ? topY - 27 : topY;
      });

      if (customization.messageOnCake && category !== 'cupcake' && category !== 'muffin') {
        ctx.fillStyle = category === 'brownie' || category === 'cookies' ? '#FFFFFF' : '#5C3A21';
        ctx.font = 'bold 12px "Inter", sans-serif';
        ctx.textAlign = 'center';
        
        ctx.save();
        ctx.translate(cx, topYPos);
        ctx.scale(1, 0.4);
        ctx.rotate(-angle);
        ctx.fillText(customization.messageOnCake, 0, 5);
        ctx.restore();
      }

      const toppings = customization.toppings || [];
      if (toppings.length > 0 || category === 'cookies' || category === 'brownie') {
        let isGold = toppings.some(t => t.includes('Gold'));
        let isFlower = toppings.some(t => t.includes('Flower') || t.includes('Rose'));
        let isMacarons = toppings.some(t => t.includes('Macarons'));
        let isChoco = toppings.some(t => t.includes('Ganache') || t.includes('Truffle')) || category === 'cookies' || category === 'brownie';

        const numElements = category === 'cookies' || category === 'brownie' ? 12 : 6;
        for (let i = 0; i < numElements; i++) {
          const a = (i / numElements) * Math.PI * 2 * 3; 
          const tr = tiers[tiers.length-1].r;
          let dist = (tr - 15) * ((i % 3 + 1) / 3);
          if (category === 'cupcake') dist = 10;
          
          let tx, ty;
          if (isSquare) {
            let cxOff = Math.cos(a + angle) * dist * 1.2;
            let cyOff = Math.sin(a + angle) * dist;
            tx = cx + cxOff * Math.cos(-angle) - cyOff * Math.sin(-angle);
            ty = topYPos + (cxOff * Math.sin(-angle) + cyOff * Math.cos(-angle)) * 0.4;
          } else {
             tx = cx + Math.cos(-angle + a) * dist;
             ty = topYPos + Math.sin(-angle + a) * dist * 0.35 - 3;
          }
          
          if (isFlower) {
            ctx.fillStyle = '#FF69B4'; 
            ctx.beginPath();
            ctx.arc(tx, ty, 6, 0, Math.PI*2);
            ctx.fill();
          } else if (isGold) {
            ctx.fillStyle = '#FFD700'; 
            ctx.fillRect(tx - 4, ty - 4, 8, 8);
          } else if (isMacarons) {
            ctx.fillStyle = '#FFDAB9'; 
            ctx.beginPath();
            ctx.ellipse(tx, ty-2, 8, 4, 0, 0, Math.PI*2);
            ctx.fill();
          } else if (isChoco) {
             ctx.fillStyle = '#3E2723';
             ctx.beginPath();
             ctx.arc(tx, ty, 4, 0, Math.PI*2);
             ctx.fill();
          } else {
             ctx.fillStyle = ['#FF0000', '#00FF00', '#0000FF'][i % 3];
             ctx.fillRect(tx, ty, 3, 3);
          }
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [customization]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsRotating(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    rotationAngleRef.current = (rotationAngleRef.current - deltaX * 0.01) % (Math.PI * 2);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
    setIsRotating(true);
  };

  return (
    <canvas 
      ref={canvasRef}
      width={280}
      height={280}
      className="w-full h-full object-contain cursor-grab active:cursor-grabbing relative z-10 filter drop-shadow-xl"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseLeave={handlePointerUp}
    />
  );
}
