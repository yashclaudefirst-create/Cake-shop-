import React from 'react';

// Color themes based on flavor selection
export interface FlavorColors {
  primary: string;
  darkShadow: string;
  glow: string;
  name: string;
}

export type FlavorType = 'vanilla' | 'chocolate' | 'strawberry' | 'redvelvet' | 'matcha' | 'watermelon';
export type FrostingType = 'vanilla' | 'lilac' | 'strawberry' | 'chocolate' | 'watermelon';
export type ToppingType = 'strawberries' | 'blueberries' | 'sprinkles' | 'chocochips';

export const FLAVOR_THEMES: Record<FlavorType, FlavorColors> = {
  vanilla: { primary: '#FFF3A8', darkShadow: '#E5D182', glow: '#FFFDE8', name: 'Golden Vanilla' },
  chocolate: { primary: '#5C3A21', darkShadow: '#3D2515', glow: '#8A5D3F', name: 'Belgian Chocolate' },
  strawberry: { primary: '#FFB6C1', darkShadow: '#E89CA9', glow: '#FFE5EC', name: 'Sweet Strawberry' },
  redvelvet: { primary: '#C0392B', darkShadow: '#922B21', glow: '#EC7063', name: 'Royal Red Velvet' },
  matcha: { primary: '#8FBC8F', darkShadow: '#6E9E6E', glow: '#E8F8F5', name: 'Matcha Green Tea' },
  watermelon: { primary: '#FF4D6D', darkShadow: '#C9184A', glow: '#FFCCD5', name: 'Summer Watermelon' }
};

export const FROSTING_COLORS: Record<FrostingType, { fill: string; shadow: string; name: string }> = {
  vanilla: { fill: '#FFFFFF', shadow: '#EBF5FB', name: 'Whipped Vanilla Cream' },
  lilac: { fill: '#E6E6FA', shadow: '#D2B4DE', name: 'Lavender Glaze' },
  strawberry: { fill: '#FFC0CB', shadow: '#F0A7B3', name: 'Strawberry Ganache' },
  chocolate: { fill: '#3E2723', shadow: '#2D1D1B', name: 'Glossy Cocoa Fudge' },
  watermelon: { fill: '#2ECC71', shadow: '#249E52', name: 'Emerald Watermelon Rind' }
};

interface VectorProps {
  scene: number;
  flavor: FlavorType;
  frosting: FrostingType;
  topping: ToppingType;
}

