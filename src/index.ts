import { Probot } from "probot";
import { issueHandlers } from "./handlers";

export default (app: Probot) => {
  app.on("issues.opened", issueHandlers.handleIssueOpened);

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
