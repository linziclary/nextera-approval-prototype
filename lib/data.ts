import type { Project, Reviewer, Stage, Job } from "./types";

// ─── Reviewers ───────────────────────────────────────────────────────────────

export const REVIEWERS: Record<string, Reviewer> = {
  jmiles: {
    id: "jmiles",
    name: "Jordan Miles",
    initials: "JM",
    department: "Creative Strategy",
    avatarColor: "#7C3AED",
  },
  sfernandez: {
    id: "sfernandez",
    name: "Sofia Fernandez",
    initials: "SF",
    department: "Marketing & Communications",
    avatarColor: "#0077AC",
  },
  ptran: {
    id: "ptran",
    name: "Priya Tran",
    initials: "PT",
    department: "Digital Experience",
    avatarColor: "#48801C",
  },
  dkim: {
    id: "dkim",
    name: "Daniel Kim",
    initials: "DK",
    department: "Legal & Compliance",
    avatarColor: "#EF4444",
  },
  rnguyen: {
    id: "rnguyen",
    name: "Rachel Nguyen",
    initials: "RN",
    department: "Brand & Creative",
    avatarColor: "#F59E0B",
  },
  cwilson: {
    id: "cwilson",
    name: "Chris Wilson",
    initials: "CW",
    department: "Safety & Compliance",
    avatarColor: "#0D9488",
  },
  mlopez: {
    id: "mlopez",
    name: "Maria Lopez",
    initials: "ML",
    department: "Communications",
    avatarColor: "#EC4899",
  },
  ahartman: {
    id: "ahartman",
    name: "Alex Hartman",
    initials: "AH",
    department: "Technical Operations",
    avatarColor: "#8B5CF6",
  },
  byoung: {
    id: "byoung",
    name: "Blake Young",
    initials: "BY",
    department: "Department Management",
    avatarColor: "#F97316",
  },
  jsmith: {
    id: "jsmith",
    name: "Jason Smith",
    initials: "JS",
    department: "Creative",
    avatarColor: "#8B5CF6",
  },
  mtran: {
    id: "mtran",
    name: "Maya Tran",
    initials: "MT",
    department: "Analytics",
    avatarColor: "#F59E0B",
  },
  // Current user (submitter context)
  lclary: {
    id: "lclary",
    name: "Linzi Clary",
    initials: "LC",
    department: "Creative Operations",
    avatarColor: "#008ac0",
  },
};

// ─── Helper to build stage arrays ────────────────────────────────────────────

function buildStages(overrides: Partial<Stage>[]): Stage[] {
  const base: Stage[] = [
    { id: "team-lead",      name: "Team Lead Review",        status: "upcoming" },
    { id: "safety",         name: "Safety Review",           status: "upcoming" },
    { id: "strategist",     name: "Strategist Review",       status: "upcoming" },
    { id: "dept-manager",   name: "Department Manager Review",status: "upcoming" },
    { id: "technical",      name: "Technical Review",        status: "upcoming" },
    { id: "legal",          name: "Legal Review",            status: "upcoming" },
    { id: "communications", name: "Communications Review",   status: "upcoming" },
  ];
  for (const ov of overrides) {
    const s = base.find((b) => b.id === ov.id);
    if (s) Object.assign(s, ov);
  }
  return base;
}

// ─── Projects & Jobs ─────────────────────────────────────────────────────────

