import * as Koa from "koa";
import {
  GraphQLOptions,
  HttpQueryError,
  runHttpQuery,
  convertNodeHttpToRequest
} from "apollo-server-core";

export interface KoaGraphQLOptionsFunction {
  (ctx: Koa.Context): GraphQLOptions | Promise<GraphQLOptions>;
}

// Design principles:
// - there is just one way allowed: POST request with JSON body. Nothing else.
// - simple, fast and secure
//

export interface KoaHandler {
  (ctx: Koa.Context, next): void;
}

export function graphqlKoa(
  options: GraphQLOptions | KoaGraphQLOptionsFunction
): KoaHandler {
  if (!options) {
    throw new Error("Apollo Server requires options.");
  }

  if (arguments.length > 1) {
    // TODO: test this
    throw new Error(
      `Apollo Server expects exactly one argument, got ${arguments.length}`
    );
  }

  const graphqlHandler = (ctx: Koa.Context): Promise<void> => {
    return runHttpQuery([ctx], {
      method: ctx.request.method,
      options: options,
      query:
        ctx.request.method === "POST" ? ctx.request.body : ctx.request.query,
      request: convertNodeHttpToRequest(ctx.req)
    }).then(
      ({ graphqlResponse, responseInit }) => {
        Object.keys(responseInit.headers).forEach(key =>
          ctx.set(key, responseInit.headers[key])
        );
        ctx.body = graphqlResponse;
      },
      (error: HttpQueryError) => {
        if ("HttpQueryError" !== error.name) {
          throw error;
        }

        if (error.headers) {
          Object.keys(error.headers).forEach(header => {
            ctx.set(header, error.headers[header]);
          });
        }

        ctx.status = error.statusCode;
        ctx.body = error.message;
      }
    );
  };

  return graphqlHandler;
}