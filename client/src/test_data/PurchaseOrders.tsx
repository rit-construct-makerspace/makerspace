import PurchaseOrder from "../types/PurchaseOrder";
import Inventory from "./Inventory";
import AdamSavage from "./AdamSavage";

const purchaseOrders: PurchaseOrder[] = [
  {
    id: 0,
    creator: AdamSavage,
    createDate: new Date(),
    expectedDeliveryDate: new Date(),
    attachments: [
      "https://b.stripecdn.com/docs-srv/assets/terminal-pre-built-receipt.7879fcc1c9eaea36e3af4dabada4f82b.png",
      "http://wpsimplepay.com/wp-content/uploads/2018/10/chewy-email-receipt-e1540988386206.png",
    ],
    items: [
      {
        id: 1,
        item: Inventory[1],
        count: 100,
      },
      {
        id: 2,
        item: Inventory[2],
        count: 20,
      },
    ],
  },
];

export default purchaseOrders;
