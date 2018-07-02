import * as express from "express";
import { ApolloServer } from "./ApolloServer";
import testSuite, {
  schema as Schema,
  CreateAppOptions
} from "apollo-server-integration-testsuite";
import { expect } from "chai";
import { GraphQLOptions, Config } from "apollo-server-core";
import "mocha";

function createApp(options: CreateAppOptions = {}) {
  const app = express();

  const server = new ApolloServer(
    (options.graphqlOptions as Config) || { schema: Schema }
  );
  server.applyMiddleware({ app });
  return app;
}

describe("expressApollo", () => {
  it("throws error if called without schema", function() {
    expect(() => new ApolloServer(undefined as GraphQLOptions)).to.throw(
      "ApolloServer requires options."
    );
  });
});

describe("integration:Express", () => {
  testSuite(createApp);
});
