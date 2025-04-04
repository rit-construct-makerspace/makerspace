import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import {
    ModuleStatus,
    moduleStatusMapper,
} from "../../../common/TrainingModuleUtils";
import TrainingModuleRow from "../../../common/TrainingModuleRow";
import { searchFilter } from "../../../common/SearchBar";
import {Card, CardHeader, Typography} from "@mui/material";


export const GET_ALL_TRAINING_MODULES = gql`
  query GetAllTrainingModules {
    modules {
      id
      name
    }
  }
`;

interface IncompleteTrainingsCardProps {
    onClick: () => void;
  }

export default function IncompleteTrainingsCard({onClick}: IncompleteTrainingsCardProps) {
    const { passedModules, trainingHolds } = useCurrentUser();
    const result = useQuery(GET_ALL_TRAINING_MODULES);
    const [searchText] = useState("");

    return (
        <RequestWrapper2
            result={result}
            render={({ modules }) => {
                const moduleStatuses = modules.map(moduleStatusMapper(passedModules, trainingHolds));

                const matching = searchFilter<ModuleStatus>(
                    searchText,
                    moduleStatuses,
                    (ms: ModuleStatus) => ms.moduleName
                );
                const notTaken = matching.filter(
                    (ms: ModuleStatus) => ms.status === "Not taken"
                );

                const reordered = [...notTaken];

                return (
                    <Card sx={{ minWidth: 250, maxWidth: 500, height: 296, padding: "1em", border: 1, borderColor: "lightgrey", flexGrow: 1, overflowY: "scroll", borderRadius: 0  }} >
                            <CardHeader title="Available Trainings" sx={{pt: 0, fontWeight: 'bold'}} />
                            {reordered.map((ms: ModuleStatus) => (
                                <TrainingModuleRow key={ms.moduleID} moduleStatus={ms} />
                            ))}
                    </Card>
                );
            }}
        />
    );
}
