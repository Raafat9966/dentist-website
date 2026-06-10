const TESTIMONIALS = [
  {
    name: "Emily Rodriguez",
    role: "Teacher",
    rating: 5,
    text: "I was terrified of the dentist for 20 years. Dr. Mitchell's team changed everything. The Invisalign process was explained step by step — now I can't stop smiling!",
    initials: "ER",
  },
  {
    name: "Michael Thompson",
    role: "Software Engineer",
    rating: 5,
    text: "Had an emergency on a Saturday morning and they fit me in within an hour. The root canal was completely pain-free. Outstanding care and professionalism.",
    initials: "MT",
  },
  {
    name: "Priya Sharma",
    role: "Marketing Director",
    rating: 5,
    text: "The whitening results blew me away — 8 shades brighter in one session. The whole team is warm and the clinic is spotlessly clean. Highly recommend!",
    initials: "PS",
  },
  {
    name: "David Kim",
    role: "Retired Engineer",
    rating: 5,
    text: "I've had dental implants done here after years of missing a tooth. The process was smooth, the outcome is perfect, and my confidence is back.",
    initials: "DK",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-br from-teal-700 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-300 text-sm font-semibold uppercase tracking-widest">Patient Stories</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
            What Our Patients Say
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-teal-200 text-sm ml-1">4.9/5 from 380+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 text-sm leading-relaxed mb-5">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-400/20 flex items-center justify-center text-white font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-teal-300 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
