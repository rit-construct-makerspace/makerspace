import React, { useEffect, useState } from "react";
import Page from "../../Page";
import QuizBuilder from "./quiz/QuizBuilder";
import { Button, Stack, Tab, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { gql, useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { useParams } from "react-router-dom";
import useTimedState from "../../../hooks/useTimedState";
import SaveStatus from "./SaveStatus";
import GET_MODULE from "../../../queries/getModule";

const RENAME_MODULE = gql`
  mutation RenameModule($id: ID!, $name: String!) {
    updateModule(id: $id, name: $name) {
      id
    }
  }
`;

export default function EditModulePage() {
  const { id } = useParams<{ id: string }>();
  const [tabIndex, setTabIndex] = useState("questions-tab");

  const getModuleResult = useQuery(GET_MODULE, { variables: { id } });

  const [renameModule, renameModuleResult] = useMutation(RENAME_MODULE);

  const [name, setName, setNameSilently] = useTimedState<string>(
    "",
    (latestName) => {
      renameModule({ variables: { id, name: latestName } });
    }
  );

  const [quizBuilderLoading, setQuizBuilderLoading] = useState<boolean>(false);

  useEffect(() => {
    const queriedTitle = getModuleResult.data?.module?.name;
    if (queriedTitle) setNameSilently(queriedTitle);
  }, [getModuleResult.data, setNameSilently]);

  return (
    <RequestWrapper
      loading={getModuleResult.loading}
      error={getModuleResult.error}
    >
      <Page title="Edit training module" maxWidth="800px">
        <Stack direction="row" justifyContent="space-between">
          <TextField
            label="Module title"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: 400 }}
          />
          <Button startIcon={<DeleteIcon />} color="error">
            Delete
          </Button>
        </Stack>

        <SaveStatus
          loading={
            getModuleResult.loading ||
            renameModuleResult.loading ||
            quizBuilderLoading
          }
        />

        <TabContext value={tabIndex}>
          <TabList
            value={tabIndex}
            onChange={(e, newValue: string) => setTabIndex(newValue)}
            sx={{ mt: 4, mb: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Questions" value="questions-tab" />
            <Tab label="Equipment" value="equipment-tab" />
            <Tab label="Makers" value="makers-tab" />
          </TabList>

          <TabPanel value="questions-tab">
            <QuizBuilder setQuizBuilderLoading={setQuizBuilderLoading} />
          </TabPanel>

          <TabPanel value="equipment-tab">
            Imagine a list of equipment that use this module
          </TabPanel>

          <TabPanel value="makers-tab">
            Imagine a list of makers who have completed this module
          </TabPanel>
        </TabContext>
      </Page>
    </RequestWrapper>
  );
}
