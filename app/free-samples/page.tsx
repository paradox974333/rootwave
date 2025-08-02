"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent, useRef, useMemo, useLayoutEffect } from 'react';
import { Shield, ArrowRight, Mail, CheckCircle, Phone, Gift, Star, Recycle, LucideIcon, Menu, X, Home, Briefcase, MapPin, Package } from 'lucide-react';
import { toast } from "@/hooks/use-toast"; // Ensure this path is correct for your project

// --- CONSTANTS ---
const TARGET_WHATSAPP_NUMBER = '919244823663';
const COMPANY_NAME = "RootWave";
const WEBSITE_URL = "www.rootwave.org";
const DATA_SUBMISSION_WEBHOOK_URL = 'https://hook.eu2.make.com/clrhjur8lnbh1hlkq9ecbivb4tkboyog';

const HEADER_HEIGHT_PX = 64; // Corresponds to h-16 in Tailwind (4rem * 16px/rem = 64px)
const FIXED_BOTTOM_CTA_OFFSET_PX = 35; // Offset from the bottom for the fixed CTA (e.g., 24px)
const SCROLL_TO_SECTION_OFFSET_PX = HEADER_HEIGHT_PX + 16; // Header height + extra margin for visual comfort

// --- TYPE DEFINITIONS ---
interface EnvironmentalBenefit {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
}

interface ProductVariant {
  id: string;
  size: string;
  use: string;
  icon: string; // Emoji
  image: string;
  description: string;
}

// --- DATA ---
const siteInfo = {
  slogan: "ROOTWAVE PREMIUM RICE STRAWS",
  websiteName: "RootWave",
  websiteUrl: WEBSITE_URL,
  brandIntro: "RootWave creates bio-based alternatives from agricultural rice waste, promoting a circular economy and a healthier planet.",
  logoPath: "/logo icon -svg-01.png",
  environmentalBenefits: [
    { id: 'benefit-zero-waste', icon: Recycle, title: "Zero Waste Cycle", desc: "Utilizes agricultural by-products, turning waste into value.", color: "emerald" },
    { id: 'benefit-eco-friendly', icon: Shield, title: "Purely Eco-Friendly", desc: "Crafted with no plastics or synthetic materials, kind to Earth.", color: "green" },
    { id: 'benefit-biodegradable', icon: Star, title: "Rapidly Biodegradable", desc: "Decomposes naturally in weeks, not centuries.", color: "yellow" },
    { id: 'benefit-safe-vegan', icon: Shield, title: "Safe, Vegan & Edible", desc: "Food-grade, gluten-free, cruelty-free, and even edible.", color: "blue" }
  ] as EnvironmentalBenefit[],
  productVariants: [
    { id: 'prod-6.5mm', size: '6.5mm', use: 'Water, Juice, Tea, Soda', icon: '💧', image: '/6.png', description: 'Perfect for everyday beverages and light drinks' },
    { id: 'prod-8mm', size: '8mm', use: 'Smoothies, Milkshakes', icon: '🥤', image: '/8.png', description: 'Ideal for medium-thick beverages and protein shakes' },
    { id: 'prod-10mm', size: '10mm', use: 'Thick Shakes, Fruit Blends', icon: '🍓', image: '/10.png', description: 'Great for thick smoothies and fruit-based drinks' },
    { id: 'prod-13mm', size: '13mm', use: 'Bubble Tea, Jelly Drinks', icon: '🧋', image: '/13.png', description: 'Perfect for bubble tea and drinks with toppings' }
  ] as ProductVariant[],
  vsPlastic: "Plastic: Non-biodegradable (400+ yrs), fossil fuel-based, pollutes ecosystems. Our Straws: Biodegradable (weeks), plant-based, nourishes soil.",
  vsPaper: "Paper: Often soggy, impacts taste, may contain non-compostable coatings. Our Straws: Durable, neutral taste, 100% home compostable.",
  contactEmail: "info@rootwave.org",
};

