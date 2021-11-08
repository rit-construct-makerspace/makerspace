import PendingOrder from "../types/PendingOrder";
import Inventory from "./Inventory";
import AdamSavage from "./AdamSavage";

const pendingOrders: PendingOrder[] = [
  {
    id: 0,
    item: Inventory[1],
    count: 500,
    creator: AdamSavage,
    createDate: new Date(),
  },
];

export default pendingOrders;
