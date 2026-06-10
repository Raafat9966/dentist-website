import { API_BASE_URL } from "./config";
import type {
  Service,
  AvailabilityResponse,
  AppointmentCreate,
  AppointmentOut,
} from "./types";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body?.detail ?? "Request failed");
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchServices(): Promise<Service[]> {
  return apiFetch<Service[]>("/api/services");
}

export async function fetchAvailability(
  serviceId: number,
  start: string,
  end: string,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({
    service_id: String(serviceId),
    start,
    end,
  });
  return apiFetch<AvailabilityResponse>(`/api/availability?${params}`);
}

export async function createAppointment(
  data: AppointmentCreate,
): Promise<AppointmentOut> {
  return apiFetch<AppointmentOut>("/api/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
