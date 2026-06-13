import React, { useState } from 'react';
import { Cake } from 'lucide-react';

interface MenuItem {
  name: string;
  price: number;
}

export default function Menu() {
  const [activeTab, setActiveTab] = useState('Everyday Classics');

  const tabs = [
    'Everyday Classics',
    'Premium Favourites',
    'Chocolate & Fusion',
    'Celebration Specials',
    'Fudgy Brownies'
  ];

  const menuData: Record<string, MenuItem[]> = {
    'Everyday Classics': [
      { name: 'Classic Vanilla', price: 600 },
      { name: 'Black Forest', price: 700 },
      { name: 'White Forest', price: 750 },
      { name: 'Chocolate', price: 750 },
      { name: 'Butterscotch', price: 850 }
    ],
    'Premium Favourites': [
      { name: 'Red Velvet', price: 850 },
      { name: 'Real Fruit Mango', price: 950 },
      { name: 'Honey Cake', price: 1250 },
      { name: 'Rose Milk', price: 1350 },
      { name: 'Tender Coconut', price: 1250 }
    ],
    'Chocolate & Fusion': [
      { name: 'Chocolate Truffles', price: 1150 },
      { name: 'White Truffle', price: 1250 },
      { name: 'Oreo Truffle', price: 1250 },
      { name: 'Tresleches Cake', price: 1250 },
      { name: 'Rasamalai', price: 1250 },
      { name: 'Gulab Jamun', price: 1250 },
      { name: 'Milk Gova', price: 1350 }
    ],
    'Celebration Specials': [
      { name: 'KitKat', price: 1500 },
      { name: 'Ferro Rocher', price: 1600 },
      { name: 'Nutella', price: 1400 }
    ],
    'Fudgy Brownies': [
      { name: 'Brownie Slab 600g', price: 750 }
    ]
  };

  const currentItems = menuData[activeTab] || [];

  return (
    <section id="menu" className="py-20 bg-[#fff1ea]/30 select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header Title & Subtitle */}
        <div className="text-center mb-12 space-y-3">
          <span className="p-1 px-3 bg-primary/10 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase inline-block">
            Boutique Menu
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Our Dreamy Selection
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto font-medium">
            All items home-baked with love
          </p>
        </div>

        {/* Tab Buttons bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-350 cursor-pointer border ${
                activeTab === tab
                  ? 'bg-primary text-white border-primary shadow-md scale-105'
                  : 'bg-white text-on-surface-variant border-[#d6c2c3]/40 hover:bg-primary/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid layout of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {currentItems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-5 border border-primary/5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center p-1.5 text-primary shrink-0">
                    <Cake className="w-5 h-5" />
                  </div>
                  <span className="font-display font-bold text-slate-800 text-sm tracking-tight text-left">
                    {item.name}
                  </span>
                </div>
                <span className="font-sans font-bold text-primary text-sm shrink-0">
                  ₹{item.price}
                </span>
              </div>

              {/* Order Button bottom */}
              <a
                href={`https://wa.me/919865621880?text=${encodeURIComponent(
                  `Hi! I want to order ${item.name}. Please confirm!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-xl text-xs font-black uppercase tracking-wider text-center transition-all duration-300 mt-2 block"
              >
                Order Via WhatsApp
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
