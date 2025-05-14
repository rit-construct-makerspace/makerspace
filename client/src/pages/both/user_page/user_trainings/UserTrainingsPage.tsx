import { Box, Divider, Stack, Typography } from "@mui/material";
import { PassedModule, useCurrentUser } from "../../../../common/CurrentUserProvider";
import { GET_ALL_TRAINING_MODULES } from "../../../maker/training/TrainingPage";
import { useQuery } from "@apollo/client";
import RequestWrapper from "../../../../common/RequestWrapper";
import { searchFilter } from "../../../../common/SearchBar";
import { ModuleStatus, moduleStatusMapper } from "../../../../common/TrainingModuleUtils";
import TrainingModuleRow from "../../../../common/TrainingModuleRow";
import RequestWrapper2 from "../../../../common/RequestWrapper2";
import GET_EQUIPMENTS from "../../../../queries/equipmentQueries";
import Equipment from "../../../../types/Equipment";
import { GET_ACCESS_CHECKS_BY_USERID } from "../../../../queries/accessChecksQueries";
import AccessCheck from "../../../../types/AccessCheck";
import UnpagedEquipmentCard from "../../equipment/UnpagedEquipmentCard";
import { SetStateAction, useState } from "react";
import UnpagedEquipmentModal from "../../../maker/equipment_modal/UnpagedEquipmentModal";

export default function UserTraingingsPage() {
    const user = useCurrentUser();

    const getAllModules = useQuery(GET_ALL_TRAINING_MODULES);
    const getAccessChecks = useQuery(GET_ACCESS_CHECKS_BY_USERID, {variables: {userID: user.id}});

    const [modalID, setModalID] = useState<number | undefined>(undefined);

    return (
        <Stack spacing={2} margin="20px" width="100%" divider={<Divider orientation="horizontal" flexItem/>}>
            {/* Trainings */}
            <RequestWrapper2
                result={getAllModules}
                render={({modules}) => {
                    const moduleStatuses = modules.map(moduleStatusMapper(user.passedModules, user.trainingHolds));
                    
            
                    const expired = moduleStatuses.filter(
                        (ms: ModuleStatus) => ms.status === "Expired"
                    );
                    const passed = moduleStatuses.filter(
                        (ms: ModuleStatus) => ms.status === "Passed"
                    );
                    const notTaken = moduleStatuses.filter(
                        (ms: ModuleStatus) => ms.status === "Not taken"
                    );
                    const locked = moduleStatuses.filter(
                        (ms: ModuleStatus) => ms.status === "Locked"
                    );

                    return (
                        <Stack
                            spacing={3}
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem/>}
                            maxHeight="20%"
                        >
                            {/* Complete Trainings */}
                            <Stack width="40%" overflow="auto">
                                <Typography variant="h4" alignSelf="center">Passed Trainings</Typography>
                                {passed.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                            {/* Expiring Trainings */}
                            <Stack width="40%" overflow="auto">
                                <Typography variant="h4" alignSelf="center">Expired Trainings</Typography>
                                {expired.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                        </Stack>
                    );
                }}
            />
            {/* Equipment */}
            <RequestWrapper2
                result={getAccessChecks}
                render={({accessChecksByUserID}) => {

                    const approved = accessChecksByUserID.filter(
                        (ac: AccessCheck) => ac.approved
                    );

                    const unapproved = accessChecksByUserID.filter(
                        (ac: AccessCheck) => !ac.approved && !ac.equipment.byReservationOnly
                    );

                    return (
                        <Stack spacing={1}>
                            <Typography variant="h4">Approved Equipment</Typography>
                            <Stack direction="row" overflow="auto" spacing={2}>
                                {approved.map((ac: AccessCheck) => (
                                    <Box width="250px" height="345px" padding="20px 0px">
                                        <UnpagedEquipmentCard
                                            id={ac.equipment.id}
                                            name={ac.equipment.name}
                                            setID={setModalID}
                                            sopUrl={ac.equipment.sopUrl}
                                            trainingModules={ac.equipment.trainingModules}
                                            byReservationOnly={ac.equipment.byReservationOnly}
                                            imageUrl={((ac.equipment.imageUrl == undefined || ac.equipment.imageUrl == null || ac.equipment.imageUrl === "") ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + ac.equipment.imageUrl)}
                                    />
                                    </Box>
                                ))}
                            </Stack>
                            <Typography variant="h4">Awaiting In-person Knowledge Check</Typography>
                            <Stack direction="row" overflow="auto" spacing={2}>
                                {unapproved.map((ac: AccessCheck) => (
                                    <Box width="250px" height="345px" padding="20px 0px">
                                        <UnpagedEquipmentCard
                                            id={ac.equipment.id}
                                            name={ac.equipment.name}
                                            setID={setModalID}
                                            sopUrl={ac.equipment.sopUrl}
                                            trainingModules={ac.equipment.trainingModules}
                                            byReservationOnly={ac.equipment.byReservationOnly}
                                            imageUrl={((ac.equipment.imageUrl == undefined || ac.equipment.imageUrl == null || ac.equipment.imageUrl === "") ? process.env.PUBLIC_URL + "/shed_acronym_vert.jpg" : "" + process.env.REACT_APP_CDN_URL + process.env.REACT_APP_CDN_EQUIPMENT_DIR + "/" + ac.equipment.imageUrl)}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                            <UnpagedEquipmentModal equipmentID={modalID} setEquipmentID={setModalID}/>
                        </Stack>
                    );
                }}
            />
            {/* History */}
        </Stack>
    );
}