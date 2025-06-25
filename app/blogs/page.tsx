// app/blogs/page.tsx

import { Header } from "@/components/header"; // Your existing Header component
import { Separator } from "@/components/ui/separator"; // For Footer
import { CalendarDays, Clock, Mail, Phone, MessageCircle, BookOpen, UserCircle } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image"; // Use NextImage for consistency
// REMOVED: import { BlogGlobalStyles } from "@/components/blog-global-styles"; 

// This page is a Server Component.
export default async function SimpleBlogPage() {
  // Sample Blog Post Data (hardcoded here for simplicity)
  const samplePost = {
    title: "Our Journey Towards Sustainable Innovation",
    date: "February 10, 2024",
    author: "The Rootwave Team",
    readTimeMinutes: 6,
    image: "/blog-images/sample-blog-cover.jpg", // Example path: ensure public/blog-images/sample-blog-cover.jpg exists
    tags: ["Sustainability", "Innovation", "Rootwave", "Eco-Friendly"],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100 flex flex-col antialiased">
      {/* REMOVED: <BlogGlobalStyles />  */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section for Blog Page */}
        <section className="relative py-20 sm:py-28 md:py-32 text-center px-4 overflow-hidden">
          {/* You can keep these simpler background divs or remove them if you don't want any animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-blue-500/10"></div>
          {/* If you remove BlogGlobalStyles, these animated divs won't have their pulse animation defined
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-300/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow animation-delay-2000"></div> 
          */}


          <div className="container mx-auto relative z-10">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-emerald-100/70 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200/80">
              <BookOpen className="w-4 h-4 mr-2" />
              Our Thoughts
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5 tracking-tight text-gray-800">
              Rootwave <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed">
              Sharing our journey, insights, and passion for a sustainable future.
            </p>
          </div>
        </section>

        {/* Single Blog Post Content Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
          <div className="container mx-auto max-w-4xl bg-white rounded-xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-200/80">
            <article className="prose prose-lg lg:prose-xl max-w-none prose-emerald 
                                prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-800
                                prose-p:text-gray-700 prose-li:text-gray-700
                                prose-a:text-emerald-600 hover:prose-a:text-emerald-700
                                prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/70 prose-blockquote:text-emerald-800
                                prose-figure:my-8 prose-img:rounded-lg prose-img:shadow-md">
              {/* Post Header */}
              <header className="mb-10 border-b border-gray-200 pb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 !leading-tight">
                  {samplePost.title}
                </h1>
                <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 sm:space-x-6">
                  <div className="flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{samplePost.date}</span>
                  </div>
                  <div className="flex items-center">
                    <UserCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>By {samplePost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>{samplePost.readTimeMinutes} min read</span>
                  </div>
                </div>
                {samplePost.tags && samplePost.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {samplePost.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              {/* Optional Cover Image */}
              {samplePost.image && (
                <figure className="!my-8">
                  <NextImage
                    src={samplePost.image}
                    alt={`Cover image for ${samplePost.title}`}
                    width={1200}
                    height={675}
                    className="w-full h-auto rounded-xl shadow-lg"
                    priority
                  />
                </figure>
              )}

              {/* Blog Post Content (Hardcoded JSX) */}
              <div className="mt-8">
                <p className="mb-6 text-lg leading-relaxed">
                  Welcome to the Rootwave blog! We're excited to share our journey and insights into the world of sustainable innovation. Our mission has always been to find creative and impactful solutions to environmental challenges, starting with the humble drinking straw and expanding our vision to broader packaging and material science.
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-8">
                  The Genesis of an Idea
                </h2>
                <p className="mb-6 text-lg leading-relaxed">
                  It all began with a simple question: how can we reduce plastic waste in a way that is not just eco-friendly but also enhances the user experience? This led us to explore agricultural byproducts, specifically rice, as a viable alternative. The development of our edible rice straws was a breakthrough, offering a product that is sturdy, pleasant to use, and leaves zero waste if consumed or composted.
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  Our commitment doesn't stop at straws. We are continuously researching and developing new materials derived from natural, renewable resources. The goal is to create a circular economy where products return to the earth beneficially or are repurposed effectively.
                </p>
                <blockquote className="my-8 p-6 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 italic rounded-r-lg">
                  "Sustainability is not a trend; it's a responsibility. At Rootwave, we embrace this responsibility by innovating with nature, for nature."
                </blockquote>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 mt-8">
                  Looking Ahead
                </h2>
                <p className="mb-6 text-lg leading-relaxed">
                  The future is full of possibilities. We envision a world where sustainable choices are the default, not the alternative. Through this blog, we'll share updates on our projects, discuss challenges and opportunities in the green tech space, and highlight the incredible work being done by others in the sustainability community.
                </p>
                <p className="text-lg leading-relaxed">
                  Thank you for joining us on this important journey. We look forward to sharing more with you soon!
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-gray-800 via-emerald-900 to-blue-900 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden mt-auto">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-r from-emerald-600/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-l from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-10 sm:mb-12 md:mb-16">
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
            <div className="space-y-4 md:space-y-6">
              <h4 className="font-semibold text-lg sm:text-xl text-white tracking-wide">Quick Links</h4>
              <ul className="space-y-2.5 sm:space-y-3">
                {["Home", "About", "Products", "Blogs", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                        href={
                            item === 'Home' ? '/' :
                            (item === 'Blogs' ? '/blogs' : `/#${item.toLowerCase().replace(/\s+/g, '-')}`)
                        }
                        passHref
                        legacyBehavior
                    >
                      <a className="text-emerald-200/90 hover:text-white transition-colors duration-200 text-sm sm:text-base group">
                        <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                          {item}
                        </span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div className="space-y-4 md:space-y-6">
              <h4 className="font-semibold text-lg sm:text-xl text-white tracking-wide">Our Straws</h4>
              <ul className="space-y-2.5 sm:space-y-3 text-emerald-200/90 text-sm sm:text-base">
                <li>6.5mm Rice Straws</li>
                <li>8mm Rice Straws</li>
                <li>10mm Rice Straws</li>
                <li>13mm Rice Straws</li>
              </ul>
            </div>
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
          <Separator className="bg-white/20 h-px my-8 sm:my-10" />
          <div className="text-center">
            <p className="text-emerald-300/80 text-xs sm:text-sm">
              © {new Date().getFullYear()} Rootwave. All Rights Reserved.
            </p>
            <p className="text-emerald-400/70 text-xs mt-1">Sustainable luxury for a greener tomorrow.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}