import React, { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import NoTransactionView from "./NoTransactionView";
import { ShoppingCartEntry } from "../storefront/StorefrontPage";
import CreatingTransactionView from "./CreatingTransactionView";

export default function StorefrontPreviewPage() {
  const [cart, setCart] = useState<ShoppingCartEntry[]>([]);

  const getCartFromStorage = useCallback(() => {
    const storedCart = localStorage.getItem("cart");
    const parsedCart = storedCart && JSON.parse(storedCart);
    setCart(parsedCart || []);
  }, []);

  useEffect(() => {
    // Load the cart on page load
    getCartFromStorage();

    // Load the cart whenever localstorage changes
    window.addEventListener("storage", getCartFromStorage);
  }, [getCartFromStorage]);

  return (
    <Box sx={{ padding: 4, width: "100%", height: "100vh" }}>
      {cart.length ? (
        <CreatingTransactionView cart={cart} />
      ) : (
        <NoTransactionView />
      )}
    </Box>
  );
}