const job1: Job = {
  id: "job-001",
  projectId: "proj-001",
  title: "Wind Energy Hero Video Series",
  requestType: "Campaign (Multi-Channel)",
  channels: ["Paid Media"],
  priority: "Strategic",
  brand: "M&C",
  initiative: "Renewables Brand Elevation 2026",
  dueDate: "2026-04-30",
  description:
    "A three-part hero video series spotlighting NextEra's wind energy leadership. Content will run across nexteraenergy.com, YouTube pre-roll, and paid social. Requires final brand approval and legal clearance for talent usage rights.",
  submittedBy: REVIEWERS.lclary,
  submittedDate: "2026-04-10",
  status: "active",
  currentStage: "team-lead",
  daysPending: 5,
  stages: buildStages([
    {
      id: "team-lead",
      status: "active",
      assignedTo: REVIEWERS.jmiles,
      dueDate: "2026-04-28",
    },
    { id: "safety", status: "skipped" },
    {
      id: "strategist",
      status: "upcoming",
      assignedTo: REVIEWERS.sfernandez,
    },
    {
      id: "dept-manager",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    {
      id: "technical",
      status: "upcoming",
      assignedTo: REVIEWERS.ahartman,
    },
    {
      id: "legal",
      status: "upcoming",
      assignedTo: REVIEWERS.dkim,
    },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [],
};

const job2: Job = {
  id: "job-002",
  projectId: "proj-001",
  title: "Renewables Investor One-Pager",
  requestType: "Single Channel",
  channels: ["Email"],
  priority: "Operational",
  brand: "NEE",
  initiative: "Renewables Brand Elevation 2026",
  dueDate: "2026-05-10",
  description:
    "One-page investor communication summarising Q1 renewables portfolio performance. For distribution via IR email list.",
  submittedBy: REVIEWERS.lclary,
  submittedDate: "2026-04-15",
  status: "active",
  currentStage: "dept-manager",
  daysPending: 3,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-17",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "active",
      assignedTo: REVIEWERS.byoung,
      dueDate: "2026-04-30",
    },
    { id: "technical", status: "skipped" },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-002",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-17T10:05:00Z",
    },
  ],
};

const job3: Job = {
  id: "job-003",
  projectId: "proj-001",
  title: "Wind Farm Photography Asset Pack",
  requestType: "Existing Project",
  channels: ["Web"],
  priority: "Quick Win",
  brand: "M&C",
  initiative: "Renewables Brand Elevation 2026",
  dueDate: "2026-05-05",
  description:
    "New photography assets from the Palms Springs Wind Farm shoot. Assets to be uploaded to the DAM and embedded on the renewables product pages.",
  submittedBy: REVIEWERS.rnguyen,
  submittedDate: "2026-04-20",
  status: "approved",
  currentStage: null,
  daysPending: 0,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-21",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "completed",
      assignedTo: REVIEWERS.byoung,
      completedDate: "2026-04-22",
    },
    {
      id: "technical",
      status: "completed",
      assignedTo: REVIEWERS.ahartman,
      completedDate: "2026-04-23",
    },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-003",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-21T09:10:00Z",
    },
    {
      id: "dec-004",
      stageId: "dept-manager",
      stageName: "Department Manager Review",
      reviewer: REVIEWERS.byoung,
      action: "Approved",
      timestamp: "2026-04-22T11:30:00Z",
    },
    {
      id: "dec-005",
      stageId: "technical",
      stageName: "Technical Review",
      reviewer: REVIEWERS.ahartman,
      action: "Approved",
      timestamp: "2026-04-23T16:45:00Z",
      comment: "Assets optimised and CDN-ready. Approved.",
    },
  ],
};

// ─── Project 2 jobs ───────────────────────────────────────────────────────────

const job4: Job = {
  id: "job-004",
  projectId: "proj-002",
  title: "FPL Outage Map UX Redesign",
  requestType: "Existing Project",
  channels: ["UX"],
  priority: "Quick Win",
  brand: "FPL",
  initiative: "FPL Customer Self-Service 2026",
  dueDate: "2026-04-25",
  description:
    "Redesign of the outage map interactive component on FPL.com. Improving mobile responsiveness and real-time data latency display. Full design handoff complete; this job covers the UX review and sign-off.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-08",
  status: "approved",
  currentStage: null,
  daysPending: 0,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-09",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "completed",
      assignedTo: REVIEWERS.byoung,
      completedDate: "2026-04-11",
    },
    {
      id: "technical",
      status: "completed",
      assignedTo: REVIEWERS.ahartman,
      completedDate: "2026-04-14",
    },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-006",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-09T08:55:00Z",
    },
    {
      id: "dec-007",
      stageId: "dept-manager",
      stageName: "Department Manager Review",
      reviewer: REVIEWERS.byoung,
      action: "Approved",
      timestamp: "2026-04-11T14:20:00Z",
    },
    {
      id: "dec-008",
      stageId: "technical",
      stageName: "Technical Review",
      reviewer: REVIEWERS.ahartman,
      action: "Approved",
      timestamp: "2026-04-14T10:00:00Z",
      comment: "WCAG 2.1 AA compliant. Performance benchmarks met.",
    },
  ],
};

