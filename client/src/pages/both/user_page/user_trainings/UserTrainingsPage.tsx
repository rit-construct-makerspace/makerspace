import { Divider, Stack, Typography } from "@mui/material";
import { useCurrentUser } from "../../../../common/CurrentUserProvider";
import { GET_ALL_TRAINING_MODULES } from "../../../maker/training/TrainingPage";
import { useQuery } from "@apollo/client";
import RequestWrapper from "../../../../common/RequestWrapper";
import { searchFilter } from "../../../../common/SearchBar";
import { ModuleStatus, moduleStatusMapper } from "../../../../common/TrainingModuleUtils";
import TrainingModuleRow from "../../../../common/TrainingModuleRow";
import RequestWrapper2 from "../../../../common/RequestWrapper2";

export default function UserTraingingsPage() {
    const { passedModules, trainingHolds } = useCurrentUser();

    const getAllModules = useQuery(GET_ALL_TRAINING_MODULES);

    return (
        <Stack spacing={2} margin="20px" width="100%" divider={<Divider orientation="horizontal" flexItem/>}>
            {/* Trainings */}
            <RequestWrapper2
                result={getAllModules}
                render={({modules}) => {
                    const moduleStatuses = modules.map(moduleStatusMapper(passedModules, trainingHolds));
                    
                    const matching = searchFilter<ModuleStatus>(
                        "",
                        moduleStatuses,
                        (ms: ModuleStatus) => ms.moduleName
                    );
            
                    const expired = matching.filter(
                        (ms: ModuleStatus) => ms.status === "Expired"
                    );
                    const passed = matching.filter(
                        (ms: ModuleStatus) => ms.status === "Passed"
                    );
                    const notTaken = matching.filter(
                        (ms: ModuleStatus) => ms.status === "Not taken"
                    );
                    const locked = matching.filter(
                        (ms: ModuleStatus) => ms.status === "Locked"
                    );

                    return (
                        <Stack
                            spacing={3}
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem/>}
                            maxHeight="25%"
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
            {/* History */}
        </Stack>
    );
}