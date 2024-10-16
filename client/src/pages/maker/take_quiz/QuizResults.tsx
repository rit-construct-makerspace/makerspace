import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_LATEST_SUBMISSION, GET_SUBMISSION, GET_SUBMISSIONS } from "../../../queries/getSubmissions";
import { GET_MODULE } from "../../../queries/trainingQueries";
import { Module } from "../../../types/Quiz";
import Page from "../../Page";
import SubmissionCard from "./SubmissionCard";
import ResultsCard from "./ResultsCard";

export default function QuizResults() {
  const { id } = useParams<{ id: string }>();
  const submissionResult = useQuery(GET_LATEST_SUBMISSION,
    { 
      variables: { moduleID: id },
      fetchPolicy: 'network-only', // Prevents caching previous submissions if multiple attempts are made in one session
      nextFetchPolicy: 'cache-first' // Caches this submission while we are using it
    }
  );
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
          </Grid>
          <br />
          <ResultsCard summary={submissionResult.data?.latestSubmission.summary}></ResultsCard>
        </Page>
      </RequestWrapper>
    </RequestWrapper>
  );
}
