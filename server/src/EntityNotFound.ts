import { ApolloError } from "apollo-server-errors";

export class EntityNotFound extends ApolloError {
  constructor(message: string) {
    super(message, "ENTITY_NOT_FOUND");
  }
}
