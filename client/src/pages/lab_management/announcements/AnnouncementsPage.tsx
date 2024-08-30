import { useState } from "react";
import Page from "../../Page";
import SearchBar from "../../../common/SearchBar";
import { Divider, Stack } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_ANNOUNCEMENTS } from "../../../queries/announcementsQueries";
import AnnouncementModule from "./AnnouncementModule";
import AdminPage from "../../AdminPage";


export default function AnnouncementsPage() {
  const navigate = useNavigate();

  const getAnnouncementsResults = useQuery(GET_ANNOUNCEMENTS);

  const [searchText, setSearchText] = useState("");

  const handleNewAnnouncementClicked = async () => {
    //const result = await createAnnouncement();
    //const announcementID = result?.data?.createAnnouncement?.id;

    // Redirect to the announcement editor after creation
    //navigate(`/admin/announcements/${announcementID}`);
    //navigate(`/admin/announcements/sample`);s
    navigate(`/admin/announcements/new`);
  };

  return (
    <RequestWrapper
      loading={getAnnouncementsResults.loading}
      error={getAnnouncementsResults.error}
    >
      <AdminPage title="Announcements" maxWidth="1250px">
        <Stack direction="row" alignItems="center" spacing={1}>
          <SearchBar
            placeholder="Search announcements"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <LoadingButton
            loading={false}
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
          {getAnnouncementsResults.data?.getAllAnnouncements
            ?.filter((m: { id: number; title: string }) =>
              m.title
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
            .map((m: { id: number; title: string }) => (
              <AnnouncementModule key={m.id} id={m.id} title={m.title} />
            ))}
        </Stack>
      </AdminPage>
    </RequestWrapper>
  );
}
