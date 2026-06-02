"use strict";

const fs = require("fs");
const path = require("path");
const core = require("@actions/core");
const github = require("@actions/github");
const yaml = require("js-yaml");
const { minimatch } = require("minimatch");
const { DefaultArtifactClient } = require("@actions/artifact");

const COMMENT_MARKER = "<!-- aims-guard-ate-governance-review -->";
const PROJECT_NAME = "AIMS Guard Accountability Trigger Engine (ATE)";
const AUTHOR = "Japmandeep Ahluwalia (Sunny)";
const ORGANISATION = "Luxyn Ethics & Governance (LEG) AI Governance Lab";
const WEBSITE = "https://aimsguard.org";

async function run() {
  const startedAt = new Date().toISOString();
  const inputs = readInputs();
  const octokit = github.getOctokit(inputs.githubToken);
  const context = github.context;
  const { owner, repo } = context.repo;

  try {
    const pullRequest = await resolvePullRequest(octokit, context, owner, repo);
    const prNumber = pullRequest.number;
    const repository = `${owner}/${repo}`;

    core.info(`${PROJECT_NAME} evaluating ${repository}#${prNumber}`);

    const config = loadRiskConfig(inputs.riskConfigPath);
    const changedFiles = await getChangedFiles(octokit, owner, repo, prNumber);
    const latestCommitAt = await getLatestCommitTimestamp(octokit, owner, repo, prNumber);
    const matchedRules = matchRiskRules(config.rules, changedFiles);
    const approval = await findHumanApproval(
      octokit,
      owner,
      repo,
      prNumber,
      inputs.approvalPhrase,
      latestCommitAt
    );

    const approvalRequired = matchedRules.length > 0;
    const decision = determineDecision(approvalRequired, approval.found);

    if (approvalRequired) {
      await ensureGovernanceLabel(octokit, owner, repo, prNumber, inputs.governanceLabel);
      await upsertGovernanceComment(octokit, owner, repo, prNumber, {
        approval,
        approvalPhrase: inputs.approvalPhrase,
        decision,
        matchedRules,
        governanceLabel: inputs.governanceLabel,
      });
    }

    const auditRecord = buildAuditRecord({
      approval,
      approvalPhrase: inputs.approvalPhrase,
      approvalRequired,
      changedFiles,
      config,
      context,
      decision,
      governanceLabel: inputs.governanceLabel,
      latestCommitAt,
      matchedRules,
      owner,
      prNumber,
      pullRequest,
      repo,
      repository,
      startedAt,
    });

    writeAuditRecord(inputs.auditOutputPath, auditRecord);
    await uploadAuditArtifact(inputs.auditArtifactName, inputs.auditOutputPath);

    setOutputs({
      approvalFound: approval.found,
      approvalRequired,
      auditPath: inputs.auditOutputPath,
      decision,
      matchedRules,
    });

    if (approvalRequired && !approval.found && inputs.failOnRequiredApproval) {
      core.setFailed(
        `${PROJECT_NAME}: human oversight is required. A maintainer must comment "${inputs.approvalPhrase}" before this check can pass.`
      );
      return;
    }

    core.info(`${PROJECT_NAME} decision: ${decision}`);
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error));
  }
}

function readInputs() {
  return {
    githubToken: requiredInput("github_token"),
    riskConfigPath: optionalInput("risk_config_path", "config/risk-rules.yml"),
    approvalPhrase: optionalInput("approval_phrase", "/aims-approve"),
    governanceLabel: optionalInput("governance_label", "governance-review-required"),
    auditArtifactName: optionalInput("audit_artifact_name", "aims-guard-audit"),
    auditOutputPath: optionalInput("audit_output_path", "audit/aims-guard-audit.json"),
    failOnRequiredApproval: parseBoolean(optionalInput("fail_on_required_approval", "true")),
  };
}

function requiredInput(name) {
  const value = core.getInput(name, { required: true }).trim();
  if (!value) {
    throw new Error(`Missing required input: ${name}`);
  }
  return value;
}

function optionalInput(name, fallback) {
  const value = core.getInput(name);
  return value && value.trim() ? value.trim() : fallback;
}

function parseBoolean(value) {
  return ["1", "true", "yes", "y"].includes(String(value).toLowerCase());
}

async function resolvePullRequest(octokit, context, owner, repo) {
  if (context.payload.pull_request) {
    return context.payload.pull_request;
  }

  const issue = context.payload.issue;
  if (issue && issue.pull_request) {
    const response = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: issue.number,
    });
    return response.data;
  }

  throw new Error(
    `${PROJECT_NAME} must run on a pull_request event or an issue_comment event attached to a pull request.`
  );
}

