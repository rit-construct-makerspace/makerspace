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

import { scrypt, createCipheriv, randomInt } from "crypto";
import { generateRandomHumanName } from "../data/humanReadableNames.js";
const serverApiPass = process.env.SERVER_API_PASSWORD ?? 'unsecure_server_password';
const serverApiPassBinary = Buffer.from(serverApiPass, 'utf-8');
const algorithm = 'aes-192-cbc';
// Usually an IV is random per message. We are using the encrpytion as an identifier so we want this constant
const iv = new Uint8Array(16);

function generateShlugKey(SN: string, keyCycle: number) {
  const plainText = `shlug:${SN}:${keyCycle}`;
  let encrypted = '';
  scrypt(serverApiPass, 'salt', 24, (err, key) => {
    if (err) throw err;

    const cipher = createCipheriv(algorithm, key, iv);

    cipher.setEncoding('hex');

    cipher.on('data', (chunk) => encrypted += chunk);
    cipher.on('end', () => console.log(encrypted));

    cipher.write(plainText);
    cipher.end();
  });

}

async function generateUniqueHumanName() {
  const RANDOM_TRIES = 10;
  for (var i = 0; i < RANDOM_TRIES; i++) {
    const name = generateRandomHumanName();
    if (await ReaderRepo.getReaderByName(name) == null) {
      return name;
    }
  }
  return `${generateRandomHumanName()}-${randomInt(1000)}`
}



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
     * Pair a new Reader
     * @argument SN serial number of the shlug
     * @returns SerialNumber, ShlugKey, Certs, Domain
     * @throws GraphQLError if not STAFF or is on hold
     */
    pairReader: async (
      _parent: any,
      args: { SN: string },
      { ifAllowed }: ApolloContext) =>
      ifAllowed([Privilege.STAFF], async () => {
        var reader = await ReaderRepo.getReaderBySN(args.SN);
        if (reader == null) {
          const name = await generateUniqueHumanName();
          reader = await ReaderRepo.createReaderFromSN({ SN: args.SN, name: name });
        }
        if (reader == null) {
          // Not found and can't create a new one, we're really out of lukc
          throw "Unable to pair new reader";
        }

        var keyCycle = (reader?.readerKeyCycle ?? 0) + 1;
        reader.readerKeyCycle = keyCycle;

        const newKey = generateShlugKey(args.SN, keyCycle);
        await ReaderRepo.updateReaderStatus(reader);
        return { readerKey: newKey, name: reader.name, certs: "Hold on, im going as fast as i can" }
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
      args: { id: number; state: string },
      { ifAllowed }: ApolloContext
    ) =>
      ifAllowed([Privilege.STAFF], async (executingUser: any) => {
        try {
          const reader = await ReaderRepo.getReaderByID(args.id);
          if (reader == undefined) {
            throw EntityNotFound;
          }
          await createLog(
            `{user} set {access_device}'s state to ${args.state}.`,
            "admin",
            { id: executingUser.id, label: getUsersFullName(executingUser) },
            { id: reader.id, label: reader.name }
          );

          return ShlugControl.sendState(Number(args.id), args.state);
        } catch (e) {
          return `failed to parse id: ${e}`;
        }
      }),
  }
};

export default ReadersResolver;