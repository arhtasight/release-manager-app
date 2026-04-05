import { issueService, projectService } from "../services";
import { configUtils } from "../utils";
import { MilestoneCreatedContext } from "./types";

export const handleMilestoneCreated = async (context: MilestoneCreatedContext): Promise<void> => {
  context.log.info(`Milestone created: ${context.payload.milestone.title} in repository ${context.payload.repository.full_name}`);
  if (!isMilestoneEligibleForAutomation(context.payload.milestone.title, context.payload.milestone.description)) {
    context.log.info(`Milestone #${context.payload.milestone.number} with title: ${context.payload.milestone.title} is not eligible for automation. Skipping.`);
    return;
  }
  const projectItemResponse = await projectService.addProjectItem(context, {
    itemTitle: context.payload.milestone.title,
    itemBody: `Milestone #${context.payload.milestone.number} is created.\n\nlink to the milestone: ${context.payload.milestone.html_url}`,
    projectnumber: configUtils.getProjectNumber()
  });
  await initializeMilestoneDescription(context, projectItemResponse);
  context.log.info(`handled milestone created for milestone #${context.payload.milestone.number} with title: ${context.payload.milestone.title}`);
};

const initialDescription =
  "Automated milestone description initialized by Release Manager App.\n\nDO NOT edit or remove this description if you want to keep the automation working for this milestone.\n\n";

const initializeMilestoneDescription = async (context: MilestoneCreatedContext, projectItem: projectService.ProjectItemResponse): Promise<void> => {
  let description = initialDescription;
  if (context.payload.milestone.description && context.payload.milestone.description !== initialDescription) {
    context.log.info(
      `Milestone #${context.payload.milestone.number} already has description set manually. appending project item information to the existing description.`
    );
    description = context.payload.milestone.description;
  }
  description = addLineSafely(description, "The draft item is automatically created in project board related to this milestone to track progress.", 2);
  description = addLineSafely(description, `You can view and edit the item here: ${projectItem.itemUrl}`, 2);
  description = addLineSafely(description, `Please check the project board ${projectItem.projectUrl} for more details.`, 1);
  await issueService.updateMilestoneDescription(context, description);
};

const isMilestoneEligibleForAutomation = (title: string, description: string | null): boolean => {
  if (!title.includes("test")) {
    return false;
  }
  if (!description) {
    return true;
  }
  if (description.startsWith(initialDescription)) {
    return true;
  }
  return false;
};

const addLineSafely = (original: string, lineToAdd: string, minRequiredLineBreaksAtEnd: number): string => {
  // find the last line seperator occurrence and add the line after that, only add missing line seperators.
  // ex. requires 2 line seperators, if there is already 1 line seperator at the end of the original string, only add 1 line seperator before the line to add.
  const trimmedOriginal = original.trimEnd(); // remove all line seperators at the end to avoid confusion, we will add the required line seperators back later.
  // count occurrences of line seperator at the end of the original string
  const lineSeperatorsAtEnd = original.length - trimmedOriginal.length;
  if (lineSeperatorsAtEnd >= minRequiredLineBreaksAtEnd) {
    return original + lineToAdd;
  }

  return original + "\n".repeat(minRequiredLineBreaksAtEnd) + lineToAdd;
};
