import * as SubmissionRepo from "../repositories/Training/SubmissionRepository.js";
import { ApolloContext } from "../context.js";

const TrainingSubmissionResolvers = {
  Query: {
    submission: async (
      parent: any,
      args: { submissionID: string },
      { ifAuthenticated }: ApolloContext
    ) => 
      ifAuthenticated (async (user: any) => {
        return SubmissionRepo.getSubmission(Number(args.submissionID));
    }),
    submissions: async (
      _parent: any,
      args: { moduleID: string },
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user: any) => {
        return args.moduleID ? 
          await SubmissionRepo.getSubmissionsByModule(user.id, Number(args.moduleID)) :
          await SubmissionRepo.getSubmissionsByUser(user.id)
    }),
    latestSubmission: async (
      _parent: any,
      args: { moduleID: string },
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user: any) => {
        return args.moduleID ? 
          await SubmissionRepo.getLatestSubmissionByModule(user.id, Number(args.moduleID)) :
          await SubmissionRepo.getLatestSubmission(user.id)
    })
  }
};

export default TrainingSubmissionResolvers;
