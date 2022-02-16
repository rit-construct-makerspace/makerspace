import { knex } from "../../db";
import { EquipmentLabelInput } from "../../models/equipment/equipmentLabelInput";
import { EquipmentLabel } from "../../models/equipment/equipmentLabel";
import { singleEquipmentLabelToDomain, equipmentLabelsToDomain } from "../../mappers/equipment/EquipmentLabel";
import { singleTrainingModuleToDomain } from "../../mappers/training/TrainingModuleMapper";
import { TrainingModule } from "../../models/training/trainingModule";

export interface IEquipmentLabelRepository {
  getEquipmentLabelById(id: number | string): Promise<EquipmentLabel | null>;
  getEquipmentLabels(): Promise<EquipmentLabel[]>;
  addEquipmentLabel(equipmentLabel: EquipmentLabelInput): Promise<EquipmentLabel | null>;
  getTrainingModules(id: number): Promise<EquipmentLabel[] | null>;
  addTrainingModulesToEquipmentLabel(id: number, trainingModules: number[]): Promise<void>;
  updateTrainingModules(id: number, trainingModules: number[]): Promise<void>;
  removeTrainingModulesFromEquipmentLabel(id: number, trainingModules: number[]): Promise<void>;
  updateEquipmentLabel(id: number, equipmentLabel: EquipmentLabelInput): Promise<EquipmentLabel | null>;
  removeEquipmentLabel(id: number): Promise<void>;
  
}

export class EquipmentLabelRepository implements IEquipmentLabelRepository {

    private queryBuilder

    constructor(queryBuilder?: any) {
        this.queryBuilder = queryBuilder || knex
    }

    public async getEquipmentLabelById(id: string | number): Promise<EquipmentLabel | null> {
      const knexResult = await this.queryBuilder
      .first(
        "id",
        "name"
      )
      .from("EquipmentLabels")
      .where("id", id);

      return singleEquipmentLabelToDomain(knexResult);
    }

    public async removeEquipmentLabel(id: number): Promise<void> {
      await this.queryBuilder("EquipmentLabels").where({ id: id }).del();
    }

    public async getEquipmentLabels(): Promise<EquipmentLabel[]> {
      const knexResult = await this.queryBuilder("EquipmentLabels").select(
        "id",
        "name"
      );
      return equipmentLabelsToDomain(knexResult);
    }

    public async getTrainingModules(id: number): Promise<TrainingModule[] | null> {
      const knexResult = await this.queryBuilder("ModulesForLabels")
        .leftJoin("TrainingModule", "TrainingModule.id", "=", "ModulesForLabels.trainingModuleId")
        .select("TrainingModule.id", "TrainingModule.name")
        .where("ModulesForLabels.equipmentLabelId", id);
      const result = knexResult.map((i: any) => singleTrainingModuleToDomain(i));
      if (result.length === 1 && result[0] === null) return null;
      return result;
    }

    public async addTrainingModulesToEquipmentLabel(id: number, trainingModules: number[]): Promise<void> {
      await this.queryBuilder("ModulesForLabels")
        .insert(
          trainingModules.map(trainingModule => 
            ({ equipmentLabelId: id, trainingModuleId: trainingModule }))
        );
    }

    public async removeTrainingModulesFromEquipmentLabel(id: number, trainingModules: number[]): Promise<void> {
      await this.queryBuilder("ModulesForLabels")
        .where("equipmentLabelId", "=", id)
        .whereIn("trainingModuleId", trainingModules)
        .del();
    }

    public async updateTrainingModules(id: number, trainingModules: number[]): Promise<void> {
      await this.queryBuilder("ModulesForLabels").del().where("equipmentLabelId", id);
      if (trainingModules && trainingModules.length > 0) {
        await this.addTrainingModulesToEquipmentLabel(id, trainingModules);
      }
    }

    public async updateEquipmentLabel(id: number, equipmentLabel: EquipmentLabelInput): Promise<EquipmentLabel | null> {
        await this.queryBuilder("EquipmentLabels")
        .where("id", id)
        .update({
          name: equipmentLabel.name
        }).then(async () => {
          await this.updateTrainingModules(id, equipmentLabel.trainingModules);
        });
        return this.getEquipmentLabelById(id);
    }

    public async addEquipmentLabel(equipmentLabel: EquipmentLabelInput): Promise<EquipmentLabel | null> {
      const newId = (
        await this.queryBuilder("EquipmentLabels").insert(
          {
            name: equipmentLabel.name
          },
          "id"
        )
      )[0];
      if (equipmentLabel.trainingModules && equipmentLabel.trainingModules.length > 0)
        await this.addTrainingModulesToEquipmentLabel(newId, equipmentLabel.trainingModules);
      return await this.getEquipmentLabelById(newId);
    }
}


