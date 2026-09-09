import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-surface-container mt-16">
      <div className="max-w-[88rem] mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Platform identity & Certifications */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-secondary-fixed text-sm font-bold">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
              </div>
              <span className="text-base font-bold text-primary tracking-tight">
                BhoomiSetu
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Institutional research and spatial cadastre analytics engine administered for statutory land governance reform and verifiable title clarity.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded text-[11px] font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[13px] text-secondary">security</span>
                ISO 27001 Certified
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-highest px-2 py-1 rounded text-[11px] font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[13px] text-secondary">gavel</span>
                STQC Audited
              </span>
            </div>
          </div>

          {/* Col 2: Statutory Portals */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Statutory Portals
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Digital India Land Records (DILRMP)
                </Link>
              </li>
              <li>
                <Link href="/gis" className="hover:text-primary transition-colors">
                  Survey of India Cadastral Grid
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-primary transition-colors">
                  National Geo-Spatial Repository
                </Link>
              </li>
              <li>
                <Link href="/simulate" className="hover:text-primary transition-colors">
                  e-Courts Land Dispute Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Helpdesk & Redressal */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Helpdesk &amp; Redressal
            </h4>
            <p className="text-xs text-on-surface-variant mb-1">
              Toll-free Citizen Cadastre Helpline:
            </p>
            <p className="text-sm font-bold text-primary font-mono mb-3">
              1800-11-2466 (BHUMI)
            </p>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  CPGRAMS Grievance Portal
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Spatial Data API Support
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Institutional Researcher Desk
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Security & Policy */}
          <div>
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
              Security &amp; Policy
            </h4>
            <ul className="space-y-2 text-xs text-on-surface-variant">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Privacy Policy &amp; Terms of Access
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Geospatial Data Guidelines 2021
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Cyber Security Clearance (CERT-In)
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  Hyperlinking &amp; Copyright Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-surface-container mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-on-surface-variant gap-2">
          <p>© 2025 National Informatics Centre, Ministry of Rural Development. All Rights Reserved.</p>
          <p className="font-medium text-[11px]">
            Designed and hosted in compliance with GIGW 3.0 Guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
