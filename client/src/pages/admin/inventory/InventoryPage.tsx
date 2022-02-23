import React, { useState } from "react";
import Page from "../../Page";
import { Button, Divider, Stack } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { useHistory } from "react-router-dom";
import InventoryRow from "../../../common/InventoryRow";
import RunningLow from "./RunningLow";
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
    }
  }
`;

export default function InventoryPage() {
  const history = useHistory();

  const [searchText, setSearchText] = useState<string>("");

  const { loading, error, data } = useQuery(QUERY_INVENTORY_ITEMS, {
    fetchPolicy: "no-cache",
  });

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="1000px">
        <RunningLow />

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
          {data?.InventoryItems?.filter((item: InventoryItem) =>
            item.name.includes(searchText)
          ).map((item: InventoryItem) => (
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
