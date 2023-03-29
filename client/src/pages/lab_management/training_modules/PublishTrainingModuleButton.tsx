import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import PublishButton from "../../../common/PublishButton";
import { GET_ARCHIVED_MODULE, GET_ARCHIVED_TRAINING_MODULES, GET_TRAINING_MODULES, PUBLISH_TRAINING_MODULE } from "../../../queries/modules";

interface PublishTrainingModuleButtonProps {
  moduleID: number;
  appearance: "icon-only" | "small" | "medium" | "large"
}

export default function PublishTrainingModuleButton(props: PublishTrainingModuleButtonProps) {
  const navigate = useNavigate();

  const [publishTrainingModule, { loading }] = useMutation(PUBLISH_TRAINING_MODULE, {
    variables: { id: props.moduleID },
    refetchQueries: [
      { query: GET_TRAINING_MODULES },
      { query: GET_ARCHIVED_TRAINING_MODULES },
      { query: GET_ARCHIVED_MODULE, variables: { id: props.moduleID } },
    ],
  });

  const handleClick = async () => {
    await publishTrainingModule();
    navigate("/admin/equipment");
  };

  return (
    <PublishButton
      appearance={props.appearance}
      handleClick={handleClick}
      loading={loading}
      tooltipText="Publish Module"
    />
  );
}
