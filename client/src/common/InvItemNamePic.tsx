import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Avatar, Stack, Typography } from "@mui/material";

interface InventoryItemNamePicProps {
  item: InventoryItem;
}

export default function InvItemName({ item }: InventoryItemNamePicProps) {
  return (
    <Stack direction="row" spacing={2} flexGrow={1}>
      <Typography variant="body1">{item.name}</Typography>
    </Stack>
  );
}
