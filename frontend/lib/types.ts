export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  buffer_minutes: number;
  price_from: number | null;
  icon: string | null;
  sort_order: number;
}

export interface TimeSlot {
  date: string;
  start_time: string;
  end_time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string;
  slots: TimeSlot[];
  has_availability: boolean;
}

export interface AvailabilityResponse {
  service_id: number;
  days: DayAvailability[];
}

export interface AppointmentCreate {
  full_name: string;
  email: string;
  phone: string;
  service_id: number;
  selected_date: string;
  selected_start_time: string;
  selected_end_time: string;
  notes?: string;
}

export interface AppointmentOut {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  service_id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}
