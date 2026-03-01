import { IssueOpenedContext } from "../handlers/types";
import assert from "assert";

export const addComment = async (context: IssueOpenedContext, commentBody: string): Promise<void> => {
  assert.ok(commentBody, "Comment body is required");
  const issueComment = context.issue({ body: commentBody });
  const addCommentResponse = await context.octokit.rest.issues.createComment(issueComment);
  context.log.info(
    `Added comment to issue #${context.payload.issue.number}, comment: ${commentBody}, response status: ${addCommentResponse.status}, response data: ${JSON.stringify(addCommentResponse.data)}`
  );
};