const job5: Job = {
  id: "job-005",
  projectId: "proj-002",
  title: "Paid Social Campaign — NEER",
  requestType: "Campaign (Multi-Channel)",
  channels: ["Paid Media"],
  priority: "Crisis",
  brand: "NEER",
  initiative: "NEER Investor Relations Q2 Push",
  dueDate: "2026-04-29",
  description:
    "Emergency paid social activation responding to competitive messaging in the clean energy investment space. Requires immediate legal review for financial claims compliance and rapid deployment across LinkedIn, X, and Meta.",
  submittedBy: REVIEWERS.sfernandez,
  submittedDate: "2026-04-26",
  status: "active",
  currentStage: "team-lead",
  daysPending: 1,
  stages: buildStages([
    {
      id: "team-lead",
      status: "active",
      assignedTo: REVIEWERS.jmiles,
      dueDate: "2026-04-27",
    },
    { id: "safety", status: "skipped" },
    {
      id: "strategist",
      status: "upcoming",
      assignedTo: REVIEWERS.sfernandez,
    },
    {
      id: "dept-manager",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    { id: "technical", status: "skipped" },
    {
      id: "legal",
      status: "upcoming",
      assignedTo: REVIEWERS.dkim,
    },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [],
};

const job6: Job = {
  id: "job-006",
  projectId: "proj-002",
  title: "Events Landing Page — Q4 Summit",
  requestType: "Single Channel",
  channels: ["Events", "Web"],
  priority: "Operational",
  brand: "M&C",
  initiative: "NextEra Leadership Summit 2026",
  dueDate: "2026-06-01",
  description:
    "Landing page for the NextEra Leadership Summit Q4 2026. Includes speaker bios, agenda, registration form, and livestream embed. Returned for revision after Technical Review flagged accessibility issues with the registration form.",
  submittedBy: REVIEWERS.lclary,
  submittedDate: "2026-04-05",
  status: "returned",
  currentStage: "technical",
  returnedComment:
    "Registration form fails WCAG 2.1 AA — error states are colour-only and the date picker is keyboard-inaccessible. Please revise before resubmission.",
  returnedStage: "Technical Review",
  returnedDate: "2026-04-18",
  daysPending: 9,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-07",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "completed",
      assignedTo: REVIEWERS.byoung,
      completedDate: "2026-04-12",
    },
    {
      id: "technical",
      status: "active",
      assignedTo: REVIEWERS.ahartman,
      dueDate: "2026-04-21",
    },
    { id: "legal", status: "skipped" },
    {
      id: "communications",
      status: "upcoming",
      assignedTo: REVIEWERS.mlopez,
    },
  ]),
  decisions: [
    {
      id: "dec-009",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-07T11:00:00Z",
    },
    {
      id: "dec-010",
      stageId: "dept-manager",
      stageName: "Department Manager Review",
      reviewer: REVIEWERS.byoung,
      action: "Approved",
      timestamp: "2026-04-12T15:30:00Z",
    },
    {
      id: "dec-011",
      stageId: "technical",
      stageName: "Technical Review",
      reviewer: REVIEWERS.ahartman,
      action: "Revision Requested",
      timestamp: "2026-04-18T09:15:00Z",
      comment:
        "Registration form fails WCAG 2.1 AA — error states are colour-only and the date picker is keyboard-inaccessible. Please revise before resubmission.",
    },
  ],
};

// ─── Project 3 jobs ───────────────────────────────────────────────────────────

