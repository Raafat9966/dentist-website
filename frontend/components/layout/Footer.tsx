export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 5 6 8c0 2.5 1 4.5 2 6l1 6h2l1-4 1 4h2l1-6c1-1.5 2-3.5 2-6 0-3-2.5-6-6-6z" />
                </svg>
              </div>
              <span className="text-white font-bold">BrightSmile Dental</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Providing compassionate, expert dental care since 2008. Our mission is to help every patient achieve a confident, healthy smile.
            </p>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram", "Twitter"].map((s) => (
                <a key={s} href="#" aria-label={s} className="w-8 h-8 rounded-full bg-slate-800 hover:bg-teal-600 flex items-center justify-center transition-colors">
                  <span className="text-xs text-slate-400 hover:text-white">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {["About", "Services", "Team", "Testimonials", "FAQ", "Book Appointment"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(" ", "-")}`} className="text-sm hover:text-teal-400 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>123 Health Avenue, Suite 200</li>
              <li>New York, NY 10001</li>
              <li className="pt-1">
                <a href="tel:+15552345678" className="hover:text-teal-400 transition-colors">(555) 234-5678</a>
              </li>
              <li>
                <a href="mailto:hello@brightsmile.dental" className="hover:text-teal-400 transition-colors">hello@brightsmile.dental</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} BrightSmile Dental Clinic. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
