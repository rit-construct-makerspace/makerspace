import React from "react";
import { ShoppingCartEntry } from "./StorefrontPage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Divider, Stack, Typography } from "@mui/material";
import ShoppingCartRow from "./ShoppingCartRow";

function EmptyShoppingCart() {
  return (
    <Stack
      sx={{
        bgcolor: "grey.100",
        p: 2,
        borderRadius: 1,
      }}
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
    >
      <ShoppingCartIcon fontSize="inherit" opacity={0.5} />

      <Typography color="grey.600" fontStyle="italic">
        Shopping cart empty.
      </Typography>
    </Stack>
  );
}

interface ShoppingCartProps {
  entries: ShoppingCartEntry[];
  removeEntry: (id: string) => void;
}

export default function ShoppingCart({
  entries,
  removeEntry,
}: ShoppingCartProps) {
  return (
    <>
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Shopping cart
      </Typography>

      {entries.length === 0 && <EmptyShoppingCart />}

      <Stack spacing={1} divider={<Divider flexItem />}>
        {entries.map((entry) => (
          <ShoppingCartRow
            shoppingCartEntry={entry}
            key={entry.id}
            removeEntry={() => removeEntry(entry.id)}
          />
        ))}
      </Stack>
    </>
  );
}
