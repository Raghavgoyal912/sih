"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "AI Search", href: "/search" },
  { label: "GIS Dashboard", href: "/gis" },
  { label: "Policy Simulator", href: "/simulate" },
  { label: "Collaboration Hub", href: "/collaborate" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [language, setLanguage] = useState<"EN" | "HI">("EN");

  const fontSizes = ["A-", "A", "A+"];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-[0_1px_8px_rgba(15,41,66,0.06)] bg-surface">
      {/* Top Institutional Banner */}
      <div className="w-full bg-primary text-on-primary py-1 px-4 lg:px-6">
        <div className="max-w-[88rem] mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">
              verified_user
            </span>
            <span className="tracking-wide truncate font-medium">
              Government of India • Ministry of Rural Development &amp; Land Resources • NIC Partnered
            </span>
            <span className="hidden md:inline-block text-on-primary-container px-1 font-mono">|</span>
            <span className="hidden md:inline-block text-on-primary-container font-medium">
              भारत सरकार
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Accessibility Font Size Controls */}
            <div className="flex items-center gap-0.5">
              {fontSizes.map((size, idx) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSizeIndex(idx)}
                  className={`px-1.5 py-0.5 rounded transition-colors text-xs ${
                    fontSizeIndex === idx
                      ? "bg-secondary-fixed text-primary font-bold"
                      : "text-on-primary hover:text-secondary-fixed"
                  }`}
                  aria-label={`Set font size ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>

            <span className="text-on-primary-container">|</span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage("EN")}
                className={`font-semibold ${
                  language === "EN" ? "text-secondary-fixed underline" : "text-on-primary hover:text-secondary-fixed"
                }`}
              >
                EN
              </button>
              <span className="text-on-primary-container">/</span>
              <button
                type="button"
                onClick={() => setLanguage("HI")}
                className={`font-semibold ${
                  language === "HI" ? "text-secondary-fixed underline" : "text-on-primary hover:text-secondary-fixed"
                }`}
              >
                HI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="bg-surface-container-lowest/95 backdrop-blur-xl border-b border-surface-container">
        <div className="h-16 max-w-[88rem] mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-secondary-fixed shadow-sm">
              <span className="material-symbols-outlined text-[22px]">account_balance</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-primary tracking-tight group-hover:text-secondary transition-colors">
                BhoomiSetu
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold hidden sm:block">
                National Land Governance Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-container/60">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-on-surface-variant hover:text-primary hover:bg-surface-container"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/search"
              className="hidden lg:inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              <span>Explore Docs</span>
            </Link>

            <Link
              href="/collaborate"
              className="hidden sm:inline-flex items-center justify-center bg-primary text-on-primary px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-primary-container transition-all shadow-sm active:scale-[0.98]"
            >
              National Portal Access
            </Link>

            <div
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm text-on-primary cursor-pointer hover:ring-2 hover:ring-secondary/50 transition-all"
              title="Government Authorized Officer"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              aria-label="Toggle navigation menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-surface-container bg-surface-container-lowest px-4 py-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-surface-container mt-2">
              <Link
                href="/collaborate"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-sm"
              >
                National Portal Access
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
