# Demo Walkthrough

## AIMS Guard Accountability Trigger Engine (ATE)

This walkthrough demonstrates an end-to-end governance scenario using AIMS Guard Accountability Trigger Engine (ATE).

The demo shows how an Accountability Trigger activates when an AI-assisted pull request changes authentication code, requires human oversight, creates audit evidence, and allows the workflow to pass only after explicit human approval.

## Demonstration Scenario

An AI-assisted pull request modifies authentication logic in a repository.

Changed files:

```text
src/auth/token-validator.js
login/session.js
oauth/callback-handler.js
```

Configured risk rule:

```text
authentication-authorization-change
```

Human approval phrase:

```text
/aims-approve
```

Governance label:

```text
governance-review-required
```

## Demo Objective

The purpose of this demonstration is to show a practical implementation of:

- AI Governance
- Human Oversight
- Accountability Triggers
- Risk-proportional review
- Auditability
- Traceability
- ISO/IEC 42001-inspired governance controls

This walkthrough is suitable for GitHub repository documentation, practitioner review, presentation materials, and Global Talent Visa evidence showing original governance thinking translated into a working technical control.

## Step 1: AI-Assisted Pull Request Changes Authentication Code

An AI coding assistant helps generate or modify authentication-related files.

Example pull request title:

```text
Improve token validation and OAuth callback handling
```

Example changed files:

```text
src/auth/token-validator.js
login/session.js
oauth/callback-handler.js
```

### Screenshot Description

**Screenshot 1: Pull request file changes**

The GitHub pull request page shows three changed files under the "Files changed" tab:

- `src/auth/token-validator.js`
- `login/session.js`
- `oauth/callback-handler.js`

The changes appear as normal code updates, but the affected paths are part of the configured high-risk authentication and authorization rule set.

## Step 2: Accountability Trigger Activates

When the pull request is opened or updated, the AIMS Guard ATE GitHub Action runs.

The action reads:

```text
config/risk-rules.yml
```

It detects the changed files and evaluates them against configured governance rules.

Matched rule:

```yaml
id: authentication-authorization-change
name: Authentication or authorization change
risk: high
action: require_human_approval
```

### Expected Workflow Log Output

```text
AIMS Guard Accountability Trigger Engine (ATE) evaluating example-org/example-repo#42
Risk configuration loaded from config/risk-rules.yml
Changed files detected: 3
Matched high-risk rule: authentication-authorization-change
Governance decision: human_approval_required
Human approval phrase required: /aims-approve
```

### Governance Decision

```text
human_approval_required
```

## Step 3: governance-review-required Label Is Applied

Because a high-risk authentication rule was triggered, the action applies the governance label:

```text
governance-review-required
```

### Screenshot Description

**Screenshot 2: Pull request label**

The GitHub pull request sidebar shows the label:

```text
governance-review-required
```

This makes the governance status visible to maintainers, reviewers, security teams, and project stakeholders.

## Step 4: Governance Review Comment Is Posted

AIMS Guard ATE posts a pull request comment explaining why human oversight is required.

### Expected Pull Request Comment

```markdown
## AIMS Guard Accountability Trigger

Human oversight has been triggered for this pull request.

**Governance decision:** `human_approval_required`
**Governance label:** `governance-review-required`

Human approval is required. A maintainer must comment `/aims-approve` after reviewing this pull request.

### Matched Governance Rules

- **Authentication or authorization change** (`authentication-authorization-change`)
  Risk: high
  Action: require_human_approval
  Reason: Human review is required because access control changes can introduce privilege, identity, or account security risks.
  Matched files:
  - `src/auth/token-validator.js`
  - `login/session.js`
  - `oauth/callback-handler.js`

### Governance Basis

This review gate supports practical AI Governance, Human Oversight, Accountability Triggers and ISO/IEC 42001-inspired governance controls by keeping high-risk changes visible, accountable and reviewable.
```

### Screenshot Description

**Screenshot 3: Governance review comment**

The pull request conversation contains an automated AIMS Guard ATE comment. The comment lists:

- The governance decision
- The required human approval phrase
- The matched rule ID
- The high-risk files that triggered oversight
- The governance rationale

## Step 5: Audit Record Is Created

