import { addMutationMock, editCurrentUser, renderApp } from "./TestUtils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UPDATE_STUDENT_PROFILE } from "../pages/maker/signup/SignupPage";

test("signup page happy path", async () => {
  const mock = addMutationMock(
    UPDATE_STUDENT_PROFILE,
    {
      userID: "123",
      pronouns: "test_pronouns",
      college: "GCCIS",
      expectedGraduation: "Spring 2026",
      universityID: "123456789",
    },
    { updateStudentProfile: { id: 123 } }
  );

  editCurrentUser({ setupComplete: false });
  renderApp();

  await screen.findByText("Welcome to The Construct at RIT!");

  screen.getByText("John Smith");
  screen.getByText("jxs1234@rit.edu");

  userEvent.type(
    screen.getByRole("textbox", { name: "Pronouns" }),
    "test_pronouns"
  );

  userEvent.click(screen.getByRole("button", { name: /College/ }));
  userEvent.click(screen.getByRole("option", { name: /GCCIS/ }));

  userEvent.click(screen.getByRole("button", { name: /Expected Graduation/ }));
  userEvent.click(screen.getByRole("option", { name: "Spring 2026" }));

  userEvent.type(
    screen.getByRole("textbox", { name: "University ID" }),
    "123456789"
  );

  userEvent.click(screen.getByRole("checkbox"));

  userEvent.click(screen.getByRole("button", { name: "Start making!" }));

  expect(mock).toBeCalled();
});

test("redirect back to home on setupComplete", async () => {
  renderApp("/signup");
  await screen.findByAltText("Construct logo");
});
