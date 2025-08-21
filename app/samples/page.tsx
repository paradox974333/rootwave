"use client";

import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent, useMemo } from 'react';
import { toast } from "@/hooks/use-toast"; // Ensure this path is correct for your project
import { Shield, ArrowRight, Mail, CheckCircle, Phone, Gift, Star, Recycle, LucideIcon, Menu, X, Home, Briefcase, MapPin, Package, Leaf } from 'lucide-react';

// --- CONSTANTS ---
const TARGET_WHATSAPP_NUMBER = '919244823663';
const COMPANY_NAME = "RootWave";
const WEBSITE_URL = "www.rootwave.org";
const DATA_SUBMISSION_WEBHOOK_URL = 'https://hook.eu2.make.com/clrhjur8lnbh1hlkq9ecbivb4tkboyog';

// --- TYPE DEFINITIONS ---
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

// --- DATA ---
const siteInfo = {
  productVariants: [
    { id: 'prod-6.5mm', size: '6.5mm', use: 'Water, Juice, Tea, Soda', icon: '💧', image: '/6.png', description: 'Perfect for everyday beverages and light drinks' },
    { id: 'prod-8mm', size: '8mm', use: 'Smoothies, Milkshakes', icon: '🥤', image: '/8.png', description: 'Ideal for medium-thick beverages and protein shakes' },
    { id: 'prod-10mm', size: '10mm', use: 'Thick Shakes, Fruit Blends', icon: '🍓', image: '/10.png', description: 'Great for thick smoothies and fruit-based drinks' },
    { id: 'prod-13mm', size: '13mm', use: 'Bubble Tea, Jelly Drinks', icon: '🧋', image: '/13.png', description: 'Perfect for bubble tea and drinks with toppings' }
  ],
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
  { value: 'individual', label: 'Individual' },
] as const;

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

// --- MAIN COMPONENT ---
const SampleRequestPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', pincode: '', address: '',
    businessType: '', strawSizes: [], message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error' | 'webhook_error_csv_success'>('idle');

  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.style.scrollBehavior = 'smooth';
    document.title = `${COMPANY_NAME} - Premium Rice Straws | Request Samples`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', `Request samples of ${COMPANY_NAME}'s premium, biodegradable rice straws. Made from natural ingredients. Sustainable packaging solutions for eco-conscious businesses. Note: Shipping costs apply.`);
    
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

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleFormValueChange(e.target.name as keyof FormData, e.target.value);
  }, [handleFormValueChange]);

  const handleMultiSelectChange = useCallback((optionValue: string) => {
    const currentSizes = formData.strawSizes;
    const newSizes = currentSizes.includes(optionValue)
      ? currentSizes.filter(size => size !== optionValue)
      : [...currentSizes, optionValue];
    handleFormValueChange('strawSizes', newSizes);
  }, [formData.strawSizes, handleFormValueChange]);

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

    const whatsappMessage = `*${COMPANY_NAME} - Sample Request*\n\nName: ${tempSubmissionDataForMsg.name}\nEmail: ${tempSubmissionDataForMsg.email}\nPhone: ${tempSubmissionDataForMsg.phone}\nPincode: ${tempSubmissionDataForMsg.pincode}\nAddress: ${tempSubmissionDataForMsg.address}\nBusiness Type: ${tempSubmissionDataForMsg.businessType}\nStraw Sizes: ${tempSubmissionDataForMsg.strawSizes}\n${tempSubmissionDataForMsg.message && tempSubmissionDataForMsg.message !== 'N/A' ? `Message: ${tempSubmissionDataForMsg.message}` : ''}\n\nNote: Shipping costs apply.\nRequest from website: ${WEBSITE_URL}`;
    const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    
    try {
      const waWindow = window.open(whatsappUrl, '_blank');
      if (!waWindow && !navigator.userAgent.includes("WhatsApp")) {
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
      submittedAt: new Date().toISOString(), source: WEBSITE_URL, campaign: "Sample Request",
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

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans antialiased selection:bg-green-500 selection:text-white">
      <main>
        <section className="py-20 md:py-24 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          
          <div className="max-w-lg mx-auto px-4 relative">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Leaf className="h-10 w-10 text-green-600" aria-hidden="true" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 via-gray-900 to-blue-600 bg-clip-text text-transparent mb-4 balance-text">
                Request Samples
              </h2>
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-1 bg-green-500 rounded-full"></div>
                <div className="w-6 h-1 bg-gray-300 rounded-full mx-2"></div>
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 leading-relaxed balance-text">
                Try our premium biodegradable rice straws. Request samples for your business today. Shipping costs apply.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 space-y-6 relative">
              {/* Accent border */}
              <div className="absolute -top-1 left-4 right-4 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
                <p className="text-green-700 font-semibold text-sm flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                  Shipping costs apply - We'll contact you with details
                </p>
              </div>
              
              {FORM_FIELDS_CONFIG.map(field => (
                <div key={field.name}>
                  <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.icon && <field.icon className="inline h-4 w-4 mr-1 mb-0.5 text-green-500" aria-hidden="true" />} 
                    {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-sm placeholder-gray-400 bg-gray-50 focus:bg-white hover:border-blue-300"
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white appearance-none hover:border-blue-300"
                      disabled={isSubmitting}
                      autoComplete={field.autocomplete}
                      aria-required={field.required}
                    >
                      {field.options?.map(option => (
                        <option key={option.value} value={option.value} disabled={option.value === ''}>{option.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'multiselect' ? (
                    <fieldset className="p-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 hover:border-blue-300">
                      <legend className="sr-only">{field.label}</legend>
                      <div className="flex flex-wrap gap-2">
                        {field.options?.map(option => (
                          <button
                            type="button"
                            key={option.value}
                            onClick={() => handleMultiSelectChange(option.value)}
                            disabled={isSubmitting}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-all duration-200 ${
                              formData.strawSizes.includes(option.value)
                                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white border-green-600 shadow-lg'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-400'
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
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm placeholder-gray-400 bg-gray-50 focus:bg-white hover:border-blue-300"
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
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-700 cursor-wait'
                    : isFormValid
                      ? 'bg-gradient-to-r from-green-600 via-green-500 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/25 hover:-translate-y-0.5 transform'
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
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </button>
              
              <div role="status" aria-live="polite">
                {submissionStatus === 'success' && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 border-2 border-green-200 rounded-lg text-sm text-center">
                    ✅ Request sent successfully! We'll contact you on WhatsApp. Your info has been recorded.
                  </div>
                )}
                {submissionStatus === 'webhook_error_csv_success' && (
                  <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 border-2 border-yellow-200 rounded-lg text-sm text-center">
                    ✅ Request sent! We'll contact you. A CSV backup was made.
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg text-sm text-center">
                    Failed to record request. WhatsApp may have opened. Please try again or send details via WhatsApp if needed.
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                We prioritize your privacy. We'll contact you via WhatsApp regarding your sample request. Your details will be recorded for processing. In case of system issues, a CSV copy of your request may be downloaded to your device for backup. Shipping costs apply.
              </p>
            </form>
          </div>
        </section>
      </main>
      
      <style jsx global>{`
        .balance-text {
          text-wrap: balance;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
};

export default SampleRequestPage;