The workflow creates a structured JSON audit record.

The audit record is uploaded as a GitHub Actions artifact.

Artifact name:

```text
aims-guard-audit
```

Audit output path:

```text
audit/aims-guard-audit.json
```

### Example Audit Record Before Approval

```json
{
  "project": "AIMS Guard Accountability Trigger Engine (ATE)",
  "author": "Japmandeep Ahluwalia (Sunny)",
  "organisation": "Luxyn Ethics & Governance (LEG) AI Governance Lab",
  "website": "https://aimsguard.org",
  "timestamp": "2026-06-02T09:30:00.000Z",
  "repository": {
    "owner": "example-org",
    "name": "example-repo",
    "full_name": "example-org/example-repo"
  },
  "pull_request": {
    "number": 42,
    "title": "Improve token validation and OAuth callback handling",
    "author": "ai-assisted-contributor",
    "head_sha": "abc123def456",
    "latest_commit_at": "2026-06-02T09:25:00.000Z",
    "base_ref": "main",
    "html_url": "https://github.com/example-org/example-repo/pull/42"
  },
  "governance": {
    "decision": "human_approval_required",
    "approval_required": true,
    "approval_found": false,
    "approval_phrase": "/aims-approve",
    "approver": null,
    "approved_at": null,
    "governance_label": "governance-review-required",
    "principles": [
      "Human accountability",
      "Human oversight",
      "Traceability",
      "Auditability",
      "Risk-based controls",
      "Transparency"
    ],
    "iso_iec_42001_inspired": true
  },
  "risk_evaluation": {
    "matched_rule_ids": [
      "authentication-authorization-change"
    ],
    "matched_rules": [
      {
        "id": "authentication-authorization-change",
        "name": "Authentication or authorization change",
        "risk": "high",
        "action": "require_human_approval",
        "matched_files": [
          "src/auth/token-validator.js",
          "login/session.js",
          "oauth/callback-handler.js"
        ]
      }
    ]
  }
}
```

### Screenshot Description

**Screenshot 4: GitHub Actions artifact**

The GitHub Actions workflow run page shows an artifact named:

```text
aims-guard-audit
```

Downloading the artifact reveals the structured audit JSON record containing the governance decision and matched rule details.

## Step 6: Workflow Fails

Because human approval has not yet been provided, the workflow fails.

### Expected Workflow Result

```text
Conclusion: failure
Reason: Human oversight is required.
Required approval phrase: /aims-approve
```

### Expected Failure Message

```text
AIMS Guard Accountability Trigger Engine (ATE): human oversight is required. A maintainer must comment "/aims-approve" before this check can pass.
```

### Screenshot Description

**Screenshot 5: Failed workflow check**

The pull request checks section shows the AIMS Guard ATE workflow as failed. If branch protection requires this check to pass, the pull request cannot be merged until human approval is recorded.

## Step 7: Human Reviewer Evaluates The Change

A human reviewer examines the authentication-related changes.

The reviewer checks:

- Whether token validation remains secure
- Whether OAuth callback handling is safe
- Whether session behavior is correct
- Whether access control boundaries are preserved
- Whether the change introduces privilege or identity risks
- Whether additional tests or security review are needed

This step is the human oversight point in the governance workflow.

### Screenshot Description

**Screenshot 6: Human review in GitHub**

The reviewer is shown inspecting the authentication files in the pull request. The AIMS Guard ATE comment remains visible in the conversation as the governance context for the review.

## Step 8: Reviewer Comments /aims-approve

After completing the review, the human reviewer comments:

```text
/aims-approve
```

### Screenshot Description

**Screenshot 7: Human approval comment**

The pull request conversation shows a maintainer comment containing:

```text
/aims-approve
```

This comment acts as the explicit human approval signal for the MVP workflow.

## Step 9: Workflow Passes

The workflow runs again after the approval comment or is manually re-run.

AIMS Guard ATE detects that:

- The same high-risk authentication rule is still matched.
- Human approval is now present.
- The approver is a non-bot GitHub user.
- The approval was provided after the latest pull request commit.

### Expected Workflow Log Output After Approval

