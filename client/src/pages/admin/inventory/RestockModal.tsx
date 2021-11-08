import React, { useState } from "react";
import InventoryItem from "../../../types/InventoryItem";
import PrettyModal from "../../../common/PrettyModal";
import { Avatar, Button, Stack, TextField, Typography } from "@mui/material";

function parseCount(count: string): number {
  const intCount = parseInt(count);

  if (isNaN(intCount) || intCount < 0) return 0;

  return intCount;
}

interface RestockModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function RestockModal({ item, onClose }: RestockModalProps) {
  const [count, setCount] = useState(0);

  if (!item) return null;

  return (
    <PrettyModal open={!!item} onClose={onClose}>
      <Stack>
        <Typography variant="h5" component="div" sx={{ mb: 2 }}>
          Restock item
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" mb={4}>
          <Avatar alt="" src={item.image} />

          <Typography variant="body1" fontWeight={500}>
            {item.name}
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body1">Current count:</Typography>
            <Typography variant="body1" fontWeight={500}>
              {item.count}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1" ml={7.5}>
              Add
            </Typography>
            <TextField
              label="Count"
              size="small"
              sx={{ width: 100 }}
              type="number"
              autoFocus
              onKeyDown={({ key }) => {
                if (key === "Enter") onClose();
              }}
              onChange={(e) => setCount(parseCount(e.target.value))}
            />
            <Typography variant="body1">{item.pluralUnit}</Typography>
          </Stack>

          <Stack direction="row" spacing={1.75} alignItems="center">
            <Typography variant="body1">After restock:</Typography>
            <Typography variant="body1" fontWeight={500}>
              {item.count + count}
            </Typography>
          </Stack>
        </Stack>

        <Button sx={{ alignSelf: "flex-end", mt: 2 }} variant="contained">
          Restock
        </Button>
      </Stack>
    </PrettyModal>
  );
}
