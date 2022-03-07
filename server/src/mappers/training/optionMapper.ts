import { Option } from "../../schemas/trainingSchema";


export function optionsToDomain(raw: any): Option[] {
  return raw.map((i: any) => singleOptionToDomain(i));
}

export function singleOptionToDomain(raw: any): Option | null {
  if (raw === undefined || raw === null) return null;
  if (Array.isArray(raw)) {
    raw = raw[0]
  }
  const value: Option = {
    id: raw.id,
    text: raw.text,
    correct: raw.correct,
  }
  return value;
}