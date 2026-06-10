const TEAM = [
  {
    name: "Dr. med. dent. Stephan Heußinger",
    role: "Zahnarzt & Praxisinhaber",
    credentials: "Dr. med. dent. · 20+ years experience",
    bio: "Dr. Heußinger founded the practice with a focus on fear-free, transparent dental care. He treats each patient individually and stays current with the latest evidence-based techniques.",
    initials: "SH",
    color: "bg-teal-600",
  },
  {
    name: "Gisela Heußinger",
    role: "Anmeldung & Praxismanagement",
    credentials: "Practice Administration",
    bio: "Gisela ensures every patient feels welcome from the moment they arrive. She manages scheduling, insurance queries, and everything that makes your visit smooth.",
    initials: "GH",
    color: "bg-blue-600",
  },
  {
    name: "Gerlinde Huber",
    role: "Dental Prophylaxis",
    credentials: "Zahnmedizinische Prophylaxe",
    bio: "Gerlinde specialises in professional cleaning and preventive care, helping patients develop long-term oral hygiene habits tailored to their individual needs.",
    initials: "GH",
    color: "bg-indigo-600",
  },
  {
    name: "Jennifer Kondert",
    role: "Dental Assistant",
    credentials: "Zahnmedizinische Assistenz",
    bio: "Jennifer assists in all treatment procedures, ensuring a calm and efficient environment for both patients and the treating dentist.",
    initials: "JK",
    color: "bg-teal-700",
  },
  {
    name: "Lisa Kunzmann",
    role: "Dental Assistant",
    credentials: "Zahnmedizinische Assistenz",
    bio: "Lisa brings warmth and precision to every appointment, supporting the team across treatment and patient care with dedication.",
    initials: "LK",
    color: "bg-cyan-600",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Das Team</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Meet the Team Behind Your Smile
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            &ldquo;Für Sie ziehen wir an einem Strang!&rdquo; — Together for your dental health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((d) => (
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
