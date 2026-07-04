export type CategoryType = 'cake' | 'brownie' | 'cupcake' | 'muffin' | 'tres_leches' | 'cookies';

export interface CakeCustomization {
  category: CategoryType;
  shape: string; // "Classic Round", "Sweet Heart", "Modern Square"
  size: string; // "Small (0.5kg)", "Medium (1kg)", "Large (2kg)", "Double Tier (3kg+)"
  baseFlavor: string; // "Vanilla Butter", "Rich Chocolate", "Red Velvet", "Butterscotch", "Strawberry Cream"
  baseColor: string; // Hex color or descriptive color code
  baseColorName: string; // "Millennial Pink", "Golden Vanilla", etc.
  dietary: string; // "Standard", "Eggless", "Gluten-Free", "Vegan", "Sugar-Free"
  fillings: string; // "Belgian Fudge", "Strawberry Cream", "Salted Caramel", "Nutella Blast", "None"
  sweetness: string; // "Balanced (Muted)", "Standard", "Extra Sweet", "Sugar-Free Stevia"
  frostingType: string; // "Whipped Cream", "Cream Cheese", "Buttercream", "Fondant"
  toppings: string[]; // List of toppings like "Confetti Sprinkles", "Fresh Berries", etc.
  occasion: string; // "Birthday", "Anniversary", "Celebration", etc.
  messageOnCake: string; // Up to 30 characters
  deliveryDate: string; // YYYY-MM-DD
  deliveryTimeSlot: string; // slot like "10:00 AM - 01:00 PM", etc.
  specialInstructions: string; // free text textarea
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryType: 'delivery' | 'pickup';
}

export interface Order {
  id: string; // "SWEET-XXXXX"
  customization: CakeCustomization;
  customer: CustomerDetails;
  totalPrice: number;
  status: 'Received' | 'Preparing' | 'Baking' | 'Ready for Delivery' | 'Completed' | 'Cancelled';
  createdAt: string; // date string
}

export const STEP_NAMES = [
  "Category Choice",
  "Shape Design",
  "Sizing & Portions",
  "Artisanal Flavour",
  "Dietary Preference",
  "Interior Layer Filling",
  "Sweetness Level",
  "Frosting Layer Type",
  "Gourmet Toppings",
  "Theme & Occasion",
  "Letter Message",
  "Booking Date & Slot",
  "Delivery & Client Details",
  "Review & Checkout"
];

export interface CakeBuilderOptionItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  code?: string; // for colors
}

export interface CakeBuilderOptions {
  sizes: CakeBuilderOptionItem[];
  flavors: CakeBuilderOptionItem[];
  colors: CakeBuilderOptionItem[];
  dietary: CakeBuilderOptionItem[];
  fillings: CakeBuilderOptionItem[];
  toppings: CakeBuilderOptionItem[];
  sweetness: CakeBuilderOptionItem[];
  frostings: CakeBuilderOptionItem[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface WebsiteConfig {
  heroBadge: string;
  heroTitleCursive: string;
  heroTitleGradient: string;
  heroDescription: string;
  aboutTag: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutMainTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  card1Title: string;
  card1Desc: string;
  card2Title: string;
  card2Desc: string;
  card3Title: string;
  card3Desc: string;
  card4Title: string;
  card4Desc: string;
  whatsappNumber?: string;
  whatsappMsgTemplate?: string;
  customerAutoMsg?: string;
}
