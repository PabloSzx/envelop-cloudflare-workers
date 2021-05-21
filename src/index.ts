import { Router } from "worktop";
import * as Cache from "worktop/cache";
import { envelop, useSchema } from "@envelop/core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { processRequest } from "graphql-helix/dist/process-request";
// import * as modules from "graphql-modules";

// console.log(8, modules);
const API = new Router();

const schema = makeExecutableSchema({
  typeDefs: `
  type Query {
    hello: String!
  }
  `,
  resolvers: {
    Query: {
      hello() {
        return "Hello World";
      },
    },
  },
});

const getEnveloped = envelop({
  plugins: [useSchema(schema)],
});

API.add("GET", "/graphql", async (req, res) => {
  const request = {
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  const { schema, contextFactory, execute, parse, subscribe, validate } = getEnveloped();
  const result = await processRequest({
    schema,
    request,
    contextFactory,
    execute,
    parse,
    subscribe,
    validate,
  });

  if (result.type !== "RESPONSE") throw Error("UNSUPPORTED!");

  res.send(result.status, result.payload);
});

API.add("POST", "/graphql", async (req, res) => {
  const request = {
    body: await req.body.json(),
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  const { schema, contextFactory, execute, parse, subscribe, validate } = getEnveloped();
  const result = await processRequest({
    schema,
    request,
    contextFactory,
    execute,
    parse,
    subscribe,
    validate,
  });

  if (result.type !== "RESPONSE") throw Error("UNSUPPORTED!");

  res.send(result.status, result.payload);
});

Cache.listen(API.run);