export default function BakeryVectors({ scene, flavor, frosting, topping }: VectorProps) {
  const flavorColors = FLAVOR_THEMES[flavor];
  const frostingColors = FROSTING_COLORS[frosting];

  // Whisk rotation state
  const isWhisking = scene === 4;
  // Oven status
  const isOvenActive = scene >= 6 && scene <= 8;
  const isOvenClosed = scene === 6 || scene === 7;

  return (
    <svg 
      id="bakery-canvas"
      viewBox="0 0 500 500" 
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BACKGROUND RAY GLOWS */}
      <defs>
        <radialGradient id="stageGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFF0F5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="woodTable" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9C5A3C" />
          <stop offset="100%" stopColor="#6E3D24" />
        </linearGradient>
        <linearGradient id="ovenMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        <linearGradient id="liquidPour" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={flavorColors.primary} />
          <stop offset="100%" stopColor={flavorColors.darkShadow} />
        </linearGradient>
      </defs>

      {/* Radiant Background */}
      <circle cx="250" cy="230" r="230" fill="url(#stageGlow)" />

      {/* SCENE 1: WOODEN TABLE (Fades and slides in from bottom) */}
      <g 
        id="table-group" 
        className="transition-all duration-1000 ease-out"
        style={{
          transform: scene >= 1 ? 'translateY(0)' : 'translateY(150px)',
          opacity: scene >= 1 ? 1 : 0
        }}
      >
        {/* Table leg shadows */}
        <ellipse cx="100" cy="455" rx="30" ry="6" fill="#3D2010" opacity="0.15" />
        <ellipse cx="400" cy="455" rx="30" ry="6" fill="#3D2010" opacity="0.15" />
        <ellipse cx="250" cy="445" rx="210" ry="20" fill="#3D2010" opacity="0.25" />

        {/* Table legs */}
        <rect x="85" y="420" width="30" height="40" rx="4" fill="#502C18" />
        <rect x="385" y="420" width="30" height="40" rx="4" fill="#502C18" />

        {/* Dynamic wooden counter-top */}
        <rect x="30" y="390" width="440" height="35" rx="10" fill="url(#woodTable)" stroke="#502C18" strokeWidth="3" />
        {/* Bevel highlight */}
        <rect x="36" y="394" width="428" height="6" rx="3" fill="#D38B65" opacity="0.35" />
      </g>

      {/* SCENE 2 - 5: THE CERAMIC MIXING BOWL WITH KAWAII FACE */}
      {scene >= 2 && scene <= 5 && (
        <g 
          id="bowl-group"
          className="transition-all duration-700 ease-out origin-center"
          style={{
            transform: 
              scene === 2 
                ? 'translate(0px, 0px) scale(1)' 
                : scene === 5 
                ? 'translate(70px, -45px) rotate(60deg) scale(0.95)' // Tilt to pour!
                : 'translate(0px, 0px) scale(1)',
          }}
        >
          {/* Bowl footprint shadow */}
          <ellipse cx="250" cy="385" rx="75" ry="12" fill="#2E1C10" opacity="0.2" />

          {/* Main bowl body */}
          <path 
            d="M 160 270 Q 160 380 250 380 Q 340 380 340 270 Z" 
            fill="#7DD1B9" 
            stroke="#1D8B6F" 
            strokeWidth="4" 
          />
          {/* Outer highlight shine */}
          <path 
            d="M 170 285 A 72 72 0 0 0 250 373 A 82 82 0 0 1 170 285 Z" 
            fill="#FFFFFF" 
            opacity="0.35" 
          />
          
          {/* Pastel rim ellipse */}
          <ellipse cx="250" cy="270" rx="90" ry="14" fill="#A5E4D4" stroke="#1D8B6F" strokeWidth="4" />
          {/* Batter swirling inside bowl during whisking (Scene 4) */}
          {(scene === 4 || scene === 5) && (
            <ellipse 
              cx="250" 
              cy="271" 
              rx="82" 
              ry="11" 
              fill={flavorColors.primary} 
              className={isWhisking ? 'animate-spin' : ''}
              style={{
                transformOrigin: '250px 271px',
                animationDuration: '2s'
              }}
            />
          )}

          {/* Cute face! */}
          <circle cx="225" cy="315" r="4" fill="#1B4D41" />
          <circle cx="275" cy="315" r="4" fill="#1B4D41" />
          {/* Blushing pink cheeks */}
          <circle cx="212" cy="320" r="6" fill="#F8A5C2" opacity="0.8" />
          <circle cx="288" cy="320" r="6" fill="#F8A5C2" opacity="0.8" />
          {/* Smile arc */}
          <path d="M 246 322 Q 250 327 254 322" fill="none" stroke="#1B4D41" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* SCENE 3: INGREDIENTS ONE BY ONE */}
      {scene === 3 && (
        <g id="ingredients-layer">
          {/* 1. FLOUR BAG (Drops first on left) */}
          <g 
            id="flour-item" 
            style={{ animation: 'ingredientFall 1s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards' }}
          >
            {/* Bag Body */}
            <path d="M 140 120 L 150 70 L 210 70 L 220 120 L 210 180 L 150 180 Z" fill="#FDFEFE" stroke="#7F8C8D" strokeWidth="3" />
            <rect x="155" y="100" width="50" height="50" fill="#F9E79F" rx="4" stroke="#D68910" strokeWidth="1.5" />
            <text x="180" y="130" textAnchor="middle" fill="#D68910" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Flour</text>
            <path d="M 150 70 L 180 82 L 210 70" fill="none" stroke="#7F8C8D" strokeWidth="3" />
            
            {/* Flour Face */}
            <circle cx="170" cy="118" r="2.5" fill="#566573" />
            <circle cx="190" cy="118" r="2.5" fill="#566573" />
            <path d="M 177 122 Q 180 125 183 122" fill="none" stroke="#566573" strokeWidth="1.5" />
          </g>

          {/* White Flour Puff Cloud (Triggers at 1s when bag lands) */}
          <g style={{ animation: 'puffExpand 0.7s ease-out 0.9s forwards', opacity: 0 }}>
            <circle cx="180" cy="270" r="25" fill="#FFFFFF" opacity="0.8" filter="blur(2px)" />
            <circle cx="210" cy="260" r="15" fill="#FFFFFF" opacity="0.8" filter="blur(2px)" />
            <circle cx="150" cy="265" r="18" fill="#FFFFFF" opacity="0.8" filter="blur(2px)" />
          </g>

          {/* 2. EGG FRIEND (Drops second) */}
          <g 
            id="egg-item"
            style={{ animation: 'ingredientFall 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.25) 1.2s forwards', opacity: 0 }}
          >
            {/* Egg shell before crack */}
            <ellipse cx="250" cy="110" rx="20" ry="26" fill="#FAD7A0" stroke="#CA6F1E" strokeWidth="3px" />
            
            {/* Cute sleeping eyes */}
            <path d="M 242 110 Q 245 113 248 110" fill="none" stroke="#CA6F1E" strokeWidth="2" />
            <path d="M 252 110 Q 255 113 258 110" fill="none" stroke="#CA6F1E" strokeWidth="2" />
            
            {/* Cracked Jagged Lines that appear with shell separation */}
            <g style={{ animation: 'eggCrackLeft 1s ease-out 1.9s forwards' }}>
              <path d="M 230 110 L 250 115 L 250 80 Q 230 80 230 110 Z" fill="#FAD7A0" stroke="#CA6F1E" strokeWidth="3" />
            </g>
            <g style={{ animation: 'eggCrackRight 1s ease-out 1.9s forwards' }}>
              <path d="M 270 110 L 250 115 L 250 80 Q 270 80 270 110 Z" fill="#FAD7A0" stroke="#CA6F1E" strokeWidth="3" />
            </g>

            {/* Dripping Yolk & Splat falling inside */}
            <g style={{ animation: 'yolkDrop 0.8s ease-in 2.1s forwards', opacity: 0 }}>
              <circle cx="250" cy="140" r="14" fill="#FFC300" stroke="#FF5733" strokeWidth="2" />
              <ellipse cx="250" cy="132" rx="5" ry="3" fill="#FFFFFF" opacity="0.6" />
              {/* Dripping egg white slime */}
              <path d="M 240 140 Q 250 170 260 140" fill="#EAEDED" opacity="0.6" stroke="#BDC3C7" strokeWidth="1.5" />
            </g>
          </g>

          {/* 3. BUTTER CHIP (Slides in 3rd) */}
          <g 
            id="butter-item"
            style={{ animation: 'ingredientFall 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.25) 2.2s forwards', opacity: 0 }}
          >
            {/* Little butter dish */}
            <path d="M 285 155 L 355 155 L 345 165 L 295 165 Z" fill="#F2F4F4" stroke="#7F8C8D" strokeWidth="2" />
            
            {/* Cute Yellow butter cuboid */}
            <g style={{ animation: 'butterMelt 1s ease-out 3s forwards' }}>
              <rect x="295" y="125" width="50" height="30" rx="3" fill="#F9E79F" stroke="#D68910" strokeWidth="2.5" />
              {/* Butter slice line */}
              <line x1="310" y1="125" x2="310" y2="155" stroke="#D68910" strokeWidth="1" strokeDasharray="3" />
              
              {/* Butter face */}
              <circle cx="320" cy="138" r="2" fill="#D68910" />
              <circle cx="334" cy="138" r="2" fill="#D68910" />
              <circle cx="327" cy="144" r="3" fill="#E74C3C" opacity="0.5" />
            </g>
          </g>

          {/* 4. SUGAR SHAKER (Pours sparkles 4th) */}
          <g 
            id="sugar-item"
            style={{ animation: 'ingredientFall 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.25) 3.1s forwards', opacity: 0 }}
          >
            {/* Tilted Sugar Pot */}
            <g transform="translate(320, 90) rotate(-45)">
              <rect x="-15" y="-30" width="30" height="60" rx="8" fill="#EBF5FB" stroke="#2980B9" strokeWidth="2.5" />
              <rect x="-15" y="24" width="30" height="10" fill="#BDC3C7" rx="3" stroke="#7F8C8D" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#2980B9" fontSize="9" fontWeight="bold" fontFamily="sans-serif">SUGAR</text>
              
              {/* Cute smiley face */}
              <circle cx="-5" cy="-10" r="2" fill="#2980B9" />
              <circle cx="5" cy="-10" r="2" fill="#2980B9" />
              <path d="M -3 -5 Q 0 -2 3 -5" fill="none" stroke="#2980B9" strokeWidth="1.5" />
            </g>

            {/* Sparkle Cascades pouring into bowl (Triggers at 3.5s) */}
            <g style={{ animation: 'sugarCascade 1.2s ease-in-out 3.5s infinite', opacity: 1 }}>
              <circle cx="280" cy="150" r="1.5" fill="#FFFFFF" />
              <circle cx="290" cy="180" r="2.5" fill="#E8F8F5" />
              <circle cx="270" cy="210" r="1.5" fill="#FFFFFF" />
              <path d="M 285 140 L 285 240" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="5" opacity="0.4" />
              {/* Golden sparkles */}
              <polygon points="275,170 277,175 282,175 278,178 280,183 275,180 270,183 272,178 268,175 273,175" fill="#FFD700" />
              <polygon points="295,200 297,203 301,203 298,205 299,209 295,207 291,209 292,205 289,203 293,203" fill="#FFF" />
            </g>
          </g>
        </g>
      )}

      {/* SCENE 4: WHISK FRIEND APPEARS & SPINS TO SWIRL BATTER */}
      {scene === 4 && (
        <g 
          id="whisk-group"
          style={{
            animation: 'whiskSpin 0.7s linear infinite',
            transformOrigin: '250px 220px'
          }}
        >
          {/* Whisk handle */}
          <rect x="242" y="50" width="16" height="70" rx="5" fill="#D35400" stroke="#A04000" strokeWidth="3" />
          <rect x="243" y="115" width="14" height="15" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="1.5" />
          
          {/* Whisk metal loops */}
          <path d="M 250 130 C 210 170, 210 240, 250 250 C 290 240, 290 170, 250 130 Z" fill="none" stroke="#95A5A6" strokeWidth="4" />
          <path d="M 250 130 C 225 160, 225 225, 250 250 C 275 225, 275 160, 250 130 Z" fill="none" stroke="#BDC3C7" strokeWidth="3" />
          <path d="M 250 130 C 240 150, 240 235, 250 250 C 260 235, 260 150, 250 130 Z" fill="none" stroke="#EAEDED" strokeWidth="1.5" />

          {/* Cute face on Whisk collar mount */}
          <circle cx="247" cy="118" r="1.5" fill="#1b1b1b" />
          <circle cx="253" cy="118" r="1.5" fill="#1b1b1b" />
        </g>
      )}

      {/* SCENE 5: POURING LIQUID STREAM FROM THE TILTED BOWL */}
      {scene === 5 && (
        <g id="pour-stream-group">
          {/* Flowing viscous batter stream */}
          <path 
            d="M 295 240 Q 320 300 320 370" 
            fill="none" 
            stroke="url(#liquidPour)" 
            strokeWidth="28" 
            strokeLinecap="round" 
          />
          {/* Internal fluid shine ribbons */}
          <path 
            d="M 295 240 Q 320 300 320 370" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="4" 
            strokeDasharray="15 15"
            strokeLinecap="round" 
            className="animate-pulse"
          />

          {/* Golden drip globules */}
          <circle cx="320" cy="330" r="8" fill={flavorColors.primary} className="animate-bounce" />
        </g>
      )}

      {/* SILVER CAKE TIN (Appears in Scene 5 & 6) */}
      {(scene === 5 || scene === 6) && (
        <g 
          id="silver-tin"
          className="transition-all duration-700 ease-out"
          style={{
            transform: 
              scene === 5 
                ? 'translate(0px, 0px)' 
                : scene === 6 
                ? 'translate(60px, -23px) scale(0.65)' // slides into oven cavity
                : 'translate(0px, 0px)'
          }}
        >
          {/* Shadow */}
          <ellipse cx="320" cy="385" rx="55" ry="10" fill="#2E1C10" opacity="0.3" />

          {/* Tin outer silver walls */}
          <path d="M 270 330 L 270 375 Q 270 385 320 385 Q 370 385 370 375 L 370 330 Z" fill="#D5D8DC" stroke="#7F8C8D" strokeWidth="3" />
          {/* Top lip profile */}
          <ellipse cx="320" cy="330" rx="50" ry="10" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="3" />

          {/* Undercoated Batter Level Rising inside (Scene 5) */}
          <g>
            <ellipse cx="320" cy="337" rx="46" ry="8" fill={flavorColors.primary} />
            <ellipse cx="320" cy="341" rx="46" ry="8" fill={flavorColors.darkShadow} opacity="0.4" />
          </g>

          {/* Cute Face on Cake Tin */}
          <circle cx="310" cy="365" r="2.5" fill="#7F8C8D" />
          <circle cx="330" cy="365" r="2.5" fill="#7F8C8D" />
          <path d="M 317 369 Q 320 371 323 369" fill="none" stroke="#7F8C8D" strokeWidth="1.5" />
        </g>
      )}

      {/* SCENE 6 - 8: THE RETRO OVEN (Slides in from right) */}
      {isOvenActive && (
        <g 
          id="oven-block"
          className="transition-all duration-1000 ease-out"
          style={{
            transform: scene >= 6 && scene <= 8 ? 'translateX(0px)' : 'translateX(450px)'
          }}
        >
          {/* Oven floor footprint shadow */}
          <ellipse cx="250" cy="420" rx="160" ry="16" fill="#2E1C10" opacity="0.4" />

          {/* Oven outer retro chassis */}
          <rect x="130" y="150" width="240" height="260" rx="20" fill="url(#ovenMetal)" stroke="#9F1239" strokeWidth="6" />

          {/* Oven Top panel elements */}
          <rect x="130" y="150" width="240" height="42" rx="4" fill="#FFE4E6" stroke="#9F1239" strokeWidth="3" />
          {/* Brand/Logo placeholder */}
          <text x="250" y="174" textAnchor="middle" fill="#BE123C" fontSize="11" fontWeight="bold" fontFamily="sans-serif" letterSpacing="2">BAKE-O-MATIC</text>
          
          {/* Retro turning dials */}
          <circle cx="160" cy="172" r="8" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
          <line x1="160" y1="172" x2="160" y2="166" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          <circle cx="340" cy="172" r="8" fill="#F43F5E" stroke="#BE123C" strokeWidth="1.5" />
          <line x1="340" y1="172" x2="344" y2="176" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Inner cavity dark grate background */}
          <rect x="156" y="210" width="188" height="150" rx="10" fill="#1E0A0E" stroke="#E11D48" strokeWidth="4" />

          {/* Baking Cake inside Oven (Scene 7 only) */}
          {scene === 7 && (
            <g transform="translate(-70, -28) scale(1.05)">
              {/* Little tin nested inside oven wire rack */}
              <ellipse cx="320" cy="330" rx="30" ry="7" fill="#E2E8F0" opacity="0.9" />
              <rect x="290" y="315" width="60" height="15" fill="#94A3B8" />
              {/* Dynamic Rising Dough with red heating glow reflection */}
              <ellipse cx="320" cy="312" rx="28" ry="12" fill={flavorColors.primary} className="animate-pulse" />
            </g>
          )}

          {/* Oven door (Opens and shut based on active scene state) */}
          <g 
            id="oven-door-panel"
            className="transition-all duration-1000 ease-in-out origin-bottom"
            style={{
              transform: isOvenClosed 
                ? 'perspective(500px) rotateX(0deg)' 
                : 'perspective(500px) rotateX(-105deg)', // Open downward structure!
              transformOrigin: '250px 360px'
            }}
          >
            {/* Transparent reinforced glass cover */}
            <rect x="156" y="210" width="188" height="150" rx="10" fill="rgba(244, 63, 94, 0.25)" stroke="#9F1239" strokeWidth="4" />
            {/* Grid wiring lines inside glass */}
            <line x1="156" y1="285" x2="344" y2="285" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
            <line x1="250" y1="210" x2="250" y2="360" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

            {/* Retro gold brass handle shaft */}
            <rect x="190" y="222" width="120" height="12" rx="3" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <rect x="200" y="234" width="8" height="10" fill="#D97706" />
            <rect x="292" y="234" width="8" height="10" fill="#D97706" />

            {/* Oven Friend Face */}
            <circle cx="215" cy="312" r="3.5" fill="#FFFFFF" />
            <circle cx="285" cy="312" r="3.5" fill="#FFFFFF" />
            <path d="M 245 320 Q 250 324 255 320" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* SCENE 7: SECONDS COUNTER CLOCK DISPLAY (Digital Ticks 1-2-3) */}
          {scene === 7 && (
            <g transform="translate(210, 105)">
              <rect x="0" y="0" width="80" height="25" rx="5" fill="#000" stroke="#E11D48" strokeWidth="1.5" />
              <text x="40" y="16" textAnchor="middle" fill="#34D399" fontSize="12" fontWeight="bold" fontFamily="monospace">
                00:03
              </text>
            </g>
          )}
        </g>
      )}

      {/* THE ROYAL PEDESTAL CAKE STAND (Appears Scene 9-12 for dressing) */}
      {scene >= 9 && scene <= 12 && (
        <g id="cake-stand-group" className="animate-fade-in">
          {/* Ceramic footprint shadow */}
          <ellipse cx="250" cy="450" rx="140" ry="12" fill="#2E1C10" opacity="0.2" />

          {/* Golden base plates */}
          <path d="M 200 440 L 300 440 L 280 450 L 220 450 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          {/* Elegant gold trunk pedestal neck */}
          <path d="M 235 375 L 265 375 L 260 440 L 240 440 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
          {/* Rotating upper holding stage plate */}
          <ellipse cx="250" cy="375" rx="125" ry="16" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
        </g>
      )}

      {/* THE FINISHED CAKE WITH INDIVIDUAL ACTIVE SCENE LAYERS (Scene 8-12) */}
      {scene >= 8 && scene <= 12 && (
        <g 
          id="baking-sponge-group"
          className={scene === 12 ? 'animate-gold-glow-key' : ''}
          style={{
            transform: scene === 8 ? 'translate(0px, 0px)' : 'translate(0px, -20px)',
            transition: 'all 0.8s ease-out'
          }}
        >
          {/* SCENE 8: Freshly Baked plain Golden Sponge in Silver Tin */}
          {/* Shadow sitting on counter/plate */}
          <ellipse cx="250" cy="375" rx="110" ry="14" fill="#2E1C10" opacity="0.3" />

          {/* Silver Baking Tin Base layer */}
          <path d="M 152 320 L 152 365 Q 152 375 250 375 Q 348 375 348 365 L 348 320 Z" fill="#D5D8DC" stroke="#7F8C8D" strokeWidth="3" />
          <ellipse cx="250" cy="320" rx="98" ry="14" fill="#BDC3C7" stroke="#7F8C8D" strokeWidth="2" />

          {/* Baked Sponge itself rising high */}
          <path 
            d="M 154 316 Q 154 220 250 220 Q 346 220 346 316 Z" 
            fill={flavorColors.primary} 
            stroke={flavorColors.darkShadow} 
            strokeWidth="3.5"
            className={scene === 8 ? 'animate-rise' : ''}
            style={{
              transformOrigin: '250px 316px'
            }}
          />
          {/* Baking porous bubbles details for texture */}
          {flavor === 'watermelon' ? (
            <>
              {/* Black watermelon chocolate-chip seeds */}
              <ellipse cx="205" cy="265" rx="2.5" ry="5.5" fill="#1C0E10" transform="rotate(-15 205 265)" />
              <ellipse cx="285" cy="255" rx="2.8" ry="6" fill="#1C0E10" transform="rotate(10 285 255)" />
              <ellipse cx="242" cy="282" rx="2.5" ry="5.5" fill="#1C0E10" transform="rotate(5 242 282)" />
              <ellipse cx="262" cy="295" rx="2.2" ry="5" fill="#1C0E10" transform="rotate(-5 262 295)" />
              <ellipse cx="185" cy="295" rx="2.5" ry="5.5" fill="#1C0E10" transform="rotate(-25 185 295)" />
              <ellipse cx="312" cy="290" rx="2.5" ry="5.8" fill="#1C0E10" transform="rotate(20 312 290)" />
            </>
          ) : (
            <>
              <circle cx="210" cy="260" r="3" fill={flavorColors.darkShadow} opacity="0.4" />
              <circle cx="280" cy="250" r="4" fill={flavorColors.darkShadow} opacity="0.4" />
              <circle cx="240" cy="275" r="3" fill={flavorColors.darkShadow} opacity="0.4" />
              <circle cx="260" cy="290" r="3" fill={flavorColors.darkShadow} opacity="0.4" />
              <circle cx="180" cy="290" r="3.5" fill={flavorColors.darkShadow} opacity="0.4" />
              <circle cx="310" cy="285" r="3.5" fill={flavorColors.darkShadow} opacity="0.4" />
            </>
          )}

          {/* SCENE 9: Cream structure spreads left to right, drip down sides */}
          {scene >= 9 && (
            <g id="cream-icing-layer">
              {/* Wide topping whipped cover */}
              <path 
                d="M 154 275 Q 250 230 346 275 Q 330 330 250 330 Q 170 330 154 275 Z" 
                fill={frostingColors.fill} 
                stroke={frostingColors.shadow} 
                strokeWidth="1.5" 
                className="animate-wipe-spread"
                style={{
                  transformOrigin: '250px 275px'
                }}
              />
              
              {/* Thick Cream topping lip profile */}
              <path 
                d="M 154 275 Q 250 240 346 275 L 346 288 Q 250 305 154 288 Z" 
                fill={frostingColors.fill} 
                stroke={frostingColors.shadow} 
                strokeWidth="2" 
                className="animate-wipe-spread"
              />

              {/* Watermelon Rind Dark Green Stripes (Only shown on Watermelon-flavored glaze frosting) */}
              {frosting === 'watermelon' && (
                <g opacity="0.4" className="animate-wipe-spread">
                  <path d="M 175 284 Q 185 305 190 324" fill="none" stroke="#145A32" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 210 286 Q 215 312 218 328" fill="none" stroke="#145A32" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 245 288 Q 250 315 250 330" fill="none" stroke="#145A32" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 278 288 Q 282 312 284 328" fill="none" stroke="#145A32" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 315 284 Q 318 305 320 324" fill="none" stroke="#145A32" strokeWidth="4" strokeLinecap="round" />
                </g>
              )}

              {/* Multi side drips dripping slowly down */}
              <g id="dripping-group" className="animate-drip">
                {/* Drip 1 (Left) */}
                <path d="M 175 284 Q 180 310 185 284" fill={frostingColors.fill} />
                <circle cx="180" cy="309" r="4.5" fill={frostingColors.fill} />

                {/* Drip 2 (Mid-left) */}
                <path d="M 210 286 Q 215 320 220 286" fill={frostingColors.fill} />
                <circle cx="215" cy="318" r="5" fill={frostingColors.fill} />

                {/* Drip 3 (Center) */}
                <path d="M 245 288 Q 250 325 255 288" fill={frostingColors.fill} />
                <circle cx="250" cy="324" r="5" fill={frostingColors.fill} />

                {/* Drip 4 (Mid-Right) */}
                <path d="M 278 288 Q 283 315 288 288" fill={frostingColors.fill} />
                <circle cx="283" cy="313" r="4.5" fill={frostingColors.fill} />

                {/* Drip 5 (Right) */}
                <path d="M 315 284 Q 320 305 325 284" fill={frostingColors.fill} />
                <circle cx="320" cy="303" r="4" fill={frostingColors.fill} />
              </g>

              {/* Glossy highlight on frosting */}
              <path d="M 170 270 Q 255 248 330 270" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            </g>
          )}

          {/* SCENE 10: FRUIT OR OTHER TOPPINGS POPPING IN SEQUENCE WITH BOUNCE */}
          {scene >= 10 && (
            <g id="toppings-layer">
              {/* Rendering selected custom toppings */}
              {topping === 'strawberries' && (
                <>
                  {/* Strawberry 1 */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.1s', transformOrigin: '190px 255px', transform: 'translate(0px,0px)' }}>
                    <path d="M 180 255 C 180 235, 200 235, 200 255 C 200 268, 180 268, 180 255 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
                    <circle cx="190" cy="245" r="2" fill="#27AE60" /> {/* Stem leaf */}
                    <path d="M 188 245 Q 190 241 192 245" fill="none" stroke="#27AE60" strokeWidth="1.5" />
                    {/* Tiny seeds details */}
                    <circle cx="186" cy="254" r="0.8" fill="#F1C40F" />
                    <circle cx="194" cy="254" r="0.8" fill="#F1C40F" />
                    <circle cx="190" cy="260" r="0.8" fill="#F1C40F" />
                  </g>

                  {/* Strawberry 2 */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.4s', transformOrigin: '220px 250px' }}>
                    <path d="M 210 250 C 210 230, 230 230, 230 250 C 230 263, 210 263, 210 250 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
                    <circle cx="220" cy="240" r="2" fill="#27AE60" />
                    <circle cx="216" cy="249" r="0.8" fill="#F1C40F" />
                    <circle cx="224" cy="249" r="0.8" fill="#F1C40F" />
                    <circle cx="220" cy="255" r="0.8" fill="#F1C40F" />
                  </g>

                  {/* Strawberry 3 (Center) */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.7s', transformOrigin: '250px 245px' }}>
                    <path d="M 240 245 C 240 225, 260 225, 260 245 C 260 258, 240 258, 240 245 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
                    <circle cx="250" cy="235" r="2" fill="#27AE60" />
                    <circle cx="246" cy="244" r="0.8" fill="#F1C40F" />
                    <circle cx="254" cy="244" r="0.8" fill="#F1C40F" />
                    <circle cx="250" cy="250" r="0.8" fill="#F1C40F" />
                  </g>

                  {/* Strawberry 4 */}
                  <g className="animate-pop-top" style={{ animationDelay: '1.0s', transformOrigin: '280px 250px' }}>
                    <path d="M 270 250 C 270 230, 290 230, 290 250 C 290 263, 270 263, 270 250 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
                    <circle cx="280" cy="240" r="2" fill="#27AE60" />
                    <circle cx="276" cy="249" r="0.8" fill="#F1C40F" />
                    <circle cx="284" cy="249" r="0.8" fill="#F1C40F" />
                    <circle cx="280" cy="255" r="0.8" fill="#F1C40F" />
                  </g>

                  {/* Strawberry 5 */}
                  <g className="animate-pop-top" style={{ animationDelay: '1.3s', transformOrigin: '310px 255px' }}>
                    <path d="M 300 255 C 300 235, 320 235, 320 255 C 320 268, 300 268, 300 255 Z" fill="#E74C3C" stroke="#C0392B" strokeWidth="1.5" />
                    <circle cx="310" cy="245" r="2" fill="#27AE60" />
                    <circle cx="306" cy="254" r="0.8" fill="#F1C40F" />
                    <circle cx="314" cy="254" r="0.8" fill="#F1C40F" />
                    <circle cx="310" cy="260" r="0.8" fill="#F1C40F" />
                  </g>
                </>
              )}

              {topping === 'blueberries' && (
                <>
                  {/* Blueberry 1 */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.1s', transformOrigin: '190px 255px' }}>
                    <circle cx="190" cy="255" r="10" fill="#2E4053" stroke="#1A252F" strokeWidth="1.5" />
                    {/* Star indent hole */}
                    <path d="M 188 253 L 192 257 M 192 253 L 188 257" stroke="#1A252F" strokeWidth="1.5" />
                    <ellipse cx="187" cy="252" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.3" />
                  </g>
                  {/* Blueberry 2 */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.4s', transformOrigin: '220px 250px' }}>
                    <circle cx="220" cy="250" r="10" fill="#2E4053" stroke="#1A252F" strokeWidth="1.5" />
                    <path d="M 218 248 L 222 252 M 222 248 L 218 252" stroke="#1A252F" strokeWidth="1.5" />
                  </g>
                  {/* Blueberry 3 */}
                  <g className="animate-pop-top" style={{ animationDelay: '0.7s', transformOrigin: '250px 245px' }}>
                    <circle cx="250" cy="245" r="10" fill="#2E4053" stroke="#1A252F" strokeWidth="1.5" />
                    <path d="M 248 243 L 252 247 M 252 243 L 248 247" stroke="#1A252F" strokeWidth="1.5" />
                  </g>
                  {/* Blueberry 4 */}
                  <g className="animate-pop-top" style={{ animationDelay: '1.0s', transformOrigin: '280px 250px' }}>
                    <circle cx="280" cy="250" r="10" fill="#2E4053" stroke="#1A252F" strokeWidth="1.5" />
                    <path d="M 278 248 L 282 252 M 282 248 L 278 252" stroke="#1A252F" strokeWidth="1.5" />
                  </g>
                  {/* Blueberry 5 */}
                  <g className="animate-pop-top" style={{ animationDelay: '1.3s', transformOrigin: '310px 255px' }}>
                    <circle cx="310" cy="255" r="10" fill="#2E4053" stroke="#1A252F" strokeWidth="1.5" />
                    <path d="M 308 253 L 312 257 M 312 253 L 308 257" stroke="#1A252F" strokeWidth="1.5" />
                  </g>
                </>
              )}

              {topping === 'sprinkles' && (
                <g className="animate-fade-in">
                  {/* Scattering of cute capsules */}
                  <rect x="180" y="250" width="3" height="8" rx="1.5" fill="#E74C3C" transform="rotate(30, 180, 250)" />
                  <rect x="200" y="245" width="3" height="8" rx="1.5" fill="#F1C40F" transform="rotate(-45, 200, 245)" />
                  <rect x="220" y="240" width="3" height="8" rx="1.5" fill="#3498DB" transform="rotate(15, 220, 240)" />
                  <rect x="240" y="238" width="3" height="8" rx="1.5" fill="#9B59B6" transform="rotate(60, 240, 238)" />
                  <rect x="260" y="238" width="3" height="8" rx="1.5" fill="#2ECC71" transform="rotate(-60, 260, 238)" />
                  <rect x="280" y="240" width="3" height="8" rx="1.5" fill="#E67E22" transform="rotate(10, 280, 240)" />
                  <rect x="300" y="245" width="3" height="8" rx="1.5" fill="#1ABC9C" transform="rotate(45, 300, 245)" />
                  <rect x="315" y="250" width="3" height="8" rx="1.5" fill="#F39C12" transform="rotate(-20, 315, 250)" />
                  {/* Secondary scattering rows */}
                  <rect x="190" y="260" width="3" height="8" rx="1.5" fill="#9B59B6" transform="rotate(25)" />
                  <rect x="215" y="258" width="3" height="8" rx="1.5" fill="#E74C3C" transform="rotate(-15)" />
                  <rect x="250" y="255" width="3" height="8" rx="1.5" fill="#3498DB" transform="rotate(70)" />
                  <rect x="275" y="258" width="3" height="8" rx="1.5" fill="#2ECC71" transform="rotate(-35)" />
                  <rect x="305" y="260" width="3" height="8" rx="1.5" fill="#F1C40F" transform="rotate(10)" />
                </g>
              )}

              {topping === 'chocochips' && (
                <g className="animate-fade-in">
                  {/* Little shiny star sprinkles & choco-chips */}
                  <polygon points="190,250 192,253 196,253 193,255 194,259 190,257 186,259 187,255 184,253 188,253" fill="#F1C40F" />
                  <polygon points="250,235 252,238 256,238 253,240 254,244 250,242 246,244 247,240 244,238 248,238" fill="#F1C40F" />
                  <polygon points="310,250 312,253 316,253 313,255 314,259 310,257 306,259 307,255 304,253 308,253" fill="#F1C40F" />
                  
                  {/* Tiny chocolate pyramids */}
                  <polygon points="210,252 220,252 215,244" fill="#3E2723" stroke="#271512" strokeWidth="1" />
                  <polygon points="230,248 240,248 235,240" fill="#3E2723" stroke="#271512" strokeWidth="1" />
                  <polygon points="270,248 280,248 275,240" fill="#3E2723" stroke="#271512" strokeWidth="1" />
                  <polygon points="290,252 300,252 295,244" fill="#3E2723" stroke="#271512" strokeWidth="1" />
                </g>
              )}
            </g>
          )}

          {/* SCENE 11: GOLDEN HAPPY BIRTHDAY TOPPER STEADY INTO MIDDLE */}
          {scene >= 11 && (
            <g id="topper-group" className="animate-drop-topper" style={{ transformOrigin: '250px 180px' }}>
              {/* Topper needle spear stick */}
              <line x1="250" y1="180" x2="250" y2="245" stroke="#D97706" strokeWidth="2.5" />
              
              {/* Topper script monogram shield */}
              <circle cx="250" cy="160" r="28" fill="#FEF08A" stroke="#D97706" strokeWidth="3" opacity="0.9" />
              {/* Cursive cursive text initials or graphic crown inside */}
              <text x="250" y="160" textAnchor="middle" fill="#B45309" fontSize="13" fontWeight="900" fontFamily="serif" fontStyle="italic">
                HBD
              </text>
              <polygon points="250,138 254,146 263,143 259,150 263,157 254,155 250,163 246,155 237,157 241,150 237,143 246,146" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />

              {/* Sparkle starbursts */}
              {scene === 11 && (
                <g className="animate-pulse">
                  <polygon points="215,140 217,143 221,143 218,145 219,149 215,147 211,149 212,145 209,143 213,143" fill="#D97706" />
                  <polygon points="285,140 287,143 291,143 288,145 289,149 285,147 281,149 282,145 279,143 283,143" fill="#D97706" />
                </g>
              )}
            </g>
          )}
        </g>
      )}

      {/* STEAM PUFFS (Scene 7, 8 rises upwards) */}
      {(scene === 7 || scene === 8) && (
        <g id="steam-puffs" opacity="0.6">
          <path d="M 230 130 C 225 110, 235 100, 230 80" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
          <path d="M 270 130 C 275 110, 265 100, 270 80" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
          <path d="M 250 140 C 245 120, 255 110, 250 90" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
        </g>
      )}

      {/* SCENE 12: GOLDEN STAR SPARKLES HOVERING */}
      {scene === 12 && (
        <g id="sparkles-decor" className="animate-sparkle">
          {/* Sparkle 1 */}
          <polygon points="120,180 123,185 128,185 124,188 125,193 120,190 115,193 116,188 112,185 117,185" fill="#FFD700" className="animate-bounce" />
          {/* Sparkle 2 */}
          <polygon points="380,180 383,185 388,185 384,188 385,193 380,190 375,193 376,188 372,185 377,185" fill="#FFD700" style={{ animationDelay: '0.4s' }} />
          {/* Sparkle 3 (Lower Left) */}
          <polygon points="100,320 102,323 106,323 103,325 104,329 100,327 96,329 97,325 94,323 98,323" fill="#FEF08A" />
          {/* Sparkle 4 (Lower Right) */}
          <polygon points="400,320 402,323 406,323 403,325 404,329 400,327 396,329 397,325 394,323 398,323" fill="#FEF08A" style={{ animationDelay: '0.2s' }} />
        </g>
      )}
    </svg>
  );
}