const job7: Job = {
  id: "job-007",
  projectId: "proj-003",
  title: "June Employee Newsletter",
  requestType: "Single Channel",
  channels: ["Email"],
  priority: "Operational",
  brand: "NEE",
  initiative: "NEE Internal Communications FY2026",
  dueDate: "2026-05-28",
  description:
    "Monthly all-employee newsletter for June 2026. Includes CEO message, safety spotlight, benefits open enrollment reminder, and employee recognition section.",
  submittedBy: REVIEWERS.mlopez,
  submittedDate: "2026-04-18",
  status: "active",
  currentStage: "dept-manager",
  daysPending: 4,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-20",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "active",
      assignedTo: REVIEWERS.byoung,
      dueDate: "2026-04-30",
    },
    { id: "technical", status: "skipped" },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-012",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-20T13:00:00Z",
      comment: "Content reviewed and on-brand. Approved.",
    },
  ],
};

const job8: Job = {
  id: "job-008",
  projectId: "proj-003",
  title: "Analytics Dashboard Embed",
  requestType: "Existing Project",
  channels: ["Analytics"],
  priority: "Quick Win",
  brand: "NEE",
  initiative: "NEE Internal Communications FY2026",
  dueDate: "2026-05-15",
  description:
    "Embed a Looker Studio analytics dashboard into the NEE Internal Hub for tracking newsletter open rates, intranet page views, and employee engagement scores.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-19",
  status: "active",
  currentStage: "dept-manager",
  daysPending: 3,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-21",
    },
    { id: "safety", status: "skipped" },
    { id: "strategist", status: "skipped" },
    {
      id: "dept-manager",
      status: "active",
      assignedTo: REVIEWERS.byoung,
      dueDate: "2026-04-30",
    },
    { id: "technical", status: "skipped" },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-013",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-21T08:40:00Z",
    },
  ],
};

