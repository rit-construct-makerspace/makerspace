export default interface InventoryItem {
  id: number;
  image: string;
  name: string;
  labels: string[];
  unit: string;
  pluralUnit: string;
  count: number;
  pricePerUnit: number;
}
