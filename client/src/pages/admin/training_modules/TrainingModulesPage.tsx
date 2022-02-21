import React from "react";
import Page from "../../Page";
import TrainingModule from "./TrainingModule";
import SearchBar from "../../../common/SearchBar";
import { Divider, Fab, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function TrainingModulesPage() {
  return (
    <Page title="Training modules">
      <SearchBar placeholder="Search training modules" />
      <Stack
        alignItems="stretch"
        sx={{ width: "100%", mt: 2 }}
        divider={<Divider flexItem />}
      >
        <TrainingModule
          title="Intro to CNC safety"
          questionCount={15}
          equipmentCount={3}
          makerCount={64}
        />
        <TrainingModule
          title="Don't chop off your finger"
          questionCount={6}
          equipmentCount={31}
          makerCount={1267}
        />
        <TrainingModule
          title="Soldering basics"
          questionCount={42}
          equipmentCount={6}
          makerCount={24}
        />
        <TrainingModule
          title="Intro to CNC safety"
          questionCount={52}
          equipmentCount={4}
          makerCount={9}
        />
      </Stack>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>
    </Page>
  );
}
