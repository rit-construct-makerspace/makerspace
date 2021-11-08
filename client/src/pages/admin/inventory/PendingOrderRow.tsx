import React from "react";
import PendingOrder from "../../../types/PendingOrder";
import { Avatar, Stack } from "@mui/material";
import DropdownButton from "../../../common/DropdownButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface PendingOrderRowProps {
  order: PendingOrder;
}

export default function PendingOrderRow({ order }: PendingOrderRowProps) {
  return (
    <Stack direction="row">
      <Avatar alt="" src={order.item.image} />
      <DropdownButton
        onClick={() => {}}
        items={[
          {
            label: "Edit order",
            icon: <EditIcon />,
            onClick: () => {},
          },
          {
            label: "Delete order",
            icon: <DeleteIcon />,
            onClick: () => {},
          },
        ]}
      >
        Fulfill
      </DropdownButton>
    </Stack>
  );
}