function loadRiskConfig(configPath) {
  const resolvedPath = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd(), configPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Risk configuration file not found: ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, "utf8");
  const config = yaml.load(raw);

  if (!config || typeof config !== "object") {
    throw new Error("Risk configuration must be a YAML object.");
  }

  if (!Array.isArray(config.rules)) {
    throw new Error("Risk configuration must contain a rules array.");
  }

  for (const rule of config.rules) {
    validateRule(rule);
  }

  return config;
}

function validateRule(rule) {
  if (!rule || typeof rule !== "object") {
    throw new Error("Each risk rule must be an object.");
  }

  if (!rule.id || typeof rule.id !== "string") {
    throw new Error("Each risk rule must include a string id.");
  }

  if (!Array.isArray(rule.paths) || rule.paths.length === 0) {
    throw new Error(`Risk rule "${rule.id}" must include one or more paths.`);
  }

  for (const pattern of rule.paths) {
    if (!pattern || typeof pattern !== "string") {
      throw new Error(`Risk rule "${rule.id}" contains an invalid path pattern.`);
    }
  }
}

async function getChangedFiles(octokit, owner, repo, pullNumber) {
  const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });

  return files.map((file) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    changes: file.changes,
    previous_filename: file.previous_filename || null,
  }));
}

async function getLatestCommitTimestamp(octokit, owner, repo, pullNumber) {
  const commits = await octokit.paginate(octokit.rest.pulls.listCommits, {
    owner,
    repo,
    pull_number: pullNumber,
    per_page: 100,
  });

  const commitTimes = commits
    .map((item) => item.commit && item.commit.committer && item.commit.committer.date)
    .filter(Boolean)
    .map((date) => new Date(date).getTime())
    .filter((time) => Number.isFinite(time));

  if (commitTimes.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...commitTimes)).toISOString();
}

function matchRiskRules(rules, changedFiles) {
  const highRiskRules = rules.filter((rule) => {
    const risk = String(rule.risk || "").toLowerCase();
    const action = String(rule.action || "").toLowerCase();
    return risk === "high" || action === "require_human_approval";
  });

  return highRiskRules
    .map((rule) => {
      const matchedFiles = changedFiles.filter((file) =>
        rule.paths.some((pattern) => fileMatchesPattern(file, pattern))
      );

      if (matchedFiles.length === 0) {
        return null;
      }

      return {
        id: rule.id,
        name: rule.name || rule.id,
        description: rule.description || "",
        risk: rule.risk || "high",
        action: rule.action || "require_human_approval",
        oversight_reason: rule.oversight_reason || "",
        matched_files: matchedFiles.map((file) => file.filename),
      };
    })
    .filter(Boolean);
}

function fileMatchesPattern(file, pattern) {
  const options = {
    dot: true,
    nocase: false,
    nocomment: true,
  };

  return (
    minimatch(file.filename, pattern, options) ||
    Boolean(file.previous_filename && minimatch(file.previous_filename, pattern, options))
  );
}

async function findHumanApproval(octokit, owner, repo, issueNumber, approvalPhrase, latestCommitAt) {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });

  const latestCommitTime = new Date(latestCommitAt).getTime();
  const validApprovals = comments
    .filter((comment) => typeof comment.body === "string")
    .filter((comment) => comment.body.includes(approvalPhrase))
    .filter((comment) => comment.user && comment.user.type !== "Bot")
    .filter((comment) => new Date(comment.created_at).getTime() >= latestCommitTime)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const approval = validApprovals[0];

  if (!approval) {
    return {
      found: false,
      approver: null,
      approved_at: null,
      comment_id: null,
      approval_url: null,
    };
  }

  return {
    found: true,
    approver: approval.user.login,
    approved_at: approval.created_at,
    comment_id: approval.id,
    approval_url: approval.html_url,
  };
}

function determineDecision(approvalRequired, approvalFound) {
  if (!approvalRequired) {
    return "no_governance_trigger";
  }

  if (approvalFound) {
    return "approved_by_human";
  }

  return "human_approval_required";
}

