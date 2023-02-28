import React, { useState } from "react";
import Page from "../../Page";
import { Divider, Stack } from "@mui/material";
import SearchBar from "../../../common/SearchBar";
import PreviewInventoryRow from "../../../common/PreviewInventoryRow";
import { useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import InventoryItem from "../../../types/InventoryItem";
import GET_INVENTORY_ITEMS from "../../../queries/getInventoryItems";

export default function InventoryPreviewPage() {
  const { loading, error, data } = useQuery(GET_INVENTORY_ITEMS);

  const [searchText, setSearchText] = useState<string>("");

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="1250px">
        <SearchBar
          placeholder="Search inventory"
          sx={{ alignSelf: "flex-start" }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText("")}
        />

        <Stack divider={<Divider flexItem />} mt={2}>
          {data?.InventoryItems?.filter((item: InventoryItem) =>
            item.name.toLowerCase().includes(searchText.toLowerCase())
          ).map((item: InventoryItem) => (
            <PreviewInventoryRow item={item} key={item.id} />
          ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
