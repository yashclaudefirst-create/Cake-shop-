import React from 'react';
import { Cake, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onAdminToggle: () => void;
  onLinkClick: (sectionId: string) => void;
  isAdminVisible: boolean;
}

export default function Footer({ onAdminToggle, onLinkClick, isAdminVisible }: FooterProps) {
  return (
    <footer className="bg-surface-container dark:bg-surface-container-highest rounded-t-3xl mt-16 relative border-t border-primary/10 overflow-hidden select-none">
      
      {/* Decorative colored strip */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-[#ffb6c1] opacity-75" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-left text-xs font-semibold">
        
        {/* Left Col: Brand signature */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ffb6c1]/40 flex items-center justify-center text-primary">
              <Cake size={16} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-base font-bold tracking-tight text-primary uppercase">
              The Sweet Spot
            </span>
          </div>
          <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed max-w-xs font-medium">
            We craft customized high-fidelity cupcakes, multilayered frosted celebration cakes, and loaded brownies. Built cleanly to order with genuine farm-fresh butter and organic local berries.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-primary border border-primary/10 shadow-xs scale-95 origin-left">
            <ShieldCheck size={14} className="stroke-[2.5]" />
            <span className="font-sans text-[9px] uppercase tracking-wider font-bold">FSSAI Certified Slab</span>
          </div>
        </div>

        {/* Center column: Fast Links & Admin access */}
        <div className="space-y-3 font-sans">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
            Quick Navigation
          </h4>
          <div className="flex flex-col gap-2 font-semibold">
            <button 
              onClick={() => onLinkClick('home')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Back to Home Peak
            </button>
            <button 
              onClick={() => onLinkClick('builder')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Interactive Cake Builder
            </button>
            <button 
              onClick={() => onLinkClick('gallery')}
              className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Gourmet Sweets Catalog
            </button>
            <button 
              onClick={onAdminToggle}
              className={`text-left transition-all flex items-center gap-1 cursor-pointer font-bold ${
                isAdminVisible 
                  ? 'text-primary underline' 
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              🔐 Chef Owner Administration Board
            </button>
          </div>
        </div>

        {/* Right column: Contact & copyright */}
        <div className="space-y-3 font-sans text-on-surface-variant">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-primary">
            Studio Outpost Details
          </h4>
          <div className="space-y-2 font-semibold text-[11px]">
            <div className="flex items-center gap-2"><MapPin size={13} className="text-primary" /> Connaught Outpost, Central New Delhi</div>
            <div className="flex items-center gap-2"><Mail size={13} className="text-primary" /> orders@sweetspotbaking.com</div>
            <div className="flex items-center gap-2"><Phone size={13} className="text-primary" /> +91-98765-43210 (10 AM - 7 PM)</div>
          </div>
          
          <div className="pt-4 border-t border-primary/5 text-[10px] text-zinc-400 font-normal">
            <p>© 2026 The Sweet Spot Home Bakery.</p>
            <p>Made with love & clean cow ghee. All rights reserved.</p>
          </div>
        </div>

      </div>

    </footer>
  );
}
