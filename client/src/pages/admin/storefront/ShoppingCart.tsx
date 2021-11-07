import React, { useState } from "react";
import { ShoppingCartEntry } from "./StorefrontPage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Divider, Stack, Typography } from "@mui/material";
import ShoppingCartRow from "./ShoppingCartRow";
import CheckoutModal from "./CheckoutModal";

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
  setEntryCount: (id: string, newCount: number) => void;
  emptyCart: () => void;
}

export default function ShoppingCart({
  entries,
  removeEntry,
  setEntryCount,
  emptyCart,
}: ShoppingCartProps) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const total = entries
    .reduce((acc, { count, item }) => acc + count * item.pricePerUnit, 0)
    .toFixed(2);

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
            setEntryCount={(newCount: number) =>
              setEntryCount(entry.id, newCount)
            }
          />
        ))}
      </Stack>

      {entries.length > 0 && (
        <Stack
          spacing={1}
          sx={{ width: 150, ml: "auto", mt: 2, alignItems: "flex-start" }}
        >
          <Typography variant="h6" component="div">
            ${total}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowCheckoutModal(true)}
          >
            Checkout
          </Button>
        </Stack>
      )}

      <CheckoutModal
        open={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onFinalize={() => {
          setShowCheckoutModal(false);
          emptyCart();
        }}
      />
    </>
  );
}
