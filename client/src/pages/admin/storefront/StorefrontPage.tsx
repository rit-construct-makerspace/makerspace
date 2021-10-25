import React, { useState } from "react";
import Page from "../../Page";
import { Divider, Stack, Typography } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import InventoryRow from "../../../common/InventoryRow";
import SearchBar from "../../../common/SearchBar";
import InventoryItem from "../../../types/InventoryItem";
import AddToCartModal from "./AddToCartModal";
import { useImmer } from "use-immer";
import ShoppingCart from "./ShoppingCart";
import { v4 as uuidv4 } from "uuid";

export interface ShoppingCartEntry {
  id: string;
  item: InventoryItem;
  count: number;
}

interface StorefrontPageProps {}

export default function StorefrontPage({}: StorefrontPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<InventoryItem | undefined>(
    undefined
  );
  const [addToCartCount, setAddToCartCount] = useState(0);
  const [shoppingCart, setShoppingCart] = useImmer<ShoppingCartEntry[]>([]);

  const addToShoppingCart = (item: InventoryItem, count: number) =>
    setShoppingCart((draft) => {
      draft.push({
        id: uuidv4(),
        item,
        count,
      });
    });

  const removeFromShoppingCart = (id: string) =>
    setShoppingCart((draft) => {
      const index = draft.findIndex((e: ShoppingCartEntry) => e.id === id);
      draft.splice(index, 1);
    });

  return (
    <Page title="Storefront">
      <ShoppingCart
        entries={shoppingCart}
        removeEntry={removeFromShoppingCart}
      />

      <Typography variant="h5" component="div" sx={{ mb: 2, mt: 8 }}>
        Inventory
      </Typography>

      <SearchBar placeholder="Search inventory" sx={{ mb: 2 }} />

      <Stack divider={<Divider flexItem />}>
        {Inventory.map((item) => (
          <InventoryRow
            item={item}
            key={item.id}
            onClick={() => {
              setShowModal(true);
              setActiveItem(item);
            }}
          />
        ))}
      </Stack>

      {activeItem && showModal && (
        <AddToCartModal
          open
          count={addToCartCount}
          setCount={setAddToCartCount}
          addToCart={() => addToShoppingCart(activeItem, addToCartCount)}
          onClose={() => setShowModal(false)}
          item={activeItem}
        />
      )}
    </Page>
  );
}
