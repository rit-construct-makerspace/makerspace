import { Equipment } from "../../models/equipment/equipment";

export function equipmentToDomain(raw: any): Equipment[] {
  return raw.map((i: any) => singleEquipmentToDomain(i));
}

export function singleEquipmentToDomain(raw: any): Equipment | null {
  if (raw === undefined || raw === null) return null;
  const value: Equipment = {
    id: raw.id,
    name: raw.name,
    addedAt: raw.addedAt,
    inUse: raw.inUse,
    roomID: raw.roomID,
  };
  return value;
}
