import { useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_EQUIPMENTS, GET_ARCHIVED_EQUIPMENTS } from "../../../queries/equipmentQueries";
import { ObjectSummary } from "../../../types/Common";
import RequestWrapper from "../../../common/RequestWrapper";
import EditableEquipmentCard from "./EditableEquipmentCard";
import Equipment from "../../../types/Equipment";
import AdminPage from "../../AdminPage";
import EquipmentModal from "../../maker/equipment_modal/EquipmentModal";
import MaintenanceLogModal from "./MaintenanceLog";

export default function ManageEquipmentPage({showLogs}: {showLogs?: boolean}) {
  const { id, logid } = useParams<{ id: string, logid: string }>();
  const navigate = useNavigate();

  const getEquipmentsResult = useQuery(GET_EQUIPMENTS);
  const getArchivedEquipmentsResult = useQuery(GET_ARCHIVED_EQUIPMENTS);

  const [searchText, setSearchText] = useState("");

  const url = "/admin/equipment/";

  return (
    <AdminPage title="Equipment" maxWidth="1250px">
        <Stack
            spacing={2}
        >
            <Stack direction="row" spacing={2}>
                <SearchBar placeholder={"Search " + getEquipmentsResult.data?.equipments.length + " equipment"}
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
                    .filter((m: Equipment) =>
                        m.name
                        .toLocaleLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                    )
                    .map((e: Equipment) => (
                        <Grid key={e.id} item>
                            <EditableEquipmentCard id={e.id} name={e.name} to={url + e.id} archived={false} sopUrl={e.sopUrl} imageUrl={(e.imageUrl == undefined || e.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR +  "/" + e.imageUrl)} />
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
                    .filter((m: Equipment) =>
                        m.name
                        .toLocaleLowerCase()
                        .includes(searchText.toLocaleLowerCase())
                    )
                    .map((e: Equipment) => (
                        <Grid key={e.id} item>
                            <EditableEquipmentCard id={e.id} name={e.name} to={url + "/archived/" + e.id} archived={true} sopUrl={e.sopUrl} imageUrl={(e.imageUrl == undefined || e.imageUrl == null ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + e.imageUrl)} />
                        </Grid>
                    ))}
                </Grid>
            </RequestWrapper>
        </Stack>
        { showLogs && logid && <MaintenanceLogModal equipmentID={logid} />}
    </AdminPage>
  );
}