import * as ReaderRepo from "../repositories/Readers/ReaderRepository";
import { ApolloContext } from "../context";
import { Privilege } from "../schemas/usersSchema";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository";
import { getUsersFullName } from "../repositories/Users/UserRepository";
import { EntityNotFound } from "../EntityNotFound";

const ReadersResolver = {
  Query: {
    readers: async (
      _parent: any,
      _args: any,
      {ifAllowed}: ApolloContext) =>
        ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
          return await ReaderRepo.getReaders();
        }),
    
    reader: async (
      _parent: any,
      args: { id: string },
      {ifAllowedOrSelf} : ApolloContext) =>
        ifAllowedOrSelf(Number(args.id), [Privilege.MENTOR, Privilege.STAFF], async () => {
          return await ReaderRepo.getReaderByID(Number(args.id));
        })
  },

  Mutation: {
    createReader: async (
      _parent: any,
      args: any,
      { ifAllowed }: ApolloContext) =>
        ifAllowed([Privilege.STAFF], async () => {
          return await ReaderRepo.createReader(args);
      }),

    setName: async (
      _parent: any,
      args: { id: string; name: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (executingUser) => {
        const readerSubject = await ReaderRepo.getReaderByID(Number(args.id));
        if (readerSubject == undefined) {
          throw EntityNotFound;
        }
        await ReaderRepo.setReaderName(Number(args.id), args.name);

        await createLog(
          `{user} set {reader}'s name to ${args.name}.`,
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: readerSubject.id, label: readerSubject.name }
        );
      })
  }
};

export default ReadersResolver;