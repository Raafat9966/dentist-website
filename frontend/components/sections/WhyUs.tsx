const REASONS = [
  {
    number: "01",
    title: "Fear-Free Experience",
    description: "We understand that many patients feel anxious. We take as much time as you need and use the latest techniques to ensure every visit is as comfortable as possible.",
  },
  {
    number: "02",
    title: "Transparent Pricing",
    description: "Full cost breakdown before any treatment starts. We explain every option and its price clearly so there are never any unexpected bills.",
  },
  {
    number: "03",
    title: "Individual Consultation",
    description: "No two mouths are alike. We tailor every treatment plan to your specific needs, lifestyle, and goals after a thorough personal consultation.",
  },
  {
    number: "04",
    title: "Evidence-Based Treatment",
    description: "Our methods are continuously updated to reflect the latest dental research, ensuring you receive safe, proven, and effective care.",
  },
  {
    number: "05",
    title: "Family-Friendly",
    description: "From children's first dental visit to senior care, our team is experienced with every age group and makes even nervous patients feel at ease.",
  },
  {
    number: "06",
    title: "Interdisciplinary Network",
    description: "When specialist care is needed, we collaborate closely with trusted partners across medical disciplines to ensure seamless, comprehensive treatment.",
  },
];

const TRUST_BADGES = [
  { label: "Jameda Verified", sub: "Top-rated by patients" },
  { label: "KZBV Member", sub: "Kassenzahnärztliche Bundesvereinigung" },
  { label: "Privacy Protected", sub: "Patient Data Secured" },
  { label: "Doctolib Partner", sub: "Online Booking Available" },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Why Dr. Heußinger</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            The Difference You&apos;ll Feel
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {REASONS.map((r) => (
            <div key={r.number} className="flex gap-5">
              <span className="text-2xl font-extrabold text-teal-100 leading-none select-none shrink-0 pt-0.5">
                {r.number}
              </span>
              <div>
                <h3 className="font-bold text-slate-800 mb-1.5">{r.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{r.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.label} className="bg-slate-50 rounded-xl p-5 text-center border border-slate-100">
              <div className="font-bold text-slate-800 text-sm">{b.label}</div>
              <div className="text-slate-500 text-xs mt-1">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
