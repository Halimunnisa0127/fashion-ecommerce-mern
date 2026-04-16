import React from "react";
import { Link } from "react-router-dom";
// UI icons (Lucide)
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

// Social icons (React Icons)
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-violet-600 transition-colors">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900">
                FashionHub
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Defining the aesthetics of modern fashion. Curated collections for the bold and the visionary.
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={FaInstagram} />
              <SocialIcon Icon={FaTwitter} />
              <SocialIcon Icon={FaFacebook} />
              <SocialIcon Icon={FaLinkedin} />
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Navigation</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="New Arrivals" />
              <FooterLink to="/" label="Best Sellers" />
              <FooterLink to="/" label="Collections" />
              <FooterLink to="/aboutpage" label="Our Story" />
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Support</h4>
            <ul className="space-y-4">
              <FooterLink to="/" label="Trace Order" />
              <FooterLink to="/" label="Shipping Policy" />
              <FooterLink to="/" label="Terms & Conditions" />
              <FooterLink to="/" label="Privacy Policy" />
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Stay in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <Mail className="w-4 h-4" /> support@fashionhub.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <Phone className="w-4 h-4" /> +91 (800) FASHION
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-900 transition-colors">
                <MapPin className="w-4 h-4" /> NY, 5th Avenue, Fashion District
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} FashionHub. Elevated by Antigravity AI.
          </p>
          <div className="flex gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 grayscale hover:grayscale-0 transition-all opacity-50" alt="PayPal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg" className="h-4 grayscale hover:grayscale-0 transition-all opacity-50" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 grayscale hover:grayscale-0 transition-all opacity-50" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-sm text-gray-500 hover:text-violet-600 transition-colors font-medium">
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ Icon }) => (
  <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-violet-600 hover:text-white transition-all transform hover:-translate-y-1">
    <Icon className="w-5 h-5" />
  </a>
);

export default Footer;
