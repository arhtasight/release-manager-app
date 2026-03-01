import { Context } from "probot";

export const graphQlMutation = async (context: Context): Promise<void> => {
  const query = `
          query {
          __type(name: "Mutation") {
            fields {
              name
            }
          }
        }
      `;

  const response: any = await context.octokit.graphql(query);
  context.log.info("GraphQL Mutation Fields: " + JSON.stringify(response));
};
