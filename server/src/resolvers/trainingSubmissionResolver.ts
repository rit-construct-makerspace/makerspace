import * as SubmissionRepo from "../repositories/Training/SubmissionRepository";
import { ApolloContext } from "../context";

const TrainingSubmissionResolvers = {
  Query: {
    submission: async (
      parent: any,
      args: { submissionID: number },
      { ifAuthenticated }: ApolloContext
    ) => 
      ifAuthenticated (async (user) => {
        return SubmissionRepo.getSubmission(user.id, args.submissionID);
    }),
    submissions: async (
      _parent: any,
      args: { moduleID: number },
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user) => {
        return args.moduleID ? 
          await SubmissionRepo.getSubmissionsByModule(user.id, args.moduleID) :
          await SubmissionRepo.getSubmissionsByUser(user.id)
    }),
    latestSubmission: async (
      _parent: any,
      args: { moduleID: number },
      { ifAuthenticated }: ApolloContext
    ) =>
      ifAuthenticated(async (user) => {
        return args.moduleID ? 
          await SubmissionRepo.getLatestSubmissionByModule(user.id, args.moduleID) :
          await SubmissionRepo.getLatestSubmission(user.id)
    })
  }
};

export default TrainingSubmissionResolvers;
