import React from "react";
import { Stack, Typography } from "@mui/material";
import CollectiveExpertAvailabilityCard from "./CollectiveExpertAvailabilityCard";
import TestData from "../../../test_data/CollectiveExpertAvailability.json";
import ExpertAvailability from "../../../types/ExpertAvailability";

interface ChooseExpertStepProps {
  stepForwards: () => void;
  onExpertClick: (expert: ExpertAvailability) => void;
}

export default function ChooseExpertStep({
  stepForwards,
  onExpertClick,
}: ChooseExpertStepProps) {
  return (
    <>
      <Typography variant="body1" marginY={2}>
        Our experts are here to help you use machines and equipment in a safe
        and effective manner.
        <br />
        Select an expert's schedule below to get started.
      </Typography>
      <Stack direction="row" spacing={16} marginTop={8}>
        {TestData.data.map((collectiveExpertAvailability) => (
          <CollectiveExpertAvailabilityCard
            key={collectiveExpertAvailability.dateString}
            collectiveExpertAvailability={collectiveExpertAvailability}
            onExpertClick={onExpertClick}
          />
        ))}
      </Stack>
    </>
  );
}
