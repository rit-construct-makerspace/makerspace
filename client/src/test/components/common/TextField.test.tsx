import React, { ChangeEventHandler } from "react";
import { render, screen } from "@testing-library/react";
import TextField from "../../../components/common/TextField";
import userEvent from "@testing-library/user-event";

test("label, field, and placeholder are rendered", () => {
  render(
    <TextField
      label="Test Label"
      placeholder="Test placeholder"
      value=""
      onChange={() => {}}
      id="test-id"
    />
  );

  screen.getByRole("textbox", { name: "Test Label" });
  screen.getByPlaceholderText("Test placeholder");
});

test("onChange is called upon user typing", () => {
  const values: string[] = [];

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) =>
    values.push(e.target.value);

  render(
    <TextField
      label="Test Label"
      value=""
      onChange={handleChange}
      id="test-id"
    />
  );

  const textbox = screen.getByRole("textbox", { name: "Test Label" });
  userEvent.type(textbox, "Hello!");

  expect(values).toEqual(["H", "e", "l", "l", "o", "!"]);
});

test("error is shown when provided", () => {
  render(
    <TextField
      label="Test Label"
      value=""
      onChange={() => {}}
      id="test-id"
      error="Test error"
    />
  );

  screen.getByText("Test error");
});
