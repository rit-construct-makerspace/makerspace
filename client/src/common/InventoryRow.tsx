import React from "react";
import InventoryItem from "../types/InventoryItem";
import { CardActionArea, Chip, Stack, Typography } from "@mui/material";
import InvItemNamePic from "./InvItemNamePic";
import InvItemCount from "./InvItemCount";

interface InventoryRowProps {
  item: InventoryItem;
  onClick: () => void;
}

export default function InventoryRow({ item, onClick }: InventoryRowProps) {
  return (
    <CardActionArea onClick={onClick} sx={{ py: 2 }}>
      <Stack
        sx={{ opacity: item.count === 0 ? 0.5 : 1 }}
        direction="row"
        alignItems="center"
        spacing={8}
      >
        <InvItemNamePic item={item} />
        <Stack direction={"row"} spacing={0.1}>
          {!item.storefrontVisible && <Chip variant="outlined" color="primary" label="Internal" />}
          {item.staffOnly && <Chip variant="outlined" color="secondary" label="Staff Only" />}
        </Stack>

        <InvItemCount item={item} sx={{ width: 100 }} />

        <Typography variant="body1" width={150}>
          ${item.pricePerUnit.toFixed(2)} per {item.unit}
        </Typography>
      </Stack>
    </CardActionArea>
  );
}
