import React from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Collapse,
  Divider,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InventoryItem from "../../../types/InventoryItem";

interface AddToCartModalProps {
  open: boolean;
  count: number;
  setCount: (count: number) => void;
  addToCart: () => void;
  onClose: () => void;
  item: InventoryItem;
}

export default function AddToCartModal({
  open,
  count,
  setCount,
  addToCart,
  onClose,
  item,
}: AddToCartModalProps) {
  const cost = count * item.pricePerUnit || 0;

  const validCost = cost > 0;
  const enoughInInventory = count <= item.count;

  const tryAddToCart = () => {
    if (!validCost || !enoughInInventory) return;

    addToCart();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack>
          <Typography variant="h5" component="div" sx={{ mb: 2 }}>
            Add to shopping cart
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={4}>
            <Avatar alt="" src={item.image} />

            <Typography variant="body1" fontWeight={500}>
              {item.name}
            </Typography>
          </Stack>

          <Stack
            alignSelf="flex-end"
            alignItems="flex-end"
            width="min-content"
            mb={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <TextField
                label="Count"
                size="small"
                sx={{ width: 100 }}
                type="number"
                autoFocus
                onKeyDown={({ key }) => {
                  if (key === "Enter") tryAddToCart();
                }}
                onChange={(e) => {
                  setCount(parseInt(e.target.value));
                }}
              />
              <Typography variant="body1">{item.pluralUnit}</Typography>
            </Stack>

            <Typography variant="body1" mt={1}>
              x ${item.pricePerUnit.toFixed(2)} per {item.unit}
            </Typography>

            <Divider flexItem sx={{ my: 1 }} />

            <Typography variant="h6" component="div">
              ${cost.toFixed(2)}
            </Typography>
          </Stack>

          <Collapse in={!enoughInInventory}>
            <Alert severity="error">
              Only {item.count} {item.pluralUnit} left in inventory
            </Alert>
          </Collapse>

          <Button
            variant="contained"
            sx={{ alignSelf: "flex-end", mt: 2 }}
            disabled={!validCost || !enoughInInventory}
            onClick={tryAddToCart}
          >
            Add to cart
          </Button>
        </Stack>
      </Card>
    </Modal>
  );
}
