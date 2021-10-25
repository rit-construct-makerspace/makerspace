import React from "react";
import InventoryItem from "../../../types/InventoryItem";
import { Avatar, Stack, Typography } from "@mui/material";

interface ShoppingCartRowProps {
  item: InventoryItem;
  count: number;
}

export default function ShoppingCartRow({ item, count }: ShoppingCartRowProps) {
  return (
    <Stack direction="row">
      <Stack direction="row" spacing={2} flexGrow={1}>
        <Avatar alt="" src={item.image} sx={{ width: 24, height: 24 }} />

        <Typography variant="body1" fontWeight={500}>
          {item.name}
        </Typography>
      </Stack>
    </Stack>
  );
}
