export type Priority = "Crisis" | "Strategic" | "Operational" | "Quick Win";
export type RequestType = "Campaign (Multi-Channel)" | "Single Channel" | "Existing Project" | "Event" | "Survey";
export type Channel = "Web" | "Email" | "Paid Media" | "UX" | "Analytics" | "AI" | "Events" | "PR" | "Organic Social" | "Advertising" | "Paid Social" | "Insights";
export type Brand = "M&C" | "FPL" | "NEE" | "NEER";
export type SyncType = "Monday.com" | "Jira";
export type ReviewAction = "Approved" | "Revision Requested" | "Rejected";
export type JobStatus = "active" | "approved" | "returned" | "cancelled";
export type StageStatus = "completed" | "active" | "upcoming" | "skipped";

export type StageId =
  | "team-lead"
  | "safety"
  | "strategist"
  | "dept-manager"
  | "technical"
  | "legal"
  | "communications"
  | "creative-review"
  | "data-analysis";

export interface Reviewer {
  id: string;
  name: string;
  initials: string;
  department: string;
  avatarColor: string;
}

export interface Decision {
  id: string;
  stageId: StageId;
  stageName: string;
  reviewer: Reviewer;
  action: ReviewAction;
  timestamp: string;
  comment?: string;
}

export interface Stage {
  id: StageId;
  name: string;
  status: StageStatus;
  assignedTo?: Reviewer;
  dueDate?: string;
  completedDate?: string;
}

export interface Job {
  id: string;
  projectId: string;
  title: string;
  requestType: RequestType;
  channels: Channel[];
  priority: Priority;
  brand: Brand;
  initiative: string;
  dueDate: string;
  description: string;
  submittedBy: Reviewer;
  submittedDate: string;
  status: JobStatus;
  currentStage: StageId | null;
  stages: Stage[];
  decisions: Decision[];
  reviewDraft?: string;
  cancellationReason?: string;
  returnedComment?: string;
  returnedStage?: string;
  returnedDate?: string;
  daysPending: number;
}

export interface Project {
  id: string;
  name: string;
  brand: Brand;
  syncType: SyncType;
  syncLink: string;
  description: string;
  createdDate: string;
  jobs: Job[];
}
