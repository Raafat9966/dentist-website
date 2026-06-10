const REASONS = [
  {
    number: "01",
    title: "Pain-Free Guarantee",
    description: "We use the latest anesthetic techniques and take as much time as needed so you never leave in discomfort.",
  },
  {
    number: "02",
    title: "Transparent Pricing",
    description: "Full cost breakdown before any treatment starts. No surprise bills — ever.",
  },
  {
    number: "03",
    title: "Same-Day Emergency Slots",
    description: "Dental emergencies don't wait. We keep urgent slots available every day.",
  },
  {
    number: "04",
    title: "Family-Friendly",
    description: "From toddlers to seniors, we're experienced with every age and make even the most nervous patients feel at ease.",
  },
  {
    number: "05",
    title: "Insurance & Financing",
    description: "We work with most major insurance plans and offer flexible monthly payment options through CareCredit.",
  },
  {
    number: "06",
    title: "Eco-Conscious Practice",
    description: "Digital records, minimal-waste protocols, and BPA-free materials because your health and the planet matter.",
  },
];

const TRUST_BADGES = [
  { label: "ADA Member", sub: "American Dental Assoc." },
  { label: "AAE Certified", sub: "American Assoc. of Endodontists" },
  { label: "HIPAA Compliant", sub: "Patient Privacy Protected" },
  { label: "Google Verified", sub: "4.9 ★  (380+ reviews)" },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Why BrightSmile</span>
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
