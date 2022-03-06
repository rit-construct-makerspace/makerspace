import React from "react";
import { Button, Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import MachineCard from "./MachineCard";
import { useHistory } from "react-router-dom";

interface MakerEquipmentPageProps {
  isAdmin: boolean;
}

export default function EquipmentPage({ isAdmin }: MakerEquipmentPageProps) {
  const history = useHistory();

  const machineCardLink = isAdmin
    ? "/admin/edit-equipment"
    : "/create-reservation";

  return (
    <Page title="Equipment">
      <Stack direction="row" spacing={2}>
        <SearchBar placeholder="Search equipment" />
        {isAdmin && (
          <Button
            variant="contained"
            onClick={() => history.push("/admin/equipment/new")}
          >
            + Add Equipment
          </Button>
        )}
      </Stack>

      <Grid container spacing={2} mt={2}>
        <MachineCard
          name={"ROBOTEC 1325"}
          category={"CNC Machining"}
          to={machineCardLink}
        />
        <MachineCard
          name={"ROBOTEC 1325"}
          category={"CNC Machining"}
          to={machineCardLink}
        />
        <MachineCard
          name={"ROBOTEC 1325"}
          category={"CNC Machining"}
          to={machineCardLink}
        />
        <MachineCard
          name={"ROBOTEC 1325"}
          category={"CNC Machining"}
          to={machineCardLink}
        />
      </Grid>
    </Page>
  );
}
