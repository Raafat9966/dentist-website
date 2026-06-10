"use client";

import { useEffect, useState } from "react";
import { fetchServices } from "@/lib/api";
import type { Service } from "@/lib/types";

function formatPrice(cents: number | null): string {
  if (!cents) return "Free consultation";
  return `From $${(cents / 100).toLocaleString()}`;
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  tooth: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.5 2 6 5 6 8c0 2.5 1 4.5 2 6l1 6h2l1-4 1 4h2l1-6c1-1.5 2-3.5 2-6 0-3-2.5-6-6-6z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
  shield: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 013 12c0 .338.014.673.04 1.005a11.954 11.954 0 002.58 6.584A11.953 11.953 0 0012 21a11.953 11.953 0 005.38-1.411 11.954 11.954 0 002.58-6.584A11.955 11.955 0 0021 12c0-.338-.014-.673-.04-1.005A11.956 11.956 0 0020.402 6 11.959 11.959 0 0112 2.964z" />
    </svg>
  ),
  heart: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  star: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
  alignments: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
};

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50 transition-all duration-200">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 group-hover:bg-teal-100 text-teal-600 flex items-center justify-center mb-4 transition-colors">
        {SERVICE_ICONS[service.icon ?? "tooth"] ?? SERVICE_ICONS["tooth"]}
      </div>
      <h3 className="font-bold text-slate-800 text-base mb-2">{service.name}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{service.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-teal-700 font-semibold text-sm">{formatPrice(service.price_from)}</span>
        <span className="text-slate-400 text-xs">{service.duration_minutes} min</span>
      </div>
    </div>
  );
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">What We Offer</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Comprehensive Dental Services
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base">
            From preventive care to advanced cosmetic procedures, everything you need for a healthy, beautiful smile.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow-md shadow-teal-600/25"
          >
            Book Your Appointment
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