async function ensureGovernanceLabel(octokit, owner, repo, issueNumber, label) {
  try {
    await ensureLabelExists(octokit, owner, repo, label);
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels: [label],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Unable to apply governance label "${label}": ${message}`);
  }
}

async function ensureLabelExists(octokit, owner, repo, label) {
  try {
    await octokit.rest.issues.getLabel({
      owner,
      repo,
      name: label,
    });
  } catch (error) {
    if (!isGitHubStatus(error, 404)) {
      throw error;
    }

    try {
      await octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label,
        color: "1d76db",
        description: "AIMS Guard ATE human governance review is required.",
      });
    } catch (createError) {
      if (!isGitHubStatus(createError, 422)) {
        throw createError;
      }
    }
  }
}

function isGitHubStatus(error, status) {
  return Boolean(error && typeof error === "object" && error.status === status);
}

async function upsertGovernanceComment(octokit, owner, repo, issueNumber, details) {
  const body = buildGovernanceComment(details);
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: issueNumber,
    per_page: 100,
  });

  const existingComment = comments.find(
    (comment) =>
      comment.user &&
      comment.user.type === "Bot" &&
      typeof comment.body === "string" &&
      comment.body.includes(COMMENT_MARKER)
  );

  if (existingComment) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body,
    });
    return;
  }

  await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  });
}

function buildGovernanceComment(details) {
  const matchedRuleLines = details.matchedRules
    .map((rule) => {
      const files = rule.matched_files.map((file) => `  - \`${file}\``).join("\n");
      const reason = rule.oversight_reason ? `\n  Reason: ${rule.oversight_reason}` : "";
      return `- **${rule.name}** (\`${rule.id}\`)\n  Risk: ${rule.risk}\n  Action: ${rule.action}${reason}\n  Matched files:\n${files}`;
    })
    .join("\n\n");

  const approvalStatus = details.approval.found
    ? `Human approval found from **${details.approval.approver}** at \`${details.approval.approved_at}\`.`
    : `Human approval is required. A maintainer must comment \`${details.approvalPhrase}\` after reviewing this pull request.`;

  return `${COMMENT_MARKER}
## AIMS Guard Accountability Trigger

Human oversight has been triggered for this pull request.

**Governance decision:** \`${details.decision}\`
**Governance label:** \`${details.governanceLabel}\`

${approvalStatus}

### Matched Governance Rules

${matchedRuleLines}

### Governance Basis

This review gate supports practical AI Governance, Human Oversight, Accountability Triggers and ISO/IEC 42001-inspired governance controls by keeping high-risk changes visible, accountable and reviewable.
`;
}

function buildAuditRecord(details) {
  return {
    project: PROJECT_NAME,
    author: AUTHOR,
    organisation: ORGANISATION,
    website: WEBSITE,
    timestamp: new Date().toISOString(),
    workflow: {
      event_name: details.context.eventName,
      run_id: process.env.GITHUB_RUN_ID || null,
      run_attempt: process.env.GITHUB_RUN_ATTEMPT || null,
      job: process.env.GITHUB_JOB || null,
      sha: details.context.sha,
      ref: details.context.ref,
      started_at: details.startedAt,
    },
    repository: {
      owner: details.owner,
      name: details.repo,
      full_name: details.repository,
    },
    pull_request: {
      number: details.prNumber,
      title: details.pullRequest.title,
      author: details.pullRequest.user ? details.pullRequest.user.login : null,
      head_sha: details.pullRequest.head ? details.pullRequest.head.sha : null,
      latest_commit_at: details.latestCommitAt,
      base_ref: details.pullRequest.base ? details.pullRequest.base.ref : null,
      html_url: details.pullRequest.html_url,
      updated_at: details.pullRequest.updated_at,
    },
    governance: {
      decision: details.decision,
      approval_required: details.approvalRequired,
      approval_found: details.approval.found,
      approval_phrase: details.approvalPhrase,
      approver: details.approval.approver,
      approved_at: details.approval.approved_at,
      approval_comment_id: details.approval.comment_id,
      approval_url: details.approval.approval_url,
      governance_label: details.governanceLabel,
      principles: [
        "Human accountability",
        "Human oversight",
        "Traceability",
        "Auditability",
        "Risk-based controls",
        "Transparency",
      ],
      iso_iec_42001_inspired: true,
    },
    risk_evaluation: {
      config_version: details.config.version || null,
      matched_rule_ids: details.matchedRules.map((rule) => rule.id),
      matched_rules: details.matchedRules,
      changed_files: details.changedFiles,
    },
  };
}

function writeAuditRecord(outputPath, auditRecord) {
  const resolvedPath = path.resolve(process.env.GITHUB_WORKSPACE || process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
  fs.writeFileSync(resolvedPath, `${JSON.stringify(auditRecord, null, 2)}\n`, "utf8");
  core.info(`AIMS Guard audit record written to ${resolvedPath}`);
}

async function uploadAuditArtifact(artifactName, outputPath) {
  const artifactClient = new DefaultArtifactClient();
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  const resolvedPath = path.resolve(workspace, outputPath);

  await artifactClient.uploadArtifact(artifactName, [resolvedPath], path.dirname(resolvedPath), {
    retentionDays: 90,
  });

  core.info(`AIMS Guard audit artifact uploaded as ${artifactName}`);
}

function setOutputs(details) {
  core.setOutput("decision", details.decision);
  core.setOutput("approval_required", String(details.approvalRequired));
  core.setOutput("approval_found", String(details.approvalFound));
  core.setOutput(
    "matched_rules",
    JSON.stringify(details.matchedRules.map((rule) => ({ id: rule.id, matched_files: rule.matched_files })))
  );
  core.setOutput("audit_path", details.auditPath);
}

run();
