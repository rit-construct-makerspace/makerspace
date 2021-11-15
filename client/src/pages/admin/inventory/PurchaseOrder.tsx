import React from "react";
import IPurchaseOrder from "../../../types/PurchaseOrder";
import {
  Avatar,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PurchaseOrderItemRow from "./PurchaseOrderItemRow";
import styled from "styled-components";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const StyledAttachment = styled.img`
  border-radius: 4px;
  object-fit: fill;
  width: 80px;
  height: 80px;
  margin-bottom: -7px; // remove mystery 7px bottom margin
`;

interface PurchaseOrderCardProps {
  order: IPurchaseOrder;
}

export default function PurchaseOrder({ order }: PurchaseOrderCardProps) {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" component="div">
          Expected Wednesday
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={order.creator.avatarHref}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="body2" color="text.secondary">
            {order.creator.name}, 12/12/21
          </Typography>
        </Stack>
      </Stack>

      <Stack divider={<Divider flexItem />} spacing={2} mt={2}>
        {order.items.map((poItem) => (
          <PurchaseOrderItemRow purchaseOrderItem={poItem} />
        ))}
      </Stack>

      <Typography variant="body2" color="text.secondary" mt={4}>
        Attachments
      </Typography>

      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} mt={1}>
          {order.attachments.map((att, index) => (
            <a
              href={att}
              target="_blank"
              aria-label={`Attachment ${index}`}
              key={index}
            >
              <Paper>
                <StyledAttachment src={att} alt="" />
              </Paper>
            </a>
          ))}
        </Stack>

        <Stack direction="row">
          <Button>Edit</Button>
          <Button variant="contained" startIcon={<LocalShippingIcon />}>
            Receive
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
