import React from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import PurchaseOrderList from "./PurchaseOrderList";
import { useHistory } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import RunningLow from "./RunningLow";

interface InventoryPageProps {}

export default function InventoryPage({}: InventoryPageProps) {
  const history = useHistory();

  return (
    <Page title="Inventory">
      <PurchaseOrderList />

      <RunningLow />

      <PageSectionHeader>All Materials</PageSectionHeader>

      <SearchBar placeholder="Search inventory" />
      <Stack divider={<Divider flexItem />} mt={2}>
        {Inventory.map((item) => (
          <InventoryRow
            item={item}
            key={item.id}
            onClick={() => history.push(`/admin/inventory/${item.id}`)}
          />
        ))}
      </Stack>
    </Page>
  );
}
