import React, { useState } from 'react';
import { CakeCustomization, CustomerDetails, Order } from '../types';
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
  Store 
} from 'lucide-react';

interface CakeBuilderProps {
  onOrderAdded: (newOrder: Order) => void;
}

const INITIAL_CUSTOMIZATION: CakeCustomization = {
  category: 'cake',
  size: 'Medium (1.0kg) - 8-12 servings',
  baseFlavor: 'Rich Belgian Chocolate',
  baseColor: '#ffb6c1',
  baseColorName: 'Millennial Pink',
  dietary: 'Standard Cream Base',
  fillings: 'Belgian Fudge',
  sweetness: 'Standard Sweetness',
  frostingType: 'Light Whipped Frosting',
  toppings: ['Rainbow Sprinkles'],
  occasion: 'Birthday Celebration',
  messageOnCake: '',
  deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
  deliveryTimeSlot: 'Evening Twilight (06:00 PM - 09:00 PM)',
  specialInstructions: ''
};

const INITIAL_CUSTOMER: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  deliveryType: 'pickup'
};

export default function CakeBuilder({ onOrderAdded }: CakeBuilderProps) {
  const [step, setStep] = useState(1);
  const [customization, setCustomization] = useState<CakeCustomization>(INITIAL_CUSTOMIZATION);
  const [customer, setCustomer] = useState<CustomerDetails>(INITIAL_CUSTOMER);
  const [validationError, setValidationError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Pricing calculation helper
  const calculatePrice = (): number => {
    let base = customization.category === 'cake' ? 500 : 350;

    // Size pricing
    if (customization.size.includes('Small')) base += 0;
    else if (customization.size.includes('Medium')) base += 250;
    else if (customization.size.includes('Large')) base += 550;
    else if (customization.size.includes('Double Tier')) base += 1050;

    // Flavor sponging pricing
    if (customization.baseFlavor.includes('Belgian Chocolate')) base += 100;
    else if (customization.baseFlavor.includes('Red Velvet')) base += 150;
    else if (customization.baseFlavor.includes('Butterscotch')) base += 80;
    else if (customization.baseFlavor.includes('Strawberry')) base += 80;

    // Dietary
    if (customization.dietary.includes('Eggless')) base += 50;
    else if (customization.dietary.includes('Gluten-Free')) base += 120;
    else if (customization.dietary.includes('Vegan')) base += 150;
    else if (customization.dietary.includes('Sugar-Free')) base += 180;

    // Fillings
    if (customization.fillings.includes('Belgian Fudge')) base += 80;
    else if (customization.fillings.includes('Strawberry Cream')) base += 90;
    else if (customization.fillings.includes('Salted Caramel')) base += 80;
    else if (customization.fillings.includes('Nutella')) base += 120;
    else if (customization.fillings.includes('Cookies')) base += 70;

    // Toppings cumulative sum
    customization.toppings.forEach(top => {
      if (top.includes('Sprinkles')) base += 30;
      else if (top.includes('Macarons')) base += 150;
      else if (top.includes('Gold Foil')) base += 200;
      else if (top.includes('Chocolate Drip')) base += 60;
      else if (top.includes('Sugar Flowers')) base += 80;
      else if (top.includes('Butterflies')) base += 100;
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
      // Validate customer info before moving to checkout review screen
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
    setCustomization(INITIAL_CUSTOMIZATION);
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
              <div className="py-1.5 flex justify-between"><span className="text-on-surface-variant">Dispatch:</span> <span className="font-bold">{submittedOrder.customer.deliveryType === 'delivery' ? '🚗 Home Delivery' : '📦 Studio Self-Pickup'}</span></div>
              <div className="py-2 flex justify-between text-base font-bold text-primary pt-3"><span className="font-display uppercase tracking-wider text-xs">Settled Total:</span> <span>₹{submittedOrder.totalPrice}</span></div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetBuilder}
                className="flex-1 py-3 bg-primary text-white text-xs font-bold uppercase rounded-full shadow-md hover:bg-[#6b3741] transition-all cursor-pointer"
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
                className="flex-1 py-3 bg-[#fff8f5] text-primary border border-primary/20 text-xs font-bold uppercase rounded-full hover:bg-primary-container/10 transition-all"
              >
                Inspect Live Order Queue
              </button>
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
                      {[
                        { name: 'Small (0.5kg) - 4-6 servings', desc: 'Cute mini birthday standard size', price: '₹0' },
                        { name: 'Medium (1.0kg) - 8-12 servings', desc: 'Perfect family parlor gathering', price: '+₹250' },
                        { name: 'Large (2.0kg) - 16-20 servings', desc: 'Festive office & larger groups', price: '+₹550' },
                        { name: 'Double Tier Luxury (3.0kg+) - 25-30 servings', desc: 'Grand showstopper custom stacked tiers', price: '+₹1050' },
                      ].map((sizeItem) => (
                        <button
                          key={sizeItem.name}
                          onClick={() => setCustomization({ ...customization, size: sizeItem.name })}
                          className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                            customization.size === sizeItem.name
                              ? 'border-primary bg-primary-container/15 font-bold'
                              : 'border-outline-variant/55 bg-white/50'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs text-primary block">{sizeItem.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-normal block">{sizeItem.desc}</span>
                          </div>
                          <span className="text-xs text-primary font-bold">{sizeItem.price}</span>
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
                      {[
                        { name: 'Classic Madagascar Vanilla Butter', cost: '+₹0' },
                        { name: 'Rich Belgian Fudge Chocolate', cost: '+₹100' },
                        { name: 'Velvety Red Velvet Cocoa', cost: '+₹150' },
                        { name: 'Creamcheese Salted Butterscotch', cost: '+₹80' },
                        { name: 'Summer Fresh Strawberry Cream', cost: '+₹80' }
                      ].map((flav) => (
                        <button
                          key={flav.name}
                          onClick={() => setCustomization({ ...customization, baseFlavor: flav.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col gap-1 transition-all cursor-pointer ${
                            customization.baseFlavor === flav.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <span className="font-display text-xs font-bold text-primary">{flav.name}</span>
                          <span className="text-[10px] text-on-surface-variant">{flav.cost}</span>
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
                      {[
                        { name: 'Millennial Pink', code: '#ffb6c1' },
                        { name: 'Belgian Charcoal Fudge', code: '#4a3538' },
                        { name: 'Golden Banana Cream', code: '#e9c400' },
                        { name: 'Lavender Dreams', code: '#d8b4fe' },
                        { name: 'Mint Meadow', code: '#a7f3d0' },
                        { name: 'Pure Snow White', code: '#ffffff' }
                      ].map((col) => (
                        <button
                          key={col.name}
                          onClick={() => setCustomization({ ...customization, baseColor: col.code, baseColorName: col.name })}
                          className={`p-3.5 rounded-2xl border-2 text-center flex flex-col items-center gap-2 transition-all cursor-pointer ${
                            customization.baseColorName === col.name
                              ? 'border-primary bg-primary-container/20 font-bold scale-[1.03]'
                              : 'border-outline-variant/50 bg-white/30'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-full border border-primary/20 shadow-inner"
                            style={{ backgroundColor: col.code }}
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
                      {[
                        { name: 'Standard Cream Base', desc: 'Fresh farm eggs and rich dairy cream', cost: '₹0' },
                        { name: '100% Pure Eggless Sponge', desc: 'No eggs used inside workspace', cost: '+₹50' },
                        { name: 'Certified Gluten-Free Base', desc: 'Using organic almond or coconut starch', cost: '+₹120' },
                        { name: 'Organic Vegan Dairy-Free', desc: 'Using coconut butter and almond milk cream', cost: '+₹150' },
                        { name: 'Healthy Sugar-Free Stevia Blend', desc: 'Zero added processed refine sugar', cost: '+₹180' }
                      ].map((diet) => (
                        <button
                          key={diet.name}
                          onClick={() => setCustomization({ ...customization, dietary: diet.name })}
                          className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                            customization.dietary === diet.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{diet.name}</span>
                            <span className="text-[10px] text-on-surface-variant block">{diet.desc}</span>
                          </div>
                          <span className="text-xs text-primary font-bold">{diet.cost}</span>
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
                      {[
                        { name: 'Belgian Fudge', cost: '+₹80' },
                        { name: 'Strawberry Cream', cost: '+₹90' },
                        { name: 'Salted Caramel', cost: '+₹80' },
                        { name: 'Nutella Blast', cost: '+₹120' },
                        { name: 'Cookies n Cream', cost: '+₹70' },
                        { name: 'Standard Cream Paste', cost: '+₹0' }
                      ].map((fil) => (
                        <button
                          key={fil.name}
                          onClick={() => setCustomization({ ...customization, fillings: fil.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.fillings === fil.name
                              ? 'border-primary bg-primary-container/15 font-bold'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <span className="font-display text-xs text-primary">{fil.name}</span>
                          <span className="text-[10px] text-on-surface-variant font-semibold">{fil.cost}</span>
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
                      {[
                        { name: 'Balanced (Muted Sweetness)', desc: 'Keeps cream taste primary with very mild sugars' },
                        { name: 'Standard Sweetness', desc: 'Traditional perfect balanced sweet index' },
                        { name: 'Extra Sweet Richness', desc: 'Bold sugary pop, perfect for chocoholics (+₹0)' },
                        { name: 'Stevia / Monk Fruit Sweetener', desc: 'No spikes! Organic premium leaf crystals (+₹40)' }
                      ].map((swt) => (
                        <button
                          key={swt.name}
                          onClick={() => setCustomization({ ...customization, sweetness: swt.name })}
                          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            customization.sweetness === swt.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/50 bg-white/50'
                          }`}
                        >
                          <span className="font-display text-xs font-bold text-primary block">{swt.name}</span>
                          <span className="text-[10px] text-on-surface-variant block">{swt.desc}</span>
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
                      {[
                        { name: 'Light Whipped Frosting', desc: 'Fluffy air whipped sugar cream', price: '+₹0' },
                        { name: 'Swiss Meringue Buttercream', desc: 'Rich velvety luxury finish', price: '+₹100' },
                        { name: 'New York Cream Cheese Frosting', desc: 'Tangy dessert pastry favorite', price: '+₹120' },
                        { name: 'Rigid Rolled Fondant Sheet', desc: 'Sleek custom sculpted cake finish', price: '+₹150' },
                      ].map((fs) => (
                        <button
                          key={fs.name}
                          onClick={() => setCustomization({ ...customization, frostingType: fs.name })}
                          className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                            customization.frostingType === fs.name
                              ? 'border-primary bg-primary-container/15'
                              : 'border-outline-variant/40 bg-white/40'
                          }`}
                        >
                          <div>
                            <span className="font-display text-xs font-bold text-primary block">{fs.name}</span>
                            <span className="text-[10px] text-on-surface-variant block">{fs.desc}</span>
                          </div>
                          <span className="text-xs text-primary font-bold mt-2 block">{fs.price}</span>
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
                      {[
                        { name: 'Rainbow Sprinkles', cost: '+₹30' },
                        { name: 'French Macarons & Organic Berries', cost: '+₹150' },
                        { name: 'Edible 24k Gold Foil flakes', cost: '+₹200' },
                        { name: 'Chocolate Ganache Drip', cost: '+₹60' },
                        { name: 'Artisan Whipped Sugar Flowers', cost: '+₹80' },
                        { name: 'Magic Edible Butterflies', cost: '+₹100' }
                      ].map((top) => {
                        const isChosen = customization.toppings.includes(top.name);
                        return (
                          <button
                            key={top.name}
                            onClick={() => handleToppingToggle(top.name)}
                            className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all cursor-pointer ${
                              isChosen
                                ? 'border-primary bg-primary-container/15 font-bold'
                                : 'border-outline-variant/40 bg-white/40'
                            }`}
                          >
                            <span className="font-display text-xs text-primary">{top.name}</span>
                            <span className="text-[10px] text-on-surface-variant font-bold">{top.cost}</span>
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
                          🍒🍓🍒
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
                      <div className="absolute inset-x-2 bottom-4 flex justify-around pointer-events-none">
                        {customization.toppings.includes('French Macarons & Organic Berries') && <span className="text-lg">🍓</span>}
                        {customization.toppings.includes('Magic Edible Butterflies') && <span className="text-md animate-bounce">🦋</span>}
                        {customization.toppings.includes('Artisan Whipped Sugar Flowers') && <span className="text-base">🌸</span>}
                        {customization.toppings.includes('Edible 24k Gold Foil flakes') && <span className="text-xs text-[#e9c400] font-bold">✨</span>}
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
                        {customization.toppings.includes('French Macarons & Organic Berries') && <span className="text-sm">🍓</span>}
                        {customization.toppings.includes('Rainbow Sprinkles') && <span className="text-xs">✨✨</span>}
                        {customization.toppings.includes('Artisan Whipped Sugar Flowers') && <span className="text-xs">🌸</span>}
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
