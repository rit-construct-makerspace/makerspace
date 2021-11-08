import InventoryItem from "./InventoryItem";
import Person from "./Person";

export default interface PendingOrder {
  id: number;
  item: InventoryItem;
  count: number;
  creator: Person;
  createDate: Date;
}
