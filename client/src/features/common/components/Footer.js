import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { Sparkles } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-white" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                AmiFairy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-400 mb-6 leading-relaxed">
              Your magical shopping destination for premium sarees and traditional wear. Discover elegance and style.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaInstagram className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-pink-400" />
                </div>
              </a>
              
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaFacebook className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-blue-400" />
                </div>
              </a>
              
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaTwitter className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-cyan-400" />
                </div>
              </a>
              
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="relative bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20">
                  <FaYoutube className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-red-400" />
                </div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Collections
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Special Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Customer Service
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-200 hover:pl-2 inline-block"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
              Get In Touch
            </h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start gap-3">
                <HiMail className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:hello@amifairy.com"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  hello@amifairy.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HiPhone className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+911234567890"
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors duration-200"
                >
                  +91 12345 67890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <HiLocationMarker className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base text-gray-400">
                  Mumbai, Maharashtra, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © {new Date().getFullYear()} AmiFairy. All rights reserved. Crafted with ✨
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Terms of Service
              </a>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <a
                href="/"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
