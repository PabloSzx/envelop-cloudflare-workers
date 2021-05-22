import { Handler, Router } from "worktop";
import * as Cache from "worktop/cache";

import { createEnvelopAppFactory, gql, handleRequest } from "@pablosz/envelop-app/common/app";

const API = new Router();

const App = (async () => {
  const envelopApp = createEnvelopAppFactory(
    {
      schema: {
        typeDefs: gql`
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
      },
    },
    {}
  );

  function parseQuery(queryString: string) {
    const query: Record<string, string> = {};
    const pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");
    for (let i = 0; i < pairs.length; ++i) {
      const pair = pairs[i].split("=");
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
    }
    return query;
  }

  return envelopApp.appBuilder({
    adapterFactory(getEnveloped) {
      const handler: Handler = async (req, res) => {
        const request = {
          body: req.method === "POST" ? await req.body.json() : undefined,
          headers: req.headers,
          method: req.method,
          query: req.search ? parseQuery(req.search) : {},
        };

        await handleRequest({
          request,
          getEnveloped,
          baseOptions: {},
          buildContext() {
            return {};
          },
          buildContextArgs() {},
          onMultiPartResponse() {
            throw Error("UNSUPPORTED");
          },
          onPushResponse() {
            throw Error("UNSUPPORTED");
          },
          onResponse(result) {
            res.send(result.status, result.payload);
          },
        });
      };

      return handler;
    },
  });
})();

API.add("GET", "/graphql", async (req, res) => {
  await (await App).app(req, res);
});

API.add("POST", "/graphql", async (req, res) => {
  await (await App).app(req, res);
});

Cache.listen(API.run);
