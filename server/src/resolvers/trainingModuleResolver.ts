import * as ModuleRepo from "../repositories/Training/ModuleRepository";
import { AnswerInput } from "../schemas/trainingModuleSchema";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import * as SubmissionRepo from "../repositories/Training/SubmissionRepository";
import { MODULE_PASSING_THRESHOLD } from "../constants";
import { TrainingModuleItem, TrainingModuleRow } from "../db/tables";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository";
import { createAccessCheck } from "../repositories/Equipment/AccessChecksRepository";
import fetch from "node-fetch";


const ID_3DPRINTEROS_QUIZ = Number(process.env.ID_3DPRINTEROS_QUIZ);

async function add3DPrinterOSUser(username: string) {
  //Login API User
  var options = {
    body: "username:" + process.env.CLOUDPRINT_API_USERNAME + "\npassword:" + process.env.CLOUDPRINT_API_PASSWORD,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  const body = await fetch((process.env.CLOUDPRINT_API_URL + "login"), options).then(function (res) {
    //Currently the compiler will not allow us to parse res.json() since it is typed as 'unknown'
    //To fix this, we will simply lie to the compiler and say it is 'any'
    return res.json() as any;
  }).then(async function (json) {
    //Add user to workgroups
    if (json.body == null) return;
    var options = {
      body: "session:" + JSON.parse(json.body).message.session + "\nworkgroup_id:" + process.env.CLOUDPRINT_API_WORKGROUP + "\nemail:" + username + "@rit.edu",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }
    return fetch((process.env.CLOUDPRINT_API_URL + "add_user_to_workgroup"), options)
  }).then(function (res) {
    return res?.json() as any;
  }).then(function (res) {
    return res.body;
  });

  console.log(body);
}

const removeAnswersFromQuiz = (quiz: TrainingModuleItem[]) => {
  for (let item of quiz) {
    if (item.options) {
      for (let option of item.options) {
        delete option.correct;
      }
    }
  }
};

function submittedOptionIDsCorrect(
  correct: string[],
  submitted: string[] | undefined
) {
  if (!submitted || correct.length !== submitted.length) return false;

  for (let i = 0; i < correct.length; i++) {
    if (correct[i] !== submitted[i]) return false;
  }

  return true;
}

const TrainingModuleResolvers = {
  Query: {
    modules: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let modules = await ModuleRepo.getModulesWhereArchived(false);

        if (user.privilege === "MAKER")
          for (let module of modules) removeAnswersFromQuiz(module.quiz);

        return modules;
      }),

    module: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user) => {
        let module = await ModuleRepo.getModuleByIDWhereArchived(args.id, false);

        if (user.privilege === "MAKER") removeAnswersFromQuiz(module.quiz);

        return module;
      }),

    archivedModules: async (
      _parent: any,
      _args: any,
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (_user) => {
        let modules = await ModuleRepo.getModulesWhereArchived(true);

        return modules;
      }),

    archivedModule: async (
      _parent: any,
      args: { id: number },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (_user) => {
        let module = await ModuleRepo.getModuleByIDWhereArchived(args.id, true);

        return module;
      }),
  },

  TrainingModule: {
    equipment: async (
      parent: TrainingModuleRow,
      _: any,
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user) => {
        return EquipmentRepo.getEquipmentForModule(parent.id);
      })
  },

  Mutation: {
    createModule: async (
      _parent: any,
      args: { name: string; quiz: object },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.addModule(
          args.name,
          args.quiz
        );

        await createLog(
          "{user} created the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );

        return module;
      }),

    updateModule: async (
      _parent: any,
      args: { id: string; name: string; quiz: object; reservationPrompt: object },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.updateModule(
          Number(args.id),
          args.name,
          args.quiz,
          args.reservationPrompt
        );

        await createLog(
          "{user} updated the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );
      }),

    archiveModule: async (
      _parent: any,
      args: { id: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.setModuleArchived(Number(args.id), true);

        await createLog(
          "{user} archived the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );

        return module;
      }),

    publishModule: async (
      _parent: any,
      args: { id: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user) => {
        const module = await ModuleRepo.setModuleArchived(Number(args.id), false);

        await createLog(
          "{user} archived the {module} module.",
          { id: user.id, label: getUsersFullName(user) },
          { id: module.id, label: module.name }
        );

        return module;
      }),

    submitModule: async (
      _parent: any,
      args: { moduleID: string; answerSheet: AnswerInput[] },
      { ifAllowed }: ApolloContext
    ) => {
      return ifAllowed(
        [Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF],
        async (user) => {
          const module = await ModuleRepo.getModuleByIDWhereArchived(Number(args.moduleID), false);

          if (!module || module.archived) {
            throw Error(`Cannot access module #${args.moduleID}`);
          }

          if (module.quiz.length === 0) {
              throw Error("Provided module has no questions");
          }

          let correct = 0;
          let incorrect = 0;

          const questions = module.quiz.filter((i) =>
            ["CHECKBOXES", "MULTIPLE_CHOICE"].includes(i.type)
          );

          for (let question of questions) {
            if (!question.options)
              throw Error(
                `Module Item ${question.id} of type ${question.type} has no options`
              );

            const correctOptionIDs = question.options
              .filter((o) => o.correct)
              .map((o) => o.id);

            const submittedOptionIDs = args.answerSheet.find(
              (item) => item.itemID === question.id
            )?.optionIDs;

            submittedOptionIDsCorrect(correctOptionIDs, submittedOptionIDs)
              ? correct++
              : incorrect++;
          }

          const grade = (correct / (incorrect + correct)) * 100;

          SubmissionRepo.addSubmission(
            user.id,
            Number(args.moduleID),
            grade >= MODULE_PASSING_THRESHOLD
          ).then(async (id) => {
            await createLog(
              `{user} submitted attempt of {module} with a grade of ${grade}.`,
              { id: user.id, label: getUsersFullName(user) },
              { id: args.moduleID, label: module.name }
            );

            //If all trainings for equipment done, add access check for all passed equipment
            if (grade >= MODULE_PASSING_THRESHOLD) {
              if (Number(args.moduleID) === ID_3DPRINTEROS_QUIZ) {
                //If 3D Printer Training, add them to the workgroup instead of using an access check
                add3DPrinterOSUser(user.ritUsername)
              } else {
                const equipmentIDsToCheck = await ModuleRepo.getPassedEquipmentIDsByModuleID(Number(args.moduleID), user.id);
                equipmentIDsToCheck.forEach(async equipmentID => {
                  await createAccessCheck(user.id, equipmentID);
                });
              }
            }

            return id;
          });
        }
      );
    },
  },
};

export default TrainingModuleResolvers;
