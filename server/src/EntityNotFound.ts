import { GraphQLError } from "graphql";

export class EntityNotFound extends GraphQLError  {
  constructor(message: string) {
    super(message, {
      extensions: { code: "ENTITY_NOT_FOUND" },
    });
  }
}
