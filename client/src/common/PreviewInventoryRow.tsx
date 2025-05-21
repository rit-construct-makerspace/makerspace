import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Stack, Typography } from "@mui/material";
import InvItemName from "./InvItemNamePic";
import InvItemCount from "./InvItemCount";

interface InventoryRowProps {
  item: InventoryItem;
}

export default function InventoryRow({ item }: InventoryRowProps) {
  return (
    <Stack
      sx={{ opacity: item.count === 0 ? 0.3 : 1 }}
      direction="row"
      alignItems="center"
      spacing={8}
      height={50}
    >
      <InvItemName item={item} />

      <InvItemCount item={item} sx={{ width: 100 }} />

      <Typography variant="body1" width={150}>
        ${item.pricePerUnit.toFixed(2)} per {item.unit}
      </Typography>
    </Stack>
  );
}
