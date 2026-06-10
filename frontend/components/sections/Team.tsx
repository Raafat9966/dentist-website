const DENTISTS = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Lead Dentist & Founder",
    credentials: "DDS, Columbia University · 15 yrs experience",
    bio: "Dr. Mitchell founded BrightSmile with the vision of making advanced dental care accessible to everyone. Her specialty is cosmetic and restorative dentistry.",
    initials: "SM",
    color: "bg-teal-600",
  },
  {
    name: "Dr. James Chen",
    role: "Endodontist",
    credentials: "DMD, NYU · Board Certified · 10 yrs experience",
    bio: "Specialist in root canal therapy and dental trauma. Dr. Chen's gentle technique has helped hundreds of patients save their natural teeth.",
    initials: "JC",
    color: "bg-blue-600",
  },
  {
    name: "Dr. Aisha Patel",
    role: "Orthodontist",
    credentials: "DDS, Harvard · Invisalign Gold Provider",
    bio: "Expert in traditional braces and clear aligner therapy. Dr. Patel brings a personalised approach to every smile transformation.",
    initials: "AP",
    color: "bg-indigo-600",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Our Experts</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Meet the Team Behind Your Smile
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Board-certified dentists with a passion for continuing education and patient-centred care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {DENTISTS.map((d) => (
            <div key={d.name} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-shadow duration-200">
              <div className={`${d.color} h-36 flex items-center justify-center`}>
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">{d.initials}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-base">{d.name}</h3>
                <p className="text-teal-600 text-sm font-medium mt-0.5">{d.role}</p>
                <p className="text-slate-400 text-xs mt-1 mb-3">{d.credentials}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{d.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
