# Architecture

## AIMS Guard Accountability Trigger Engine (ATE)

**Author:** Japmandeep Ahluwalia (Sunny)  
**Organisation:** Luxyn Ethics & Governance (LEG) AI Governance Lab  
**Website:** https://aimsguard.org

AIMS Guard Accountability Trigger Engine (ATE) is a GitHub-native governance control for pull requests that modify high-risk areas of a software repository. It is designed to support AI Governance, Human Oversight, Accountability Triggers, auditability, and ISO/IEC 42001-inspired governance controls.

## 1. Governance Problem Being Solved

Software teams are increasingly adopting AI-assisted development tools, including AI coding agents that can create, modify, and propose code changes at high speed.

This creates a governance challenge: high-risk changes may be introduced into sensitive areas of a repository before traditional review processes can identify their significance.

Examples of high-risk changes include:

- Authentication and authorization logic
- GitHub Actions workflows
- Deployment and infrastructure configuration
- Security policies
- AI governance policies
- Audit and compliance controls
- Secrets and permissions configuration

These changes can affect access control, deployment behavior, system resilience, security posture, audit evidence, and organisational accountability.

AIMS Guard ATE addresses this by introducing an automated governance checkpoint. When a pull request touches predefined high-risk files, the system triggers human oversight before the change should proceed to merge.

## 2. Why Accountability Triggers Are Needed For AI-Generated Code

AI-generated or AI-assisted code can increase productivity, but it can also compress the time between idea, implementation, and pull request creation.

This speed creates several accountability risks:

- High-risk files may be changed without the contributor recognising their governance significance.
- AI-generated changes may appear routine while affecting critical controls.
- Reviewers may miss indirect impacts across deployment, identity, security, or compliance systems.
- Organisations may lack clear evidence showing when human oversight was required and performed.
- Responsibility can become unclear when automated systems contribute to code changes.

Accountability triggers help solve this problem by converting predefined risk signals into explicit governance actions.

In AIMS Guard ATE, the trigger model is simple:

```text
High-risk file change detected
        |
        v
Governance rule matched
        |
        v
Human oversight required
        |
        v
Audit evidence generated
```

The objective is not to prevent AI-assisted development. The objective is to ensure that critical decisions remain visible, accountable, and reviewable.

## Accountability Trigger Framework

The Accountability Trigger Framework is an original governance concept introduced by Japmandeep Ahluwalia. It is designed to help organisations apply human oversight in a targeted, risk-sensitive, and auditable way as AI-assisted software development becomes more common.

Traditional code review often assumes that every change receives equal review attention. In practice, this assumption becomes difficult to sustain when AI-assisted development increases the volume and speed of code generation, modification, and pull request creation.

Accountability Triggers introduce risk-sensitive governance checkpoints. Rather than applying the same level of oversight to every change, governance controls activate only when predefined risk conditions are met. This allows human oversight to become proportional to risk.

In this model, routine changes can continue to move quickly, while changes affecting high-risk areas such as authentication, deployment workflows, infrastructure, security controls, or governance policies automatically require additional review, approval, or audit evidence.

**Definition:** An Accountability Trigger is a predefined governance condition that automatically requires human oversight, review, approval, or audit evidence when AI-assisted activity affects a high-risk area.

The framework aims to balance innovation speed with accountability by ensuring that AI-assisted development remains productive while critical decisions remain visible, reviewable, and attributable to responsible human oversight.

### Core Principles

1. **Risk-Proportional Oversight:** governance attention should increase when the potential impact of a change increases.
2. **Human Accountability:** high-risk AI-assisted activity should remain connected to an accountable human decision-maker.
3. **Auditability:** governance decisions should produce evidence that can be reviewed after the event.
4. **Traceability:** oversight decisions should be linked to the repository, pull request, files changed, rules triggered, and approver.
5. **Governance by Design:** oversight should be embedded into normal development workflows rather than added as an informal afterthought.

### What Makes Accountability Triggers Different

Accountability Triggers differ from traditional approval gates because they are activated by governance risk conditions rather than applied uniformly across all changes.

Traditional approval gates are usually static and apply to all changes equally at a defined workflow stage. Accountability Triggers activate dynamically when predefined risk conditions are met. The trigger is driven by the nature of the change rather than the workflow stage alone.

This means oversight becomes risk-aware instead of only process-aware. The framework is designed for AI-assisted development environments where code volume may increase significantly and where organisations need a practical way to concentrate human review on changes with higher governance impact.

| Traditional Approval Gates | Accountability Triggers |
| --- | --- |
| **Activation method:** activated at a fixed workflow stage, such as before merge or deployment. | **Activation method:** activated dynamically when predefined governance risk conditions are met. |
| **Risk sensitivity:** generally applies the same approval requirement to all changes in scope. | **Risk sensitivity:** applies additional oversight when the nature of the change indicates higher risk. |
| **Human oversight model:** human review is process-driven and often uniform across many changes. | **Human oversight model:** human review is risk-proportional and focused on changes requiring accountability. |
| **Audit evidence:** may record that an approval occurred, but not always why additional oversight was required. | **Audit evidence:** records the risk signal, matched rule, changed files, approval status, approver, and governance decision. |
| **AI-assisted development suitability:** may become noisy or inefficient when AI-assisted code volume increases. | **AI-assisted development suitability:** designed to help manage increased AI-assisted code volume by focusing attention on high-risk activity. |

