import React, { useCallback, useEffect, useState } from "react";
import Page from "../../Page";
import { Button, Divider, Stack, Typography } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import InventoryRow from "../../../common/InventoryRow";
import SearchBar from "../../../common/SearchBar";
import InventoryItem from "../../../types/InventoryItem";
import AddToCartModal from "./AddToCartModal";
import { useImmer } from "use-immer";
import ShoppingCart from "./ShoppingCart";
import { v4 as uuidv4 } from "uuid";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export interface ShoppingCartEntry {
  id: string;
  item: InventoryItem;
  count: number;
}

function updateLocalStorage(cart: ShoppingCartEntry[] | null) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

interface StorefrontPageProps {}

export default function StorefrontPage({}: StorefrontPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<InventoryItem | undefined>(
    undefined
  );
  const [addToCartCount, setAddToCartCount] = useState(0);
  const [shoppingCart, setShoppingCart] = useImmer<ShoppingCartEntry[]>([]);

  const getCartFromStorage = useCallback(() => {
    const storedCart = localStorage.getItem("cart");
    const parsedCart = storedCart && JSON.parse(storedCart);
    setShoppingCart(parsedCart || []);
  }, []);

  useEffect(() => {
    // Load the cart on page load
    getCartFromStorage();

    // Load the cart whenever localstorage changes
    window.addEventListener("storage", getCartFromStorage);
  }, []);

  const addToShoppingCart = (item: InventoryItem, count: number) =>
    setShoppingCart((draft) => {
      draft.push({
        id: uuidv4(),
        item,
        count,
      });

      updateLocalStorage(draft);
    });

  const removeFromShoppingCart = (id: string) =>
    setShoppingCart((draft) => {
      const index = draft.findIndex((e: ShoppingCartEntry) => e.id === id);
      draft.splice(index, 1);
      updateLocalStorage(draft);
    });

  const setEntryCount = (id: string, newCount: number) =>
    setShoppingCart((draft) => {
      const index = draft.findIndex((e: ShoppingCartEntry) => e.id === id);

      const valid = newCount > 0 && newCount <= draft[index].item.count;
      if (!valid) return;

      draft[index].count = newCount;

      updateLocalStorage(draft);
    });

  const emptyCart = () => {
    setShoppingCart((draft) => []);
    updateLocalStorage([]);
  };

  return (
    <Page
      title="Storefront"
      topRightAddons={
        <Button
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          href="/admin/storefront/preview"
          target="_blank"
        >
          Customer view
        </Button>
      }
    >
      <ShoppingCart
        entries={shoppingCart}
        removeEntry={removeFromShoppingCart}
        setEntryCount={setEntryCount}
        emptyCart={emptyCart}
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
