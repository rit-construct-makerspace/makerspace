import { Button, Grid, Stack } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import EquipmentCard from "./EquipmentCard";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import GET_EQUIPMENTS from "../../../queries/getEquipments";
import { NameAndID } from "../../lab_management/manage_equipment/ManageEquipmentPage";
import RequestWrapper from "../../../common/RequestWrapper";
import EquipmentModal from "../../maker/equipment_modal/EquipmentModal";

interface MakerEquipmentPageProps {
  isAdmin: boolean;
}

export default function EquipmentPage({ isAdmin }: MakerEquipmentPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getEquipmentsResult = useQuery(GET_EQUIPMENTS);

  const url = isAdmin ? "/admin/equipment/" : "/maker/equipment/";

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

        {!isAdmin && id && <EquipmentModal equipmentID={id} />}
      </Page>
    </RequestWrapper>
  );
}
