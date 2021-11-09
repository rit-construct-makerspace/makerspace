import React from "react";
import { ShoppingCartEntry } from "../storefront/StorefrontPage";
import { Avatar, Stack, Typography } from "@mui/material";

interface ShoppingCartRowProps {
  entry: ShoppingCartEntry;
}

export default function ShoppingCartPreviewRow({
  entry,
}: ShoppingCartRowProps) {
  const { item, count } = entry;

  return (
    <Stack direction="row" alignItems="center">
      <Stack direction="row" spacing={3} flexGrow={1} alignItems="center">
        <Avatar alt="" src={item.image} />

        <Typography variant="h5" component="div" fontWeight={500}>
          {item.name}
        </Typography>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h5" component="div" width={100} textAlign="right">
          {count}
        </Typography>

        <Typography variant="h5" component="div" width={100}>
          {count === 1 ? item.unit : item.pluralUnit}
        </Typography>
      </Stack>

      <Typography variant="h5" component="div" width={150} ml={8}>
        ${(count * item.pricePerUnit).toFixed(2)}
      </Typography>
    </Stack>
  );
}
