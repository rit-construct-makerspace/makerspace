import { addMutationMock, addQueryMock, renderApp } from "../TestUtils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GET_TRAINING_MODULES from "../../queries/getModules";
import { CREATE_TRAINING_MODULE } from "../../pages/admin/training_modules/TrainingModulesPage";
import { GET_MODULE } from "../../pages/admin/edit_module/EditModulePage";

test("can navigate to page", async () => {
  addQueryMock(GET_TRAINING_MODULES, { modules: [] });

  renderApp();

  const trainingNavs = await screen.findAllByRole("link", { name: "Training" });
  userEvent.click(trainingNavs[1]);

  await screen.findByRole("heading", { name: "Training modules" });
});

test("show and search, and click module", async () => {
  addQueryMock(GET_TRAINING_MODULES, {
    modules: [
      { id: "1", name: "test module" },
      { id: "2", name: "another one" },
    ],
  });

  addQueryMock(
    GET_MODULE,
    { module: { name: "another one", quiz: [] } },
    { id: "2" }
  );

  renderApp("/admin/training");

  await screen.findByRole("button", { name: "test module" });
  screen.getByRole("button", { name: "another one" });

  userEvent.type(screen.getByPlaceholderText("Search training modules"), "oNe");

  const anotherOne = screen.getByRole("button", { name: "another one" });
  expect(screen.queryByRole("button", { name: "test module" })).toBeNull();

  userEvent.click(anotherOne);

  const moduleTitle = await screen.findByRole("textbox", {
    name: "Module title",
  });
  expect(moduleTitle).toHaveValue("another one");
});

test("clicking new module button", async () => {
  addQueryMock(GET_TRAINING_MODULES, { modules: [] });

  addQueryMock(
    GET_MODULE,
    { module: { name: "test module", quiz: [] } },
    { id: "1" }
  );

  const createMock = addMutationMock(
    CREATE_TRAINING_MODULE,
    { name: "New Training Module" },
    { createModule: { id: "1" } }
  );

  renderApp("/admin/training");

  const button = await screen.findByRole("button", { name: /new module/i });
  userEvent.click(button);

  expect(createMock).toBeCalled();

  await screen.findByRole("heading", { name: "Edit training module" });
});
