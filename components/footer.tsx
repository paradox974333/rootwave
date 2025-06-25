import { Separator } from "@/components/ui/separator"; // Assuming this path is correct
import { Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image"; // Renamed to avoid conflict if 'Image' is globally used

export function Footer() {
  // Data for Quick Access, adapted for Next/Link
  // Assumes your page sections have IDs like "about", "products", "contact"
  // "Home" links to the root page.
  const quickAccessNavItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Contact", href: "/#contact" },
    { name: "Blogs", href: "/blogs" },
  ];

  // Data for Signature Collection
  const signatureCollectionItems = ["6.5mm Rice Straws", "8mm Rice Straws", "10mm Rice Straws", "13mm Rice Straws"];

  return (
    <footer className="relative bg-gradient-to-br from-gray-800 via-emerald-900 to-blue-900 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden mt-auto">
      {/* Background elements from the second footer design */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 sm:mb-12 md:mb-16">
          
          {/* Column 1: Rootwave Info (from second footer design) */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 p-1">
                <NextImage src="/logo icon -svg-01.png" alt="Rootwave Logo" width={36} height={36} className="w-full h-full" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Rootwave</h3>
            </div>
            <p className="text-emerald-200/90 text-sm sm:text-base font-medium">Sip Sustainably, Live Luxuriously.</p>
            <p className="text-emerald-300/80 text-xs sm:text-sm leading-relaxed">
              Pioneering the future of sustainability through innovative agricultural transformation.
            </p>
          </div>

          {/* Column 2: Quick Access (Styled as per the first footer design) */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-black text-lg sm:text-xl md:text-2xl text-white">Quick Access</h4>
            <ul className="space-y-3 sm:space-y-4 text-emerald-200">
              {quickAccessNavItems.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} passHref legacyBehavior>
                    <a className="hover:text-white cursor-pointer transition-colors font-semibold text-sm sm:text-base md:text-lg group">
                      <span className="group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300 inline-block">
                        {item.name}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Signature Collection (Styled as per the first footer design) */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-black text-lg sm:text-xl md:text-2xl text-white">Signature Collection</h4>
            <ul className="space-y-3 sm:space-y-4 text-emerald-200">
              {signatureCollectionItems.map((item, index) => (
                <li key={index} className="font-semibold text-sm sm:text-base md:text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Column 4: Get In Touch (from second footer design) */}
          <div className="space-y-4 md:space-y-6">
            <h4 className="font-semibold text-lg sm:text-xl text-white tracking-wide">Get In Touch</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { icon: Mail, text: "info@rootwave.org", href: "mailto:info@rootwave.org" },
                { icon: Phone, text: "+91 77600 21026", href: "tel:+917760021026" },
                { icon: MessageCircle, text: "WhatsApp Us", href: "https://wa.me/917760021026?text=Hi%20Rootwave%2C%20I'm%20interested%20in%20your%20products." }
              ].map((contactItem, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <contactItem.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
                  </div>
                  <a
                    href={contactItem.href}
                    target={contactItem.href.startsWith('http') ? '_blank' : undefined}
                    rel={contactItem.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-emerald-200/90 hover:text-white transition-colors duration-200 text-sm sm:text-base break-all"
                  >
                    {contactItem.text}
                  </a>
                </li>
              ))}
               <li className="font-medium text-sm sm:text-base text-emerald-300/80 pt-1">🇮🇳 Proudly Made in India</li>
            </ul>
          </div>
        </div>

        {/* Separator and Copyright from the second footer design */}
        <Separator className="bg-white/20 h-px my-8 sm:my-10" />
        <div className="text-center">
          <p className="text-emerald-300/80 text-xs sm:text-sm">
            © {new Date().getFullYear()} Rootwave. All Rights Reserved.
          </p>
          <p className="text-emerald-400/70 text-xs mt-1">Sustainable luxury for a greener tomorrow.</p>
        </div>
      </div>
    </footer>
  );
}