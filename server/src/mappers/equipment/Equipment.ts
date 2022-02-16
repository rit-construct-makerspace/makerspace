import { Equipment } from "../../models/equipment/equipment";

export function equipmentToDomain(raw: any): Equipment[] {
  return raw.map((i: any) => singleEquipmentToDomain(i));

}

export function singleEquipmentToDomain(raw: any): Equipment | null {
  if (raw === undefined || raw === null) return null;
  const value: Equipment = {
    id: raw.id,
    name: raw.name,
    room: raw.room,
    addedAt: raw.addedAt,
    inUse: raw.inUse
  }
  return value;
}