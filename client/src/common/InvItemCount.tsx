import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Typography, TypographyProps } from "@mui/material";

interface InvItemCountProps extends TypographyProps {
  item: InventoryItem;
  count?: number; // if not specified, we'll use the count from the item object
}

export default function InvItemCount({
  item,
  count = item.count,
  ...otherProps
}: InvItemCountProps) {
  return (
    <Typography variant="body1" {...otherProps}>
      {count} {count === 1 ? item.unit : item.pluralUnit}
    </Typography>
  );
}
