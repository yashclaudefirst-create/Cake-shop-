import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { Heart, Search, Eye, X, Star, Calendar } from 'lucide-react';

export default function Gallery() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [likedItems, setLikedItems] = useState<string[]>([]);
  const [zoomedItem, setZoomedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      title: "Signature Strawberry Luxury Peak",
      category: "Cakes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCL7Lz3fGNOqtxv5Mtv2O9UKxXh3LiG5rGCbQqBEi0trMJiPxZejHF_g-hpT7E2dIcX2jGRiONAVvKyTp8hiMh2PTYQM-pMfBNuTmrkjE7fymm8a_VfI8A0LkclNyQ4pw6I1-KBvXOyOJN0RACYG1KTZhLlJzy7UMRJaq4-l1u9FC75fIR89IjLFqbCb4tgMVwD9nNAUX0YjKfgxptEmnKM-J-z0D5pJbqJVIzhN_6TTjS-H8Dlh1sKMsNrzhG6pHYIwUASCNlpifo",
      description: "A gorgeous, elaborate double tier custom cake garnished with fresh handpicked strawberries, royal cream rosettes, and whimsical sugar butterflies."
    },
    {
      id: "gal-2",
      title: "Vivid Confetti Cupcakes",
      category: "Special Cakes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2nH6z8eHE0d3DYjSLpTJolZSLAEmJmzwyt_PE2J3ESXLCdtxVZUDm_wEs3GrzqltZxLVeMdrUEB1UA6GroETcb3fYOGQyOo0-gcOSELxqdLPzpkPSyKExQlULAD6PZIWDd8PcUhMp9ZwPRXulkQoJUDhecEjYre7LR63xirPtB-iwOZc1KQKqjsBeAyOH053CNqwHcJGsTgycdbK9NHWrrEtLhs6-qLOVvq8SJeoS4gJe4-Zugp8EWpcBidQLzSx6Yg9KLUq5_0M",
      description: "Miniature sponge fluffy cupcakes topped with creamy strawberry frosting icing and premium edible crystal sprinkles."
    },
    {
      id: "gal-3",
      title: "Gooey Belgian Walnut Brownies",
      category: "Brownies",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg9Lr3k2hwBV9__-xXoWuJVpHRQ1b8W4ZHN-MK1bmNn092Tl58KNaTb2bRLzQIfchxucorWhJLbmj5hqCguH1M9fY76p5MKlFm1WEEp8BSljnyKqZT7MtIjwpn_GMHYmgtbwRxqczzLy4UxDFICAj8eWNG2gb1lPdR1bEqz5B3BZBYJ8MICSeoFtPHOPJyU_XDig8sf_nLuiDkKHzjbTFHJPwL_nRcKa5EaYMsk2DmOGSokyhYjkaCtaxJnTIGN0_7alk-_xx0XXQ",
      description: "Moist chocolate square bites crafted from rich organic 74% dark chocolate, butter cream, and roasted Kashmiri walnuts."
    },
    {
      id: "gal-4",
      title: "Esterhazy Custard Milfoil",
      category: "Special Cakes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUZC1h1eqrOD7tUOhKag3aVnSBhrJGe9u_kIWX49md6TGh3yOI_1Z6AqMc68QX61twozVGU93Uniwjs9IjKnBr7f3r-wrWo0JK8yMvLjclSS2_EE59a0sG8zuUcbQ0Qbjys18NwIbf3By7JRLnOhkzYwi4u7srpcwllVy7BW9MdD5bDrSOY-4-ktzUBwoo5iJbjhftnYCwOyVxsqTJX6X9loF34z88jsSMajyQ34Og4DU2C_uGcNN0XOgv--uTkTgMejBUZmJ45uI",
      description: "Multi-layered delicate puff pastry stuffed with Madagascar custard pudding and topped with white chocolate cobweb glazes."
    },
    {
      id: "gal-5",
      title: "Custom Birthday Macaron Castle",
      category: "Cakes",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1fZMjX_oG4jCntDV434e2IR035wogrWMak7a_X4mHryhMtp-nv-ThXwThb1oj-lWVjdBD-comvTsnrYmYPUhO0Th52JuNNYPi8zCRfXpFWu0cS2pUlFdKd1A2PzAxv7edkCmgc_Wn-HAkKip3LkYFCCV7OKTDn0mC6ewvOXKbi1WUAAkVW5G41csEdG1zCYhFgTdscsGN5iwXJ3SyAHLV2tKrbiBoYcuSj6P1_GiZO4JWb-UYjw2jP4CPi1HshhiJt4j8NQbbkek",
      description: "Three tier customized cake loaded with authentic French almond flour macarons, edible gold sprinkles, and a customized Happy Birthday topper."
    },
    {
      id: "gal-6",
      title: "Artisanal High Tea Bakery Assortments",
      category: "Brownies",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6gUk4Lax0y7Nppc6RIvUkd91fDIJVRF5EnwNUD1-1Nsz66PANG9fwmUU3eC1E-CmysDUOfOTn4M28O9Tn9GJsXqqL6psXnoD3hNi_wtjHTrLSQ7fOgIaXvnJJ0wJ-CceZNVOdOfrzfJjKaKTR2Fdh0-Gai2PhNEAvEg3vUIeViiqnfA4Gc2fE7RUBtu8poemZWH3rGKy9MTtFcKjWngqmtHsUyFYSZVv6FPA_FDHCd9YK6__kYFb4fNNb0LNkMbktgHeIvBUCcnk",
      description: "A signature platter of custom-baked products including fudge slices, red velvet pastry bites, chocolate macaron treats, and butter cookies."
    }
  ];

  const filters = ['All', 'Cakes', 'Brownies', 'Special Cakes'];

  const filteredItems = selectedFilter === 'All'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedFilter);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <section id="gallery" className="py-20 bg-[#fff8f5] select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Gallery Intro Header */}
        <div className="text-center mb-10 space-y-3">
          <span className="p-1 px-3 bg-secondary/15 text-secondary text-[10px] font-bold rounded-full tracking-widest uppercase">
            Sweets & Cakes catalogue
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Our Gourmet Sweet Gallery
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
            Feast your eyes on our home baked best sellers. Every order is baked fresh using clean, premium cow butter.
          </p>

          {/* Interactive Categories Filters Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {filters.map((fil) => (
              <button
                key={fil}
                onClick={() => setSelectedFilter(fil)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer border ${
                  selectedFilter === fil
                    ? 'bg-primary text-white border-primary shadow-sm scale-105'
                    : 'bg-white text-on-surface-variant border-[#d6c2c3]/60 hover:bg-primary-container/10'
                }`}
              >
                {fil}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Box Grid representation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isLiked = likedItems.includes(item.id);
            // We want a beautiful varied height/column span to represent the Bento grid accurately
            const isWideItem = index === 0 || index === 4;
            
            return (
              <div
                key={item.id}
                onClick={() => setZoomedItem(item)}
                className={`group cursor-pointer bg-white rounded-3xl overflow-hidden border border-primary-container/20 hover:shadow-lg transition-all duration-300 relative ${
                  isWideItem ? 'sm:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Visual Image container with hover zooms */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-neutral-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Subtle black overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

                  {/* Top-right helper badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="bg-white/90 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold text-primary font-display uppercase tracking-widest rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <button
                      onClick={(e) => toggleLike(item.id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white shadow-sm hover:scale-110`}
                    >
                      <Heart 
                        size={15} 
                        className={`transition-colors ${
                          isLiked 
                            ? 'fill-red-500 stroke-red-500' 
                            : 'text-on-surface-variant group-hover:text-pink-600'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Bottom details block inside image */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                    <div className="space-y-0.5 text-left pr-4">
                      <h4 className="font-display text-sm font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                        {item.title}
                      </h4>
                      <p className="font-sans text-[11px] text-zinc-200 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="w-8 h-8 rounded-full bg-primary/95 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Zoom details Modal popup */}
      {zoomedItem && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden border border-primary-container relative animate-bounce-slight max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setZoomedItem(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 shadow-md text-on-surface-variant hover:text-red-700 flex items-center justify-center transition-colors z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Image display */}
            <div className="h-64 sm:h-80 bg-neutral-100 relative">
              <img 
                src={zoomedItem.image} 
                alt={zoomedItem.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {zoomedItem.category}
              </div>
            </div>

            {/* Detail copy and checklist metrics */}
            <div className="p-6 md:p-8 space-y-4 text-left">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary">
                  {zoomedItem.title}
                </h3>
                <div className="flex items-center gap-1 bg-[#e9c400]/10 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold shrink-0">
                  <Star size={13} className="fill-current" />
                  5.0 Rating
                </div>
              </div>

              <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                {zoomedItem.description}
              </p>

              {/* Recipe Highlights */}
              <div className="bg-[#fff8f5] p-4 rounded-2xl border border-primary-container/20 space-y-2.5">
                <h4 className="font-display text-xs font-bold text-primary uppercase tracking-wider block">
                  Fine Kitchen Highlights:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans font-semibold text-on-surface-variant">
                  <div className="flex items-center gap-2">✔ 100% Homemade Butter</div>
                  <div className="flex items-center gap-2">✔ FSSAI Certified hygiene</div>
                  <div className="flex items-center gap-2">✔ Eggless Custom Option</div>
                  <div className="flex items-center gap-2">✔ No Added Preservatives</div>
                </div>
              </div>

              {/* Order Now direct-forward buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setZoomedItem(null);
                    // scroll to builder
                    const element = document.getElementById('builder');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 py-3 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#6b3741] transition-all text-center cursor-pointer"
                >
                  Configure Customize Order
                </button>
                <button
                  onClick={() => setZoomedItem(null)}
                  className="px-6 py-3 bg-neutral-100 text-on-surface-variant rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition-colors"
                >
                  Return to Catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
