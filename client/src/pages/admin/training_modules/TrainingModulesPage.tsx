import React from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Divider, Stack } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useHistory } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import RequestWrapper from "../../../common/RequestWrapper";
import TrainingModule from "./TrainingModule";
import GET_TRAINING_MODULES from "../../../queries/getModules";

const CREATE_TRAINING_MODULE = gql`
  mutation CreateTrainingModule($name: String) {
    createModule(name: $name) {
      id
    }
  }
`;

export default function TrainingModulesPage() {
  const history = useHistory();

  const [createModule, { loading }] = useMutation(CREATE_TRAINING_MODULE, {
    variables: { name: "New Training Module" },
    refetchQueries: [{ query: GET_TRAINING_MODULES }],
  });

  const getModuleResults = useQuery(GET_TRAINING_MODULES);

  const handleNewModuleClicked = async () => {
    const result = await createModule();
    const moduleId = result?.data?.createModule?.id;

    // Redirect to the module editor after creation
    history.push(`/admin/training/${moduleId}`);
  };

  return (
    <RequestWrapper
      loading={getModuleResults.loading}
      error={getModuleResults.error}
    >
      <Page title="Training modules" maxWidth="800px">
        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchBar placeholder="Search training modules" />
          <LoadingButton
            loading={loading}
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={handleNewModuleClicked}
            sx={{ height: 40 }}
          >
            New material
          </LoadingButton>
        </Stack>

        <Stack
          alignItems="stretch"
          sx={{ width: "100%", mt: 2 }}
          divider={<Divider flexItem />}
        >
          {getModuleResults.data?.modules?.map(
            (m: { id: number; name: string }) => (
              <TrainingModule key={m.id} id={m.id} title={m.name} />
            )
          )}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
