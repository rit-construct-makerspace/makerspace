import { useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EQUIPMENTS, GET_ARCHIVED_EQUIPMENTS } from "../../../queries/equipments";
import { ObjectSummary } from "../../../types/Common";
import RequestWrapper from "../../../common/RequestWrapper";
import EditableEquipmentCard from "./EditableEquipmentCard";

export default function ManageEquipmentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getEquipmentsResult = useQuery(GET_EQUIPMENTS);
  const getArchivedEquipmentsResult = useQuery(GET_ARCHIVED_EQUIPMENTS);

  const [searchText, setSearchText] = useState("");

  const url = "/admin/equipment/";

  return (
    <Page title="Equipment" maxWidth="1250px">
        <Stack
            spacing={2}
        >
            <Stack direction="row" spacing={2}>
                <SearchBar placeholder="Search equipment"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => navigate("/admin/equipment/new")}
                >
                    + Add Equipment
                </Button>
            </Stack>

            <Typography variant="h5">
                Active Equipment
            </Typography>

            <RequestWrapper
                loading={getEquipmentsResult.loading && getArchivedEquipmentsResult.loading}
                error={getEquipmentsResult.error}
            >
                <Grid container spacing={3} mt={2}>
                    {getEquipmentsResult.data?.equipments
                    .filter((m: ObjectSummary) =>
                        m.name
                        .toLocaleLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                    )
                    .map((e: ObjectSummary) => (
                        <Grid key={e.id} item>
                            <EditableEquipmentCard id={e.id} name={e.name} to={url + e.id} archived={false} />
                        </Grid>
                    ))}
                </Grid>
            </RequestWrapper>

            <Typography variant="h5">
                Archived Equipment
            </Typography>

            <RequestWrapper
                loading={getEquipmentsResult.loading && getArchivedEquipmentsResult.loading}
                error={getArchivedEquipmentsResult.error}
            >
                <Grid container spacing={3} mt={2}>
                    {getArchivedEquipmentsResult.data?.archivedEquipments
                    .filter((m: ObjectSummary) =>
                        m.name
                        .toLocaleLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                    )
                    .map((e: ObjectSummary) => (
                        <Grid key={e.id} item>
                            <EditableEquipmentCard id={e.id} name={e.name} to={url + "/archived/" + e.id} archived={true} />
                        </Grid>
                    ))}
                </Grid>
            </RequestWrapper>
        </Stack>
    </Page>
  );
}