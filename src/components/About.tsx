import React from 'react';
import { Heart, Sparkles, ShieldCheck, Soup, Trophy, Coffee } from 'lucide-react';
import { WebsiteConfig } from '../types';

interface AboutProps {
  config?: WebsiteConfig;
}

export default function About({ config }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-[#fff8f5] to-[#fff1ea] relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* About Intro Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="p-1 px-3 bg-primary/10 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase inline-block">
            {config?.aboutTag || "Our Baker Story"}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
            {config?.aboutTitle || "Craving for Confectionery Perfection"}
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-lg mx-auto">
            {config?.aboutSubtitle || "At Lavanya Dreamy Delight, we elevate premium baking into a fine art form, blending pure organic Jersey dairy cream, authentic Belgian chocolates, and a sprinkle of magic."}
          </p>
        </div>

        {/* Story Two-Column Grid splitting */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column Description */}
          <div className="space-y-6 text-left">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-primary leading-snug">
              {config?.aboutMainTitle || "Choosy Baking, Small Batch Delicacies & Genuine Care"} <Sparkles className="inline-block text-primary w-5 h-5 ml-1.5 align-middle animate-pulse" />
            </h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              {config?.aboutDesc1 || "Founded under the simple tenet that cake should never taste ordinary or artificial, Lavanya Dreamy Delight operates as a localized boutique micro-bakery. Every recipe sponge is individually whipped from scratch—there are zero premixes, zero high-fructose corn syrups, and strictly no artificial stabilizers inside our pantry."}
            </p>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
              {config?.aboutDesc2 || "We sourcing fresh seasonal sweet strawberries, organic eggs, natural Madagascar vanilla pods, and genuine imported cocoa powders. This uncompromising devotion to raw ingredients translates directly into dense, velvety moist finishes that melt on your tongue."}
            </p>

            {/* Quality Checklist badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-2.5">
                <div className="p-2 shrink-0 bg-primary/10 rounded-xl text-primary">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-primary block">
                    {config?.card1Title || "FSSAI Certified"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-normal">
                    {config?.card1Desc || "Strict sanitary food workspace checks"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 shrink-0 bg-secondary/10 rounded-xl text-secondary">
                  <Soup size={18} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-secondary block">
                    {config?.card2Title || "100% Homemade"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-normal">
                    {config?.card2Desc || "Real cow ghee and rich dairy butter"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 shrink-0 bg-amber-500/10 rounded-xl text-amber-700">
                  <Trophy size={18} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-amber-800 block">
                    {config?.card3Title || "Artisan Crafting"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-normal">
                    {config?.card3Desc || "Tailored ribbons & handwritten letters"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 shrink-0 bg-rose-500/10 rounded-xl text-rose-700">
                  <Coffee size={18} />
                </div>
                <div>
                  <span className="font-display font-bold text-xs text-rose-800 block">
                    {config?.card4Title || "Baked to Hour"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-normal">
                    {config?.card4Desc || "Dispatched warm within 3 hrs of setup"}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Decorative showcase collage using hotlink images provided in the HTML */}
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="rounded-3xl overflow-hidden shadow-md h-44 hover:scale-[1.02] transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg9Lr3k2hwBV9__-xXoWuJVpHRQ1b8W4ZHN-MK1bmNn092Tl58KNaTb2bRLzQIfchxucorWhJLbmj5hqCguH1M9fY76p5MKlFm1WEEp8BSljnyKqZT7MtIjwpn_GMHYmgtbwRxqczzLy4UxDFICAj8eWNG2gb1lPdR1bEqz5B3BZBYJ8MICSeoFtPHOPJyU_XDig8sf_nLuiDkKHzjbTFHJPwL_nRcKa5EaYMsk2DmOGSokyhYjkaCtaxJnTIGN0_7alk-_xx0XXQ" 
                  alt="Brownie details cooking" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-md h-56 hover:scale-[1.02] transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2nH6z8eHE0d3DYjSLpTJolZSLAEmJmzwyt_PE2J3ESXLCdtxVZUDm_wEs3GrzqltZxLVeMdrUEB1UA6GroETcb3fYOGQyOo0-gcOSELxqdLPzpkPSyKExQlULAD6PZIWDd8PcUhMp9ZwPRXulkQoJUDhecEjYre7LR63xirPtB-iwOZc1KQKqjsBeAyOH053CNqwHcJGsTgycdbK9NHWrrEtLhs6-qLOVvq8SJeoS4gJe4-Zugp8EWpcBidQLzSx6Yg9KLUq5_0M" 
                  alt="Aesthetic sprinkles cupcake" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="rounded-3xl overflow-hidden shadow-md h-56 hover:scale-[1.02] transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1fZMjX_oG4jCntDV434e2IR035wogrWMak7a_X4mHryhMtp-nv-ThXwThb1oj-lWVjdBD-comvTsnrYmYPUhO0Th52JuNNYPi8zCRfXpFWu0cS2pUlFdKd1A2PzAxv7edkCmgc_Wn-HAkKip3LkYFCCV7OKTDn0mC6ewvOXKbi1WUAAkVW5G41csEdG1zCYhFgTdscsGN5iwXJ3SyAHLV2tKrbiBoYcuSj6P1_GiZO4JWb-UYjw2jP4CPi1HshhiJt4j8NQbbkek" 
                  alt="Celebration custom topping" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-md h-44 hover:scale-[1.02] transition-transform">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6gUk4Lax0y7Nppc6RIvUkd91fDIJVRF5EnwNUD1-1Nsz66PANG9fwmUU3eC1E-CmysDUOfOTn4M28O9Tn9GJsXqqL6psXnoD3hNi_wtjHTrLSQ7fOgIaXvnJJ0wJ-CceZNVOdOfrzfJjKaKTR2Fdh0-Gai2PhNEAvEg3vUIeViiqnfA4Gc2fE7RUBtu8poemZWH3rGKy9MTtFcKjWngqmtHsUyFYSZVv6FPA_FDHCd9YK6__kYFb4fNNb0LNkMbktgHeIvBUCcnk" 
                  alt="High tea chocolate cookies" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
