import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import RequestWrapper from "../../../common/RequestWrapper";
import { GET_LATEST_SUBMISSION, GET_SUBMISSION, GET_SUBMISSIONS } from "../../../queries/getSubmissions";
import { GET_MODULE } from "../../admin/edit_module/EditModulePage";
import Page from "../../Page";
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
  const moduleResult = useQuery(GET_MODULE, { variables: { id } });

  return (
    <RequestWrapper
      loading={ submissionResult.loading || submissionResult.data === undefined }
      error={ submissionResult.error }
    >
      <RequestWrapper
          loading={ moduleResult.loading || moduleResult.data === undefined }
          error={ moduleResult.error }
        >
        <Page title="Quiz Results" maxWidth="736px"> 
         <SubmissionCard module={moduleResult.data?.module} submission={submissionResult.data?.latestSubmission}/>
        </Page>
      </RequestWrapper>
    </RequestWrapper>
  );
}
