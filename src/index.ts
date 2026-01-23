import { Probot, Context } from "probot";
import * as assert from "assert";

const projectNumber = 1; // Replace with your actual project number

export default (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!"
    });
    await context.octokit.rest.issues.createComment(issueComment);
    context.log.info(`Created thank you comment for issue #${context.payload.issue.number}`);
    await addProjectItem(context, { projectnumber: projectNumber, itemTitle: context.payload.issue.title, itemBody: context.payload.issue.body });
    context.log.info(`handled addition of issue #${context.payload.issue.number} for title: ${context.payload.issue.title}`);
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

const addProjectItem = async (context: Context, data: { projectnumber: number; itemTitle: string; itemBody?: string | null }): Promise<string | null> => {
  assert.ok(data, "Data object is required");
  assert.ok(data.projectnumber, "Project number is required");
  assert.ok(data.itemTitle, "Item title is required");

  const addProjectItemQuery = `
        mutation 
          AddIssueToProject($projectId: ID!, $title: String!, $body: String!) {
            addProjectV2DraftItem(input: {
              projectId: $projectId,
              title: $title
              body: $body
            }) {
              projectItem { id }
            }
          }
    `;

  const projectId = await getProjectId(context, data.projectnumber);
  context.log.info(`Retrieved project ID: ${projectId} for project number: ${data.projectnumber}`);
  assert.ok(projectId, `Could not find project ID for project number ${data.projectnumber}`);
  const addProjectItemQueryVariables = {
    projectId: projectId,
    title: data.itemTitle,
    body: data.itemBody || ""
  };

  const response: any = await context.octokit.graphql(addProjectItemQuery, addProjectItemQueryVariables);
  const itemId = response?.addProjectV2DraftItem?.projectItem?.id;
  context.log.info(`Added item [id=${itemId}] to project ${data.projectnumber} with title: ${data.itemTitle}`);
  assert.ok(itemId, "Failed to add item to project");
  return itemId;
};

const getProjectId = async (context: Context, projectNumber: number): Promise<string | null> => {
  const payload = context.payload as any;
  const owner = payload.organization?.login || payload.repository?.owner?.login;
  assert.ok(owner, "Owner information is required in the payload");

  const getProjectsQuery = `
      query GetOrgProjectId {
        organization(login: "YOUR_ORG_NAME") {
          projectV2(number: 3) {
            id
          }
        }
      }
  `;
  const variables = {
    owner: owner,
    projectNumber: projectNumber
  };
  context.log.info(`Fetching project ID for project number ${projectNumber} under owner ${owner}`);
  const response: any = await context.octokit.graphql(getProjectsQuery, variables);
  return response?.organization?.projectV2?.id;
};
