import React, { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Divider, Stack } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import RequestWrapper from "../../../common/RequestWrapper";
import GET_TRAINING_MODULES from "../../../queries/modules";
import { GET_ANNOUNCEMENTS } from "../../../queries/getAnnouncements";
import { Announcement } from "@mui/icons-material";
import TrainingModule from "../training_modules/TrainingModule";
import AnnouncementModule from "./AnnouncementModule";

export const CREATE_ANNOUNCEMENT = gql`
  mutation CreateAnnouncement($title: String, $description: String) {
    createAnnouncement(title: $title, description: $description) {
      id
    }
  }
`;

export default function AnnouncementsPage() {
  const navigate = useNavigate();

  const [createAnnouncement, { loading }] = useMutation(CREATE_ANNOUNCEMENT, {
    variables: { name: "New Announcement", description: "New description" },
    refetchQueries: [{ query: GET_ANNOUNCEMENTS }],
  });

  const getAnnouncementsResults = useQuery(GET_ANNOUNCEMENTS);

  const [searchText, setSearchText] = useState("");

  const handleNewAnnouncementClicked = async () => {
    //const result = await createAnnouncement();
    //const announcementID = result?.data?.createAnnouncement?.id;

    // Redirect to the announcement editor after creation
    //navigate(`/admin/announcements/${announcementID}`);
    navigate(`/admin/announcements/sample`);
  };

  return (
    <RequestWrapper
      loading={getAnnouncementsResults.loading}
      error={getAnnouncementsResults.error}
    >
      <Page title="Announcements" maxWidth="1250px">
        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchBar
            placeholder="Search announcements"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <LoadingButton
            loading={loading}
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={handleNewAnnouncementClicked}
            sx={{ height: 40 }}
          >
            New announcement
          </LoadingButton>
        </Stack>

        <Stack
          alignItems="stretch"
          sx={{ width: "100%", mt: 2 }}
          divider={<Divider flexItem />}
        >
          {getAnnouncementsResults.data?.modules
            ?.filter((m: { id: number; title: string }) =>
              m.title
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
            .map((m: { id: number; title: string }) => (
              <AnnouncementModule key={m.id} id={m.id} title={m.title} />
            ))}
        </Stack>
      </Page>
    </RequestWrapper>
  );
}
