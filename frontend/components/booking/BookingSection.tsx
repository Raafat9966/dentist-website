"use client";

import { useEffect, useState } from "react";
import BookingCalendar from "./BookingCalendar";
import BookingForm from "./BookingForm";
import { fetchServices } from "@/lib/api";
import type { Service, TimeSlot } from "@/lib/types";

type BookingState = "idle" | "success";

export default function BookingSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>("idle");

  useEffect(() => {
    fetchServices().then((data) => {
      setServices(data);
      if (data.length > 0) setSelectedService(data[0]);
    });
  }, []);

  const handleServiceChange = (service: Service) => {
    setSelectedService(service);
    setSelectedSlot(null);
  };

  const handleSuccess = () => {
    setBookingState("success");
    setSelectedSlot(null);
  };

  return (
    <section id="booking" className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-teal-600 text-sm font-semibold uppercase tracking-widest">Booking</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Book Your Appointment
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Choose a service, pick a date and time that works for you, then complete your details. We&apos;ll send a confirmation to your email.
          </p>
        </div>

        {bookingState === "success" ? (
          <div className="max-w-lg mx-auto bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Thank you! Your appointment has been booked. A confirmation email is on its way to you. If you need to cancel or reschedule, please call us at (555) 234-5678.
            </p>
            <button
              onClick={() => setBookingState("idle")}
              className="text-teal-600 hover:text-teal-700 font-semibold text-sm transition-colors underline"
            >
              Book another appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar panel */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-5">Select Date &amp; Time</h3>
              <BookingCalendar
                serviceId={selectedService?.id ?? null}
                onSlotSelect={setSelectedSlot}
                selectedSlot={selectedSlot}
              />
            </div>

            {/* Form panel */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 text-base mb-5">Your Details</h3>
              <BookingForm
                services={services}
                selectedService={selectedService}
                selectedSlot={selectedSlot}
                onServiceChange={handleServiceChange}
                onSuccess={handleSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
