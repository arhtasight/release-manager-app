import { IssueOpenedContext } from "./types";
import { issueService, projectService } from "../services";
import { configUtils, diagnoseUtils } from "../utils";

export const handleIssueOpened = async (context: IssueOpenedContext): Promise<void> => {
  const issueNumber = context.payload.issue.number;
  const issueTitle = context.payload.issue.title;
  context.log.info(`Handling opened issue #${issueNumber} with title: ${issueTitle}`);

  issueService.addComment(context, "Thanks for opening this issue!");
  diagnoseUtils.graphQlMutation(context);

  await projectService.addProjectItem(context, {
    projectnumber: configUtils.getProjectNumber(),
    itemTitle: context.payload.issue.title,
    itemBody: context.payload.issue.body || ""
  });
  context.log.info(`handled addition of issue #${context.payload.issue.number} for title: ${context.payload.issue.title}`);
};
