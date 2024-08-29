import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Grid,
  CardHeader
} from "@mui/material";
import { Module, Submission } from "../../../types/Quiz";
import Markdown from "react-markdown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@material-ui/core/styles";

interface ResultsCardProps {
    summary: Array<ChoiceSummary>
}

interface ChoiceSummary {
  questionNum: string;
  questionText: string;
  correct: boolean;
}

const useStyles = makeStyles({
  strongerBolds: {
    '& p': {
      fontWeight: 400
    },
    '& strong': {
      fontWeight: 900
    }
  }
});


export default function SubmissionCard({ summary }: ResultsCardProps) {

  //const summaryObj: Array<ChoiceSummary> = JSON.parse(summary);

  const summaryObj = summary;

  const classes = useStyles();

  return (
    <Card sx={{ width: 0.85 }}>
      <CardHeader title="Question Summary"></CardHeader>
      <CardContent>
        {summaryObj.map((choiceSummary: ChoiceSummary) => (
          <Card elevation={2} sx={{ p: 2 }}>
            <Stack direction={"row"} spacing={2} alignItems="center" >
              {choiceSummary.correct 
              ? <CheckCircleIcon color="success" />
              : <CloseIcon color="error" />}
              <Typography sx={{ fontWeight: 500, mb: 1 }}><Markdown className={classes.strongerBolds}>{choiceSummary.questionText}</Markdown></Typography>
            </Stack>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
