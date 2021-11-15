import React from "react";
import { PurchaseOrderItem } from "../../../types/PurchaseOrder";
import { Stack } from "@mui/material";
import InvItemNamePic from "../../../common/InvItemNamePic";
import InvItemCount from "../../../common/InvItemCount";

interface PurchaseOrderItemProps {
  purchaseOrderItem: PurchaseOrderItem;
}

export default function PurchaseOrderItemRow({
  purchaseOrderItem,
}: PurchaseOrderItemProps) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <InvItemNamePic item={purchaseOrderItem.item} />
      <InvItemCount
        item={purchaseOrderItem.item}
        count={purchaseOrderItem.count}
      />
    </Stack>
  );
}
