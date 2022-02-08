import React from "react";
import Page from "../../Page";
import { Button, Divider, Stack } from "@mui/material";
import Inventory from "../../../test_data/Inventory";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import PurchaseOrderList from "./PurchaseOrderList";
import { useHistory } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import RunningLow from "./RunningLow";
import CreateIcon from "@mui/icons-material/Create";

interface InventoryPageProps {}

export default function InventoryPage({}: InventoryPageProps) {
  const history = useHistory();

  return (
    <Page title="Inventory">
      <PurchaseOrderList />

      <RunningLow />

      <PageSectionHeader>All Materials</PageSectionHeader>

      <Stack direction="row" alignItems="center" spacing={1}>
        <SearchBar placeholder="Search inventory" />
        <Button
          variant="outlined"
          startIcon={<CreateIcon />}
          onClick={() => history.push(`/admin/inventory/new`)}
        >
          New material
        </Button>
      </Stack>

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
