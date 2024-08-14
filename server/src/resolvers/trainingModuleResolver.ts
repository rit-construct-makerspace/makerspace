import * as ModuleRepo from "../repositories/Training/ModuleRepository.js";
import { AnswerInput } from "../schemas/trainingModuleSchema.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUsersFullName } from "../repositories/Users/UserRepository.js";
import * as SubmissionRepo from "../repositories/Training/SubmissionRepository.js";
import { MODULE_PASSING_THRESHOLD } from "../constants.js";
import { TrainingModuleItem, TrainingModuleRow } from "../db/tables.js";
import * as EquipmentRepo from "../repositories/Equipment/EquipmentRepository.js";
import { createAccessCheck } from "../repositories/Equipment/AccessChecksRepository.js";
import fetch from "node-fetch";


const ID_3DPRINTEROS_QUIZ = Number(process.env.ID_3DPRINTEROS_QUIZ);

async function add3DPrinterOSUser(username: string) {
  //Login API User
  var options = {
    body: "username=" + process.env.CLOUDPRINT_API_USERNAME + "&password=" + process.env.CLOUDPRINT_API_PASSWORD,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: "POST"
  }
  console.log(options);
  const addRequestBody = await fetch((process.env.CLOUDPRINT_API_URL + "login"), options).then(async function (res) {
    //Currently the compiler will not allow us to parse res.json() since it is typed as 'unknown'
    //To fix this, we will simply lie to the compiler and say it is 'any'
    //console.log(res.json());
    return await res.json() as any;
  }).then(async function (json) {
    //Add user to workgroups
    console.log("Session: ");
    console.log(json.message.session);
    var options = {
      body: "session=" + json.message.session + "&workgroup_id=" + process.env.CLOUDPRINT_API_WORKGROUP + "&email=" + username + "@rit.edu",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      method: "POST"
    }
    return await fetch((process.env.CLOUDPRINT_API_URL + "add_user_to_workgroup"), options)
    .then(function (res) {
      return res.json() as any;
    }).then(async function (res) {
      return res;
    });
  });

  return addRequestBody.result;
}

interface ChoiceSummary {
  questionNum: string;
  questionText: string;
  correct: boolean;
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
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
      ifAllowed([Privilege.MAKER, Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async (user: any) => {
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
        async (user: any) => {
          const module = await ModuleRepo.getModuleByIDWhereArchived(Number(args.moduleID), false);

          if (!module || module.archived) {
            throw Error(`Cannot access module #${args.moduleID}`);
          }

          if (module.quiz.length === 0) {
              throw Error("Provided module has no questions");
          }

          let correct = 0;
          let incorrect = 0;
          var choiceSummary: ChoiceSummary[] = [];

          const questions = module.quiz.filter((i: any) =>
            ["CHECKBOXES", "MULTIPLE_CHOICE"].includes(i.type)
          );

          for (let question of questions) {
            if (!question.options)
              throw Error(
                `Module Item ${question.id} of type ${question.type} has no options`
              );

            const correctOptionIDs = question.options
              .filter((o: any) => o.correct)
              .map((o: any) => o.id);

            const submittedOptionIDs = args.answerSheet.find(
              (item) => item.itemID === question.id
            )?.optionIDs;

            if (submittedOptionIDsCorrect(correctOptionIDs, submittedOptionIDs)) {
              correct++;
              choiceSummary.push({questionNum: question.id, questionText: question.text, correct: true });
            } else {
              incorrect++;
              choiceSummary.push({questionNum: question.id, questionText: question.text, correct: false });
            }
              
          }

          const grade = (correct / (incorrect + correct)) * 100;

          SubmissionRepo.addSubmission(
            user.id,
            Number(args.moduleID),
            grade >= MODULE_PASSING_THRESHOLD,
            JSON.stringify(choiceSummary)
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
                add3DPrinterOSUser(user.ritUsername).then(async function(result) {
                  if (result) {
                    await createLog(
                      `{user} has been automatically added to 3DPrinterOS Workgroup ${process.env.CLOUDPRINT_API_WORKGROUP}.`,
                      { id: user.id, label: getUsersFullName(user) }
                    );
                  } else {
                    await createLog(
                      `{user} has failed to be added to 3DPrinterOS Workgroup ${process.env.CLOUDPRINT_API_WORKGROUP}. Check server logs.`,
                      { id: user.id, label: getUsersFullName(user) }
                    );
                  }
                })
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
