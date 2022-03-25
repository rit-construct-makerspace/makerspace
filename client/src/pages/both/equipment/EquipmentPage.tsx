import React from "react";
import { Button, Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import EquipmentCard from "./EquipmentCard";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import { NameAndID } from "../../admin/manage_equipment/ManageEquipmentPage";
import RequestWrapper from "../../../common/RequestWrapper";

interface MakerEquipmentPageProps {
  isAdmin: boolean;
}

export default function EquipmentPage({ isAdmin }: MakerEquipmentPageProps) {
  const navigate = useNavigate();

  const getEquipmentsResult = useQuery(GET_EQUIPMENTS);

  const url = isAdmin ? "/admin/equipment/" : "/create-reservation/";

  return (
    <RequestWrapper
      loading={getEquipmentsResult.loading}
      error={getEquipmentsResult.error}
    >
      <Page title="Equipment">
        <Stack direction="row" spacing={2}>
          <SearchBar placeholder="Search equipment" />
          {isAdmin && (
            <Button
              variant="contained"
              onClick={() => navigate("/admin/equipment/new")}
            >
              + Add Equipment
            </Button>
          )}
        </Stack>

        <Grid container spacing={2} mt={2}>
          {getEquipmentsResult.data?.equipments.map((e: NameAndID) => (
            <EquipmentCard key={e.id} name={e.name} to={url + e.id} />
          ))}
        </Grid>
      </Page>
    </RequestWrapper>
  );
}
