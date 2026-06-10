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
              <span className="text-white font-bold">Dr. Heußinger Zahnarztpraxis</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Moderne Zahnheilkunde in entspannter Atmosphäre. Transparente Behandlung, individuelle Beratung und ein erfahrenes Team — in Oberasbach bei Nürnberg.
            </p>
            <div className="flex gap-3 mt-5">
              {["Facebook", "Instagram"].map((s) => (
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
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li>Meißener Str. 34</li>
              <li>90522 Oberasbach</li>
              <li className="pt-1">
                <a href="tel:+499119991766" className="hover:text-teal-400 transition-colors">+49 911 999 17 666</a>
              </li>
              <li>
                <a href="mailto:praxis@doktor-heussinger.de" className="hover:text-teal-400 transition-colors">praxis@doktor-heussinger.de</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Zahnarztpraxis Dr. Stephan Heußinger. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-teal-400 transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-teal-400 transition-colors">Impressum</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
