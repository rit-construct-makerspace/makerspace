import React, { useState } from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";
import CloseButton from "../../../common/CloseButton";

interface PurchaseOrderExplainerProps {}

export default function PurchaseOrderExplainer({}: PurchaseOrderExplainerProps) {
  const [showAlert, setShowAlert] = useState<boolean>(true);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity="info"
        action={<CloseButton onClick={() => setShowAlert(false)} />}
        sx={{ mb: 4 }}
      >
        <AlertTitle>What is a purchase order?</AlertTitle>
        Purchase orders make it easy to track incoming inventory, and to add
        said inventory to the system once the delivery arrives. You can record
        which supplies were purchased at what price, an expected delivery date,
        and even attach screenshots and receipts.
      </Alert>
    </Collapse>
  );
}
