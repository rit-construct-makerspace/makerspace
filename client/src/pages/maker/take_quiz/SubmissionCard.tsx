import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Grid
} from "@mui/material";
import { Module, Submission } from "../../../types/Quiz";

interface SubmissionCardProps {
    submission: Submission;
    module: Module;
}

export default function SubmissionCard({ module, submission }: SubmissionCardProps) {
  let submissionDate = new Date(+(submission.submissionDate)).toLocaleString('en-US');
  return (
    <Card sx={{ width: 0.85 }}>
        <CardActionArea>
          <CardContent>
            <Grid container>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  component="div"
                >
                  Submission
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  sx={{fontSize: 18}}
                  component="div"
                >
                  {`${module.name}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="h6"
                  component="div"
                >
                  Score
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{fontSize: 16}}
                  component="div"
                >
                  {`${submissionDate}`}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  sx={{fontSize: 18}}
                  component="div"
                  color={submission.passed ?
                    `green`
                  : `red`}
                >
                  {submission.passed ?
                      `>80`
                    : `<80`}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
  );
}
