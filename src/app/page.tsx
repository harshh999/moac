"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import menuData from "@/data/menu.json";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Clock, Phone, MapPin, ChevronRight } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: string;
  veg: boolean;
}

interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("starter");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(menuData.categories);
  }, []);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };



  const openZomato = () => {
    window.open("https://zomato.onelink.me/xqzv/w7aifpkj", "_blank");
  };

  const openGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/14HcfYx9QQH84TyVA", "_blank");
  };

  const formatPriceOptions = (priceString: string) => {
    // Clean up the price string
    const cleanString = priceString.trim();

    // Check for complex patterns with colons and commas (Half/Full with Oil/Butter)
    if (cleanString.includes(':') && cleanString.includes(',')) {
      const result: any = {
        type: 'complex',
        sections: {}
      };

      // Split by comma to get size sections
      const sizeSections = cleanString.split(',').map(section => section.trim());

      sizeSections.forEach(section => {
        const [size, options] = section.split(':').map(part => part.trim());

        if (size && options) {
          // Split options by pipe and clean them
          const optionList = options.split('|').map(opt => opt.trim()).filter(opt => opt);

          if (!result.sections[size]) {
            result.sections[size] = [];
          }

          result.sections[size] = optionList;
        }
      });

      return result;
    }

    // Check for patterns with commas (Oil/Butter groups)
    if (cleanString.includes(',') && !cleanString.includes(':')) {
      const result: any = {
        type: 'grouped',
        sections: {}
      };

      // Split by comma to get groups
      const groups = cleanString.split(',').map(group => group.trim());

      groups.forEach((group, index) => {
        // Check if this group has pipe separators
        if (group.includes('|')) {
          const options = group.split('|').map(opt => opt.trim()).filter(opt => opt);
          result.sections[`Group ${index + 1}`] = options;
        } else {
          // Single option in this group
          result.sections[`Group ${index + 1}`] = [group];
        }
      });

      return result;
    }

    // Check for simple Half/Full pattern
    if (cleanString.includes('Half') || cleanString.includes('Full')) {
      const options = cleanString.split('|').map(opt => opt.trim()).filter(opt => opt);

      const halfOption = options.find(opt => opt.toLowerCase().includes('half'));
      const fullOption = options.find(opt => opt.toLowerCase().includes('full'));

      if (halfOption && fullOption) {
        return {
          type: 'halfFull',
          half: halfOption.replace(/half/i, '').trim(),
          full: fullOption.replace(/full/i, '').trim()
        };
      }
    }

    // Simple options with pipes
    if (cleanString.includes('|')) {
      const options = cleanString.split('|').map(opt => opt.trim()).filter(opt => opt);
      return {
        type: 'simple',
        options: options
      };
    }

    // Single option
    return {
      type: 'single',
      option: cleanString
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#8B0000] shadow-lg border-b border-[#6B0000]">
        <div className="px-3 sm:px-4 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            {/* Top Row: Logo and Restaurant Name */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full shadow-lg overflow-hidden border-2 border-white/30 bg-white flex items-center justify-center flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Mahi Omlette & Chinese Logo"
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full bg-white rounded-full flex items-center justify-center"><span class="text-[#8B0000] font-bold text-xs">MOC</span></div>';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg font-bold text-white leading-tight">
                  Mahi Omlette & Chinese
                </h1>
                <p className="text-xs text-white/80">
                  Where Taste Meets Tradition
                </p>
              </div>
            </div>

            {/* Bottom Row: Action Buttons */}
            <div className="flex gap-2 justify-center mb-4">
              <Button
                onClick={openGoogleMaps}
                className="bg-white/10 text-white hover:bg-white/20 font-semibold px-3 py-2 rounded-full text-xs shadow-md hover:shadow-lg transition-all duration-300 border border-white/30 flex-shrink-0"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Find Us
              </Button>
              <Button
                onClick={openZomato}
                className="bg-white text-[#8B0000] hover:bg-gray-100 font-semibold px-3 py-2 rounded-full text-xs shadow-md hover:shadow-lg transition-all duration-300 border-2 border-white/50 flex-shrink-0"
              >
                Order on Zomato
              </Button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center justify-between mb-4">
            {/* Logo and Restaurant Info */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full shadow-lg overflow-hidden border-2 border-white/30 bg-white flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Mahi Omlette & Chinese Logo"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full bg-white rounded-full flex items-center justify-center"><span class="text-[#8B0000] font-bold text-sm">MOC</span></div>';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  Mahi Omlette & Chinese
                </h1>
                <p className="text-sm text-white/80">
                  Where Taste Meets Tradition
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={openGoogleMaps}
                className="bg-white/10 text-white hover:bg-white/20 font-semibold px-3 py-2 rounded-full text-xs shadow-md hover:shadow-lg transition-all duration-300 border border-white/30"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Find Us
              </Button>
              <Button
                onClick={openZomato}
                className="bg-white text-[#8B0000] hover:bg-gray-100 font-semibold px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition-all duration-300 border-2 border-white/50"
              >
                Order on Zomato
              </Button>
            </div>
          </div>



          {/* Contact Info */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-white/80 bg-white/10 py-2 rounded-lg">
              <Phone className="h-4 w-4" />
              <span className="text-xs font-medium">+91 99982 82121</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/80 bg-white/10 py-2 rounded-lg">
              <Clock className="h-4 w-4" />
              <span className="text-xs">We serve from 12:00 P.M. – 11:00 P.M.</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Category Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => scrollToCategory(category.id)}
                    className={`whitespace-nowrap flex-shrink-0 px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === category.id
                      ? "bg-orange-600 text-white shadow-md"
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                      }`}
                  >
                    {category.name}
                    {activeCategory === category.id && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
                        layoutId="activeCategory"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
            {/* Right Arrow Indicator */}
            <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
              <div className="bg-gradient-to-l from-white via-white/80 to-transparent w-8 h-full flex items-center justify-end pr-1">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <main className="flex-1">
        {categories.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-24"
          >
            <div className="px-6 py-8">
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {category.name}
                <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
              </motion.h2>

              <div className="space-y-1">
                {category.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    whileHover={{ x: 1 }}
                  >
                    <div className="bg-white border border-gray-200 rounded-md hover:shadow-xs transition-all duration-150 p-2">
                      <div className="flex items-start gap-2">
                        {/* Veg/Non-Veg Indicator */}
                        <div className="flex-shrink-0 mt-1">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${item.veg
                              ? "bg-green-500 ring-1 ring-green-200"
                              : "bg-red-500 ring-1 ring-red-200"
                              }`}
                          />
                        </div>

                        {/* Item Name */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                            {item.name}
                          </h3>

                          {/* Price Options */}
                          <div className="space-y-1">
                            {(() => {
                              const priceData = formatPriceOptions(item.price);

                              if (priceData.type === 'complex') {
                                // Complex pattern: Half/Full with Oil/Butter using colons and commas
                                return Object.entries(priceData.sections).map(([size, options]) => (
                                  <div key={size} className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 font-medium w-12 flex-shrink-0">{size}:</span>
                                    <div className="flex flex-wrap gap-1">
                                      {(options as string[]).map((option: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium"
                                        >
                                          {option}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ));
                              } else if (priceData.type === 'grouped') {
                                // Grouped pattern: Oil/Butter groups separated by commas
                                return Object.entries(priceData.sections).map(([groupName, options]) => (
                                  <div key={groupName} className="flex items-start gap-2">
                                    <span className="text-xs text-gray-500 font-medium w-12 flex-shrink-0">
                                      {groupName.includes('1') ? 'Oil:' : 'Butter:'}
                                    </span>
                                    <div className="flex flex-wrap gap-1">
                                      {(options as string[]).map((option: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium"
                                        >
                                          {option}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ));
                              } else if (priceData.type === 'halfFull') {
                                // Simple Half/Full pattern
                                return (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500 font-medium w-12 flex-shrink-0">Half:</span>
                                      <div className="flex flex-wrap gap-1">
                                        <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">
                                          {priceData.half}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-500 font-medium w-12 flex-shrink-0">Full:</span>
                                      <div className="flex flex-wrap gap-1">
                                        <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">
                                          {priceData.full}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                );
                              } else if (priceData.type === 'simple') {
                                // Simple options with pipes
                                return (
                                  <div className="flex flex-wrap gap-1">
                                    {priceData.options.map((option: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                );
                              } else if (priceData.type === 'single') {
                                // Single option
                                return (
                                  <div className="flex flex-wrap gap-1">
                                    <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">
                                      {priceData.option}
                                    </span>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>



      {/* Footer */}
      <footer className="bg-[#8B0000] border-t border-[#6B0000] py-8 px-6 mt-auto">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          {/* Restaurant Name */}
          <h2 className="text-xl font-bold text-white">
            Mahi Omlette and Chinese
          </h2>

          {/* Tagline */}
          <p className="text-white/90 italic">
            Where Taste Meets Tradition
          </p>

          {/* Contact & Timings */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+91 99982 82121</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm">We serve from 12:00 P.M. – 11:00 P.M.</span>
            </div>
          </div>

          <Separator className="my-4 bg-white/20" />

          {/* QR Code Line */}
          <p className="text-sm text-white/80">
            📱 Scan QR code to view menu anytime, anywhere
          </p>

          {/* Credit Line with Hyperlink */}
          <p className="text-sm text-white/80">
            ✨ Digital Menu crafted with precision by{" "}
            <a
              href="https://www.lazlle.studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/90 underline font-medium transition-colors duration-200"
            >
              Lazlle & Co.
            </a>
          </p>

          {/* Professional Solutions Line */}
          <p className="text-sm text-white/80">
            ⚡ Professional QR Code Menu Solutions for Restaurants
          </p>
        </div>
      </footer>
    </div>
  );
}