The Accountability Trigger Framework proposes that governance interventions should be activated by risk signals rather than applied uniformly. This allows organisations to maintain development velocity while concentrating human attention where accountability matters most.

## Governance Hypothesis

The Accountability Trigger Framework is based on the hypothesis that:

> As AI-assisted development increases the volume and velocity of software changes, organisations cannot sustainably apply the same level of human scrutiny to every change. Governance effectiveness improves when oversight intensity is proportional to risk.

This hypothesis frames governance as a dynamic control problem. In AI-assisted development environments, review capacity, attention, and accountability mechanisms must be directed toward the areas where human judgement has the greatest governance value.

### Oversight Elasticity

**Oversight Elasticity** is the ability of a governance system to automatically increase or decrease human oversight requirements in response to changing risk conditions.

Under this model:

- Low-risk changes require minimal governance friction.
- High-risk changes require stronger oversight.
- Accountability Triggers are the mechanism that adjusts oversight levels.
- This enables scalable governance in AI-assisted environments.

This concept is exploratory and intended to stimulate discussion on practical AI governance controls that can support responsible, accountable, and scalable use of AI-assisted software development.

## 3. Alignment With Human Oversight Principles

AIMS Guard ATE supports human oversight by ensuring that high-risk changes are not treated as ordinary pull request changes.

The control reinforces human oversight through:

- **Visibility:** high-risk changes are surfaced directly in the pull request.
- **Reviewability:** matched governance rules and affected files are listed for maintainers.
- **Human approval:** a human approval signal is required before the workflow can pass.
- **Accountability:** the audit record captures the governance decision and approver.
- **Traceability:** the decision is linked to the repository, pull request, changed files, and matched rules.

For the Version 1 MVP, human oversight is represented by a maintainer comment:

```text
/aims-approve
```

This makes the oversight process explicit, transparent, and easy to demonstrate inside GitHub.

## 4. Alignment With ISO/IEC 42001 Concepts

AIMS Guard ATE is not a certification tool and does not claim ISO/IEC 42001 compliance by itself.

It is designed as a practical technical control inspired by ISO/IEC 42001 governance concepts, including:

- Defined responsibility for AI-related activities
- Human oversight of AI-assisted processes
- Risk-based controls
- Evidence generation
- Traceability of governance decisions
- Monitoring of AI-related operational impacts
- Continual improvement through configurable rules

The project supports the idea that organisations should identify where AI-assisted workflows may create risk and define controls that keep those risks accountable.

AIMS Guard ATE contributes to this by providing:

- Configurable governance rules
- Automated detection of high-risk repository changes
- Human approval gates
- Structured audit records
- Pull request-level governance transparency

## 5. Governance Workflow From PR Creation To Approval

The Version 1 workflow is intentionally small and GitHub-native.

```text
Pull request opened or updated
        |
        v
AIMS Guard ATE workflow runs
        |
        v
Risk rules are loaded from config/risk-rules.yml
        |
        v
Changed pull request files are detected
        |
        v
Changed files are matched against governance rules
        |
        v
If no high-risk rule matches:
        |
        v
Workflow passes with no governance trigger
```

If a high-risk rule matches:

```text
High-risk rule matched
        |
        v
governance-review-required label is applied
        |
        v
Governance review comment is posted to the PR
        |
        v
Audit JSON record is created
        |
        v
Workflow checks for /aims-approve human approval comment
        |
        v
If approval is missing, workflow fails
        |
        v
Maintainer reviews the PR and comments /aims-approve
        |
        v
Workflow runs again
        |
        v
Approval is detected
        |
        v
Workflow passes
```

When GitHub branch protection requires this check to pass, AIMS Guard ATE becomes a practical merge gate for high-risk changes.

## 6. Audit Trail Model

AIMS Guard ATE creates a structured JSON audit record for each workflow evaluation.

The audit trail is designed to answer:

- Which repository was evaluated?
- Which pull request was evaluated?
- Which files changed?
- Which governance rules matched?
- Was human approval required?
- Was human approval found?
- Who approved the change?
- When was the approval recorded?
- What governance decision was made?

The Version 1 audit record includes:

- Timestamp
- Repository owner and name
- Pull request number and metadata
- Pull request author
- Changed files
- Matched rule IDs
- Matched rule details
- Governance decision
- Approval status
- Approver
- Approval timestamp
- Workflow run metadata
- Human oversight and accountability principles

Example governance decisions:

```text
no_governance_trigger
human_approval_required
approved_by_human
```

The audit record is uploaded as a GitHub Actions artifact. This keeps the first version simple while still producing evidence that can be reviewed by maintainers, governance teams, auditors, or security reviewers.

## 7. Future Roadmap

Future versions may extend AIMS Guard ATE with more advanced governance capabilities.

Potential roadmap items:

- AI-agent contribution detection
- CODEOWNERS and reviewer role integration
- Required approval by specific governance roles
- Multiple approval levels by risk severity
- Pull request review approval detection
- Signed audit records
- External audit storage
- SIEM integration
- Slack and Microsoft Teams notifications
- SARIF or security dashboard output
- GitHub App packaging
- Policy-as-code support
- Risk scoring beyond binary high-risk matching
- Organisation-wide governance rule templates
- Mapping documentation for ISO/IEC 42001 control support
- Dashboard for governance events and oversight metrics
- Support for additional platforms beyond GitHub

The long-term direction is to make AI-assisted software development more accountable, observable, and governable without making responsible innovation unnecessarily slow.
