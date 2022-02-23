export interface InventoryItemInput {
    image: string;
    name: string;
    labels: string[];
    unit: string;
    pluralUnit: string;
    count: number;
    pricePerUnit: number;
    threshold: number;
}