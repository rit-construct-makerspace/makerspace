import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import { useCurrentUser } from "../../../../common/CurrentUserProvider";
import { GET_ALL_TRAINING_MODULES } from "../../../maker/training/TrainingPage";
import { useQuery } from "@apollo/client";
import { ModuleStatus, moduleStatusMapper } from "../../../../common/TrainingModuleUtils";
import TrainingModuleRow from "../../../../common/TrainingModuleRow";
import RequestWrapper2 from "../../../../common/RequestWrapper2";
import { GET_ACCESS_CHECKS_BY_USERID } from "../../../../queries/accessChecksQueries";
import AccessCheck from "../../../../types/AccessCheck";
import UnpagedEquipmentCard from "../../equipment/UnpagedEquipmentCard";
import { useEffect, useState } from "react";
import UnpagedEquipmentModal from "../../../maker/equipment_modal/UnpagedEquipmentModal";
import EquipmentCard from "../../../../common/EquipmentCard";

export default function UserTraingingsPage() {
    const user = useCurrentUser();

    const getAllModules = useQuery(GET_ALL_TRAINING_MODULES);
    const getAccessChecks = useQuery(GET_ACCESS_CHECKS_BY_USERID, {variables: {userID: user.id}});

    const [modalID, setModalID] = useState<number | undefined>(undefined);

    const [width, setWidth] = useState<number>(window.innerWidth);
    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 1100;

    const [manageEquipment, setManageEquipment] = useState(false);
    const [curEquipID, setCurEquipID] = useState(0);

    function handleOpen(id: number) {
        setCurEquipID(id);
        setManageEquipment(true);
    }

    function handleClose() {
        setManageEquipment(false);
    }

    return (
        <Stack
            spacing={2}
            margin={isMobile ? "10px" : "20px"}
            width="fit-content"
            height="100vh"
            divider={<Divider orientation="horizontal" flexItem/>}
        >
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
                            direction={isMobile ? "column" : "row"}
                            justifyContent={isMobile ? "center" : "space-between"}
                            divider={isMobile ? <Divider orientation="horizontal" flexItem/> : <Divider orientation="vertical" flexItem/>}
                            height={isMobile ? undefined : "30%"}
                            width="100%"
                        >
                            {/* Complete Trainings */}
                            <Stack width={isMobile ? "auto" : "50%"} overflow="auto">
                                <Typography variant="h4" alignSelf="center">Passed Trainings</Typography>
                                {passed.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                            {/* Expiring Trainings */}
                            <Stack width={isMobile ? "auto" : "50%"} overflow="auto">
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
                        <Stack spacing={1} >
                            <Typography variant="h4">Approved Equipment</Typography>
                            <Grid container justifyContent="space-around" width="fit-content" rowSpacing={2}>
                                {approved.map((ac: AccessCheck) => (
                                    <Grid item key={ac.equipment.id}>
                                        <EquipmentCard 
                                            equipment={ac.equipment}
                                            isMobile={isMobile}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                            <Typography variant="h4">Awaiting In-person Knowledge Check</Typography>
                            <Grid container justifyContent="space-around" width="fit-content"  rowSpacing={2}>
                                {unapproved.map((ac: AccessCheck) => (
                                    <Grid item key={ac.equipment.id}>
                                        <EquipmentCard
                                            equipment={ac.equipment}
                                            isMobile={isMobile}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Stack>
                    );
                }}
            />
        </Stack>
    );
}