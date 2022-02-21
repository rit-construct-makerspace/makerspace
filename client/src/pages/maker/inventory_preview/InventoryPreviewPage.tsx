import React from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import SearchBar from "../../../common/SearchBar";
import PreviewInventoryRow from "../../../common/PreviewInventoryRow";
import PageSectionHeader from "../../../common/PageSectionHeader";

export default function InventoryPreviewPage() {
  return (
    <Page title="Inventory">
      <SearchBar placeholder="Search inventory" />

      <PageSectionHeader>All Materials</PageSectionHeader>

      <Stack divider={<Divider flexItem />} mt={2}>
        {Inventory.map((item) => (
          <PreviewInventoryRow item={item} key={item.id} />
        ))}
      </Stack>

      <PageSectionHeader>Out of Stock</PageSectionHeader>

      <Stack divider={<Divider flexItem />} mt={2}>
        {Inventory.slice(4).map((item) => (
          <PreviewInventoryRow item={item} key={item.id} />
        ))}
      </Stack>
    </Page>
  );
}
