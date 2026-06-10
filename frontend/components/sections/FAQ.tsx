"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "How often should I have a check-up?",
    answer: "Most patients benefit from a check-up and professional cleaning every 6 months. If you have gum disease or a higher risk of cavities, we may recommend every 3–4 months. We will tailor a recall schedule to your individual needs.",
  },
  {
    question: "I am afraid of the dentist — can you help?",
    answer: "Absolutely. Many of our patients feel anxious before their first visit. Dr. Heußinger and the team take as much time as needed, explain every step in advance, and only proceed when you feel comfortable. We can also discuss additional options such as local anaesthesia to make treatment completely pain-free.",
  },
  {
    question: "What does a prophylaxis appointment include?",
    answer: "A professional prophylaxis session includes removal of plaque and tartar (including below the gumline), polishing of all tooth surfaces, fluoride application where appropriate, and personalised advice on your home oral hygiene routine.",
  },
  {
    question: "Is teeth whitening safe?",
    answer: "Yes. Professional in-office whitening uses controlled concentrations of bleaching agent applied under clinical conditions. Mild tooth sensitivity for 24–48 hours is normal and temporary. We screen every patient beforehand to confirm suitability.",
  },
  {
    question: "Does my health insurance cover treatment?",
    answer: "We treat both statutory (GKV) and private (PKV) patients. Statutory insurance covers a defined range of treatments; additional or higher-quality options (such as tooth-coloured fillings or certain prosthetics) may incur a co-payment. We always provide a written cost plan before starting, so you know your costs in advance.",
  },
  {
    question: "How do I book an appointment?",
    answer: "You can book online 24/7 using the booking form on this page, call us at +49 911 999 17 666 during opening hours, or use our Doctolib profile. We confirm every appointment and send a reminder before your visit.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-sm sm:text-base">{question}</span>
        <svg
          className={`w-5 h-5 text-teal-600 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="text-slate-500 text-sm leading-relaxed pb-5">{answer}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Common Questions
          </h2>
        </div>
        <div>
          {FAQS.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
