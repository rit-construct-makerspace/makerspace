import React from "react";
import Page from "../../Page";
import Explainer from "./Explainer";
import PageSectionHeader from "../../../common/PageSectionHeader";

interface TrainingPageProps {}

export default function TrainingPage({}: TrainingPageProps) {
  return (
    <Page title="Training">
      <Explainer />
      <PageSectionHeader>Available training modules</PageSectionHeader>
      coming soon
      <PageSectionHeader>Completed training modules</PageSectionHeader>
      also coming soon
    </Page>
  );
}
