import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Avatar, Stack, Typography } from "@mui/material";

interface InventoryItemNamePicProps {
  item: InventoryItem;
}

export default function InvItemNamePic({ item }: InventoryItemNamePicProps) {
  return (
    <Stack direction="row" spacing={2} flexGrow={1}>
      <Avatar alt="" src={item.image} sx={{ width: 24, height: 24 }} />

      <Typography variant="body1">{item.name}</Typography>
    </Stack>
  );
}
