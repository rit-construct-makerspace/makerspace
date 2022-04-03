import { PassedModule } from "./CurrentUserProvider";
import { differenceInYears, parseISO } from "date-fns";

export interface ModuleStatus {
  moduleID: string;
  moduleName: string;
  status: "Passed" | "Expired" | "Not taken";
  submissionDate: string;
}

export interface TrainingModule {
  id: string;
  name: string;
}

export const moduleStatusMapper =
  (passedModules: PassedModule[]) =>
  (module: TrainingModule): ModuleStatus => {
    const passedModule = passedModules.find((pm) => pm.moduleID === module.id);

    if (!passedModule)
      return {
        moduleID: module.id,
        moduleName: module.name,
        status: "Not taken",
        submissionDate: "",
      };

    const submissionDate = parseISO(passedModule.submissionDate);
    const expired = differenceInYears(submissionDate, new Date()) > 0;

    return {
      moduleID: module.id,
      moduleName: module.name,
      status: expired ? "Expired" : "Passed",
      submissionDate: passedModule.submissionDate,
    };
  };