const job9: Job = {
  id: "job-009",
  projectId: "proj-003",
  title: "Leadership Town Hall Recap Video",
  requestType: "Single Channel",
  channels: ["Web"],
  priority: "Strategic",
  brand: "NEE",
  initiative: "NEE Internal Communications FY2026",
  dueDate: "2026-05-20",
  description:
    "Edited recap of the April All-Hands Town Hall with captions and chapter markers. To be posted on the NEE Internal Hub within 5 business days of the event.",
  submittedBy: REVIEWERS.mlopez,
  submittedDate: "2026-04-22",
  status: "active",
  currentStage: "strategist",
  daysPending: 2,
  stages: buildStages([
    {
      id: "team-lead",
      status: "completed",
      assignedTo: REVIEWERS.jmiles,
      completedDate: "2026-04-23",
    },
    { id: "safety", status: "skipped" },
    {
      id: "strategist",
      status: "active",
      assignedTo: REVIEWERS.sfernandez,
      dueDate: "2026-04-29",
    },
    {
      id: "dept-manager",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    {
      id: "technical",
      status: "upcoming",
      assignedTo: REVIEWERS.ahartman,
    },
    { id: "legal", status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    {
      id: "dec-014",
      stageId: "team-lead",
      stageName: "Team Lead Review",
      reviewer: REVIEWERS.jmiles,
      action: "Approved",
      timestamp: "2026-04-23T10:20:00Z",
    },
  ],
};

const job10: Job = {
  id: "job-010",
  projectId: "proj-001",
  title: "Solar Power Awareness Webinar",
  requestType: "Event",
  channels: ["PR", "Organic Social"],
  priority: "Operational",
  brand: "M&C",
  initiative: "Renewables Brand Elevation 2026",
  dueDate: "2026-05-14",
  description:
    "Live webinar event promoting solar power accessibility for residential customers. Covers product education, Q&A session, and post-event social amplification.",
  submittedBy: REVIEWERS.rnguyen,
  submittedDate: "2026-04-22",
  status: "active",
  currentStage: "team-lead",
  daysPending: 2,
  stages: buildStages([
    {
      id: "team-lead",
      status: "active",
      assignedTo: REVIEWERS.jmiles,
      dueDate: "2026-05-01",
    },
    { id: "safety", status: "skipped" },
    {
      id: "strategist",
      status: "upcoming",
      assignedTo: REVIEWERS.sfernandez,
    },
    {
      id: "dept-manager",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    { id: "technical", status: "skipped" },
    {
      id: "legal",
      status: "upcoming",
      assignedTo: REVIEWERS.dkim,
    },
    {
      id: "communications",
      status: "upcoming",
      assignedTo: REVIEWERS.mlopez,
    },
  ]),
  decisions: [],
};

const job11: Job = {
  id: "job-011",
  projectId: "proj-002",
  title: "Electric Vehicle Launch Campaign",
  requestType: "Campaign (Multi-Channel)",
  channels: ["Advertising", "Paid Social"],
  priority: "Operational",
  brand: "FPL",
  initiative: "FPL Clean Energy Transition 2026",
  dueDate: "2026-05-04",
  description:
    "Multi-channel launch campaign for FPL's new EV charging network expansion. Covers digital advertising, paid social activation, and co-branded content with automotive partners.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-21",
  status: "active",
  currentStage: "creative-review",
  daysPending: 3,
  stages: [
    {
      id: "creative-review",
      name: "Creative Review",
      status: "active",
      assignedTo: REVIEWERS.jsmith,
      dueDate: "2026-05-01",
    },
    {
      id: "dept-manager",
      name: "Department Manager Review",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    {
      id: "legal",
      name: "Legal Review",
      status: "upcoming",
      assignedTo: REVIEWERS.dkim,
    },
    {
      id: "communications",
      name: "Communications Review",
      status: "skipped",
    },
  ],
  decisions: [],
};

const job12: Job = {
  id: "job-012",
  projectId: "proj-003",
  title: "Annual Customer Feedback Survey",
  requestType: "Survey",
  channels: ["Insights", "Email"],
  priority: "Operational",
  brand: "NEE",
  initiative: "NEE Internal Communications FY2026",
  dueDate: "2026-06-15",
  description:
    "Annual survey distributed to all NEE residential customers to measure satisfaction, service quality, and communication preferences. Results feed into Q3 strategy planning.",
  submittedBy: REVIEWERS.mlopez,
  submittedDate: "2026-04-23",
  status: "active",
  currentStage: "data-analysis",
  daysPending: 1,
  stages: [
    {
      id: "data-analysis",
      name: "Data Analysis",
      status: "active",
      assignedTo: REVIEWERS.mtran,
      dueDate: "2026-05-15",
    },
    {
      id: "dept-manager",
      name: "Department Manager Review",
      status: "upcoming",
      assignedTo: REVIEWERS.byoung,
    },
    {
      id: "communications",
      name: "Communications Review",
      status: "upcoming",
      assignedTo: REVIEWERS.mlopez,
    },
  ],
  decisions: [],
};

// ─── Project 4 jobs ───────────────────────────────────────────────────────────

const job13: Job = {
  id: "job-013",
  projectId: "proj-004",
  title: "Q2 Earnings Infographic",
  requestType: "Single Channel",
  channels: ["Web"],
  priority: "Operational",
  brand: "NEER",
  initiative: "NEER Investor Relations Q2 Push",
  dueDate: "2026-04-15",
  description:
    "Visual infographic summarising Q2 earnings highlights for distribution on nexteraenergy.com and the investor relations portal.",
  submittedBy: REVIEWERS.sfernandez,
  submittedDate: "2026-04-02",
  status: "approved",
  currentStage: null,
  daysPending: 0,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,      completedDate: "2026-04-04" },
    { id: "safety",       status: "skipped" },
    { id: "strategist",   status: "skipped" },
    { id: "dept-manager", status: "completed", assignedTo: REVIEWERS.byoung,      completedDate: "2026-04-08" },
    { id: "technical",    status: "skipped" },
    { id: "legal",        status: "completed", assignedTo: REVIEWERS.dkim,        completedDate: "2026-04-12" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    { id: "dec-020", stageId: "team-lead",    stageName: "Team Lead Review",           reviewer: REVIEWERS.jmiles, action: "Approved", timestamp: "2026-04-04T10:00:00Z" },
    { id: "dec-021", stageId: "dept-manager", stageName: "Department Manager Review",  reviewer: REVIEWERS.byoung, action: "Approved", timestamp: "2026-04-08T14:00:00Z" },
    { id: "dec-022", stageId: "legal",        stageName: "Legal Review",               reviewer: REVIEWERS.dkim,   action: "Approved", timestamp: "2026-04-12T09:30:00Z" },
  ],
};

const job14: Job = {
  id: "job-014",
  projectId: "proj-004",
  title: "Shareholder Letter — Spring 2026",
  requestType: "Single Channel",
  channels: ["Email"],
  priority: "Strategic",
  brand: "NEER",
  initiative: "NEER Investor Relations Q2 Push",
  dueDate: "2026-05-08",
  description:
    "Quarterly shareholder letter covering Q1 performance, clean energy pipeline milestones, and forward-looking statements for FY2026.",
  submittedBy: REVIEWERS.sfernandez,
  submittedDate: "2026-04-14",
  status: "active",
  currentStage: "legal",
  daysPending: 4,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,    completedDate: "2026-04-16" },
    { id: "safety",       status: "skipped" },
    { id: "strategist",   status: "completed", assignedTo: REVIEWERS.sfernandez, completedDate: "2026-04-20" },
    { id: "dept-manager", status: "completed", assignedTo: REVIEWERS.byoung,    completedDate: "2026-04-23" },
    { id: "technical",    status: "skipped" },
    { id: "legal",        status: "active",    assignedTo: REVIEWERS.dkim,      dueDate: "2026-05-01" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    { id: "dec-023", stageId: "team-lead",    stageName: "Team Lead Review",          reviewer: REVIEWERS.jmiles,     action: "Approved", timestamp: "2026-04-16T11:00:00Z" },
    { id: "dec-024", stageId: "strategist",   stageName: "Strategist Review",         reviewer: REVIEWERS.sfernandez, action: "Approved", timestamp: "2026-04-20T15:00:00Z" },
    { id: "dec-025", stageId: "dept-manager", stageName: "Department Manager Review", reviewer: REVIEWERS.byoung,     action: "Approved", timestamp: "2026-04-23T09:00:00Z" },
  ],
};

const job15: Job = {
  id: "job-015",
  projectId: "proj-004",
  title: "Investor Day Event Kit",
  requestType: "Event",
  channels: ["PR", "Web"],
  priority: "Crisis",
  brand: "NEER",
  initiative: "NEER Investor Relations Q2 Push",
  dueDate: "2026-04-30",
  description:
    "Full event kit for the NEER Investor Day including presentation decks, press release, social media toolkit, and live-stream landing page.",
  submittedBy: REVIEWERS.sfernandez,
  submittedDate: "2026-04-21",
  status: "active",
  currentStage: "strategist",
  daysPending: 2,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,    completedDate: "2026-04-22" },
    { id: "safety",       status: "skipped" },
    { id: "strategist",   status: "active",    assignedTo: REVIEWERS.sfernandez, dueDate: "2026-04-27" },
    { id: "dept-manager", status: "upcoming",  assignedTo: REVIEWERS.byoung },
    { id: "technical",    status: "skipped" },
    { id: "legal",        status: "upcoming",  assignedTo: REVIEWERS.dkim },
    { id: "communications", status: "upcoming", assignedTo: REVIEWERS.mlopez },
  ]),
  decisions: [
    { id: "dec-026", stageId: "team-lead", stageName: "Team Lead Review", reviewer: REVIEWERS.jmiles, action: "Approved", timestamp: "2026-04-22T08:45:00Z", comment: "Urgent — fast-tracking to strategist." },
  ],
};

