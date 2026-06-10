export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f766e 0%, #0e7490 50%, #1e40af 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-teal-100 text-sm font-medium px-4 py-2 rounded-full mb-8 border border-white/20">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Top-rated on Jameda — Oberasbach bei Nürnberg
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Ihr Zahnarzt in
          <br />
          <span className="text-teal-200">Oberasbach</span>
        </h1>

        <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          Moderne Zahnheilkunde in entspannter Atmosphäre. Dr. Stephan Heußinger und sein Team bieten individuelle Beratung, transparente Kosten und angstfreie Behandlung.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#booking"
            className="w-full sm:w-auto bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 py-4 rounded-full text-base shadow-xl shadow-black/20 transition-colors"
          >
            Termin online buchen
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto border border-white/40 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full text-base transition-colors"
          >
            Unsere Leistungen
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
          {[
            { value: "20+", label: "Jahre Erfahrung" },
            { value: "8", label: "Behandlungsgebiete" },
            { value: "Jameda", label: "Top Bewertet" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-teal-200 text-xs sm:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
