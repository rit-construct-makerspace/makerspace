import React from "react";
import { Divider, Stack } from "@mui/material";
import PageSectionHeader from "../../../common/PageSectionHeader";
import EmptyPageSection from "../../../common/EmptyPageSection";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TestData from "../../../test_data/PendingOrders";
import PendingOrderRow from "./PendingOrderRow";

interface PendingOrdersProps {}

export default function PendingOrders({}: PendingOrdersProps) {
  return (
    <Stack>
      <PageSectionHeader top>Pending Orders</PageSectionHeader>
      <EmptyPageSection
        icon={<LocalShippingIcon />}
        label="No pending orders."
      />
      <Stack divider={<Divider flexItem />} mt={2}>
        {TestData.map((order) => (
          <PendingOrderRow order={order} key={order.id} />
        ))}
      </Stack>
    </Stack>
  );
}
