import React, { useState } from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import SearchBar from "../../../common/SearchBar";
import ItemRow from "./ItemRow";
import PageSectionHeader from "../../../common/PageSectionHeader";
import RestockModal from "./RestockModal";
import InventoryItem from "../../../types/InventoryItem";
import PendingOrders from "./PendingOrders";

interface InventoryPageProps {}

export default function InventoryPage({}: InventoryPageProps) {
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null);

  return (
    <Page title="Inventory">
      <PendingOrders />

      <PageSectionHeader>All Materials</PageSectionHeader>

      <SearchBar placeholder="Search inventory" />
      <Stack divider={<Divider flexItem />} mt={2}>
        {Inventory.map((item) => (
          <ItemRow
            item={item}
            onRestock={() => setRestockItem(item)}
            key={item.id}
          />
        ))}
      </Stack>

      <RestockModal item={restockItem} onClose={() => setRestockItem(null)} />
    </Page>
  );
}
