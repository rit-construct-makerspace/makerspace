import { knex } from "../../db";

export interface ILabelRepository {
    getAllLabels(): Promise<string[]>;
    getLabelsForItem(itemId: number): Promise<string[]>;
    addLabel(label: string): Promise<void>;
    deleteLabel(label: string): Promise<void>;
    deleteLabelById(labelId: number): Promise<void>;
}

export class LabelRepository implements ILabelRepository {
    private queryBuilder;

    constructor(queryBuilder?: any) {
        this.queryBuilder = queryBuilder || knex;
    }

    public async getAllLabels(): Promise<string[]> {
        const knexResult = await this.queryBuilder("Label")
            .select("label");
        const result = knexResult.map((i: any) => i.label)
        return result;
    }

    public async getLabelsForItem(itemId: number): Promise<string[]> {
        const result = await this.queryBuilder("InventoryItem")
            .leftJoin(
                "InventoryItemLabel",
                "InventoryItemLabel.item",
                "=",
                "InventoryItem.id"
            )
            .leftJoin("Label", "Label.id", "=", "InventoryItemLabel.label")
            .select("Label.label").where("InventoryItem.id", itemId);
        return result;
    }

    public async addLabel(label: string): Promise<void> {
        await this.queryBuilder("Label").insert({ label });
    }

    public async deleteLabel(label: string): Promise<void> {
        await this.queryBuilder("Label").where({ label }).del();
    }

    public async deleteLabelById(labelId: number): Promise<void> {
        await this.queryBuilder("Label").where({ id: labelId }).del();
    }

}
