import React, { useEffect, useState } from "react";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Typography } from "@mui/material";
import { Alert } from "@mui/lab";
import PrettyModal from "../common/PrettyModal";

const SWIPE_START_CHAR = ";";
const SWIPE_END_CHAR = "?";

interface CardReaderAlertProps {}

let readingSwipe = false;
let swipeBuffer: string[] = [];

export default function CardReaderAlert({}: CardReaderAlertProps) {
  const [showModal, setShowModal] = useState(false);
  const [uid, setUid] = useState("");

  useEffect(() => {
    document.addEventListener("keydown", ({ key }) => {
      if (readingSwipe) {
        swipeBuffer.push(key);
      }

      if (key === SWIPE_START_CHAR) {
        readingSwipe = true;
        swipeBuffer = [];
      }

      if (key === SWIPE_END_CHAR) {
        readingSwipe = false;

        const uidString = swipeBuffer.slice(0, 9).join("");
        setUid(uidString);

        setShowModal(true);
      }
    });
  }, []);

  return (
    <>
      <Alert severity="info" icon={<CreditCardIcon />} sx={{ borderRadius: 0 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.2, mt: "2px" }}>
          Listening for card swipes...
        </Typography>
      </Alert>

      <PrettyModal open={showModal} onClose={() => setShowModal(false)}>
        {uid}
      </PrettyModal>
    </>
  );
}
