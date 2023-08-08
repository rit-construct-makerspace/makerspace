import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_LATEST_SUBMISSION, GET_SUBMISSION, GET_SUBMISSIONS } from "../../../queries/getSubmissions";
import { GET_MODULE } from "../../../queries/trainingQueries";
import { Module } from "../../../types/Quiz";
import Page from "../../Page";
import ReservationPromptCard from "./ReservationPrompt";
import SubmissionCard from "./SubmissionCard";

export default function QuizResults() {
  const { id } = useParams<{ id: string }>();
  const submissionResult = useQuery(GET_LATEST_SUBMISSION,
    { 
      variables: { moduleID: id },
      fetchPolicy: 'network-only', // Prevents caching previous submissions if multiple attempts are made in one session
      nextFetchPolicy: 'cache-first' // Caches this submission while we are using it
    }
  );
  const [reservation, setReservationDraft] = useImmer<{ dateTime: Date | null, equipmentID: number | undefined }>({
    dateTime: new Date(),
    equipmentID: undefined
  });
  const moduleResult = useQuery<{module: Module}>(
    GET_MODULE,
    {
      variables: { id }
    }
  );

  return (
    <RequestWrapper
      loading={ submissionResult.loading || submissionResult.data === undefined }
      error={ submissionResult.error }
    >
      <RequestWrapper
          loading={ moduleResult.loading || moduleResult.data === undefined }
          error={ moduleResult.error }
        >
        <Page title="Quiz Results" maxWidth="800px">
          <Grid container rowSpacing={3}>
            <Grid item xs={12}>
              <SubmissionCard module={moduleResult.data?.module!} submission={submissionResult.data?.latestSubmission}/>
            </Grid>
            {
              moduleResult.data?.module?.reservationPrompt?.enabled && submissionResult.data?.latestSubmission?.passed ?
                <Grid item xs={12}>
                  <ReservationPromptCard
                    moduleID={moduleResult.data?.module?.id}
                    promptText={moduleResult.data.module.reservationPrompt.promptText}
                    reservation={reservation}
                    updateReservation={(reservation) => {setReservationDraft(reservation)}}
                  />
                </Grid>
              : null
            }
          </Grid>
        </Page>
      </RequestWrapper>
    </RequestWrapper>
  );
}
