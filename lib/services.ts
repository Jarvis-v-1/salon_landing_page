import type { ServiceTag } from "./employees";

export type RoomType = "facial" | "body_waxing";

export type ProcessTimePhases = {
  applicationMin: number;
  processMin: number;
  processMax: number;
  washStyleMin: number;
  washStyleMax: number;
};

export type ServiceOption = {
  id: string;
  label: string;
  tag: ServiceTag;
  durationMin: number;
  /** Room constraint: facial room or body waxing room (only for facial/threading) */
  roomType?: RoomType;
  /** Process-time services: application, process (free for others), wash & style */
  phases?: ProcessTimePhases;
};

export const SERVICES: ServiceOption[] = [
  { id: "haircut", label: "Haircut & Styling", tag: "hair", durationMin: 60 },
  { id: "color", label: "Hair Color & Highlights", tag: "hair", durationMin: 150 },
  {
    id: "full_hair_color",
    label: "Full hair color / Root touch up",
    tag: "hair",
    durationMin: 30 + 40 + 35,
    phases: {
      applicationMin: 30,
      processMin: 30,
      processMax: 40,
      washStyleMin: 30,
      washStyleMax: 35,
    },
  },
  {
    id: "highlights",
    label: "Highlights",
    tag: "hair",
    durationMin: 45 + 35 + 35,
    phases: {
      applicationMin: 45,
      processMin: 30,
      processMax: 35,
      washStyleMin: 30,
      washStyleMax: 35,
    },
  },
  {
    id: "keratin",
    label: "Keratin treatment",
    tag: "hair",
    durationMin: 30 + 60 + 60,
    phases: {
      applicationMin: 30,
      processMin: 60,
      processMax: 60,
      washStyleMin: 60,
      washStyleMax: 60,
    },
  },
  { id: "bridal", label: "Bridal Makeup", tag: "bridal", durationMin: 180 },
  {
    id: "threading",
    label: "Waxing / Threading",
    tag: "threading",
    durationMin: 30,
    roomType: "body_waxing",
  },
  {
    id: "facial",
    label: "Facial & Skincare",
    tag: "facial",
    durationMin: 75,
    roomType: "facial",
  },
  {
    id: "interview",
    label: "Interview / Consultation",
    tag: "interview",
    durationMin: 30,
  },
];

export function getServiceById(serviceId: string | null | undefined) {
  if (!serviceId) return null;
  return SERVICES.find((s) => s.id === serviceId) ?? null;
}

export function isProcessTimeService(
  service: ServiceOption | null
): service is ServiceOption & { phases: ProcessTimePhases } {
  return !!service?.phases;
}
