import React from "react";
import { Avatar, CardActionArea, Chip, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import InventoryItem from "../../../types/InventoryItem";
import DropdownButton from "../../../common/DropdownButton";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";

interface ItemRowProps {
  item: InventoryItem;
  onRestock: () => void;
}

export default function ItemRow({ item, onRestock }: ItemRowProps) {
  const history = useHistory();

  return (
    <Stack direction="row" alignItems="center" spacing={2} ml={-2}>
      <CardActionArea
        onClick={() => history.push(`/admin/inventory/${item.id}`)}
        sx={{ p: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={8}>
          <Stack direction="row" spacing={2} flexGrow={1}>
            <Avatar alt="" src={item.image} sx={{ width: 24, height: 24 }} />

            <Typography variant="body1" fontWeight={500}>
              {item.name}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            {item.labels.map((l, index) => (
              <Chip label={l} size="small" key={`${l}-${index}`} />
            ))}
          </Stack>

          <Typography variant="body1" sx={{ width: 100 }}>
            {item.count} {item.count === 1 ? item.unit : item.pluralUnit}
          </Typography>

          <Typography variant="body1" width={150}>
            ${item.pricePerUnit.toFixed(2)} per {item.unit}
          </Typography>
        </Stack>
      </CardActionArea>

      <DropdownButton
        onClick={onRestock}
        items={[
          {
            icon: <LocalShippingIcon />,
            label: "Create order",
            onClick: () => {},
          },
          {
            icon: <HistoryIcon />,
            label: "View logs",
            onClick: () => {},
          },
          {
            icon: <EditIcon />,
            label: "Edit item",
            onClick: () => {},
          },
        ]}
      >
        Restock
      </DropdownButton>
    </Stack>
  );
}
