import React, { useState } from 'react';
import { CakeCustomization, CustomerDetails, Order, CakeBuilderOptions } from '../types';
import { 
  Cake as CakeIcon, 
  ChevronLeft, 
  ChevronRight, 
  UtensilsCrossed, 
  Flame, 
  Calendar, 
  Clock, 
  HelpCircle, 
  Check, 
  Sparkles, 
  TrendingUp, 
  ShoppingBag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Truck, 
  Store,
  MessageSquare
} from 'lucide-react';

interface CakeBuilderProps {
  onOrderAdded: (newOrder: Order) => void;
  builderOptions?: CakeBuilderOptions;
}

const INITIAL_CUSTOMER: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  deliveryType: 'pickup'
};

export default function CakeBuilder({ onOrderAdded, builderOptions }: CakeBuilderProps) {
  // Safe fallback to match original values if no custom ones are stored
  const options = builderOptions || {
    sizes: [
      { id: 'sz-1', name: 'Small (0.5kg) - 4-6 servings', description: 'Cute mini birthday standard size', price: 0 },
      { id: 'sz-2', name: 'Medium (1.0kg) - 8-12 servings', description: 'Perfect family parlor gathering', price: 250 },
      { id: 'sz-3', name: 'Large (2.0kg) - 16-20 servings', description: 'Festive office & larger groups', price: 550 },
      { id: 'sz-4', name: 'Double Tier Luxury (3.0kg+) - 25-30 servings', description: 'Grand showstopper custom stacked tiers', price: 1050 }
    ],
    flavors: [
      { id: 'fl-1', name: 'Classic Madagascar Vanilla Butter', price: 0 },
      { id: 'fl-2', name: 'Rich Belgian Fudge Chocolate', price: 100 },
      { id: 'fl-3', name: 'Velvety Red Velvet Cocoa', price: 150 },
      { id: 'fl-4', name: 'Creamcheese Salted Butterscotch', price: 80 },
      { id: 'fl-5', name: 'Summer Fresh Strawberry Cream', price: 80 },
      { id: 'fl-6', name: 'Summer Juicy Red Watermelon', price: 180 }
    ],
    colors: [
      { id: 'cl-1', name: 'Millennial Pink', code: '#ffb6c1', price: 0 },
      { id: 'cl-2', name: 'Belgian Charcoal Fudge', code: '#4a3538', price: 0 },
      { id: 'cl-3', name: 'Golden Banana Cream', code: '#e9c400', price: 0 },
      { id: 'cl-4', name: 'Lavender Dreams', code: '#d8b4fe', price: 0 },
      { id: 'cl-5', name: 'Mint Meadow', code: '#a7f3d0', price: 0 },
      { id: 'cl-6', name: 'Emerald Watermelon Rind', code: '#2ecc71', price: 0 },
      { id: 'cl-7', name: 'Pure Snow White', code: '#ffffff', price: 0 }
    ],
    dietary: [
      { id: 'dt-1', name: 'Standard Cream Base', description: 'Fresh farm eggs and rich dairy cream', price: 0 },
      { id: 'dt-2', name: '100% Pure Eggless Sponge', description: 'No eggs used inside workspace', price: 50 },
      { id: 'dt-3', name: 'Certified Gluten-Free Base', description: 'Using organic almond or coconut starch', price: 120 },
      { id: 'dt-4', name: 'Organic Vegan Dairy-Free', description: 'Using coconut butter and almond milk cream', price: 150 },
      { id: 'dt-5', name: 'Healthy Sugar-Free Stevia Blend', description: 'Zero added processed refine sugar', price: 180 }
    ],
    fillings: [
      { id: 'fi-1', name: 'Belgian Fudge', price: 80 },
      { id: 'fi-2', name: 'Strawberry Cream', price: 90 },
      { id: 'fi-3', name: 'Salted Caramel', price: 80 },
      { id: 'fi-4', name: 'Nutella Blast', price: 120 },
      { id: 'fi-5', name: 'Cookies n Cream', price: 70 },
      { id: 'fi-6', name: 'Standard Cream Paste', price: 0 }
    ],
    toppings: [
      { id: 'tp-1', name: 'Rainbow Sprinkles', price: 30 },
      { id: 'tp-2', name: 'French Macarons & Organic Berries', price: 150 },
      { id: 'tp-3', name: 'Edible 24k Gold Foil flakes', price: 200 },
      { id: 'tp-4', name: 'Chocolate Ganache Drip', price: 60 },
      { id: 'tp-5', name: 'Artisan Whipped Sugar Flowers', price: 80 },
      { id: 'tp-6', name: 'Magic Edible Butterflies', price: 100 }
    ],
    sweetness: [
      { id: 'sw-1', name: 'Balanced (Muted Sweetness)', description: 'Keeps cream taste primary with very mild sugars', price: 0 },
      { id: 'sw-2', name: 'Standard Sweetness', description: 'Traditional perfect balanced sweet index', price: 0 },
      { id: 'sw-3', name: 'Extra Sweet Richness', description: 'Bold sugary pop, perfect for chocoholics', price: 0 },
      { id: 'sw-4', name: 'Stevia / Monk Fruit Sweetener', description: 'No spikes! Organic premium leaf crystals', price: 40 }
    ],
    frostings: [
      { id: 'fr-1', name: 'Light Whipped Frosting', description: 'Fluffy air whipped sugar cream', price: 0 },
      { id: 'fr-2', name: 'Swiss Meringue Buttercream', description: 'Rich velvety luxury finish', price: 100 },
      { id: 'fr-3', name: 'New York Cream Cheese Frosting', description: 'Tangy dessert pastry favorite', price: 120 },
      { id: 'fr-4', name: 'Rigid Rolled Fondant Sheet', description: 'Sleek custom sculpted cake finish', price: 150 }
    ]
  };

  const getInitialCustomization = (): CakeCustomization => ({
    category: 'cake',
    size: options.sizes[1]?.name || options.sizes[0]?.name || '',
    baseFlavor: options.flavors[0]?.name || '',
    baseColor: options.colors[0]?.code || '#ffb6c1',
    baseColorName: options.colors[0]?.name || 'Millennial Pink',
    dietary: options.dietary[0]?.name || '',
    fillings: options.fillings[0]?.name || '',
    sweetness: options.sweetness[1]?.name || options.sweetness[0]?.name || '',
    frostingType: options.frostings[0]?.name || '',
    toppings: options.toppings[0] ? [options.toppings[0].name] : [],
    occasion: 'Birthday Celebration',
    messageOnCake: '',
    deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    deliveryTimeSlot: 'Evening Twilight (06:00 PM - 09:00 PM)',
    specialInstructions: ''
  });

  const [step, setStep] = useState(1);
  const [customization, setCustomization] = useState<CakeCustomization>(getInitialCustomization);
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);
  const [validationError, setValidationError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Pricing calculation helper linked completely to dynamic builderOptions
  const calculatePrice = (): number => {
    let base = customization.category === 'cake' ? 500 : 350;

    // Size pricing
    const sizeOpt = options.sizes.find(s => s.name === customization.size);
    if (sizeOpt) base += sizeOpt.price;

    // Flavor sponging pricing
    const flavorOpt = options.flavors.find(f => f.name === customization.baseFlavor);
    if (flavorOpt) base += flavorOpt.price;

    // Dietary
    const dietaryOpt = options.dietary.find(d => d.name === customization.dietary);
    if (dietaryOpt) base += dietaryOpt.price;

    // Fillings
    const fillingsOpt = options.fillings.find(f => f.name === customization.fillings);
    if (fillingsOpt) base += fillingsOpt.price;

    // Sweetness
    const sweetnessOpt = options.sweetness.find(sw => sw.name === customization.sweetness);
    if (sweetnessOpt) base += sweetnessOpt.price;

    // Frosting
    const frostingOpt = options.frostings.find(fr => fr.name === customization.frostingType);
    if (frostingOpt) base += frostingOpt.price;

    // Toppings cumulative sum
    customization.toppings.forEach(top => {
      const toppingOpt = options.toppings.find(t => t.name === top);
      if (toppingOpt) base += toppingOpt.price;
    });

    // Special slots (e.g. Midnight)
    if (customization.deliveryTimeSlot.includes('Midnight')) base += 150;

    // Delivery charge
    if (customer.deliveryType === 'delivery') base += 80;

    return base;
  };

  // Step Navigators
  const nextStep = () => {
    if (step === 13) {
      if (!customer.name.trim()) return setValidationError('Please provide your name.');
      if (!customer.email.trim() || !customer.email.includes('@')) return setValidationError('Please enter a valid email address.');
      if (!customer.phone.trim() || customer.phone.length < 8) return setValidationError('Please enter a valid phone contact.');
      if (customer.deliveryType === 'delivery' && !customer.address.trim()) return setValidationError('Please provide an address for home delivery.');
    }
    setValidationError('');
    setStep((prev) => Math.min(prev + 1, 14));
  };

  const prevStep = () => {
    setValidationError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleToppingToggle = (topping: string) => {
    setCustomization((prev) => {
      const exists = prev.toppings.includes(topping);
      const nextToppings = exists
        ? prev.toppings.filter((t) => t !== topping)
        : [...prev.toppings, topping];
      return { ...prev, toppings: nextToppings };
    });
  };

  const resetBuilder = () => {
    setCustomization(getInitialCustomization());
    setCustomer(INITIAL_CUSTOMER);
    setStep(1);
    setSubmittedOrder(null);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: `SPOT-${Math.floor(10000 + Math.random() * 90000)}`,
      customization,
      customer,
      totalPrice: calculatePrice(),
      status: 'Received',
      createdAt: new Date().toLocaleString('en-US', { hour12: true })
    };

    // Save order
    onOrderAdded(newOrder);
    setSubmittedOrder(newOrder);
  };

  return (
    <section id="builder" className="py-20 bg-[#fff1ea]/60 relative select-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Intro branding */}
        <div className="text-center mb-12">
          <span className="p-1 px-3 bg-primary/15 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
            Artisanal Confectionery Engine
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mt-2">
            Design Your Dream Confection
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto mt-2">
            Customize every tier, flavor, and decoration step-by-step. Watch your cake update dynamically in real-time.
          </p>
        </div>

        {submittedOrder ? (
          /* Confirmation Success Panel */
          <div className="max-w-xl mx-auto glass-card rounded-3xl p-8 text-center border border-primary-container space-y-6 animate-bounce-slight">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <Check size={36} className="stroke-[3]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-widest bg-emerald-500/10 text-emerald-800 px-3 py-1 rounded-full uppercase">
                Order Received Successfully
              </span>
              <h3 className="font-display text-2xl font-bold text-primary">
                Your Baking Slot is Booked!
              </h3>
              <p className="font-sans text-xs text-on-surface-variant">
                We've locked in your recipe slot. A sweet confirmation slip has been logged under ID: <strong className="text-primary font-bold">{submittedOrder.id}</strong>.
              </p>
            </div>

            {/* Structured Recipe Summary */}
            <div className="bg-[#fff8f5] p-5 rounded-2xl text-left border border-primary-container/20 text-xs space-y-2 font-mono divide-y divide-primary-container/20">
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Baker Code:</span> <span className="font-bold text-primary">{submittedOrder.id}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Recipient:</span> <span className="font-bold">{submittedOrder.customer.name}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Selected Base:</span> <span className="font-bold">{submittedOrder.customization.category.toUpperCase()} ({submittedOrder.customization.baseFlavor})</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Frosting Color:</span> <span className="font-bold">{submittedOrder.customization.baseColorName}</span></div>
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Dietary Preference:</span> <span className="font-bold">{submittedOrder.customization.dietary}</span></div>
              {submittedOrder.customization.messageOnCake && (
                <div className="py-1.5 flex justify-between text-pink-700 italic"><span className="text-on-surface-variant">Topper Inscription:</span> <span>"{submittedOrder.customization.messageOnCake}"</span></div>
              )}
              <div className="py-1.5 flex justify-between">
                <span className="text-on-surface-variant">Dispatch:</span> 
                <span className="font-bold flex items-center gap-1">
                  {submittedOrder.customer.deliveryType === 'delivery' ? (
                    <>
                      <Truck size={13} className="text-primary" />
                      <span>Home Delivery</span>
                    </>
                  ) : (
                    <>
                      <Store size={13} className="text-primary" />
                      <span>Studio Self-Pickup</span>
                    </>
                  )}
                </span>
              </div>
              <div className="py-2 flex justify-between text-base font-bold text-primary pt-3"><span className="font-display uppercase tracking-wider text-xs">Settled Total:</span> <span>₹{submittedOrder.totalPrice}</span></div>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={(() => {
                  const orderDetails = `Hi Krish Dreamy Delight! 🎂\n\nI just placed a custom cake order on your website:\n*Order ID:* ${submittedOrder.id}\n*Name:* ${submittedOrder.customer.name}\n*Cake Style:* ${submittedOrder.customization.category.toUpperCase()} (${submittedOrder.customization.size})\n*Base Flavor:* ${submittedOrder.customization.baseFlavor}\n*Frosting Shade:* ${submittedOrder.customization.baseColorName}\n*Frosting Inscription:* "${submittedOrder.customization.messageOnCake || 'None'}"\n*Dispatch:* ${submittedOrder.customer.deliveryType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}\n*TotalPrice:* ₹${submittedOrder.totalPrice}\n\nPlease confirm my slot booking! Thank you. ✨`;
                  return `https://wa.me/919876543210?text=${encodeURIComponent(orderDetails)}`;
                })()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-full shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-center"
              >
                <MessageSquare size={14} className="stroke-[2.5]" />
                Direct Message Order details to Baker (WhatsApp DM)
              </a>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetBuilder}
                  className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase rounded-full shadow-md hover:bg-[#6b3741] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Bake Another Custom Order
                </button>
                <button
                  onClick={() => {
                    const dashboard = document.getElementById('admin-dashboard');
                    if (dashboard) {
                      dashboard.classList.remove('hidden');
                      dashboard.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex-1 py-3 bg-[#fff8f5] text-primary border border-primary/20 text-xs font-bold uppercase rounded-full hover:bg-primary-container/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Inspect Live Order Queue
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column Creator Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Controls & Selections (Col 7) */}
            <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-primary-container/40 flex flex-col min-h-[580px] shadow-sm">
              
              {/* Stepper Header Metrics */}
              <div className="mb-6 flex justify-between items-center bg-[#fff8f5] p-3 rounded-2xl border border-primary/5">
                <div>
                  <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest block">
                    STAGE {step} OF 14
                  </span>
                  <span className="font-display text-sm font-bold text-primary block mt-0.5">
                    {
                      [
                        "Choose Dessert Style",
                        "Portions & Physical Sizing",
                        "Artisanal Sponge Flavor",
                        "Frosting Outer Dress Color",
                        "Dietary Preference",
                        "Inner Layer Cake Filling",
                        "Calibrated Sweetness Level",
                        "Frosting Texture Coat",
                        "Gourmet Crown Toppings",
                        "Special Occasion Theme",
                        "Frosting Letter Message",
                        "Date Booking Slot",
                        "Delivery Mode & Address",
                        "Slab Recipe Overlook"
                      ][step - 1]
                    }
                  </span>
                </div>
                <div className="w-14 h-1.5 bg-primary-container/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(step / 14) * 100}%` }}
                  />
                </div>
              </div>

              {/* Dynamic STEP Option Bodies */}
              <div className="flex-grow space-y-4">
                
                {/* STEP 1: Category Selection */}
                {step === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="font-display font-bold text-lg text-primary">Choose Your Desserts Base</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Artisanal custom tier cakes or premium gooey loaded brownies cut into generous party slices.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <button
                        onClick={() => {
                          setCustomization(prev => ({ ...prev, category: 'cake' }));
                          nextStep();
                        }}
                        className={`p-6 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all cursor-pointer hover:scale-[1.02] ${
                          customization.category === 'cake'
                            ? 'border-primary bg-primary-container/15'
                            : 'border-outline-variant bg-white/50'
                        }`}
                      >
                        <CakeIcon className="text-primary" size={28} />
                        <div>
                          <h4 className="font-display font-bold text-sm text-primary">Custom Sponge Cakes</h4>
                          <span className="text-[11px] text-on-surface-variant">Beautiful custom layered frosting birthday & celebration mainstays from ₹500</span>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setCustomization(prev => ({ ...prev, category: 'brownie' }));
                          nextStep();
                        }}
                        className={`p-6 rounded-2xl border-2 text-left flex flex-col gap-3 transition-all cursor-pointer hover:scale-[1.02] ${
                          customization.category === 'brownie'
                            ? 'border-primary bg-primary-container/15'
                            : 'border-outline-variant bg-white/50'
                        }`}
                      >
                        <UtensilsCrossed className="text-primary" size={28} />
                        <div>
                          <h4 className="font-display font-bold text-sm text-primary">Loaded Brownie Boxes</h4>
                          <span className="text-[11px] text-on-surface-variant">Deep organic chocolate fudge squares drizzled with toppings from ₹350</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Size Choice */}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Physical Sizing & Serving Yield</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Calibrate the pound weight to fit your guest list perfectly.
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {options.sizes.map((sizeItem) => (
                        <button
                          key={sizeItem.id}
                          onClick={() => setCustomization({ ...customization, size: sizeItem.name })}
                          className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                            customization.size === sizeItem.name
                              ? 'border-primary bg-primary-container/15 font-bold'
                              : 'border-outline-variant/55 bg-white/50'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs text-primary block">{sizeItem.name}</span>
                            {sizeItem.description && (
                              <span className="text-[10px] text-on-surface-variant font-normal block">{sizeItem.description}</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-bold">
                            {sizeItem.price === 0 ? '₹0' : `+₹${sizeItem.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Base Flavor Sponge */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Select Sponge Cake/Brownie Base Flavor</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Our signature recipes are whipped using real cream butter and luxury organic Madagascar vanilla pods or Belgian cocoa.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {options.flavors.map((flav) => (
                        <button
                          key={flav.id}
                          onClick={() => setCustomization({ ...customization, baseFlavor: flav.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                            customization.baseFlavor === flav.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <span className="font-display text-xs font-bold text-primary">{flav.name}</span>
                          <span className="text-[10px] text-on-surface-variant">
                            {flav.price === 0 ? '₹0' : `+₹${flav.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Color Settings */}
                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Outer Frosting Dress Shade</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      This changes the visual frosting layer color in the live graphic preview panel!
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {options.colors.map((col) => (
                        <button
                          key={col.id}
                          onClick={() => setCustomization({ ...customization, baseColor: col.code || '#ffb6c1', baseColorName: col.name })}
                          className={`p-3.5 rounded-2xl border-2 text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            customization.baseColorName === col.name
                              ? 'border-primary bg-primary-container/20 font-bold scale-[1.03]'
                              : 'border-outline-variant/50 bg-white/30'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-full border border-primary/20 shadow-inner"
                            style={{ backgroundColor: col.code || '#ffb6c1' }}
                          />
                          <span className="text-[10px] text-on-surface font-semibold truncate block w-full">
                            {col.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 5: Dietary */}
                {step === 5 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Dietary Adaptations</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      We offer fully isolated sanitary workstations for special baker requests (eggless sponge, zero gluten flour blends).
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 pt-1">
                      {options.dietary.map((diet) => (
                        <button
                          key={diet.id}
                          onClick={() => setCustomization({ ...customization, dietary: diet.name })}
                          className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                            customization.dietary === diet.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{diet.name}</span>
                            {diet.description && (
                              <span className="text-[10px] text-on-surface-variant block">{diet.description}</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-bold">
                            {diet.price === 0 ? '₹0' : `+₹${diet.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Layer Filings */}
                {step === 6 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Interior Core Sponge Layer Filling</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Gourmet premium fillings stuffed cleanly between sponge cake bread decks.
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {options.fillings.map((fil) => (
                        <button
                          key={fil.id}
                          onClick={() => setCustomization({ ...customization, fillings: fil.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.fillings === fil.name
                              ? 'border-primary bg-primary-container/15 font-bold'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <span className="font-display text-xs text-primary">{fil.name}</span>
                          <span className="text-[10px] text-on-surface-variant font-semibold">
                            {fil.price === 0 ? '₹0' : `+₹${fil.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Sweetness Level */}
                {step === 7 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Calibrated Sweetness Level</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Choose how much sugar or stevia sweet index to apply.
                    </p>
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {options.sweetness.map((swt) => (
                        <button
                          key={swt.id}
                          onClick={() => setCustomization({ ...customization, sweetness: swt.name })}
                          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            customization.sweetness === swt.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <span className="font-display text-xs font-bold text-primary block">{swt.name}</span>
                              {swt.description && (
                                <span className="text-[10px] text-on-surface-variant block">{swt.description}</span>
                              )}
                            </div>
                            {swt.price > 0 && (
                              <span className="text-xs font-bold text-primary shrink-0 ml-2">
                                +₹{swt.price}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 8: Frosting type */}
                {step === 8 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Outer Body Frosting Texture coat</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Swiss buttercreams provide heavy piping options while whipped cream is fluffy and feather-light.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {options.frostings.map((fs) => (
                        <button
                          key={fs.id}
                          onClick={() => setCustomization({ ...customization, frostingType: fs.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.frostingType === fs.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{fs.name}</span>
                            {fs.description && (
                              <span className="text-[10px] text-on-surface-variant block">{fs.description}</span>
                            )}
                          </div>
                          <span className="text-xs text-primary font-bold mt-2 block">
                            {fs.price === 0 ? '₹0' : `+₹${fs.price}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 9: Toppings */}
                {step === 9 && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-display font-bold text-lg text-primary">Gourmet Toppings (Multi-Select)</h3>
                      <span className="text-[10px] bg-primary/10 text-primary uppercase p-1 px-2.5 rounded-full font-bold">
                        Add Multiple
                      </span>
                    </div>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Decorate the top and side panels! Watch stars, berries, and butterflies appear on the live review cake.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {options.toppings.map((top) => {
                        const isChosen = customization.toppings.includes(top.name);
                        return (
                          <button
                            key={top.id}
                            onClick={() => handleToppingToggle(top.name)}
                            className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                              isChosen
                                ? 'border-primary bg-primary-container/15 font-bold'
                                : 'border-outline-variant/40 bg-white/40'
                            }`}
                          >
                            <span className="font-display text-xs text-primary">{top.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold">
                              {top.price === 0 ? '₹0' : `+₹${top.price}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 10: Occasion */}
                {step === 10 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Special Occasion Theme</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      This helps our kitchen team select custom box ribbons and visual design matches.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        "Birthday Celebration",
                        "Anniversary Milestone",
                        "Grand Wedding Reception",
                        "Baby Shower Welcome",
                        "Sweet Graduation Party",
                        "Just Because / Sweet Tooth"
                      ].map((occ) => (
                        <button
                          key={occ}
                          onClick={() => setCustomization({ ...customization, occasion: occ })}
                          className={`p-4 rounded-2xl border-2 text-center text-xs font-semibold flex items-center justify-center min-h-[70px] transition-all cursor-pointer ${
                            customization.occasion === occ
                              ? 'border-primary bg-primary-container/20 text-primary font-bold scale-[1.03]'
                              : 'border-outline-variant/40 bg-white/30 text-on-surface'
                          }`}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 11: Personal message */}
                {step === 11 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Letter Message On Sponge Cake</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      We'll hand-pipe this cleanly on top of the cake. Watch it appear on the live preview cylinder!
                    </p>
                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                        Piped Text (Max 30 Characters)
                      </label>
                      <input 
                        type="text"
                        value={customization.messageOnCake}
                        onChange={(e) => setCustomization({ ...customization, messageOnCake: e.target.value.slice(0, 30) })}
                        placeholder="Happy Birthday Sarah!"
                        className="w-full p-4 rounded-xl border border-primary/20 bg-white/70 text-on-surface font-semibold placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 12: Delivery Date & Slot */}
                {step === 12 && (
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Delivery Date & Precise Time Slot</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Cakes are baked 3 hours prior to dispatch to preserve exquisite flavor. Minimum 24 hour booking is recommended.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                          Select Delivery Date
                        </label>
                        <div className="relative">
                          <input 
                            type="date"
                            value={customization.deliveryDate}
                            onChange={(e) => setCustomization({ ...customization, deliveryDate: e.target.value })}
                            className="w-full p-3 border border-primary/10 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                          Select Time Session Slot
                        </label>
                        <select
                          value={customization.deliveryTimeSlot}
                          onChange={(e) => setCustomization({ ...customization, deliveryTimeSlot: e.target.value })}
                          className="w-full p-3 border border-primary/10 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold"
                        >
                          <option>Morning Breakfast (09:00 AM - 12:00 PM)</option>
                          <option>Hi-Noon Lunch (12:00 PM - 03:00 PM)</option>
                          <option>High Tea Evening (03:00 PM - 06:00 PM)</option>
                          <option>Evening Twilight (06:00 PM - 09:00 PM)</option>
                          <option>Midnight Birthday Surprise (09:00 PM - 11:59 PM) (+₹150)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 13: Delivery Mode & Customer Details */}
                {step === 13 && (
                  <form className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-primary">Client Details & Dispatch Mode</h3>
                    <p className="font-sans text-xs text-on-surface-variant">
                      Please enter delivery details to finalize pricing.
                    </p>
                    
                    {/* Toggle Pickup vs Delivery */}
                    <div className="grid grid-cols-2 gap-3 pb-2">
                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, deliveryType: 'pickup' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          customer.deliveryType === 'pickup'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-on-surface border-[#d6c2c3]/60 hover:bg-neutral-50'
                        }`}
                      >
                        <Store size={15} />
                        Self-Pickup from Studio (Free)
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomer({ ...customer, deliveryType: 'delivery' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          customer.deliveryType === 'delivery'
                            ? 'bg-primary text-white border-primary shadow-sm'
                            : 'bg-white text-on-surface border-[#d6c2c3]/60 hover:bg-neutral-50'
                        }`}
                      >
                        <Truck size={15} />
                        Home Delivery (+₹80)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Your Name</label>
                        <input 
                          type="text"
                          required
                          value={customer.name}
                          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Rahul Sharma"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Email Address</label>
                        <input 
                          type="email"
                          required
                          value={customer.email}
                          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="rahul@example.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Phone Number</label>
                        <input 
                          type="tel"
                          required
                          value={customer.phone}
                          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="9876543210"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Special Custom Demands</label>
                        <textarea 
                          rows={1}
                          value={customization.specialInstructions}
                          onChange={(e) => setCustomization({ ...customization, specialInstructions: e.target.value })}
                          className="w-full p-2 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Please pack strawberries on side..."
                        />
                      </div>
                    </div>

                    {customer.deliveryType === 'delivery' && (
                      <div className="space-y-1 text-xs text-left">
                        <label className="font-bold text-[#874e58] uppercase text-[10px]">Home Street Address Location</label>
                        <input 
                          type="text"
                          required
                          value={customer.address}
                          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                          className="w-full p-2.5 rounded-xl border-2 border-outline-variant/40 bg-white"
                          placeholder="Apt-402, Signature Residency, Connaught Place, New Delhi"
                        />
                      </div>
                    )}
                  </form>
                )}

                {/* STEP 14: Final Invoice Review */}
                {step === 14 && (
                  <div className="space-y-4 text-xs font-sans text-left">
                    <h3 className="font-display font-bold text-lg text-primary text-center">Verify Selected Slab Recipe</h3>
                    <p className="font-sans text-[11px] text-on-surface-variant text-center">
                      Review your summary instructions before submitting baking request to kitchen.
                    </p>

                    <div className="bg-white/90 p-4 rounded-2xl border border-primary/10 max-h-[250px] overflow-y-auto space-y-2 divide-y divide-[#ffade]/20">
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Selected Base:</span> <span className="font-bold uppercase">{customization.category}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Size Scale:</span> <span className="font-bold">{customization.size}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Baked Sponge Flavor:</span> <span className="font-bold">{customization.baseFlavor}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Frosting Style Color:</span> <span className="font-bold">{customization.baseColorName}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Dietary Adjustment:</span> <span className="font-bold">{customization.dietary}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Sponge Core Filling:</span> <span className="font-bold">{customization.fillings}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Sweet Index Level:</span> <span className="font-bold">{customization.sweetness}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Icing Surface Coat:</span> <span className="font-bold">{customization.frostingType}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Toppings loaded:</span> <span className="font-bold max-w-[170px] truncate block text-right">{customization.toppings.join(', ')}</span></div>
                      <div className="flex justify-between py-1 text-pink-700 italic"><span className="text-on-surface-variant font-semibold">Frosting Message:</span> <span className="font-bold">"{customization.messageOnCake || 'None'}"</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">Occasion Intended:</span> <span className="font-bold">{customization.occasion}</span></div>
                      <div className="flex justify-between py-1 text-secondary"><span className="text-on-surface-variant">Dispatch:</span> <span className="font-bold uppercase">{customer.deliveryType}</span></div>
                      <div className="flex justify-between py-1"><span className="text-on-surface-variant">DateTime Schedule:</span> <span className="font-bold text-slate-800">{customization.deliveryDate} @ {customization.deliveryTimeSlot.slice(0, 15)}</span></div>
                    </div>
                  </div>
                )}

              </div>

              {/* Validation errors */}
              {validationError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-xs font-semibold animate-pulse border border-red-200">
                  <HelpCircle size={15} />
                  {validationError}
                </div>
              )}

              {/* Control Panel Nav Buttons */}
              <div className="mt-8 pt-4 border-t border-[#d6c2c3]/50 flex justify-between items-center bg-white/40 p-2 rounded-2xl">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="px-5 py-2.5 rounded-full text-xs font-bold border border-outline-variant/60 text-on-surface-variant hover:bg-[#ffeade]/30 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer flex items-center gap-1 transition-all"
                  id="btn-prev"
                >
                  <ChevronLeft size={14} />
                  Prev
                </button>

                {step < 14 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md hover:bg-[#6b3741] active:translate-y-0.5 transition-all cursor-pointer flex items-center gap-1"
                    id="btn-next"
                  >
                    Next Step
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    className="px-8 py-3 bg-primary text-white font-bold text-sm tracking-wider uppercase rounded-full shadow-lg hover:bg-[#6b3741] animate-pulse transition-all cursor-pointer flex items-center gap-1"
                    id="btn-checkout"
                  >
                    <ShoppingBag size={16} />
                    Submit Custom Recipe Request
                  </button>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: Live Interactive Aesthetic Preview (Col 5) */}
            <div className="lg:col-span-5 bg-gradient-to-tr from-white to-[#fff8f5] border border-primary-container/40 rounded-3xl p-6 flex flex-col items-center justify-between min-h-[580px] shadow-pink relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/20 filter blur-xl rounded-full" />
              
              <div className="text-center">
                <span className="p-1 px-3 bg-[#e9c400]/10 text-amber-700 text-[10px] font-bold rounded-full tracking-wider uppercase inline-block">
                  Aesthetic Preview Layer
                </span>
                <h3 className="font-display text-sm font-bold text-primary mt-1">
                  Active Confection Configuration
                </h3>
              </div>

              {/* The Visual Cake Stack Object */}
              <div className="relative w-64 h-64 flex items-center justify-center animate-float">
                {/* Visual shadow glow */}
                <div className="w-52 h-6 bg-primary/10 rounded-full blur-md absolute bottom-2" />

                {customization.category === 'cake' ? (
                  /* Sponge Layer 3D stacked emulations */
                  <div className="relative w-full flex flex-col items-center justify-center pt-8">
                    
                    {/* TOP TIER layer (only shown on Double Tier) */}
                    {customization.size.includes('Double Tier') && (
                      <div 
                        className="w-24 h-16 rounded-t-lg rounded-b-md relative z-20 border-b-2 border-primary/10 flex flex-col items-center justify-center shadow-md transition-all duration-500"
                        style={{ backgroundColor: customization.baseColor }}
                      >
                        {/* Buttercream layer line ring */}
                        <div className="w-full h-1 bg-white/50 absolute top-1/2" />
                        <div className="absolute -top-3.5 flex gap-1 animate-pulse">
                          <Sparkles className="text-pink-300 w-3.5 h-3.5" />
                          <Sparkles className="text-amber-300 w-3.5 h-3.5" />
                          <Sparkles className="text-pink-300 w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}

                    {/* MAIN BOTTOM TIER base layer */}
                    <div 
                      className="w-40 h-24 rounded-lg relative z-10 border-b-4 border-primary/20 flex flex-col items-center justify-center shadow-lg transition-all duration-500"
                      style={{ 
                        backgroundColor: customization.baseColor,
                        transform: customization.size.includes('Double Tier') ? 'scale(1.05)' : 'scale(1.15) translateY(-8px)'
                      }}
                    >
                      {/* Piped decorations and drip decorations simulation */}
                      {customization.toppings.includes('Chocolate Ganache Drip') && (
                        <div className="w-full absolute top-0 flex justify-between px-0.5 pointer-events-none">
                          {Array.from({ length: 8 }).map((_, di) => (
                            <div key={di} className="w-1.5 h-3.5 bg-amber-900 rounded-b-full shadow-xs" />
                          ))}
                        </div>
                      )}

                      {/* Sweet whipping edge ring */}
                      <div className="w-full h-1.5 bg-white/70 absolute top-[43%] translate-y-[-50%]" />

                      {/* Sparkles, Berries, Toppings stacked overlays on active preview cylinder */}
                      <div className="absolute inset-x-2 bottom-5 flex justify-around pointer-events-none">
                        {customization.toppings.includes('French Macarons & Organic Berries') && <Sparkles size={16} className="text-rose-500 fill-rose-300" />}
                        {customization.toppings.includes('Magic Edible Butterflies') && <Sparkles size={16} className="text-indigo-400 animate-bounce" />}
                        {customization.toppings.includes('Artisan Whipped Sugar Flowers') && <Sparkles size={16} className="text-pink-400" />}
                        {customization.toppings.includes('Edible 24k Gold Foil flakes') && <Sparkles size={16} className="text-[#e9c400] font-bold fill-current" />}
                      </div>

                      {/* Personal Text message on cake base */}
                      {customization.messageOnCake && (
                        <div className="absolute top-[55%] inset-x-2 text-center pointer-events-none">
                          <span className="font-cursive text-xs text-glow px-2 py-0.5 rounded-md text-amber-900 bg-white/70 font-bold block truncate max-w-[130px] mx-auto transform -rotate-1">
                            {customization.messageOnCake}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Brownie box stacked representation */
                  <div className="relative flex flex-col items-center justify-center w-full pt-8 scale-110">
                    <div className="w-44 h-28 bg-[#4a3538] rounded-xl border-4 border-amber-950 flex flex-col justify-between p-2 shadow-xl relative z-10">
                      {/* Grid brownie lines */}
                      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 border-2 border-amber-950/20 rounded-lg pointer-events-none opacity-20" />
                      
                      {customization.toppings.includes('Chocolate Ganache Drip') && (
                        <div className="w-full h-full absolute inset-0 bg-amber-950/15 pointer-events-none blur-xs rounded-lg" />
                      )}

                      <div className="flex justify-around">
                        {customization.toppings.includes('French Macarons & Organic Berries') && <Sparkles size={12} className="text-rose-500 fill-rose-300 inline" />}
                        {customization.toppings.includes('Rainbow Sprinkles') && <Sparkles size={12} className="text-amber-500 inline animate-spin-slow" />}
                        {customization.toppings.includes('Artisan Whipped Sugar Flowers') && <Sparkles size={12} className="text-pink-400 inline" />}
                      </div>
                      <div className="text-center font-display text-[9px] font-bold text-[#ffb6c1] bg-[#874e58]/80 rounded p-1 max-w-[100px] mx-auto block z-20">
                        Premium Fudge Box
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Computed live invoice ticker badge pricing */}
              <div className="w-full bg-[#ffeade]/60 hover:bg-[#ffeade]/80 rounded-2xl p-4 border border-primary/5 text-center mt-4 transition-all">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  Computed Estimation Slip
                </span>
                <span className="font-display text-2xl font-bold text-primary block mt-0.5">
                  ₹{calculatePrice()}
                </span>
                <span className="text-[9px] text-[#847375] font-semibold block uppercase">
                  (Includes taxes, FSSAI certified slab slot)
                </span>
              </div>

            </div>

          </div>
        )}
      </div>
    </section>
  );
}
