import React from "react";
import Page from "../../Page";
import Explainer from "./Explainer";
import PageSectionHeader from "../../../common/PageSectionHeader";
import MakerTrainingModules from "../../../test_data/MakerTrainingModules";
import AvailableModuleThumbnail from "./AvailableModuleThumbnail";
import CompletedModuleThumbnail from "./CompletedModuleThumbnail";
import { Stack } from "@mui/material";

interface TrainingPageProps {}

export default function TrainingPage({}: TrainingPageProps) {
  return (
    <Page title="Training">
      <Explainer />

      <PageSectionHeader>Available training modules</PageSectionHeader>

      <Stack direction="row" flexWrap="wrap">
        {MakerTrainingModules.available.map((m) => (
          <AvailableModuleThumbnail
            key={m.id}
            title={m.title}
            image={m.image}
            estimatedDuration={m.estimatedDuration}
          />
        ))}
      </Stack>

      <PageSectionHeader>Completed training modules</PageSectionHeader>

      <Stack direction="row" flexWrap="wrap">
        {MakerTrainingModules.completed.map((m) => (
          <CompletedModuleThumbnail
            key={m.id}
            title={m.title}
            image={m.image}
            completionDate={m.completionDate}
          />
        ))}
      </Stack>
    </Page>
  );
}
