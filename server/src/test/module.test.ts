import { graphql } from "graphql";
import context from "../context";
import { schema } from "../schema";
import { knex } from "../db";

const mockReq = {
  req: {
    user: {
      id: 1,
      firstName: 'testFirstname',
      lastName: 'testLastname',
      email: 'test@aol.com',
      isStudent: true,
      privilege: 'MAKER',
      registrationDate: new Date(),
      expectedGraduation: 'Spring 2022',
      college: 'GCCIS',
      universityID: '123456789',
      setupComplete: true,
      ritUsername: 'test9987',
      pronouns: 'they/them',
      isArchived: false,
    }
  }
}

const mockContext = context(mockReq)

describe("Training test set", () => {

  beforeAll(() => {
    return knex.migrate.latest();
    // we can here also seed our tables, if we have any seeding files
  });

  afterAll(() => {
    knex.destroy();
  });

  test("Test modules query", async () => {
    const query = `
      {
        modules {
          id
        }
      }
    `;

    const result = await graphql(schema, query, null, mockContext)
    if (!result.data)
      fail('Result was null or undefined, was expecting empty array')
    expect(result.data.modules.length).toBe(0)
  })

});


