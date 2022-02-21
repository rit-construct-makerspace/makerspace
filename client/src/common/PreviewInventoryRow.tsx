import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Chip, Stack, Typography } from "@mui/material";
import InvItemNamePic from "./InvItemNamePic";
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
      <InvItemNamePic item={item} />

      <Stack direction="row" spacing={0.5}>
        {item.labels.map((l, index) => (
          <Chip label={l} size="small" key={`${l}-${index}`} />
        ))}
      </Stack>

      <InvItemCount item={item} sx={{ width: 100 }} />

      <Typography variant="body1" width={150}>
        ${item.pricePerUnit.toFixed(2)} per {item.unit}
      </Typography>
    </Stack>
  );
}
