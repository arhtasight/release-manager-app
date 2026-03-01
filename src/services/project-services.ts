import { Context } from "probot";
import assert from "assert";
import { IssueOpenedContext } from "src/handlers/types";
import type { Mutation, OrganizationIdentityProvider, ProjectV2 } from "../graphql/generated/schema.ts";

const addProjectItemQuery = `
        mutation AddIssueToProject($projectId: ID!, $title: String!, $body: String!) {
          addProjectV2DraftIssue(input: {
            projectId: $projectId
            title: $title
            body: $body
          }) {
            projectItem {
              fullDatabaseId
            }
          }
        }
    `;

type ProjectItemData = {
  projectnumber: number;
  itemTitle: string;
  itemBody: string;
};
type ProjectItemResponse = {
  projectUrl: string;
  itemId: string;
  itemUrl: string;
};
export const addProjectItem = async (context: Context, data: ProjectItemData): Promise<ProjectItemResponse> => {
  assert.ok(data, "Data object is required");
  assert.ok(data.projectnumber, "Project number is required");
  assert.ok(data.itemTitle, "Item title is required");
  assert.ok(data.itemBody !== undefined, "Item body is required (can be empty string)");

  const project = await getProjectId(context, data.projectnumber);
  context.log.info(`Retrieved project ID: ${project.id} for project number: ${data.projectnumber}`);
  assert.ok(project.id, `Could not find project ID for project number ${data.projectnumber}`);
  const addProjectItemQueryVariables = {
    projectId: project.id,
    title: data.itemTitle,
    body: data.itemBody || ""
  };

  const response: Mutation = await context.octokit.graphql(addProjectItemQuery, addProjectItemQueryVariables);
  const itemId = response.addProjectV2DraftIssue?.projectItem?.fullDatabaseId ?? null;
  context.log.info(`Added item [id=${itemId}] to project ${data.projectnumber} with title: ${data.itemTitle}`);
  assert.ok(itemId, "Failed to add item to project");

  const itemLink = getProjectItemUrl(project.url, itemId);
  const itemResponse: ProjectItemResponse = {
    projectUrl: project.url,
    itemId: itemId,
    itemUrl: itemLink
  };
  context.log.info(`Project item URL: ${itemLink}`);

  return itemResponse;
};

const getProjectsQuery = `
    query GetOrgProjectId($owner: String!, $projectNumber: Int!) {
      organization(login: $owner) {
        projectV2(number: $projectNumber) {
          id
          url
          resourcePath
        }
      }
    }
`;
export const getProjectId = async (context: IssueOpenedContext, projectNumber: number): Promise<{ id: string; url: string; resourcePath: string }> => {
  const owner = context.payload.organization?.login || context.payload.repository?.owner?.login;
  assert.ok(owner, "Owner information is required in the payload");

  const variables = {
    owner: owner,
    projectNumber: projectNumber
  };
  context.log.info(`Fetching project ID for project number ${projectNumber} under owner ${owner}`);
  const response: OrganizationIdentityProvider = await context.octokit.graphql(getProjectsQuery, variables);
  if (response?.organization?.projectV2) {
    const proj: Required<Pick<ProjectV2, "id" | "url" | "resourcePath">> = response?.organization?.projectV2;
    return { ...proj };
  }
  throw new Error(`Project number ${projectNumber} not found for owner ${owner}`);
};

const getProjectItemUrl = (projectUrl: string, itemId: string): string => {
  return `${projectUrl}/views/1?pane=issue&itemId=${itemId}`;
};
