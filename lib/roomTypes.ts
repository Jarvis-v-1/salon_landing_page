import { overlap } from "./time";
import { getServiceById, type RoomType } from "./services";

type BlockWithRoom = { start: Date; end: Date; roomType: RoomType | null };

/**
 * Get room type for a service (facial or body_waxing).
 * Salon constraint: at any time either 1 facial OR 1 body waxing (not both, and only one facial at a time).
 */
export function getRoomTypeForService(serviceId: string | null | undefined): RoomType | null {
  const service = getServiceById(serviceId);
  return service?.roomType ?? null;
}

export function getRoomUsageAtTime(
  slotStart: Date,
  slotEnd: Date,
  busy: BlockWithRoom[]
): { facial: number; body_waxing: number } {
  let facial = 0;
  let body_waxing = 0;
  for (const b of busy) {
    if (!overlap(slotStart, slotEnd, b.start, b.end)) continue;
    if (b.roomType === "facial") facial++;
    else if (b.roomType === "body_waxing") body_waxing++;
  }
  return { facial, body_waxing };
}

/** Can we add one more booking of this roomType at this slot? */
export function roomAllowsAdding(
  roomType: RoomType | null,
  usage: { facial: number; body_waxing: number }
): boolean {
  if (!roomType) return true;
  if (roomType === "facial") {
    return usage.body_waxing === 0 && usage.facial < 1;
  }
  return usage.body_waxing === 0 && usage.facial < 1;
}
