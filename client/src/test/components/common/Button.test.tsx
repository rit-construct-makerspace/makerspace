import React from "react";
import { render, screen } from "@testing-library/react";
import { NormalButton } from "../../../components/common/Button";
import userEvent from "@testing-library/user-event";

test("render button and call onClick", () => {
  const onClickSpy = jest.fn();
  render(<NormalButton label="test label" onClick={onClickSpy} />);
  const button = screen.getByRole("button", { name: "test label" });
  userEvent.click(button);
  expect(onClickSpy.mock.calls).toHaveLength(1);
});

test("button is disabled when disabled prop is passed", () => {
  render(<NormalButton label="test label" disabled onClick={() => {}} />);
  const button = screen.getByRole("button", { name: "test label" });
  expect(button).toBeDisabled();
});
