import { issueService } from "../services";
import { MilestoneCreatedContext } from "./types";

export const handleMilestoneCreated = async (context: MilestoneCreatedContext): Promise<void> => {
  context.log.info(`Milestone created: ${context.payload.milestone.title} in repository ${context.payload.repository.full_name}`);
  issueService.updateMilestoneDescription(
    context,
    `This milestone was created at ${context.payload.milestone.created_at} with title: ${context.payload.milestone.title}`
  );
  context.log.info(`handled milestone created for milestone #${context.payload.milestone.number} with title: ${context.payload.milestone.title}`);
};
