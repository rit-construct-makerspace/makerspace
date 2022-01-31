import React from "react";
import Page from "../../Page";
import PrivilegeControl from "./PrivilegeControl";
import PageSectionHeader from "../../../common/PageSectionHeader";
import { Avatar, Button, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerZone from "./DangerZone";
import generateUsers from "../../../test_data/Users";
import HistoryIcon from "@mui/icons-material/History";

interface ManageUserPageProps {}

const user = generateUsers(1, 0, 0)[0];

export default function ManageUserPage({}: ManageUserPageProps) {
  return (
    <Page title="Manage User">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt="" src={user.image} sx={{ width: 80, height: 80 }} />
        <Typography variant="h5" component="div" fontWeight={500}>
          {user.name}
        </Typography>
      </Stack>

      <PrivilegeControl user={user} />

      <PageSectionHeader>Account Holds</PageSectionHeader>
      <Stack direction="row" spacing={1} sx={{ opacity: 0.8 }}>
        <CheckCircleIcon color="success" fontSize="small" />
        <Typography variant="body1" fontStyle="italic">
          No holds.
        </Typography>
      </Stack>

      <Button variant="contained" sx={{ mt: 2 }}>
        Place hold
      </Button>

      <PageSectionHeader>Activity</PageSectionHeader>
      <Button startIcon={<HistoryIcon />} variant="contained">
        View logs
      </Button>

      <DangerZone />
    </Page>
  );
}