// ─── Project 5 jobs ───────────────────────────────────────────────────────────

const job16: Job = {
  id: "job-016",
  projectId: "proj-005",
  title: "Hurricane Season Preparedness Guide",
  requestType: "Single Channel",
  channels: ["Web"],
  priority: "Operational",
  brand: "FPL",
  initiative: "FPL Storm Season Readiness 2026",
  dueDate: "2026-05-01",
  description:
    "Updated customer-facing preparedness guide covering outage kits, evacuation resources, and FPL's storm response SLAs. Returned for revision after Legal flagged outdated evacuation zone references.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-05",
  status: "returned",
  currentStage: "legal",
  returnedComment: "Evacuation zone references are based on 2024 county maps — please update to 2026 FEMA data before resubmission.",
  returnedStage: "Legal Review",
  returnedDate: "2026-04-19",
  daysPending: 8,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,    completedDate: "2026-04-07" },
    { id: "safety",       status: "completed", assignedTo: REVIEWERS.cwilson,   completedDate: "2026-04-11" },
    { id: "strategist",   status: "skipped" },
    { id: "dept-manager", status: "completed", assignedTo: REVIEWERS.byoung,   completedDate: "2026-04-15" },
    { id: "technical",    status: "skipped" },
    { id: "legal",        status: "active",    assignedTo: REVIEWERS.dkim,     dueDate: "2026-04-28" },
    { id: "communications", status: "upcoming", assignedTo: REVIEWERS.mlopez },
  ]),
  decisions: [
    { id: "dec-027", stageId: "team-lead",    stageName: "Team Lead Review",          reviewer: REVIEWERS.jmiles,  action: "Approved",           timestamp: "2026-04-07T10:00:00Z" },
    { id: "dec-028", stageId: "safety",       stageName: "Safety Review",             reviewer: REVIEWERS.cwilson, action: "Approved",           timestamp: "2026-04-11T14:00:00Z" },
    { id: "dec-029", stageId: "dept-manager", stageName: "Department Manager Review", reviewer: REVIEWERS.byoung,  action: "Approved",           timestamp: "2026-04-15T09:00:00Z" },
    { id: "dec-030", stageId: "legal",        stageName: "Legal Review",              reviewer: REVIEWERS.dkim,    action: "Revision Requested", timestamp: "2026-04-19T11:30:00Z", comment: "Evacuation zone references are based on 2024 county maps — please update to 2026 FEMA data before resubmission." },
  ],
};

