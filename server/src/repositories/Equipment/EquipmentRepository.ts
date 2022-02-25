import { knex } from "../../db";
import { Equipment } from "../../models/equipment/equipment";
import { EquipmentInput } from "../../models/equipment/equipmentInput";
import { equipmentToDomain, singleEquipmentToDomain } from "../../mappers/equipment/Equipment";
import { EquipmentLabel } from "../../models/equipment/equipmentLabel";
import { singleEquipmentLabelToDomain } from "../../mappers/equipment/EquipmentLabel";

export interface IEquipmentRepository {
  getEquipmentById(id: number | string): Promise<Equipment | null>;
  getEquipments(): Promise<Equipment[]>;
  addEquipment(equipment: EquipmentInput): Promise<Equipment | null>;
  getLabels(id: number): Promise<EquipmentLabel[] | null>;
  addLabelsToEquipment(id: number, equipmentLabels: number[]): Promise<void>;
  updateLabels(id: number, equipmentLabels: number[]): Promise<void>;
  removeLabelsFromEquipment(id: number, equipmentLabels: number[]): Promise<void>;
  updateEquipment(id: number, equipment: EquipmentInput): Promise<Equipment | null>;
  removeEquipment(id: number): Promise<void>;
  
}

export class EquipmentRepository implements IEquipmentRepository {

    private queryBuilder

    constructor(queryBuilder?: any) {
        this.queryBuilder = queryBuilder || knex
    }

    public async getEquipmentById(id: string | number): Promise<Equipment | null> {
      const knexResult = await this.queryBuilder
      .first(
        "id",
        "name",
        "addedAt",
        "inUse",
        "room_id"
      )
      .from("Equipment")
      .where("id", id);

      return singleEquipmentToDomain(knexResult);
    }

    public async removeEquipment(id: number): Promise<void> {
      await this.queryBuilder("Equipment").where({ id: id }).del();
    }

    public async getEquipments(): Promise<Equipment[]> {
      const knexResult = await this.queryBuilder("Equipment").select(
        "id",
        "name",
        "addedAt",
        "inUse",
        "room_id"
      );
      return equipmentToDomain(knexResult);
    }

    public async getLabels(id: number): Promise<EquipmentLabel[] | null> {
      const knexResult = await this.queryBuilder("LabelsForEquipment")
        .leftJoin("EquipmentLabels", "EquipmentLabels.id", "=", "LabelsForEquipment.equipmentLabelId")
        .select("EquipmentLabels.id", "EquipmentLabels.name")
        .where("LabelsForEquipment.equipmentId", id);
      const result = knexResult.map((i: any) => singleEquipmentLabelToDomain(i));
      if (result.length === 1 && result[0] === null) return null;
      return result;
    }

    public async addLabelsToEquipment(id: number, equipmentLabels: number[]): Promise<void> {
      await this.queryBuilder("LabelsForEquipment")
        .insert(
          equipmentLabels.map(equipmentLabel => 
            ({ equipmentId: id, equipmentLabelId: equipmentLabel }))
        );
    }

    public async removeLabelsFromEquipment(id: number, equipmentLabels: number[]): Promise<void> {
      await this.queryBuilder("LabelsForEquipment")
        .where("equipmentId", "=", id)
        .whereIn("equipmentLabelId", equipmentLabels)
        .del();
    }

    public async updateLabels(id: number, equipmentLabels: number[]): Promise<void> {
      await this.queryBuilder("LabelsForEquipment").del().where("equipmentId", id);
      if (equipmentLabels && equipmentLabels.length > 0) {
        await this.addLabelsToEquipment(id, equipmentLabels);
      }
    }

    public async updateEquipment(id: number, equipment: EquipmentInput): Promise<Equipment | null> {
      await this.queryBuilder("Equipment")
        .where("id", id)
        .update({
          name: equipment.name,
          inUse: equipment.inUse,
          room_id: equipment.room_id
        }).then(async () => {
          await this.updateLabels(id, equipment.equipmentLabels);
        });
        return this.getEquipmentById(id);
    }

    public async addEquipment(equipment: EquipmentInput): Promise<Equipment | null> {
      const newId = (
        await this.queryBuilder("Equipment").insert(
          {
            name: equipment.name,
            inUse: equipment.inUse,
            room_id: equipment.room_id
          },
          "id"
        )
      )[0];
      if (equipment.equipmentLabels && equipment.equipmentLabels.length > 0)
        await this.addLabelsToEquipment(newId, equipment.equipmentLabels);
      return await this.getEquipmentById(newId);
    }
}


