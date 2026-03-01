import { IssueOpenedContext } from "./types";
import { issueService, projectService } from "../services";
import { configUtils, diagnoseUtils } from "../utils";

export const handleIssueOpened = async (context: IssueOpenedContext): Promise<void> => {
  const issueNumber = context.payload.issue.number;
  const issueTitle = context.payload.issue.title;
  context.log.info(`Handling opened issue #${issueNumber} with title: ${issueTitle}`);

  issueService.addComment(context, "Thanks for opening this issue!");
  diagnoseUtils.graphQlMutation(context);

  let draftItemBody = context.payload.issue.body || "";
  draftItemBody += `\n\n---\n\n*There is related issue #${issueNumber} to this item. Please check the issue for more details: ${context.payload.issue.url}*`;
  const projectItemResponse = await projectService.addProjectItem(context, {
    projectnumber: configUtils.getProjectNumber(),
    itemTitle: context.payload.issue.title,
    itemBody: draftItemBody
  });
  issueService.addComment(
    context,
    `The new draft item is created related to this issue in project board.\n\nYou can view and edit the item here: ${projectItemResponse.itemUrl}\n\nPlease check the project board ${projectItemResponse.projectUrl} for more details.`
  );
  context.log.info(
    `handled addition of issue #${context.payload.issue.number} for title: ${context.payload.issue.title} with response URL: ${projectItemResponse.itemUrl}`
  );
};
