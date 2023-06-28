import { useEffect, useState } from "react";
import AnnouncementModalContents from "./AnnouncementModalContents";
import { useMutation, useQuery } from "@apollo/client";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_ANNOUNCEMENTS, GET_ANNOUNCEMENT, UPDATE_ANNOUNCEMENT, Announcement } from "../../../queries/announcementsQueries";
import { useParams } from "react-router-dom";



export default function EditAnnouncement() {

  const { id } = useParams<{ id: string }>();

  const [announcementDraft, setAnnouncementDraft] = useState<Partial<Announcement>>({});

  const query = useQuery(GET_ANNOUNCEMENT, {
    variables: { id },
  });

  const [updateAnnouncement, mutation] = useMutation(UPDATE_ANNOUNCEMENT, {
    variables: { id: id, title: announcementDraft.title, description: announcementDraft.description },
    refetchQueries: [
      { query: GET_ANNOUNCEMENTS },
      { query: GET_ANNOUNCEMENT, variables: { id } },
    ],
  });

  // After the item has been fetched, fill in the draft
  useEffect(() => {
    if (!query.data?.getAnnouncement) return;
    setAnnouncementDraft({
      ...query.data.getAnnouncement,
      __typename: undefined,
    });
  }, [query.data, setAnnouncementDraft]);


  return (
    <RequestWrapper loading={query.loading} error={query.error} minHeight={322}>
      <AnnouncementModalContents
        isNewAnnouncement={false}
        announcementDraft={announcementDraft}
        setAnnouncementDraft={setAnnouncementDraft}
        onSave={updateAnnouncement}
        loading={mutation.loading}
      />
    </RequestWrapper>
  );
}
