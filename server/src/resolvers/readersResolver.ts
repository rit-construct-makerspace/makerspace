/**
 * readersResolver.ts
 * GraphQL Endpoint Implementations for ACS Readers
 */

import * as ReaderRepo from "../repositories/Readers/ReaderRepository.js";
import { ApolloContext, CurrentUser } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUserByCardTagID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { EntityNotFound } from "../EntityNotFound.js";
import { ReaderRow } from "../db/tables.js";

const ReadersResolver = {
  Reader: {
    //Map user field to User
    user: async (
      parent: ReaderRow,
      _args: any,
      _context: ApolloContext) => {
      return getUserByCardTagID(parent.currentUID);
    },
  },

  Query: {
    /**
     * Fetch all Readers
     * @returns all Readers
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    readers: async (
      _parent: any,
      _args: any,
      { isStaff }: ApolloContext) =>
      isStaff(async (user: CurrentUser) => {
        return await ReaderRepo.getReaders();
      }),

    /**
     * Fetch Reader by ID
     * @argument id ID of Reader
     * @returns Reader
     * @throws GraphQLError if not MENTOR or STAFF or is on hold
     */
    reader: async (
      _parent: any,
      args: { id: string },
      { isStaff }: ApolloContext) =>
      isStaff(async (user: CurrentUser) => {
        return await ReaderRepo.getReaderByID(Number(args.id));
      })
  },

  Mutation: {
    /**
     * Create a Reader
     * @argument machineID ID of Equipment
     * @argument machineType Type indication string (mostly deprecated)
     * @argument name Reader name
     * @argument zone comma seperated list of zone IDs the machine resides in (usually just the one)
     * @returns new Reader
     * @throws GraphQLError if not STAFF or is on hold
     */
    createReader: async (
      _parent: any,
      args: {machineID?: number, machineType?: string, name?: string, zone?: string},
      { isManager }: ApolloContext) =>
      isManager(async (user: CurrentUser) => {
        return await ReaderRepo.createReader(args);
      }),

    /**
     * Update the name of a Reader
     * @argument id of Reader to modify
     * @argument name new Reader name
     * @returns updated Reader
     * @throws GraphQLError if not STAFF or is on hold
     */
    setName: async (
      _parent: any,
      args: { id: string; name: string },
      { isManager }: ApolloContext
    ) =>
      isManager(async (user: CurrentUser) => {
        const readerSubject = await ReaderRepo.getReaderByID(Number(args.id));
        if (readerSubject == undefined) {
          throw EntityNotFound;
        }
        await ReaderRepo.setReaderName(Number(args.id), args.name);

        await createLog(
          `{user} set {reader}'s name to ${args.name}.`,
          "admin",
          { id: user.id, label: getUsersFullName(user) },
          { id: readerSubject.id, label: readerSubject.name }
        );
      })
  }
};

export default ReadersResolver;