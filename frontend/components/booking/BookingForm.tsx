"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createAppointment, ApiError } from "@/lib/api";
import type { Service, TimeSlot } from "@/lib/types";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  services: Service[];
  selectedService: Service | null;
  selectedSlot: TimeSlot | null;
  onServiceChange: (service: Service) => void;
  onSuccess: () => void;
}

export default function BookingForm({
  services,
  selectedService,
  selectedSlot,
  onServiceChange,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (!selectedService || !selectedSlot) return;
    try {
      await createAppointment({
        ...values,
        service_id: selectedService.id,
        selected_date: selectedSlot.date,
        selected_start_time: selectedSlot.start_time,
        selected_end_time: selectedSlot.end_time,
        notes: values.notes ?? undefined,
      });
      reset();
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError("root", { message: err.message });
      } else {
        setError("root", { message: "Something went wrong. Please try again." });
      }
    }
  };

  const isReady = selectedService && selectedSlot;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Service selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Service *
        </label>
        <select
          value={selectedService?.id ?? ""}
          onChange={(e) => {
            const s = services.find((s) => s.id === Number(e.target.value));
            if (s) onServiceChange(s);
          }}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="">Select a service…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration_minutes} min)
            </option>
          ))}
        </select>
      </div>

      {/* Selected slot display */}
      {selectedSlot ? (
        <div className="bg-teal-50 rounded-xl px-4 py-3 border border-teal-100">
          <p className="text-teal-700 text-sm font-semibold">
            Selected Appointment
          </p>
          <p className="text-teal-600 text-sm mt-0.5">
            {new Date(selectedSlot.date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {selectedSlot.start_time} – {selectedSlot.end_time}
          </p>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 text-slate-400 text-sm">
          Please select a date and time from the calendar.
        </div>
      )}

      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Full Name *
          </label>
          <input
            id="full_name"
            type="text"
            {...register("full_name")}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Phone Number *
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 (555) 000-0000"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Email Address *
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="jane@example.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-semibold text-slate-700 mb-1.5">
          Additional Notes <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={3}
          placeholder="Any concerns, allergies, or information we should know…"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
        />
      </div>

      {errors.root && (
        <div className="bg-red-50 rounded-xl px-4 py-3 border border-red-100">
          <p className="text-red-600 text-sm">{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!isReady || isSubmitting}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-teal-600/20 disabled:shadow-none"
      >
        {isSubmitting ? "Booking…" : "Confirm Appointment"}
      </button>

      <p className="text-xs text-slate-400 text-center">
        By booking, you agree to our{" "}
        <a href="#" className="underline hover:text-teal-600">Privacy Policy</a>
        . Confirmation will be sent to your email.
      </p>
    </form>
  );
}
