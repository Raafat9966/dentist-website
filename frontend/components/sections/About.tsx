const PILLARS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 013 12c0 .338.014.673.04 1.005a11.954 11.954 0 002.58 6.584A11.953 11.953 0 0012 21a11.953 11.953 0 005.38-1.411 11.954 11.954 0 002.58-6.584A11.955 11.955 0 0021 12c0-.338-.014-.673-.04-1.005A11.956 11.956 0 0020.402 6 11.959 11.959 0 0112 2.964z" />
      </svg>
    ),
    title: "Transparent Pricing",
    body: "You receive a full cost breakdown before any treatment begins — no hidden fees, no surprises on your bill.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Modern Technology",
    body: "Digital X-rays and the latest evidence-based techniques ensure precise, up-to-date treatment at every visit.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Fear-Free Care",
    body: "We take as much time as needed so even the most anxious patients leave relaxed and comfortable.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Über die Praxis</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
              Zahnheilkunde, der Sie vertrauen können
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Viele Menschen verbinden Zahnarztbesuche mit Angst und Schmerz. In unserer Praxis in Oberasbach erleben Sie das Gegenteil: eine ruhige, freundliche Atmosphäre, in der Ihre Wünsche und Bedenken gehört werden.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Dr. med. dent. Stephan Heußinger und sein Team legen großen Wert auf offene Kommunikation, individuelle Beratung und transparente Kosten — vom ersten Gespräch bis zum Abschluss der Behandlung.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PILLARS.map((p) => (
                <div key={p.title}>
                  <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                    {p.icon}
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{p.title}</h3>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual / image placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden aspect-4/3 bg-linear-to-br from-teal-50 to-blue-50 flex items-center justify-center">
              <div className="text-center px-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 5 6 8c0 2.5 1 4.5 2 6l1 6h2l1-4 1 4h2l1-6c1-1.5 2-3.5 2-6 0-3-2.5-6-6-6z" />
                  </svg>
                </div>
                <p className="text-teal-700 font-semibold text-lg">Dr. Heußinger Zahnarztpraxis</p>
                <p className="text-slate-500 text-sm mt-1">Meißener Str. 34, 90522 Oberasbach</p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white shadow-xl rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">★</div>
              <div>
                <div className="font-bold text-slate-800 text-sm">Jameda Verified</div>
                <div className="text-slate-500 text-xs">Top-rated by patients</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
