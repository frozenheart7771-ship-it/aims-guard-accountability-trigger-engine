# AIMS Guard Accountability Trigger Engine (ATE)

**AIMS Guard Accountability Trigger Engine (ATE)** is an open-source AI Governance and Human Oversight control for GitHub pull requests.

It is designed to help organisations introduce practical accountability triggers when AI coding agents, automation, or human developers contribute changes to high-risk files. When a pull request touches sensitive areas such as CI/CD workflows, security policy, authentication, infrastructure, or governance controls, AIMS Guard ATE can require explicit human oversight before the change is considered ready to merge.

AIMS Guard ATE is a practical implementation of AI Governance, Human Oversight, Accountability Triggers and ISO/IEC 42001-inspired governance controls.

## Why This Project Exists

Many organisations are rapidly adopting AI-assisted software development.

While AI coding tools can increase productivity, they can also introduce changes to authentication systems, deployment workflows, infrastructure configurations and governance controls at a speed that exceeds traditional review practices.

AIMS Guard ATE was created to demonstrate a practical accountability trigger model where predefined high-risk changes automatically require human oversight and generate audit evidence.

The objective is not to slow innovation, but to ensure that critical decisions remain visible, accountable and reviewable.

## Project Information

| Field | Value |
| --- | --- |
| Project | AIMS Guard Accountability Trigger Engine (ATE) |
| Author | Japmandeep Ahluwalia (Sunny) |
| Organisation | Luxyn Ethics & Governance (LEG) AI Governance Lab |
| Website | https://aimsguard.org |
| Type | GitHub Action |
| Focus | AI Governance, Human Oversight, Accountability, Audit Logging |

## Purpose

AI coding agents can move quickly across repositories, workflows, infrastructure, and security-sensitive code. AIMS Guard ATE provides a lightweight governance layer that helps teams answer a simple question:

> Should this pull request trigger human oversight before merge?

The Version 1 MVP is intentionally small and practical. It focuses on detecting high-risk file changes, triggering a governance review workflow, and producing an audit record that explains why oversight was required.

## What AIMS Guard ATE Does

For a pull request, AIMS Guard ATE is intended to:

1. Read configurable risk rules from `config/risk-rules.yml`.
2. Detect changed files in the pull request.
3. Match changed files against high-risk governance rules.
4. Trigger human oversight when a configured risk rule matches.
5. Add a governance review label.
6. Post a pull request comment explaining the accountability trigger.
7. Generate structured audit evidence.
8. Fail the GitHub Actions check until human approval is provided.

## MVP Scope

Version 1 is designed to be built and demonstrated in 4-6 hours.

It demonstrates the core governance loop:

```text
High-risk change detected
        |
        v
Accountability trigger activated
        |
        v
Human oversight required
        |
        v
Audit evidence generated
        |
        v
Merge allowed only after approval
```

## Human Oversight Model

For the MVP, human approval is represented by a maintainer comment on the pull request:

```text
/aims-approve
```

When a high-risk rule is matched and approval is missing, the GitHub Action should fail. After a maintainer adds the approval comment and the workflow is re-run or triggered by the comment event, the check can pass.

This keeps the first version transparent, easy to demo, and GitHub-native.

## Accountability Triggers

An accountability trigger is activated when a pull request changes files that match configured governance risk rules.

Example high-risk areas include:

- GitHub Actions workflows
- Security policies
- Authentication and authorization logic
- Infrastructure configuration
- Deployment configuration
- AI governance policy files
- Audit and compliance controls

Rules are configured in:

```text
config/risk-rules.yml
```

## Example Risk Rule

```yaml
rules:
  - id: github-actions-workflow-change
    name: GitHub Actions workflow change
    description: Workflow changes can alter CI/CD, deployment, or security controls.
    paths:
      - ".github/workflows/**"
    risk: high
    action: require_human_approval
```

## Recommended GitHub Workflow

Create a workflow such as:

```yaml
name: AIMS Guard ATE

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issue_comment:
    types: [created]

permissions:
  contents: read
  pull-requests: write
  issues: write
  actions: write

jobs:
  aims-guard:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Run AIMS Guard ATE
        uses: ./
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          risk_config_path: config/risk-rules.yml
          approval_phrase: /aims-approve
          governance_label: governance-review-required
          audit_artifact_name: aims-guard-audit
```

## Action Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `github_token` | Yes | N/A | GitHub token used to read pull request data, add labels, post comments, and upload audit evidence. |
| `risk_config_path` | No | `config/risk-rules.yml` | Path to the YAML risk rule configuration. |
| `approval_phrase` | No | `/aims-approve` | Pull request comment phrase used as the MVP human approval signal. |
| `governance_label` | No | `governance-review-required` | Label applied when human oversight is required. |
| `audit_artifact_name` | No | `aims-guard-audit` | Name of the uploaded audit artifact. |
| `audit_output_path` | No | `audit/aims-guard-audit.json` | Local path where the audit JSON file is written during the workflow run. |
| `fail_on_required_approval` | No | `true` | Whether the action should fail when human approval is required but missing. |

## Audit Logging

The MVP audit record should be structured JSON and include:

- Repository
- Pull request number
- Pull request author
- Workflow run ID
- Changed files evaluated
- Matched risk rules
- Governance decision
- Approval phrase
- Whether approval was found
- Timestamp

Example decision values:

```text
no_governance_trigger
human_approval_required
approved_by_human
```

The audit record should be uploaded as a GitHub Actions artifact so reviewers and maintainers can inspect the governance decision after the workflow completes.

## Demo Scenario

1. Install or run the action in a GitHub repository.
2. Configure a high-risk rule for `.github/workflows/**`.
3. Open a pull request that modifies `.github/workflows/deploy.yml`.
4. AIMS Guard ATE detects the workflow file change.
5. The action applies the `governance-review-required` label.
6. The action posts a pull request comment explaining the matched rule.
7. The action uploads an audit JSON artifact.
8. The action fails because human approval is required.
9. A maintainer comments `/aims-approve`.
10. The workflow runs again and passes after detecting the human approval signal.

## Version 1 Includes

- GitHub Action metadata
- YAML-based risk rule configuration
- Pull request governance trigger model
- Human approval phrase model
- Governance label model
- Pull request comment model
- Structured audit artifact model
- Public repository documentation

## Version 1 Does Not Include

- Source implementation code
- AI agent identity detection
- External audit database
- Dashboard UI
- Cryptographic audit signing
- Slack or Microsoft Teams notifications
- GitHub App installation flow
- Advanced policy engine
- CODEOWNERS integration
- Multi-reviewer approval rules
- ISO/IEC 42001 certification claims

## Governance Positioning

AIMS Guard ATE is not a certification tool and does not claim compliance with ISO/IEC 42001 by itself. Instead, it provides a practical technical control that may support governance practices such as:

- Defined accountability for AI-assisted development
- Human oversight for high-risk changes
- Traceable governance decisions
- Risk-based workflow controls
- Evidence generation for review and audit processes

## Open Source Use

This project is intended to be open source friendly:

- Simple GitHub Action architecture
- Clear configuration
- Human-readable audit output
- Minimal dependencies
- Practical first version
- Easy demo path
- Extensible governance model

## License

The recommended license for this project is Apache-2.0.
