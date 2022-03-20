import { ModuleItem } from "../../schemas/trainingSchema";


export function ModuleItemsToDomain(raw: any): ModuleItem[] {
  return raw.map((i: any) => singleModuleItemToDomain(i));
}

export function singleModuleItemToDomain(raw: any): ModuleItem | null {
  if (raw === undefined || raw === null) return null;
  if (Array.isArray(raw)) {
    raw = raw[0]
  }
  const value: ModuleItem = {
    id: raw.id,
    type: raw.moduleItemType,
    text: raw.text,
    order: raw.order
  }
  return value;
}