const BUSINESS_TYPES = [
  { value: '', label: 'Select type...' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'bar', label: 'Bar/Pub' },
  { value: 'caterer', label: 'Caterer' },
  { value: 'distributor', label: 'Distributor/Wholesaler' },
  { value: 'retailer', label: 'Retailer' },
  { value: 'event_organizer', label: 'Event Organizer' },
  { value: 'individual', label: 'individual' },
] as const;

type FormData = {
  name: string;
  email: string;
  phone: string;
  pincode: string;
  address: string;
  businessType: typeof BUSINESS_TYPES[number]['value'] | '';
  strawSizes: string[];
  message: string;
};

type FormFieldConfig = {
  label: string;
  name: keyof FormData;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'multiselect';
  placeholder: string;
  autocomplete?: string;
  icon?: LucideIcon;
  options?: ReadonlyArray<{ value: string; label: string }>;
  required?: boolean;
}

const FORM_FIELDS_CONFIG: FormFieldConfig[] = [
  { label: 'Name', name: 'name', type: 'text', placeholder: 'Your full name', autocomplete: 'name', required: true },
  { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com', autocomplete: 'email', required: true },
  { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX', autocomplete: 'tel', required: true },
  { label: 'Pincode', name: 'pincode', type: 'text', placeholder: 'e.g., 110001', autocomplete: 'postal-code', icon: MapPin, required: true },
  { label: 'Full Address', name: 'address', type: 'textarea', placeholder: 'Your full delivery address', autocomplete: 'street-address', icon: Home, required: true },
  { label: 'Type of Business', name: 'businessType', type: 'select', placeholder: '', autocomplete: 'organization-type', options: BUSINESS_TYPES, icon: Briefcase, required: true },
  { label: 'Straw Sizes Required', name: 'strawSizes', type: 'multiselect', placeholder: '', icon: Package, options: siteInfo.productVariants.map(p => ({ value: p.size, label: p.size })), required: true },
  { label: 'Message', name: 'message', type: 'textarea', placeholder: 'Any specific requirements or questions? (Optional)', required: false },
];

// --- UTILITY FUNCTIONS ---
const scrollToId = (targetId: string, offset: number = SCROLL_TO_SECTION_OFFSET_PX) => {
  const element = document.getElementById(targetId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

// --- UI COMPONENTS ---

const Header: React.FC<{ onCTAClick: () => void }> = React.memo(({ onCTAClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
  
  const handleNavLinkClick = useCallback((targetId: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
    if (event) event.preventDefault();
    setIsMobileMenuOpen(false);
    scrollToId(targetId);
  }, []);

  const handleSamplesClick = useCallback((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onCTAClick();
  }, [onCTAClick]);

  return (
    <header className="fixed top-0 w-full z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <a href="#" onClick={(e) => {e.preventDefault(); window.scrollTo({top:0, behavior: 'smooth'});}} className="flex items-center space-x-3" aria-label="Go to homepage">
          <img src={siteInfo.logoPath} alt={`${COMPANY_NAME} Logo`} className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg text-gray-800">{COMPANY_NAME}</span>
        </a>
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
          <a href="#products" onClick={(e) => handleNavLinkClick('products', e)} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">Products</a>
          <a href="#benefits" onClick={(e) => handleNavLinkClick('benefits', e)} className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">Benefits</a>
          <a href="#samples" className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors" onClick={handleSamplesClick}>Samples</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button onClick={handleSamplesClick} className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25">
            Free Samples
          </button>
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors" 
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-nav"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div 
        id="mobile-menu-nav"
        className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="px-4 py-4 space-y-3" aria-label="Mobile navigation">
          <a href="#products" className="block text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors" onClick={(e) => handleNavLinkClick('products', e)}>Products</a>
          <a href="#benefits" className="block text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors" onClick={(e) => handleNavLinkClick('benefits', e)}>Benefits</a>
          <a href="#samples" className="block text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors" onClick={handleSamplesClick}>Samples</a>
        </nav>
      </div>
    </header>
  );
});
Header.displayName = 'Header';


const FreeBanner: React.FC<{ onCTAClick: () => void }> = React.memo(({ onCTAClick }) => (
  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-4 text-center cursor-pointer hover:from-emerald-600 hover:to-green-700 transition-all duration-300" onClick={onCTAClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onCTAClick()}>
    <p className="flex items-center justify-center gap-2 text-sm font-semibold animate-pulse">
      <Gift className="h-4 w-4" aria-hidden="true" />
      <span>🎉 Limited Time: Free Sample Campaign Active - Get Yours Now!</span>
    </p>
  </div>
));
FreeBanner.displayName = 'FreeBanner';


const HeroSection: React.FC<{ onCTAClick: () => void }> = React.memo(({ onCTAClick }) => {
  const [showFixedCta, setShowFixedCta] = useState(false);
  const [ctaOriginalDimensions, setCtaOriginalDimensions] = useState({ width: 0, height: 0, left: 0 }); // `left` is still measured but not used for bottom-center positioning

  const originalCtaButtonRef = useRef<HTMLButtonElement>(null);
  const sampleFormSectionRef = useRef<HTMLElement | null>(null); // To hide CTA when form is visible

  useLayoutEffect(() => {
    const measureElements = () => {
      if (originalCtaButtonRef.current) {
        const rect = originalCtaButtonRef.current.getBoundingClientRect();
        if (rect.width !== ctaOriginalDimensions.width || rect.height !== ctaOriginalDimensions.height || rect.left !== ctaOriginalDimensions.left) {
          setCtaOriginalDimensions({ width: rect.width, height: rect.height, left: rect.left });
        }
      }
    };
    measureElements();
    if (!sampleFormSectionRef.current) {
      sampleFormSectionRef.current = document.getElementById('samples');
    }
    window.addEventListener('resize', measureElements, { passive: true });
    return () => window.removeEventListener('resize', measureElements);
  }, [ctaOriginalDimensions.width, ctaOriginalDimensions.height, ctaOriginalDimensions.left]);

  const handleScroll = useCallback(() => {
    if (!originalCtaButtonRef.current) return;

    const currentOriginalButtonRect = originalCtaButtonRef.current.getBoundingClientRect();
    
    // Condition for showing the fixed bottom CTA:
    // Show if the original button has scrolled up past the fixed header.
    const originalButtonScrolledPastHeader = currentOriginalButtonRect.top < HEADER_HEIGHT_PX;

    let formSectionVisible = false;
    if (sampleFormSectionRef.current) { // Ensure ref is populated before using
      const formRect = sampleFormSectionRef.current.getBoundingClientRect();
      // Consider form visible if its top is within 85% of viewport height and bottom is below 15% of viewport height
      formSectionVisible = formRect.top < window.innerHeight * 0.85 && formRect.bottom > window.innerHeight * 0.15;
    }
    
    // The fixed bottom CTA should show if the original button has scrolled past the header
    // AND the sample form section is not yet significantly visible.
    const newShowFixedCtaState = originalButtonScrolledPastHeader && !formSectionVisible;

    if (showFixedCta !== newShowFixedCtaState) {
      setShowFixedCta(newShowFixedCtaState);
    }
  }, [showFixedCta]); // HEADER_HEIGHT_PX is stable. Refs are stable. `sampleFormSectionRef` content is stable.

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const ctaButtonClasses = "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-1";
  // For the fixed button, we don't want the hover: -translate-y-1 if it causes jitter.
  const fixedCtaButtonClasses = "bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-3 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25";


  const handleViewProductsClick = useCallback(() => {
    scrollToId('products');
  }, []);

  return (
    <>
      <section className="relative pt-24 pb-20 md:pt-32 min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden -z-10"> 
          <div className="absolute -top-40 -right-40 w-80 h-80 md:w-96 md:h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-96 md:h-96 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        <div className="relative text-center px-4 max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-emerald-200">
            <Gift className="h-4 w-4" aria-hidden="true" />
            <span>Free samples available nationwide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight balance-text">{siteInfo.slogan}</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed max-w-3xl mx-auto font-light balance-text">{siteInfo.brandIntro}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                  ref={originalCtaButtonRef}
                  onClick={onCTAClick}
                  className={`${ctaButtonClasses} transition-opacity duration-150 ease-in-out`}
                  style={{
                    opacity: showFixedCta ? 0 : 1,
                    visibility: showFixedCta ? 'hidden' : 'visible', // Keeps space in layout, fades out
                    pointerEvents: showFixedCta ? 'none' : 'auto',
                  }}
              >
                  <span>Request Free Samples</span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true"/>
              </button>
              <button
                  onClick={handleViewProductsClick}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold px-8 py-4 rounded-2xl transition-colors duration-300 border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50"
              >
                  View Products
              </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            {siteInfo.environmentalBenefits.map((benefit) => (
              <div key={benefit.id} className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 hover:bg-white/90 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-${benefit.color}-100 rounded-xl flex items-center justify-center mb-3`}>
                  <benefit.icon className={`h-6 w-6 text-${benefit.color}-600`} aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight">{benefit.title}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">No payment required • Free nationwide shipping • 48-hour dispatch</p>
        </div>
      </section>

      {/* Fixed Bottom CTA Button */}
      {ctaOriginalDimensions.width > 0 && ( // Ensure dimensions are measured before rendering
        <button
          onClick={onCTAClick}
          className={`${fixedCtaButtonClasses} fixed`}
          style={{
            bottom: `${FIXED_BOTTOM_CTA_OFFSET_PX}px`, // Positioned at the bottom
            left: `50%`,                               // Centered horizontally
            width: `${ctaOriginalDimensions.width}px`,  // Maintains original button's width
            height: `${ctaOriginalDimensions.height}px`,// Maintains original button's height
            zIndex: 40, 
            opacity: showFixedCta ? 1 : 0,             // Fades in/out
            transform: 'translateX(-50%) translateZ(0px)', // translateX for centering, translateZ for layer promotion
            pointerEvents: showFixedCta ? 'auto' : 'none',
            transitionProperty: 'opacity',              // Only animate opacity
            transitionDuration: '150ms',                // Quick fade
            transitionTimingFunction: 'ease-in-out',
          }}
          aria-label="Request Free Samples Sticky Bottom Button"
        >
          <span>Request Free Samples</span>
          <ArrowRight className="h-5 w-5" aria-hidden="true"/>
        </button>
      )}
    </>
  );
});
HeroSection.displayName = 'HeroSection';


interface ProductCardProps {
  product: ProductVariant;
  onCTAClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({ product, onCTAClick }) => (
  <div className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 transition-all duration-500 transform hover:-translate-y-2 flex flex-col">
    <div className="relative overflow-hidden">
      <img src={product.image} alt={`${product.size} ${siteInfo.websiteName} Rice Straw`} loading="lazy" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-emerald-600">{product.icon} {product.size}</div>
    </div>
    <div className="p-6 text-center flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-gray-900">{product.size} Rice Straw</h3>
      <p className="text-gray-600 text-sm mb-3 font-medium">{product.use}</p>
      <p className="text-gray-500 text-xs mb-6 leading-relaxed flex-grow">{product.description}</p>
      <button
        onClick={onCTAClick}
        className="w-full mt-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-md border border-emerald-200 hover:border-emerald-300">
        Get FREE Sample
      </button>
    </div>
  </div>
));
ProductCard.displayName = 'ProductCard';


const ProductShowcase: React.FC<{ onCTAClick: () => void }> = React.memo(({ onCTAClick }) => (
  <section id="products" className="py-20 md:py-24 bg-gradient-to-br from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight balance-text">Perfect Size for Every Sip</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed balance-text">Our diverse range ensures the ideal straw for any beverage. All available as <span className="font-bold text-emerald-600">complimentary {siteInfo.websiteName} samples</span>.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {siteInfo.productVariants.map((product) => (
          <ProductCard key={product.id} product={product} onCTAClick={onCTAClick} />
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-100 shadow-lg">
          <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5" aria-hidden="true" />
            The Superior Eco-Choice
          </h3>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p><span className="font-semibold text-gray-900">vs. Plastic:</span> {siteInfo.vsPlastic}</p>
            <p><span className="font-semibold text-gray-900">vs. Paper:</span> {siteInfo.vsPaper}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
));
ProductShowcase.displayName = 'ProductShowcase';


const BenefitsSection: React.FC = React.memo(() => (
  <section id="benefits" className="py-20 md:py-24 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 balance-text">Why Choose RootWave?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto balance-text">Experience the perfect blend of sustainability, functionality, and innovation with every sip.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {siteInfo.environmentalBenefits.map((benefit) => (
          <div key={benefit.id} className="flex items-start gap-6 p-8 bg-gray-50 rounded-3xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
            <div className={`w-16 h-16 bg-${benefit.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));
BenefitsSection.displayName = 'BenefitsSection';


const SampleForm: React.FC<{
  formData: FormData;
  isFormValid: boolean;
  onValueChange: (name: keyof FormData, value: string | string[]) => void;
  onSubmit: (e: FormEvent) => void;
  isSubmitting: boolean;
  submissionStatus: 'idle' | 'success' | 'error' | 'webhook_error_csv_success';
}> = React.memo(({ formData, isFormValid, onValueChange, onSubmit, isSubmitting, submissionStatus }) => {
  
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onValueChange(e.target.name as keyof FormData, e.target.value);
  }, [onValueChange]);

  const handleMultiSelectChange = useCallback((optionValue: string) => {
    const currentSizes = formData.strawSizes;
    const newSizes = currentSizes.includes(optionValue)
      ? currentSizes.filter(size => size !== optionValue)
      : [...currentSizes, optionValue];
    onValueChange('strawSizes', newSizes);
  }, [formData.strawSizes, onValueChange]);

  return (
    <section id="samples" className="py-20 md:py-24 bg-gradient-to-br from-emerald-50 to-green-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Gift className="h-10 w-10 text-emerald-600" aria-hidden="true" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 balance-text">Request Free Samples</h2>
          <p className="text-gray-600 leading-relaxed balance-text">We'll send you a complete sample pack at no cost with free nationwide shipping.(if individual means it includes shipping cost)</p>
        </div>
        <form onSubmit={onSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 space-y-6">
          <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
            <p className="text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              Free campaign active - No payment required
            </p>
          </div>
          {FORM_FIELDS_CONFIG.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                {field.icon && <field.icon className="inline h-4 w-4 mr-1 mb-0.5 text-gray-500" aria-hidden="true" />} {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  id={field.name}
                  value={formData[field.name as 'address' | 'message']}
                  onChange={handleInputChange}
                  required={field.required}
                  rows={3}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none text-sm placeholder-gray-400 bg-gray-50 focus:bg-white"
                  disabled={isSubmitting}
                  autoComplete={field.autocomplete}
                  aria-required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  name={field.name}
                  id={field.name}
                  value={formData[field.name as 'businessType']}
                  onChange={handleInputChange}
                  required={field.required}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white appearance-none" // `appearance-none` for custom arrow if added
                  disabled={isSubmitting}
                  autoComplete={field.autocomplete}
                  aria-required={field.required}
                >
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === 'multiselect' ? (
                <fieldset className="p-3 border border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <legend className="sr-only">{field.label}</legend>
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map(option => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleMultiSelectChange(option.value)}
                        disabled={isSubmitting}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${formData.strawSizes.includes(option.value)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                          } ${isSubmitting ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                          aria-pressed={formData.strawSizes.includes(option.value)}
                        >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name as Exclude<keyof FormData, 'address' | 'businessType' | 'message' | 'strawSizes'>]}
                  onChange={handleInputChange}
                  required={field.required}
                  autoComplete={field.autocomplete}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white"
                  placeholder={field.placeholder}
                  disabled={isSubmitting}
                  aria-required={field.required}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${isSubmitting
                ? 'bg-gray-400 text-gray-700 cursor-wait'
                : isFormValid
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <span>Send Sample Request</span>
                <CheckCircle className="h-5 w-5" aria-hidden="true" />
              </>
            )}
          </button>
          <div role="status" aria-live="polite">
            {submissionStatus === 'success' && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm text-center">
                Request sent successfully! We'll contact you on WhatsApp. Your info has been recorded.
              </div>
            )}
            {submissionStatus === 'webhook_error_csv_success' && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm text-center">
                Request sent! We'll contact you. A CSV backup was made.
              </div>
            )}
            {submissionStatus === 'error' && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm text-center">
                Failed to record request. WhatsApp may have opened. Please try again or send details via WhatsApp if needed.
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            We prioritize your privacy. We'll contact you via WhatsApp regarding your sample request. Your details will be recorded for processing. In case of system issues, a CSV copy of your request may be downloaded to your device for backup.
          </p>
        </form>
      </div>
    </section>
  );
});
SampleForm.displayName = 'SampleForm';


const Footer: React.FC = React.memo(() => (
  <footer className="bg-gray-900 text-gray-300 py-16">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center mb-6">
          <img src={siteInfo.logoPath} alt={`${COMPANY_NAME} Logo`} className="h-12 w-12 object-contain mr-3" />
          <span className="text-2xl font-bold text-white">{COMPANY_NAME}</span>
        </div>
        <p className="text-gray-400 max-w-md mx-auto mb-8 leading-relaxed">Creating sustainable packaging solutions for a greener tomorrow.</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
          <a href={`mailto:${siteInfo.contactEmail}`} className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
            <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
            {siteInfo.contactEmail}
          </a>
          <a href={`https://wa.me/${TARGET_WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2 group">
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
            WhatsApp Support
          </a>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center">
        <p className="text-sm text-gray-400 mb-2">© {new Date().getFullYear()} {COMPANY_NAME} • <a href={`https://${WEBSITE_URL}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">{WEBSITE_URL}</a></p>
        <p className="text-xs text-emerald-400 font-medium">Sustainable packaging solutions • Made in India</p>
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';


// --- MAIN PAGE COMPONENT ---
const FreeSamplesPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', pincode: '', address: '',
    businessType: '', strawSizes: [], message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error' | 'webhook_error_csv_success'>('idle');

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.style.scrollBehavior = 'smooth';
    document.title = `${COMPANY_NAME} - Premium Rice Straws | Free Samples Available`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `Get your free samples of ${COMPANY_NAME}'s premium, biodegradable rice straws. Made from natural ingredients. Sustainable packaging solutions for eco-conscious businesses.`);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const isFormValid = useMemo(() => {
    const { name, email, phone, pincode, address, businessType, strawSizes } = formData;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?[0-9\s-()]{7,15}$/;
    const pincodeRegex = /^[1-9][0-9]{5}$/;

    return !!(
      name.trim().length > 1 &&
      emailRegex.test(email.trim()) &&
      phoneRegex.test(phone.trim()) &&
      pincodeRegex.test(pincode.trim()) &&
      address.trim().length > 5 &&
      businessType !== '' &&
      strawSizes.length > 0
    );
  }, [formData]);

  const handleFormValueChange = useCallback((name: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submissionStatus !== 'idle') setSubmissionStatus('idle');
  }, [submissionStatus]);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionStatus('idle');

    const businessTypeLabel = BUSINESS_TYPES.find(bt => bt.value === formData.businessType)?.label || formData.businessType;
    const tempSubmissionDataForMsg = {
      ...formData,
      name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim(),
      pincode: formData.pincode.trim(), address: formData.address.trim(),
      businessType: businessTypeLabel, strawSizes: formData.strawSizes.join(', '),
      message: formData.message.trim() || 'N/A',
    };

    const whatsappMessage = `*${COMPANY_NAME} - Free Sample Request (Campaign)*\n\nName: ${tempSubmissionDataForMsg.name}\nEmail: ${tempSubmissionDataForMsg.email}\nPhone: ${tempSubmissionDataForMsg.phone}\nPincode: ${tempSubmissionDataForMsg.pincode}\nAddress: ${tempSubmissionDataForMsg.address}\nBusiness Type: ${tempSubmissionDataForMsg.businessType}\nStraw Sizes: ${tempSubmissionDataForMsg.strawSizes}\n${tempSubmissionDataForMsg.message && tempSubmissionDataForMsg.message !== 'N/A' ? `Message: ${tempSubmissionDataForMsg.message}` : ''}\n\nRequest from website: ${WEBSITE_URL}`;
    const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    try {
      const waWindow = window.open(whatsappUrl, '_blank');
      if (!waWindow && !navigator.userAgent.includes("WhatsApp")) { // Check if not already in WhatsApp browser
        toast({ title: "Popup Blocked", description: "Please allow popups for WhatsApp, or contact us manually.", variant: "destructive"});
      }
    } catch (err) {
      console.error("Error opening WhatsApp:", err);
      toast({ title: "Could not open WhatsApp", description: "Please try contacting us manually.", variant: "destructive"});
    }

    const submissionData = {
      ...formData,
      name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim(),
      pincode: formData.pincode.trim(), address: formData.address.trim(),
      strawSizes: formData.strawSizes.join(', '), message: formData.message.trim() || 'N/A',
      submittedAt: new Date().toISOString(), source: WEBSITE_URL, campaign: "Free Sample Request",
    };

    let webhookSuccess = false;
    let csvFallbackUsed = false;

    if (DATA_SUBMISSION_WEBHOOK_URL && DATA_SUBMISSION_WEBHOOK_URL.trim() !== '') {
      try {
        const response = await fetch(DATA_SUBMISSION_WEBHOOK_URL, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData), mode: 'cors'
        });
        webhookSuccess = response.ok;
        if (!response.ok) { console.error("Webhook submission failed:", response.status, await response.text()); }
        toast({
          title: response.ok ? "Success!" : "Data Recording Issue",
          description: response.ok ? "Your sample request has been submitted." : "Data recording issues. Attempting backup. WhatsApp should have opened.",
          variant: response.ok ? "default" : "destructive",
        });
      } catch (error) {
        console.error("Webhook submission error:", error);
        toast({ title: "Data Recording Failed", description: "Could not connect to data service. Attempting backup. WhatsApp should have opened.", variant: "destructive"});
      }
    } else {
        toast({ title: "Data Recording Skipped", description: "Webhook URL not set. WhatsApp should have opened." });
    }

    if (!webhookSuccess) {
      csvFallbackUsed = true;
      try {
        const headers = Object.keys(submissionData).join(",") + "\n";
        const escapeCsvField = (val: string | string[] | undefined) => `"${(Array.isArray(val) ? val.join(";") : val || "").replace(/"/g, '""')}"`;
        const row = (Object.values(submissionData) as Array<string|string[]>).map(val => escapeCsvField(val)).join(",") + "\n";
        
        const csvContent = headers + row;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `RootWave_Sample_Request_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`);
          link.style.visibility = 'hidden'; document.body.appendChild(link);
          link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
          toast({ title: "Local Backup Created", description: "A CSV backup of your request has been downloaded." });
        } else {
          console.warn("CSV download not supported. Backup not auto-downloaded."); csvFallbackUsed = false; 
        }
      } catch (csvError) {
        console.error("CSV Backup Error:", csvError); csvFallbackUsed = false;
        toast({ title: "CSV Backup Failed", description: "Could not create local backup.", variant: "destructive" });
      }
    }

    setIsSubmitting(false);
    setSubmissionStatus(webhookSuccess ? 'success' : csvFallbackUsed ? 'webhook_error_csv_success' : 'error');
    if (webhookSuccess || csvFallbackUsed) {
      setFormData({ name: '', email: '', phone: '', pincode: '', address: '', businessType: '', strawSizes: [], message: '' });
    }
  }, [formData, isFormValid, isSubmitting]);

  const scrollToSamples = useCallback(() => {
    scrollToId('samples');
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <Header onCTAClick={scrollToSamples} />
      <main className="pt-16"> {/* Fixed header is h-16 (64px) */}
        <FreeBanner onCTAClick={scrollToSamples} />
        <HeroSection onCTAClick={scrollToSamples} />
        <ProductShowcase onCTAClick={scrollToSamples} />
        <BenefitsSection />
        <SampleForm
          formData={formData}
          isFormValid={isFormValid}
          onValueChange={handleFormValueChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submissionStatus={submissionStatus}
        />
      </main>
      <Footer />
      <style jsx global>{`
        .balance-text {
          text-wrap: balance;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s infinite ease-in-out;
        }
        .animation-delay-2000 {
            animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default FreeSamplesPage;