import React, { useState } from "react";
import Page from "../../Page";
import QuizBuilder from "./quiz/QuizBuilder";
import { Button, Stack, Tab, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function EditModulePage() {
  const [tabIndex, setTabIndex] = useState("questions-tab");
  return (
    <Page title="Edit training module">
      <Stack direction="row" justifyContent="space-between">
        <TextField
          label="Module title"
          value="My Module Title"
          sx={{ width: 400 }}
        />
        <Button startIcon={<DeleteIcon />} color="error">
          Delete
        </Button>
      </Stack>

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
          <QuizBuilder />
        </TabPanel>

        <TabPanel value="equipment-tab">
          Imagine a list of equipment that use this module
        </TabPanel>

        <TabPanel value="makers-tab">
          Imagine a list of makers who have completed this module
        </TabPanel>
      </TabContext>
    </Page>
  );
}