const job17: Job = {
  id: "job-017",
  projectId: "proj-005",
  title: "Storm Safety Digital Campaign",
  requestType: "Campaign (Multi-Channel)",
  channels: ["Paid Media", "Web"],
  priority: "Strategic",
  brand: "FPL",
  initiative: "FPL Storm Season Readiness 2026",
  dueDate: "2026-05-20",
  description:
    "Multi-channel awareness campaign running across paid search, display, and FPL.com ahead of Atlantic hurricane season. Drives customers to preparedness resources and the FPL app.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-17",
  status: "active",
  currentStage: "dept-manager",
  daysPending: 5,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,    completedDate: "2026-04-19" },
    { id: "safety",       status: "skipped" },
    { id: "strategist",   status: "completed", assignedTo: REVIEWERS.sfernandez, completedDate: "2026-04-22" },
    { id: "dept-manager", status: "active",    assignedTo: REVIEWERS.byoung,    dueDate: "2026-04-30" },
    { id: "technical",    status: "skipped" },
    { id: "legal",        status: "upcoming",  assignedTo: REVIEWERS.dkim },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    { id: "dec-031", stageId: "team-lead",  stageName: "Team Lead Review",   reviewer: REVIEWERS.jmiles,     action: "Approved", timestamp: "2026-04-19T10:00:00Z" },
    { id: "dec-032", stageId: "strategist", stageName: "Strategist Review",  reviewer: REVIEWERS.sfernandez, action: "Approved", timestamp: "2026-04-22T16:00:00Z" },
  ],
};

