import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Box, Divider, Stack, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client"
import { LoadingButton } from "@mui/lab";
import RequestWrapper from "../../../common/RequestWrapper";
import TrainingModuleRow from "./TrainingModuleRow";
import { GET_TRAINING_MODULES, GET_ARCHIVED_TRAINING_MODULES } from "../../../queries/trainingQueries";
import { ObjectSummary } from "../../../types/Common";
import AdminPage from "../../AdminPage";

export default function TrainingModulesPage() {
  const navigate = useNavigate();

  const getModuleResults = useQuery(GET_TRAINING_MODULES);
  const getArchivedModuleResults = useQuery(GET_ARCHIVED_TRAINING_MODULES);

  const [searchText, setSearchText] = useState("");

  const handleNewModuleClicked = async () => {
    // Redirect to the module editor after creation
    navigate(`/admin/training/new`);
  };

  return (
    <AdminPage>
      <Box margin="25px">
        <Typography variant="h3">Training Modules</Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <SearchBar
          placeholder="Search training modules"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <LoadingButton
          loading={false}
          variant="outlined"
          startIcon={<CreateIcon />}
          onClick={handleNewModuleClicked}
          sx={{ height: 40 }}
        >
          New module
        </LoadingButton>
      </Stack>

      <Typography
        variant="h5"
        sx={{
          mt: 2
        }}
      >
          Active Modules
      </Typography>

      <RequestWrapper
        loading={getModuleResults.loading}
        error={getModuleResults.error}
      >
        <Stack
          alignItems="stretch"
          divider={<Divider flexItem />}
          sx={{
            width: "100%",
            mt: 1,
            mb: 3
          }}
        >
          {getModuleResults.data?.modules
            ?.filter((m: ObjectSummary) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
            .map((m: ObjectSummary) => (
              <TrainingModuleRow key={m.id} module={m} />
            ))}
        </Stack>
      </RequestWrapper>

      <Typography variant="h5">
          Archived Modules
      </Typography>

      <RequestWrapper
        loading={getArchivedModuleResults.loading}
        error={getArchivedModuleResults.error}
      >
        <Stack
          alignItems="stretch"
          divider={<Divider flexItem />}
          sx={{
            width: "100%",
            mt: 0.75,
            mb: 0.75
          }}
        >
          {getArchivedModuleResults.data?.archivedModules
            ?.filter((m: ObjectSummary) =>
              m.name
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
            .map((m: ObjectSummary) => (
              <TrainingModuleRow key={m.id} module={m} />
            ))}
        </Stack>
      </RequestWrapper>
      </Box>
    </AdminPage>
  );
}
