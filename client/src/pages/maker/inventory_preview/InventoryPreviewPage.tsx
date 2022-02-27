import React, { useState } from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PreviewInventoryRow from "../../../common/PreviewInventoryRow";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import InventoryItem from "../../../types/InventoryItem";

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

export default function InventoryPreviewPage() {
  const { loading, error, data } = useQuery(QUERY_INVENTORY_ITEMS, {
    fetchPolicy: "no-cache",
  });

  const [searchText, setSearchText] = useState<string>("");

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="800px">
        <SearchBar
          placeholder="Search inventory"
          sx={{ alignSelf: "flex-start" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Stack divider={<Divider flexItem />} mt={2}>
          {data?.InventoryItems?.filter((item: InventoryItem) =>
            item.name.includes(searchText)
          ).map((item: InventoryItem) => (
            <PreviewInventoryRow item={item} key={item.id} />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
