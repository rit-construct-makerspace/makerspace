import { PassedModule } from "./CurrentUserProvider";
import { differenceInMonths, differenceInWeeks, differenceInYears, parseISO } from "date-fns";

export interface ModuleStatus {
  moduleID: string;
  moduleName: string;
  status: "Passed" | "Expired" | "Not taken" | "Expiring Soon";
  submissionDate: string;
  expirationDate: string;
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
        expirationDate: "",
      };

    const submissionDate = parseISO(passedModule.submissionDate);
    const expirationDate = parseISO(passedModule.expirationDate);
    const expiringSoon = differenceInMonths(expirationDate, new Date()) <= 1; //differenceInMonths(new Date(), submissionDate) > 11 && differenceInMonths(new Date(), submissionDate) < 12;
    const expired = differenceInYears(submissionDate, new Date()) > 0;

    if (expiringSoon)
      return {
        moduleID: module.id,
        moduleName: module.name,
        status: "Expiring Soon",
        submissionDate: passedModule.submissionDate,
        expirationDate: passedModule.expirationDate,
      }

    return {
      moduleID: module.id,
      moduleName: module.name,
      status: expired ? "Expired" : "Passed",
      submissionDate: passedModule.submissionDate,
      expirationDate: passedModule.expirationDate,
    };
  };
