import React from "react";
import InventoryItem from "../types/InventoryItem";
import { Avatar, CardActionArea, Chip, Stack, Typography } from "@mui/material";

interface InventoryRowProps {
  item: InventoryItem;
  onClick: () => void;
}

export default function InventoryRow({ item, onClick }: InventoryRowProps) {
  return (
    <CardActionArea onClick={onClick} sx={{ py: 2 }}>
      <Stack direction="row" alignItems="center" spacing={8}>
        <Stack direction="row" spacing={2} flexGrow={1}>
          <Avatar alt="" src={item.image} sx={{ width: 24, height: 24 }} />

          <Typography variant="body1" fontWeight={500}>
            {item.name}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {item.labels.map((l, index) => (
            <Chip label={l} size="small" key={`${l}-${index}`} />
          ))}
        </Stack>

        <Typography variant="body1" sx={{ width: 100 }}>
          {item.count} {item.count === 1 ? item.unit : item.pluralUnit}
        </Typography>

        <Typography variant="body1" width={150}>
          ${item.pricePerUnit.toFixed(2)} per {item.unit}
        </Typography>
      </Stack>
    </CardActionArea>
  );
}
