import { IssueOpenedContext, MilestoneCreatedContext } from "../handlers/types";
import assert from "assert";

export const addComment = async (context: IssueOpenedContext, commentBody: string): Promise<void> => {
  assert.ok(commentBody, "Comment body is required");
  const issueComment = context.issue({ body: commentBody });
  const addCommentResponse = await context.octokit.rest.issues.createComment(issueComment);
  context.log.info(
    `Added comment to issue #${context.payload.issue.number}, comment: ${commentBody}, response status: ${addCommentResponse.status}, response data: ${JSON.stringify(addCommentResponse.data)}`
  );
};

export const updateMilestoneDescription = async (context: MilestoneCreatedContext, description: string): Promise<void> => {
  assert.ok(description, "Milestone description is required");
  const updateResponse = await context.octokit.rest.issues.updateMilestone({
    ...context.repo(),
    milestone_number: context.payload.milestone.number,
    description: description
  });
  context.log.info(
    `Updated milestone #${context.payload.milestone.number} description, response status: ${updateResponse.status}, response data: ${JSON.stringify(updateResponse.data)}`
  );
};
