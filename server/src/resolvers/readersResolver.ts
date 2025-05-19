/**
 * readersResolver.ts
 * GraphQL Endpoint Implementations for ACS Readers
 */

import * as ReaderRepo from "../repositories/Readers/ReaderRepository.js";
import { ApolloContext } from "../context.js";
import { Privilege } from "../schemas/usersSchema.js";
import { createLog } from "../repositories/AuditLogs/AuditLogRepository.js";
import { getUserByCardTagID, getUsersFullName } from "../repositories/Users/UserRepository.js";
import { EntityNotFound } from "../EntityNotFound.js";
import { ReaderRow } from "../db/tables.js";
import * as ShlugControl from "../wsapi.js"


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
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.MENTOR, Privilege.STAFF], async () => {
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
      { ifAllowedOrSelf }: ApolloContext) =>
      ifAllowedOrSelf(Number(args.id), [Privilege.MENTOR, Privilege.STAFF], async () => {
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
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
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
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (executingUser: any) => {
        const readerSubject = await ReaderRepo.getReaderByID(Number(args.id));
        if (readerSubject == undefined) {
          throw EntityNotFound;
        }
        await ReaderRepo.setReaderName(Number(args.id), args.name);

        await createLog(
          `{user} set {reader}'s name to ${args.name}.`,
          "admin",
          { id: executingUser.id, label: getUsersFullName(executingUser) },
          { id: readerSubject.id, label: readerSubject.name }
        );
      }),

    setState: async (
      _parent: any,
      args: { id: string; state: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (executingUser: any) => {
        try {
          return ShlugControl.sendState(Number(args.id), args.state);
        } catch (e) {
          return `failed to parse id: ${e}`;
        }
      }),
  }
};

export default ReadersResolver;