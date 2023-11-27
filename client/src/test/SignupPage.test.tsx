import { addMutationMock, editCurrentUser, renderApp } from "./TestUtils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UPDATE_STUDENT_PROFILE } from "../queries/userQueries";

const alertMock = jest.fn();

// mock window.alert()
Object.defineProperty(window, "alert", {
  writable: true,
  value: alertMock,
});

beforeEach(() => {
  alertMock.mockClear();
});

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

  const pronounsInput = screen.getByRole("textbox", { name: "Pronouns" });
  userEvent.type(pronounsInput, "test_pronouns");

  userEvent.click(screen.getByRole("button", { name: /College/ }));
  userEvent.click(screen.getByRole("option", { name: /GCCIS/ }));

  userEvent.click(screen.getByRole("button", { name: /Expected Graduation/ }));
  userEvent.click(screen.getByRole("option", { name: "Spring 2026" }));

  const uidInput = screen.getByRole("textbox", { name: "University ID" });
  userEvent.type(uidInput, "123456789");

  userEvent.click(screen.getByRole("checkbox"));
  userEvent.click(screen.getByRole("button", { name: "Start making!" }));

  expect(mock).toBeCalled();
});

test("redirect back to home on setupComplete", async () => {
  renderApp("/signup");
  await screen.findByAltText("Construct logo");
});

test("pronoun quick fill buttons work", async () => {
  editCurrentUser({ setupComplete: false });
  renderApp("/signup");

  await screen.findByText("Welcome to The Construct at RIT!");

  const pronounsField = screen.getByRole("textbox", { name: "Pronouns" });
  userEvent.type(pronounsField, "overwrite me");

  userEvent.click(screen.getByRole("button", { name: "He / Him" }));
  expect(pronounsField).toHaveValue("He / Him");

  userEvent.click(screen.getByRole("button", { name: "She / Her" }));
  expect(pronounsField).toHaveValue("She / Her");

  userEvent.click(screen.getByRole("button", { name: "They / Them" }));
  expect(pronounsField).toHaveValue("They / Them");
});

test("alert when missing college", async () => {
  editCurrentUser({ setupComplete: false });
  renderApp();

  await screen.findByText("Welcome to The Construct at RIT!");

  userEvent.click(screen.getByRole("button", { name: "Start making!" }));

  expect(alertMock).toBeCalledWith("Please select your college.");
});

test("alert when missing expected graduation", async () => {
  editCurrentUser({ setupComplete: false });
  renderApp();

  await screen.findByText("Welcome to The Construct at RIT!");

  userEvent.click(screen.getByRole("button", { name: /College/ }));
  userEvent.click(screen.getByRole("option", { name: /GCCIS/ }));

  userEvent.click(screen.getByRole("button", { name: "Start making!" }));

  expect(alertMock).toBeCalledWith(
    "Please select your expected graduation date."
  );
});

test.each(["12345678", "1234567890", "blah", "abc456789", ""])(
  "alert when invalid university ID of '%s'",
  async (uid: string) => {
    editCurrentUser({ setupComplete: false });
    renderApp();

    await screen.findByText("Welcome to The Construct at RIT!");

    userEvent.click(screen.getByRole("button", { name: /College/ }));
    userEvent.click(screen.getByRole("option", { name: /GCCIS/ }));

    userEvent.click(
      screen.getByRole("button", { name: /Expected Graduation/ })
    );
    userEvent.click(screen.getByRole("option", { name: "Spring 2026" }));

    const uidInput = screen.getByRole("textbox", { name: "University ID" });
    uid && userEvent.type(uidInput, uid);

    userEvent.click(screen.getByRole("button", { name: "Start making!" }));

    expect(alertMock).toBeCalledWith("University ID must be 9 digits.");
  }
);

test("alert when terms box not checked", async () => {
  editCurrentUser({ setupComplete: false });
  renderApp();

  await screen.findByText("Welcome to The Construct at RIT!");

  userEvent.click(screen.getByRole("button", { name: /College/ }));
  userEvent.click(screen.getByRole("option", { name: /GCCIS/ }));

  userEvent.click(screen.getByRole("button", { name: /Expected Graduation/ }));
  userEvent.click(screen.getByRole("option", { name: "Spring 2026" }));

  const uidInput = screen.getByRole("textbox", { name: "University ID" });
  userEvent.type(uidInput, "123456789");

  userEvent.click(screen.getByRole("button", { name: "Start making!" }));

  expect(alertMock).toBeCalledWith(
    "You must agree to abide by The Construct's rules and policies."
  );
});
