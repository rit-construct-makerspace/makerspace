import React, { useState } from "react";
import {
  Checkbox,
  Chip,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCurrentUser } from "../../../common/CurrentUserProvider";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { LoadingButton } from "@mui/lab";
import { useHistory } from "react-router-dom";

const StyledFakeTextField = styled.div`
  border-radius: 4px;
  border: 1px solid #c0c0c0;
  background-color: #efefef;
  padding: 16.5px 14px;
  flex: 1;
`;

const COLLEGES = [
  "CAD - College of Art and Design",
  "CET - College of Engineering Technology",
  "CHST - College of Health Sciences and Technology",
  "CLA - College of Liberal Arts",
  "COS - College of Science",
  "GCCIS - B. Thomas Golisano College of Computing and Information Sciences",
  "GIS - Golisano Institute for Sustainability",
  "KGCOE - Kate Gleason College of Engineering",
  "NTID - National Technical Institute for the Deaf",
  "SCB - Saunders College of Business",
  "SOIS - School of Individualized Study",
];

const UPDATE_STUDENT_PROFILE = gql`
  mutation UpdateStudentProfile(
    $userID: ID!
    $pronouns: String
    $college: String
    $expectedGraduation: String
  ) {
    updateStudentProfile(
      userID: $userID
      pronouns: $pronouns
      college: $college
      expectedGraduation: $expectedGraduation
    ) {
      id
    }
  }
`;

function generateGradDates() {
  const semesters = ["Spring", "Summer", "Fall"];
  const year = new Date().getFullYear();
  const dates: string[] = [];

  for (let i = 0; i < 6; i++) {
    semesters.forEach((s) => dates.push(`${s} ${year + i}`));
  }

  return dates;
}

export default function SignupPage() {
  const history = useHistory();
  const currentUser = useCurrentUser();
  const [updateStudentProfile, result] = useMutation(UPDATE_STUDENT_PROFILE);

  const [pronouns, setPronouns] = useState("");
  const [college, setCollege] = useState("");
  const [expectedGraduation, setExpectedGraduation] = useState("");
  const [agreedToAbide, setAgreedToAbide] = useState(false);

  const handleSubmit = () => {
    if (!college) {
      window.alert("Please select your college.");
      return;
    }

    if (!expectedGraduation) {
      window.alert("Please select your expected graduation date.");
      return;
    }

    if (!agreedToAbide) {
      window.alert(
        "You must agree to abide by The Construct's rules and policies."
      );
      return;
    }

    updateStudentProfile({
      variables: {
        userID: currentUser.id,
        pronouns,
        college,
        expectedGraduation,
      },
      onCompleted: () => history.push("/"),
    });
  };

  return (
    <Stack sx={{ maxWidth: 715, mx: "auto", mt: 8 }}>
      <Typography variant="h3">Welcome to The Construct at RIT!</Typography>
      <Typography variant="body1" mt={4}>
        The Construct is the premier makerspace at RIT. Join a growing community
        of creative thinkers and makers, and use our tools and machinery to
        bring your projects to life!
      </Typography>
      <Typography variant="body1" mt={2}>
        Before you begin making, please answer a few questions to finish setting
        up your account.
      </Typography>

      <Stack direction="row" spacing={4} mt={8}>
        <StyledFakeTextField>{`${currentUser.firstName} ${currentUser.lastName}`}</StyledFakeTextField>
        <StyledFakeTextField>{currentUser.email}</StyledFakeTextField>
      </Stack>

      <TextField
        label="Pronouns"
        value={pronouns}
        onChange={(e) => setPronouns(e.target.value)}
        sx={{ mt: 4 }}
      />
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1, ml: 2 }}
      >
        <Typography variant="body2" fontSize="13px">
          Quick fill:
        </Typography>
        <Chip label="He / Him" onClick={() => setPronouns("He / Him")} />
        <Chip label="She / Her" onClick={() => setPronouns("She / Her")} />
        <Chip label="They / Them" onClick={() => setPronouns("They / Them")} />
      </Stack>

      <TextField
        select
        label="College"
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        sx={{ mt: 8 }}
      >
        {COLLEGES.map((c) => (
          <MenuItem value={c.split(" ")[0]} key={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Expected Graduation"
        value={expectedGraduation}
        onChange={(e) => setExpectedGraduation(e.target.value)}
        sx={{ mt: 4 }}
      >
        {generateGradDates().map((d) => (
          <MenuItem value={d} key={d}>
            {d}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" alignItems="center" mt={4}>
        <Checkbox
          checked={agreedToAbide}
          onChange={(e) => setAgreedToAbide(e.target.checked)}
        />
        <Typography variant="body1">
          I have read, understand, and agree to abide by{" "}
          <Link
            href="https://hack.rit.edu/index.php/tools-equipment/"
            target="_blank"
          >
            The Construct's rules and policies
          </Link>
        </Typography>
      </Stack>

      <LoadingButton
        loading={result.loading}
        size="large"
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 8, alignSelf: "flex-end" }}
      >
        Start making!
      </LoadingButton>
    </Stack>
  );
}
