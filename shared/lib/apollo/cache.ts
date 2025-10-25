import { InMemoryCache } from "@apollo/client";

export const globalCache = new InMemoryCache({
  typePolicies: {
    Message: {
      keyFields: ["id"],
    },
    Query: {
      fields: {
        messages: {
          merge(existing = [], incoming: any[]) {
            return [...incoming];
          },
        },
      },
    },
  },
});
