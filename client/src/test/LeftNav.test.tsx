import React from "react";
import { editCurrentUser, renderApp } from "./TestUtils";
import { screen } from "@testing-library/react";
import Privilege from "../types/Privilege";

test("render logo and current user", async () => {
  renderApp();
  await screen.findByAltText("Construct logo");
  screen.getByAltText("Profile picture");
  screen.getByText("John Smith");
});

async function checkMentorStaffNav() {
  await screen.findByText("MAKER");

  // Equipment, Training, & Materials links should show
  // up twice (once for maker and once for admin)
  expect(screen.getAllByRole("link", { name: "Equipment" })).toHaveLength(2);
  expect(screen.getAllByRole("link", { name: "Training" })).toHaveLength(2);
  expect(screen.getAllByRole("link", { name: "Materials" })).toHaveLength(2);

  // Admin section
  screen.getByText("STAFF");
  screen.getByRole("link", { name: "Storefront" });
  screen.getByRole("link", { name: "Rooms" });
  screen.getByRole("link", { name: "Reservations" });
  screen.getByRole("link", { name: "People" });
  screen.getByRole("link", { name: "History" });
}

test("render properly for admins", async () => {
  editCurrentUser({ privilege: Privilege.MENTOR });
  renderApp();
  await checkMentorStaffNav();
});

test("render properly for mentors", async () => {
  editCurrentUser({ privilege: Privilege.STAFF });
  renderApp();
  await checkMentorStaffNav();
});

test("render properly for makers", async () => {
  editCurrentUser({ privilege: Privilege.MAKER });
  renderApp();

  await screen.findByText("John Smith");

  // Don't show nav categories
  expect(screen.queryByText("MAKER")).toBeNull();
  expect(screen.queryByText("MENTOR")).toBeNull();
  expect(screen.queryByText("STAFF")).toBeNull();

  // Show maker nav links
  screen.getByRole("link", { name: "Equipment" });
  screen.getByRole("link", { name: "Training" });
  screen.getByRole("link", { name: "Materials" });

  // Don't show mentor/staff links
  expect(screen.queryByRole("link", { name: "Storefront" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Rooms" })).toBeNull();
  expect(screen.queryByRole("link", { name: "Reservations" })).toBeNull();
  expect(screen.queryByRole("link", { name: "People" })).toBeNull();
  expect(screen.queryByRole("link", { name: "History" })).toBeNull();
});

test("show hold alert when outstanding hold", async () => {
  editCurrentUser({ holds: [{ removeDate: null }] });
  renderApp();

  await screen.findByText(/A hold has been placed on your account./);
});

test("don't show hold alert for removed holds", async () => {
  editCurrentUser({ holds: [{ removeDate: "2022-03-30 22:24:15.944078+00" }] });
  renderApp();

  await screen.findByText("John Smith");
  expect(
    screen.queryByText(/A hold has been placed on your account./)
  ).toBeNull();
});