const job18: Job = {
  id: "job-018",
  projectId: "proj-005",
  title: "Emergency Response Landing Page",
  requestType: "Single Channel",
  channels: ["Web"],
  priority: "Quick Win",
  brand: "FPL",
  initiative: "FPL Storm Season Readiness 2026",
  dueDate: "2026-04-20",
  description:
    "Dedicated landing page consolidating FPL's storm response resources, outage map, generator safety tips, and contact numbers into a single customer destination.",
  submittedBy: REVIEWERS.ptran,
  submittedDate: "2026-04-08",
  status: "approved",
  currentStage: null,
  daysPending: 0,
  stages: buildStages([
    { id: "team-lead",    status: "completed", assignedTo: REVIEWERS.jmiles,   completedDate: "2026-04-09" },
    { id: "safety",       status: "skipped" },
    { id: "strategist",   status: "skipped" },
    { id: "dept-manager", status: "completed", assignedTo: REVIEWERS.byoung,  completedDate: "2026-04-13" },
    { id: "technical",    status: "completed", assignedTo: REVIEWERS.ahartman, completedDate: "2026-04-17" },
    { id: "legal",        status: "skipped" },
    { id: "communications", status: "skipped" },
  ]),
  decisions: [
    { id: "dec-033", stageId: "team-lead",    stageName: "Team Lead Review",          reviewer: REVIEWERS.jmiles,   action: "Approved", timestamp: "2026-04-09T09:00:00Z" },
    { id: "dec-034", stageId: "dept-manager", stageName: "Department Manager Review", reviewer: REVIEWERS.byoung,   action: "Approved", timestamp: "2026-04-13T11:00:00Z" },
    { id: "dec-035", stageId: "technical",    stageName: "Technical Review",          reviewer: REVIEWERS.ahartman, action: "Approved", timestamp: "2026-04-17T15:30:00Z", comment: "Passes Core Web Vitals and accessibility checks." },
  ],
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id: "proj-001",
    name: "Q3 Renewables Brand Campaign",
    brand: "M&C",
    syncType: "Monday.com",
    syncLink: "#",
    description:
      "Multi-channel brand campaign positioning NextEra as the global leader in renewable energy. Covers paid, organic, and owned channels across web, email, and video.",
    createdDate: "2026-03-15",
    jobs: [job1, job2, job3, job10],
  },
  {
    id: "proj-002",
    name: "FPL Customer Digital Experience",
    brand: "FPL",
    syncType: "Jira",
    syncLink: "#",
    description:
      "Ongoing digital experience improvements for FPL.com and the MyFPL mobile app. Focus on customer self-service, outage communications, and billing UX.",
    createdDate: "2026-02-10",
    jobs: [job4, job5, job6, job11],
  },
  {
    id: "proj-003",
    name: "NEE Internal Comms Refresh",
    brand: "NEE",
    syncType: "Monday.com",
    syncLink: "#",
    description:
      "Refresh of NEE's internal communications programme including the monthly newsletter, intranet hub, and leadership video content.",
    createdDate: "2026-04-01",
    jobs: [job7, job8, job9, job12],
  },
  {
    id: "proj-004",
    name: "NEER Investor Relations Q2 Push",
    brand: "NEER",
    syncType: "Monday.com",
    syncLink: "#",
    description:
      "Q2 investor relations programme covering earnings communications, shareholder correspondence, and the annual Investor Day event.",
    createdDate: "2026-04-01",
    jobs: [job13, job14, job15],
  },
  {
    id: "proj-005",
    name: "FPL Storm Season Readiness",
    brand: "FPL",
    syncType: "Jira",
    syncLink: "#",
    description:
      "Customer communications and digital assets preparing FPL customers for the 2026 Atlantic hurricane season, including safety guides, campaign creative, and emergency landing pages.",
    createdDate: "2026-03-28",
    jobs: [job16, job17, job18],
  },
];

// ─── Derived helpers ──────────────────────────────────────────────────────────

export const ALL_JOBS: Job[] = PROJECTS.flatMap((p) => p.jobs);

export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getJob(id: string): Job | undefined {
  return ALL_JOBS.find((j) => j.id === id);
}

export const CURRENT_USER = REVIEWERS.jmiles;

const PRIORITY_ORDER: Record<string, number> = { Crisis: 0, Strategic: 1, "Quick Win": 2, Operational: 3 };

export const MY_QUEUE = ALL_JOBS
  .filter((j) =>
    j.status === "active" &&
    j.stages.find((s) => s.status === "active")?.assignedTo?.id === CURRENT_USER.id
  )
  .sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99));

export const OVERDUE_JOBS = ALL_JOBS.filter(
  (j) =>
    j.status === "active" &&
    j.dueDate < new Date().toISOString().split("T")[0]
);

export const APPROVED_THIS_WEEK = ALL_JOBS.filter(
  (j) =>
    j.status === "approved" &&
    j.decisions.some(
      (d) =>
        d.reviewer.id === CURRENT_USER.id &&
        d.action === "Approved"
    )
);

