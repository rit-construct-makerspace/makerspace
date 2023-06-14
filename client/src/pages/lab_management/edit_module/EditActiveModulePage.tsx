import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import RequestWrapper2 from "../../../common/RequestWrapper2";
import { Module, ReservationPrompt } from "../../../types/Quiz";
import { GET_MODULE, GET_TRAINING_MODULES, UPDATE_MODULE, ARCHIVE_MODULE } from "../../../queries/modules";
import 'react-toastify/dist/ReactToastify.css';
import EditModulePage from "./EditModulePage";

export default function EditActiveModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const queryResult = useQuery(GET_MODULE, {
    variables: { id }
  });

  const [updateModule, updateResult] = useMutation(UPDATE_MODULE);

  const [deleteModule] = useMutation(ARCHIVE_MODULE, {
    variables: { id },
    refetchQueries: [{ query: GET_TRAINING_MODULES }],
    onCompleted: () => navigate("/admin/training"),
  });

  const executeUpdate = async (updatedModule: Module) => {
    await updateModule({
      variables: {
        id: updatedModule.id,
        name: updatedModule.name,
        quiz: updatedModule.quiz,
      },
      refetchQueries: [
        { query: GET_MODULE, variables: { id } },
        { query: GET_TRAINING_MODULES },
      ],
    });
  }

  const executeDelete = async () => {
    await deleteModule();
  }

  return (
    <RequestWrapper2
      result={queryResult}
      render={() => (
        <EditModulePage
            moduleInitialValue={queryResult.data.module}
            deleteModule={executeDelete}
            updateModule={executeUpdate}
            updateLoading={updateResult.loading}
        />
      )}
    />
  );
}
