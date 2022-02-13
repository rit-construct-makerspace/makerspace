import React from "react";
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

// TODO: Remove this function and query for the fields instead
function addMissingFields(data: any): InventoryItem[] {
  return data.map((incomplete: any) => ({
    ...incomplete,
    image: "https://thediyplan.com/wp-content/uploads/2020/03/IMG_2897.jpg",
    labels: ["Test 1", "Test 2"],
  }));
}

export default function InventoryPage() {
  const history = useHistory();
  const { loading, error, data } = useQuery(QUERY_INVENTORY_ITEMS);

  const safeData = data ? addMissingFields(data.InventoryItems) : [];

  return (
    <RequestWrapper loading={loading} error={error}>
      <Page title="Inventory" maxWidth="1000px">
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
          {safeData.map((item) => (
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
