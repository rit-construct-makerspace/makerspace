import React, { useState } from "react";
import Page from "../../Page";
import { Button, Divider, Stack } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useHistory } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import CreateIcon from "@mui/icons-material/Create";
import { gql, useQuery } from "@apollo/client";
import InventoryItem from "../../../types/InventoryItem";
import RequestWrapper from "../../../common/RequestWrapper";

const QUERY_INVENTORY_ITEMS = gql`
  query getInventoryItems {
    InventoryItems {
      id
      name
      unit
      pluralUnit
      count
      pricePerUnit
      threshold
    }
  }
`;

function sortItemsByName(items: InventoryItem[]): InventoryItem[] {
  return (
    items.sort((a: InventoryItem, b: InventoryItem) =>
      a.name > b.name ? 1 : -1
    ) ?? []
  );
}

export default function InventoryPage() {
  const history = useHistory();

  const [searchText, setSearchText] = useState<string>("");

  const { loading, error, data } = useQuery(QUERY_INVENTORY_ITEMS, {
    fetchPolicy: "no-cache",
  });

  const safeData = data?.InventoryItems ?? [];
  const sortedItems = sortItemsByName(safeData);
  const lowItems = sortedItems.filter((i) => i.count < i.threshold);
  const matchingItems = sortedItems.filter((i) => i.name.includes(searchText));

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="1000px">
        <PageSectionHeader top>Running Low</PageSectionHeader>

        <Stack divider={<Divider flexItem />}>
          {lowItems.map((item: InventoryItem) => (
            <InventoryRow
              item={item}
              key={item.id}
              onClick={() => history.push(`/admin/inventory/${item.id}`)}
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
            onClick={() => history.push(`/admin/inventory/new`)}
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
              onClick={() => history.push(`/admin/inventory/${item.id}`)}
            />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
