import { Divider, Stack, Typography } from "@mui/material";
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

export default function UserTraingingsPage() {
    const user = useCurrentUser();

    const getAllModules = useQuery(GET_ALL_TRAINING_MODULES);
    const getEquipments = useQuery(GET_EQUIPMENTS);

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
                            maxHeight="30%"
                        >
                            {/* Complete Trainings */}
                            <Stack width="33%" overflow="auto">
                                <Typography variant="h4" alignSelf="center">Passed Trainings</Typography>
                                {passed.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                            {/* Expiring Trainings */}
                            <Stack width="33%" overflow="auto">
                                <Typography variant="h4" alignSelf="center">Expired Trainings</Typography>
                                {expired.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                            {/* Available Trainings */}
                            <Stack width="33%" overflow="auto">
                                <Typography variant="h4" alignSelf="center">Available Trainings</Typography>
                                {notTaken.map((ms: ModuleStatus) => (
                                    <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                                ))}
                            </Stack>
                        </Stack>
                    );
                }}
            />
            {/* Equipment */}
            <RequestWrapper2
                result={getEquipments}
                render={({equipments}) => {

                    equipments.filter((m: Equipment) => {
                        const moduleStatuses: ModuleStatus[] = m.trainingModules.map(
                            moduleStatusMapper(user.passedModules, user.trainingHolds)
                        );

                        moduleStatuses.map((status: ModuleStatus) => {
                            user.passedModules.forEach((passed: PassedModule) => {
                                status.moduleID === passed.moduleID
                                return true;
                            })
                            return false;
                        })
                    }).map(e: Equipment)

                    return (
                        <Stack spacing={1} maxHeight="30%">
                            <Typography variant="h4">Approved Equipment</Typography>
                            <Stack direction="row" overflow="auto">
                                
                            </Stack>
                            <Typography variant="h4">Awaiting In-person Knowledge Check</Typography>
                            <Stack direction="row" overflow="auto">
                            
                            </Stack>
                        </Stack>
                    );
                }}
            />
            {/* History */}
        </Stack>
    );
}