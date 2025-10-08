import React, { useState } from 'react';
import { SparklesIcon, GiftIcon, FireIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function DiwaliBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-pink-600 to-purple-700 py-4 sm:py-6">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <SparklesIcon
              key={i}
              className="absolute text-yellow-300 animate-pulse"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-4 sm:right-6 lg:right-8 z-10 rounded-full bg-white/20 backdrop-blur-sm p-1.5 sm:p-2 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-90 border border-white/30"
          aria-label="Close banner"
        >
          <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <FireIcon className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-300 animate-bounce" />
              <div className="absolute inset-0 blur-xl bg-yellow-300 opacity-50 animate-pulse"></div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="inline-block animate-pulse">✨</span>
                Happy Diwali!
                <span className="inline-block animate-pulse">🪔</span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-yellow-100 font-semibold mt-1">
                Celebrate with amazing deals & festive offers
              </p>
            </div>
          </div>

          {/* Right Section - Offer Badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/20 backdrop-blur-sm border-2 border-yellow-300 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3">
                <GiftIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-300 animate-bounce" />
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-bold text-yellow-100 uppercase tracking-wider">
                    Festival Sale
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-none">
                    Up to 70% OFF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Text */}
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-xs sm:text-sm text-yellow-100 font-semibold animate-pulse">
            🎊 Free Shipping on Orders Above ₹999 | Limited Time Offer 🎊
          </p>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400"></div>
    </div>
  );
}