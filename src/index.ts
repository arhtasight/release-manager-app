import { Probot } from "probot";
import { issueHandlers, milestoneHandlers } from "./handlers";

export default (app: Probot) => {
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  app.on("issues.opened", issueHandlers.handleIssueOpened);
  app.on("milestone.created", milestoneHandlers.handleMilestoneCreated);
};
