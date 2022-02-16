import { EquipmentLabel } from "../../models/equipment/equipmentLabel";

export function equipmentLabelsToDomain(raw: any): EquipmentLabel[] {
  return raw.map((i: any) => singleEquipmentLabelToDomain(i));
}

export function singleEquipmentLabelToDomain(raw: any): EquipmentLabel | null {
  if (raw === undefined || raw === null) return null;
  const value: EquipmentLabel = {
    id: raw.id,
    name: raw.name,
  }
  return value;
}
