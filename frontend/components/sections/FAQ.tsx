"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "How often should I visit the dentist?",
    answer: "Most patients benefit from a check-up and cleaning every 6 months. Those with gum disease or a higher cavity risk may need to come every 3–4 months. We'll tailor a schedule to your needs.",
  },
  {
    question: "Is teeth whitening safe?",
    answer: "Yes. Professional in-office whitening uses safe, controlled concentrations of hydrogen peroxide. Mild sensitivity for 24–48 hours is normal and temporary. We screen every patient beforehand to ensure suitability.",
  },
  {
    question: "What should I do in a dental emergency?",
    answer: "Call us immediately at (555) 234-5678. We keep same-day emergency slots every day. For a knocked-out tooth, rinse it gently, keep it moist, and get to us within 30 minutes for the best chance of reimplantation.",
  },
  {
    question: "Do you accept dental insurance?",
    answer: "We accept most major insurance plans including Delta Dental, Cigna, Aetna, MetLife, and United Concordia. We'll verify your benefits before treatment and let you know your out-of-pocket costs upfront.",
  },
  {
    question: "How long does an Invisalign treatment take?",
    answer: "Mild cases can be corrected in 6–12 months; more complex cases typically take 12–18 months. During your free consultation, Dr. Patel will give you a personalised timeline using our 3D imaging technology.",
  },
  {
    question: "Is the booking process secure?",
    answer: "Yes. All data submitted through our booking form is encrypted in transit and stored securely in compliance with HIPAA regulations. We never share your information without explicit consent.",
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
