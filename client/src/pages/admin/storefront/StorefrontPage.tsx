import React, { useState } from "react";
import Page from "../../Page";
import { Divider, Stack, Typography } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import InventoryRow from "../../../common/InventoryRow";
import SearchBar from "../../../common/SearchBar";
import InventoryItem from "../../../types/InventoryItem";
import AddToCartModal from "./AddToCartModal";

interface StorefrontPageProps {}

export default function StorefrontPage({}: StorefrontPageProps) {
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState<InventoryItem | undefined>(
    undefined
  );

  return (
    <Page title="Storefront">
      <Typography variant="h5" component="div" sx={{ mb: 2 }}>
        Shopping cart
      </Typography>

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
          onClose={() => setShowModal(false)}
          item={activeItem}
        />
      )}
    </Page>
  );
}
