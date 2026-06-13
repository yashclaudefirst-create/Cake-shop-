import React, { useEffect } from 'react';

export default function BakingAnimation() {
  useEffect(() => {
    let isActive = true;

    function sleep(ms: number) {
      return new Promise(
        r => setTimeout(r, ms)
      );
    }

    async function bakingAnimation() {
      if (!isActive) return;

      const stage = document.getElementById('baking-stage');
      if (!stage) return;
      
      // Reset everything
      const table = document.getElementById('b-table');
      const bowl = document.getElementById('b-bowl');
      const swirl = document.getElementById('b-swirl');
      const oven = document.getElementById('b-oven');
      const door = document.getElementById('b-oven-door');
      const cake = document.getElementById('b-cake');
      const cream = document.getElementById('b-cream');
      const timer = document.getElementById('b-timer');
      const typewriter = document.getElementById('b-typewriter');

      if (!table || !bowl || !swirl || !oven || !door || !cake || !cream || !timer || !typewriter) {
        return;
      }

      // Reset styles manually
      table.style.opacity = '0';
      table.style.transform = 'translateY(100px)';
      bowl.style.left = '-150px';
      oven.style.right = '-200px';
      door.style.transform = 'rotateX(0deg)';
      cake.style.opacity = '0';
      cake.style.transform = 'translateX(-50%) translateY(100px)';
      cream.style.width = '0%';
      timer.style.opacity = '0';
      timer.textContent = '';
      typewriter.textContent = '';

      // Clean up dynamic elements
      stage.querySelectorAll(
        '.b-ingredient, .b-steam, .b-confetti, .b-fruit-pop, .b-topper'
      ).forEach(el => el.remove());

      await sleep(100);

      if (!isActive) return;

      // Scene 1: Table appears
      table.style.opacity = '1';
      table.style.transform = 'translateY(0)';
      await sleep(800);

      if (!isActive) return;

      // Scene 2: Bowl slides in
      bowl.style.left = 'calc(50% - 50px)';
      await sleep(1000);

      if (!isActive) return;

      // Scene 3: Ingredients fall
      const ingredients = [
        {name:'Flour', left:'30%'},
        {name:'Eggs', left:'45%'},
        {name:'Butter', left:'60%'},
        {name:'Sugar', left:'40%'}
      ];
      
      for(let ing of ingredients) {
        if (!isActive) return;
        const el = document.createElement('div');
        el.className = 'b-ingredient';
        el.textContent = ing.name;
        el.style.left = ing.left;
        stage.appendChild(el);
        await sleep(100);
        if (!isActive) return;
        el.style.top = '270px'; 
        el.style.opacity = '1';
        await sleep(500);
        if (!isActive) return;
        el.style.opacity = '0';
      }
      await sleep(500);

      if (!isActive) return;

      // Scene 4: Swirl batter
      swirl.style.opacity = '1';
      await sleep(1500);
      swirl.style.opacity = '0';
      await sleep(300);

      if (!isActive) return;

      // Scene 5: Oven slides in
      oven.style.right = '30px';
      await sleep(1000);

      if (!isActive) return;

      // Scene 6: Door closes
      door.style.transform = 'rotateX(90deg)';
      await sleep(800);

      if (!isActive) return;

      // Scene 7: Timer countdown
      bowl.style.left = '-150px';
      timer.style.opacity = '1';
      for(let i=3; i>=1; i--) {
        if (!isActive) return;
        timer.textContent = i + '...';
        await sleep(800);
      }
      timer.style.opacity = '0';
      
      if (!isActive) return;

      // Steam effect
      for(let i=0; i<3; i++) {
        const steam = document.createElement('div');
        steam.className = 'b-steam';
        steam.style.left = (40+i*20)+'px';
        steam.style.bottom = '170px';
        steam.style.opacity = '0.8';
        oven.appendChild(steam);
      }
      await sleep(2000);

      if (!isActive) return;

      // Scene 8: Cake comes out
      door.style.transform = 'rotateX(0deg)';
      await sleep(500);
      if (!isActive) return;
      oven.style.right = '-200px';
      cake.style.opacity = '1';
      cake.style.transform = 'translateX(-50%) translateY(0)';
      await sleep(1000);

      if (!isActive) return;

      // Scene 9: Cream spreads
      cream.style.width = '90px';
      await sleep(800);

      if (!isActive) return;

      // Scene 10: Sprinkle pops
      const sprinkleCount = 5;
      const sprinkleColors = ['#FFA500', '#FF69B4', '#FFF5EE', '#FFD700', '#BA55D3'];
      for(let i=0; i<sprinkleCount; i++) {
        if (!isActive) return;
        const el = document.createElement('div');
        el.className = 'b-fruit-pop';
        el.style.cssText = `
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${sprinkleColors[i % sprinkleColors.length]};
          border: 1px solid #ffffffa0;
          bottom: ${170 + Math.random() * 30}px;
          left: calc(50% - 45px + ${Math.random() * 90}px);
          transform: scale(0);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        `;
        stage.appendChild(el);
        await sleep(100);
        if (!isActive) return;
        el.style.transform = 'scale(1)';
        await sleep(300);
      }
      await sleep(500);

      if (!isActive) return;

      // Scene 11: Topper drops (Premium SVG Candle)
      const topper = document.createElement('div');
      topper.className = 'b-topper';
      topper.innerHTML = `
        <svg width="24" height="34" viewBox="0 0 24 34" fill="none" style="display: block;">
          <path d="M12 2C12 2 15 6 15 8C15 10 13.5 11 12 11C10.5 11 9 10 9 8C9 6 12 2 12 2Z" fill="#FFA500"/>
          <line x1="12" y1="11" x2="12" y2="15" stroke="#4A2C2A" stroke-width="1.5"/>
          <rect x="10" y="15" width="4" height="18" rx="1" fill="#FFB6C1"/>
        </svg>
      `;
      topper.style.cssText = `
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translateX(-50%);
        transition: top 0.6s cubic-bezier(0.34,1.56,0.64,1);
      `;
      stage.appendChild(topper);
      await sleep(100);
      if (!isActive) return;
      topper.style.top = '145px'; 
      await sleep(800);

      if (!isActive) return;

      // Scene 12: Confetti!
      const colors = [
        '#FFB6C1','#9B59B6','#FFD700',
        '#FF69B4','#00CED1','#FF6347'
      ];
      for(let i=0; i<40; i++) {
        const c = document.createElement('div');
        c.className = 'b-confetti';
        c.style.background = colors[Math.floor(Math.random()*colors.length)];
        c.style.left = '50%';
        c.style.top = '40%';
        const angle = Math.random()*360;
        const dist = 80+Math.random()*150;
        c.style.setProperty('--tx', Math.cos(angle)*dist+'px');
        c.style.setProperty('--ty', Math.sin(angle)*dist+'px');
        stage.appendChild(c);
        setTimeout(() => { if (isActive) c.remove(); }, 1000);
      }

      if (!isActive) return;

      // Typewriter text
      const text = 'Baked Fresh, Made With Love!';
      typewriter.textContent = '';
      for(let ch of text) {
        if (!isActive) return;
        typewriter.textContent += ch;
        await sleep(60);
      }

      await sleep(3000);

      if (!isActive) return;

      // Reset stage and loop
      stage.querySelectorAll(
        '.b-ingredient,.b-steam,.b-confetti,.b-fruit-pop,.b-topper'
      ).forEach(el => el.remove());
      
      table.style.opacity = '0';
      table.style.transform = 'translateY(100px)';
      bowl.style.left = '-150px';
      oven.style.right = '-200px';
      cake.style.opacity = '0';
      cake.style.transform = 'translateX(-50%) translateY(100px)';
      cream.style.width = '0';
      typewriter.textContent = '';
      
      await sleep(1000);
      bakingAnimation();
    }

    // Start when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        if(entries[0].isIntersecting && isActive) {
          bakingAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    const targetEle = document.getElementById('baking-stage');
    if (targetEle) {
      observer.observe(targetEle);
    }

    return () => {
      isActive = false;
      observer.disconnect();
    };
  }, []);

  return (
    <section className="py-16 bg-[#fff8f5] select-none">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8 space-y-2">
          <span className="p-1 px-3 bg-secondary/15 text-secondary text-[10px] font-bold rounded-full tracking-widest uppercase inline-block">
            Baking Laboratory Simulator
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black text-primary tracking-tight">
            Our Interactive Baking Process
          </h2>
          <p className="font-sans text-xs text-on-surface-variant max-w-sm mx-auto">
            A whimsical live demonstration of flour, eggs & sweet strawberries converting into delicious cakes from our oven.
          </p>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          #baking-stage {
            height: 450px;
            background: #FFF0F5;
            position: relative;
            overflow: hidden;
            border-radius: 24px;
            border: 2px dashed rgba(135, 78, 88, 0.2);
            box-shadow: inset 0 0 20px rgba(135, 78, 88, 0.05);
          }

          /* Wooden Table */
          #b-table {
            position:absolute; bottom:0;
            width:100%; height:70px;
            background:#8B4513;
            border-radius:8px 8px 0 0;
            transform:translateY(100px);
            opacity:0;
            transition:all 0.8s ease;
          }

          /* Mixing Bowl */
          #b-bowl {
            position:absolute;
            bottom:70px; left:-150px;
            width:100px; height:70px;
            background:#D2691E;
            border-radius:0 0 50px 50px;
            border-top:8px solid #A0522D;
            transition:left 0.8s cubic-bezier(0.34,1.56,0.64,1);
          }

          /* Bowl contents swirl */
          #b-swirl {
            position:absolute;
            width:60px; height:60px;
            background:conic-gradient(
              #FFB6C1,#FFD700,#FF69B4,#FFB6C1
            );
            border-radius:50%;
            top:5px; left:20px;
            opacity:0;
            animation:swirl 0.5s linear infinite;
          }

          @keyframes swirl {
            to { transform:rotate(360deg); }
          }

          /* Oven */
          #b-oven {
            position:absolute;
            bottom:70px; right:-200px;
            width:150px; height:170px;
            background:#696969;
            border-radius:8px;
            transition:right 0.8s ease;
          }

          #b-oven-door {
            position:absolute;
            bottom:0; width:100%;
            height:80px;
            background:#808080;
            border-radius:0 0 8px 8px;
            transform-origin:bottom;
            transition:transform 0.5s ease;
          }

          #b-oven-window {
            width:50px; height:50px;
            background:#333;
            border-radius:50%;
            margin:10px auto;
            border:4px solid #999;
          }

          /* Cake */
          #b-cake {
            position:absolute;
            bottom:140px;
            left:50%;
            transform:translateX(-50%) translateY(100px);
            opacity:0;
            transition:all 0.8s cubic-bezier(0.34,1.56,0.64,1);
          }

          #b-cake-bottom {
            width:120px; height:60px;
            background:linear-gradient(
              #FFB6C1,#FF69B4
            );
            border-radius:4px;
          }

          #b-cake-top {
            width:90px; height:50px;
            background:linear-gradient(
              #FF69B4,#FFB6C1
            );
            border-radius:4px;
            margin:0 auto;
          }

          #b-cream {
            width:0%; height:12px;
            background:white;
            border-radius:6px;
            margin:0 auto;
            transition:width 0.8s ease;
          }

          /* Ingredients */
          .b-ingredient {
            position:absolute;
            font-size:10px;
            font-weight:800;
            text-transform:uppercase;
            letter-spacing:1px;
            color:#874e58;
            background:#fff;
            border:1.5px solid #ffb6c1;
            padding:4px 10px;
            border-radius:99px;
            top:-60px;
            opacity:0;
            transition:all 0.6s cubic-bezier(0.34,1.56,0.64,1);
          }

          /* Steam */
          .b-steam {
            position:absolute;
            width:12px; height:30px;
            background:rgba(255,255,255,0.6);
            border-radius:50%;
            animation:steam 1.5s ease-in-out infinite;
            opacity:0;
          }

          @keyframes steam {
            0% { transform:translateY(0) scaleX(1); opacity:0.8; }
            100% { transform:translateY(-50px) scaleX(2); opacity:0; }
          }

          /* Timer */
          #b-timer {
            position:absolute;
            top:20px; left:50%;
            transform:translateX(-50%);
            font-size:48px;
            font-weight:bold;
            color:#9B59B6;
            opacity:0;
            transition:opacity 0.3s;
          }

          /* Typewriter text */
          #b-typewriter {
            position:absolute;
            bottom:20px; width:100%;
            text-align:center;
            font-size:18px;
            font-weight:bold;
            color:#9B59B6;
            font-family:cursive;
            min-height:30px;
          }

          /* Confetti pieces */
          .b-confetti {
            position:absolute;
            width:8px; height:8px;
            border-radius:50%;
            animation:b-fly 1s ease-out forwards;
          }

          @keyframes b-fly {
            to {
              transform:translate(
                var(--tx), var(--ty)
              );
              opacity:0;
            }
          }
        `}} />

        <div id="baking-stage">
          {/* Table */}
          <div id="b-table" />

          {/* Bowl */}
          <div id="b-bowl">
            <div id="b-swirl" />
          </div>

          {/* Oven */}
          <div id="b-oven">
            <div id="b-oven-window" />
            <div id="b-oven-door" />
          </div>

          {/* Cake */}
          <div id="b-cake">
            <div id="b-cake-top" />
            <div id="b-cream" />
            <div id="b-cake-bottom" />
          </div>

          {/* Timer */}
          <div id="b-timer" />

          {/* Typewriter text */}
          <div id="b-typewriter" />
        </div>
      </div>
    </section>
  );
}
