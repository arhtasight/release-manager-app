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
              id
            }
          }
        }
    `;

type ProjectItemData = {
  projectnumber: number;
  itemTitle: string;
  itemBody: string;
};
export const addProjectItem = async (context: Context, data: ProjectItemData): Promise<string | null> => {
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
  const itemId = response.addProjectV2DraftIssue?.projectItem?.id ?? null;
  context.log.info(`Added item [id=${itemId}] to project ${data.projectnumber} with title: ${data.itemTitle}`);
  assert.ok(itemId, "Failed to add item to project");

  // Post a comment on the issue with a link to the project (include item node id)
  try {
    const projectUrl = project.url || `https://github.com${project.resourcePath || ""}`;
    const itemLink = itemId ? `${projectUrl}/items/${itemId}` : projectUrl;
    const projectComment = context.issue({ body: `This issue was added to project: ${itemLink}` });
    await context.octokit.rest.issues.createComment(projectComment);
  } catch (err) {
    context.log.error("Failed to post project link comment", err as any);
  }

  return itemId;
};

export const getProjectId = async (context: IssueOpenedContext, projectNumber: number): Promise<{ id: string; url: string; resourcePath: string }> => {
  const owner = context.payload.organization?.login || context.payload.repository?.owner?.login;
  assert.ok(owner, "Owner information is required in the payload");

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
