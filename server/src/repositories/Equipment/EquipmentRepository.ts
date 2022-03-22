import { knex } from "../../db";
import { Equipment } from "../../models/equipment/equipment";
import { EquipmentInput } from "../../models/equipment/equipmentInput";
import { equipmentToDomain, singleEquipmentToDomain } from "../../mappers/equipment/Equipment";
import { TrainingModule } from "../../schemas/trainingSchema";
import { singleTrainingModuleToDomain } from "../../mappers/training/TrainingModuleMapper";

export interface IEquipmentRepository {
  getEquipmentById(id: number | string): Promise<Equipment | null>;
  getEquipments(): Promise<Equipment[]>;
  addEquipment(equipment: EquipmentInput): Promise<Equipment | null>;
  getTrainingModules(id: number): Promise<TrainingModule[] | null>;
  addTrainingModulesToEquipment(
    id: number,
    trainingModules: number[]
  ): Promise<void>;
  updateTrainingModules(id: number, trainingModules: number[]): Promise<void>;
  removeTrainingModulesFromEquipment(
    id: number,
    trainingModules: number[]
  ): Promise<void>;
  updateEquipment(
    id: number,
    equipment: EquipmentInput
  ): Promise<Equipment | null>;
  archiveEquipment(id: number): Promise<Equipment | null>;
}

export class EquipmentRepository implements IEquipmentRepository {
  private queryBuilder;

  constructor(queryBuilder?: any) {
    this.queryBuilder = queryBuilder || knex;
  }

  public async getEquipmentById(
    id: string | number
  ): Promise<Equipment | null> {
    const knexResult = await this.queryBuilder
      .first("id", "name", "addedAt", "inUse", "roomID")
      .from("Equipment")
      .where("id", id);

    return singleEquipmentToDomain(knexResult);
  }

  public async archiveEquipment(id: number): Promise<Equipment | null> {
    await knex("ModulesForEquipment").where({ id: id}).update({isArchived: true})
    await knex("Equipment").where({ id: id}).update({isArchived: true})
    return this.getEquipmentById(id);
  }

  public async getEquipments(): Promise<Equipment[]> {
    const knexResult = await this.queryBuilder("Equipment").select(
      "id",
      "name",
      "addedAt",
      "inUse",
      "roomID"
    );
    return equipmentToDomain(knexResult);
  }

  public async getTrainingModules(
    id: number
  ): Promise<TrainingModule[] | null> {
    const knexResult = await this.queryBuilder("ModulesForEquipment")
      .leftJoin(
        "TrainingModule",
        "TrainingModule.id",
        "=",
        "ModulesForEquipment.trainingModuleId"
      )
      .select("TrainingModule.id", "TrainingModule.name")
      .where("ModulesForEquipment.equipmentId", id);
    const result = knexResult.map((i: any) => singleTrainingModuleToDomain(i));
    if (result.length === 1 && result[0] === null) return null;
    return result;
  }

  public async addTrainingModulesToEquipment(
    id: number,
    trainingModules: number[]
  ): Promise<void> {
    await this.queryBuilder("ModulesForEquipment").insert(
      trainingModules.map((trainingModule) => ({
        equipmentId: id,
        trainingModuleId: trainingModule,
      }))
    );
  }

  public async removeTrainingModulesFromEquipment(
    id: number,
    trainingModules: number[]
  ): Promise<void> {
    await this.queryBuilder("ModulesForEquipment")
      .where("equipmentId", "=", id)
      .whereIn("trainingModuleId", trainingModules)
      .del();
  }

  public async updateTrainingModules(
    id: number,
    trainingModules: number[]
  ): Promise<void> {
    await this.queryBuilder("ModulesForEquipment")
      .del()
      .where("equipmentId", id);
    if (trainingModules && trainingModules.length > 0) {
      await this.addTrainingModulesToEquipment(id, trainingModules);
    }
  }

  public async updateEquipment(
    id: number,
    equipment: EquipmentInput
  ): Promise<Equipment | null> {
    await this.queryBuilder("Equipment")
      .where("id", id)
      .update({
        name: equipment.name,
        inUse: equipment.inUse,
        roomID: equipment.roomID,
      })
      .then(async () => {
        await this.updateTrainingModules(id, equipment.trainingModules);
      });

    return this.getEquipmentById(id);
  }

  public async addEquipment(
    equipment: EquipmentInput
  ): Promise<Equipment | null> {
    const newId = (
      await this.queryBuilder("Equipment").insert(
        {
          name: equipment.name,
          inUse: equipment.inUse,
          roomID: equipment.roomID,
        },
        "id"
      )
    )[0];
    if (equipment.trainingModules && equipment.trainingModules.length > 0)
      await this.addTrainingModulesToEquipment(
        newId,
        equipment.trainingModules
      );

    return await this.getEquipmentById(newId);
  }
}
