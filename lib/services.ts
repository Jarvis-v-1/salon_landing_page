import type { ServiceTag } from "./employees";

export type ServiceOption = {
  id: string;
  label: string;
  tag: ServiceTag;
  durationMin: number;
};

// Keep this concise for MVP; can be expanded to full price-list granularity.
export const SERVICES: ServiceOption[] = [
  { id: "haircut", label: "Haircut & Styling", tag: "hair", durationMin: 60 },
  { id: "color", label: "Hair Color & Highlights", tag: "hair", durationMin: 150 },
  { id: "bridal", label: "Bridal Makeup", tag: "bridal", durationMin: 180 },
  { id: "threading", label: "Waxing / Threading", tag: "threading", durationMin: 30 },
  { id: "facial", label: "Facial & Skincare", tag: "facial", durationMin: 75 },
  { id: "manicure", label: "Manicure", tag: "manicure", durationMin: 45 },
  { id: "pedicure", label: "Pedicure", tag: "pedicure", durationMin: 60 },
  {
    id: "interview",
    label: "Interview / Consultation",
    tag: "interview",
    durationMin: 30
  }
];

export function getServiceById(serviceId: string | null | undefined) {
  if (!serviceId) return null;
  return SERVICES.find((s) => s.id === serviceId) ?? null;
}