```text
AIMS Guard Accountability Trigger Engine (ATE) evaluating example-org/example-repo#42
Changed files detected: 3
Matched high-risk rule: authentication-authorization-change
Human approval found from sunny-reviewer at 2026-06-02T09:45:00.000Z
Governance decision: approved_by_human
Audit artifact uploaded as aims-guard-audit
```

### Governance Decision

```text
approved_by_human
```

### Screenshot Description

**Screenshot 8: Passing workflow check**

The pull request checks section shows the AIMS Guard ATE workflow as passing. The pull request is now eligible to proceed, subject to any other repository branch protection rules.

## Step 10: Audit Evidence Is Updated

The updated audit artifact records that human approval was found.

### Example Audit Record After Approval

```json
{
  "project": "AIMS Guard Accountability Trigger Engine (ATE)",
  "author": "Japmandeep Ahluwalia (Sunny)",
  "organisation": "Luxyn Ethics & Governance (LEG) AI Governance Lab",
  "website": "https://aimsguard.org",
  "timestamp": "2026-06-02T09:46:00.000Z",
  "repository": {
    "owner": "example-org",
    "name": "example-repo",
    "full_name": "example-org/example-repo"
  },
  "pull_request": {
    "number": 42,
    "title": "Improve token validation and OAuth callback handling",
    "author": "ai-assisted-contributor",
    "head_sha": "abc123def456",
    "latest_commit_at": "2026-06-02T09:25:00.000Z",
    "base_ref": "main",
    "html_url": "https://github.com/example-org/example-repo/pull/42"
  },
  "governance": {
    "decision": "approved_by_human",
    "approval_required": true,
    "approval_found": true,
    "approval_phrase": "/aims-approve",
    "approver": "sunny-reviewer",
    "approved_at": "2026-06-02T09:45:00.000Z",
    "governance_label": "governance-review-required",
    "principles": [
      "Human accountability",
      "Human oversight",
      "Traceability",
      "Auditability",
      "Risk-based controls",
      "Transparency"
    ],
    "iso_iec_42001_inspired": true
  },
  "risk_evaluation": {
    "matched_rule_ids": [
      "authentication-authorization-change"
    ],
    "matched_rules": [
      {
        "id": "authentication-authorization-change",
        "name": "Authentication or authorization change",
        "risk": "high",
        "action": "require_human_approval",
        "matched_files": [
          "src/auth/token-validator.js",
          "login/session.js",
          "oauth/callback-handler.js"
        ]
      }
    ]
  }
}
```

### Screenshot Description

**Screenshot 9: Updated audit artifact**

The GitHub Actions artifacts section shows the latest `aims-guard-audit` artifact. The JSON record now includes:

- `decision: approved_by_human`
- `approval_found: true`
- `approver: sunny-reviewer`
- `approved_at: 2026-06-02T09:45:00.000Z`

## End-to-End Governance Flow

```text
AI-assisted authentication change
        |
        v
Pull request opened
        |
        v
Changed files detected
        |
        v
authentication-authorization-change rule matched
        |
        v
Accountability Trigger activates
        |
        v
governance-review-required label applied
        |
        v
Governance comment posted
        |
        v
Audit record created
        |
        v
Workflow fails pending human oversight
        |
        v
Human reviewer evaluates change
        |
        v
Reviewer comments /aims-approve
        |
        v
Workflow passes
        |
        v
Audit evidence updated
```

## Practitioner Review Notes

This demonstration shows how Accountability Triggers can make AI-assisted development more governable without applying heavy governance friction to every pull request.

The control is practical because it operates inside GitHub, uses repository-native configuration, and produces visible evidence at the point where engineering decisions are made.

The governance value is that oversight is activated by risk signals:

- The nature of the changed files
- The configured governance rule
- The high-risk classification
- The presence or absence of explicit human approval

This supports risk-proportional oversight, traceability, auditability, and human accountability.

## Evidence Value

For portfolio, presentation, or Global Talent Visa evidence, this demo illustrates:

- Original governance thinking through the Accountability Trigger Framework
- Practical implementation of AI Governance concepts
- Human oversight embedded into software delivery workflows
- ISO/IEC 42001-inspired control design
- Audit evidence generation for AI-assisted development
- A working technical artefact that translates governance theory into engineering practice

