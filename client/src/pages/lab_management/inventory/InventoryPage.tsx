import React, { useState } from "react";
import Page from "../../Page";
import { Button, Divider, Stack } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useNavigate } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import CreateIcon from "@mui/icons-material/Create";
import { useQuery } from "@apollo/client";
import InventoryItem from "../../../types/InventoryItem";
import RequestWrapper from "../../../common/RequestWrapper";
import MaterialModal from "./MaterialModal";
import GET_INVENTORY_ITEMS from "../../../queries/getInventoryItems";

function sortItemsByName(items: InventoryItem[]): InventoryItem[] {
  return [...items].sort((a, b) => (a.name > b.name ? 1 : -1)) ?? [];
}

export default function InventoryPage() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState<string>("");
  const [modalItemId, setModalItemId] = useState<string>("");

  const { loading, error, data } = useQuery(GET_INVENTORY_ITEMS);

  const safeData = data?.InventoryItems ?? [];
  const sortedItems = sortItemsByName(safeData);
  const lowItems = sortedItems.filter((i) => i.count < i.threshold);
  const matchingItems = sortedItems.filter((i) => i.name.includes(searchText));

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="1250px">
        <PageSectionHeader top>Running Low</PageSectionHeader>

        <Stack divider={<Divider flexItem />}>
          {lowItems.map((item: InventoryItem) => (
            <InventoryRow
              item={item}
              key={item.id}
              onClick={() => navigate(`/admin/inventory/${item.id}`)}
            />
          ))}
        </Stack>

        <PageSectionHeader>All Materials</PageSectionHeader>

        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchBar
            placeholder="Search inventory"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={() => setModalItemId("new")}
            sx={{ height: 40 }}
          >
            New material
          </Button>
        </Stack>

        <Stack divider={<Divider flexItem />} mt={2}>
          {matchingItems.map((item: InventoryItem) => (
            <InventoryRow
              item={item}
              key={item.id}
              onClick={() => setModalItemId(item.id + "")}
            />
          ))}
        </Stack>

        <MaterialModal
          itemId={modalItemId}
          onClose={() => setModalItemId("")}
        />
      </Page>
    </RequestWrapper>
  );
}
