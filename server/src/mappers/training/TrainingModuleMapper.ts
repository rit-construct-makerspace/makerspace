import { TrainingModule } from "../../models/training/trainingModule";

export function trainingModulesToDomain(raw: any): TrainingModule[] {
  return raw.map((i: any) => singleTrainingModuleToDomain(i));
}

export function singleTrainingModuleToDomain(raw: any): TrainingModule | null {
  if (raw === undefined || raw === null) return null;
  const value: TrainingModule = {
    id: raw.id,
    name: raw.name,
  }
  return value;
}
