# Use Cases

## AIMS Guard Accountability Trigger Engine (ATE)

This document describes realistic governance scenarios that demonstrate how Accountability Triggers can operate in AI-assisted software development workflows.

An Accountability Trigger is a predefined governance condition that automatically requires human oversight, review, approval, or audit evidence when AI-assisted activity affects a high-risk area.

## 1. GitHub Actions Workflow Change

### Scenario

An AI coding agent updates a GitHub Actions workflow to modify a deployment pipeline.

Changed file:

```text
.github/workflows/deploy.yml
```

### Governance Risk

Workflow changes can affect CI/CD behavior, deployment controls, build integrity, secrets exposure, and production release paths.

### Accountability Trigger

AIMS Guard ATE matches the changed file against the configured rule:

```text
github-actions-workflow-change
```

### Human Oversight Response

The pull request receives the `governance-review-required` label. A governance review comment is posted, and the workflow fails until a maintainer reviews the change and comments:

```text
/aims-approve
```

### Audit Evidence

The audit record captures the repository, pull request number, changed workflow file, matched rule ID, governance decision, approval status, approver, and timestamp.

## 2. Authentication Logic Change

### Scenario

An AI-assisted pull request modifies login handling and session validation.

Changed files:

```text
login/session.js
src/auth/token-validator.js
```

### Governance Risk

Authentication changes can affect user identity, access control, session security, and privilege boundaries. A small implementation change may create significant security or compliance exposure.

### Accountability Trigger

AIMS Guard ATE matches the files against the configured rule:

```text
authentication-authorization-change
```

### Human Oversight Response

The pull request is marked for governance review. A human reviewer must examine the authentication impact before approval is recorded.

### Audit Evidence

The audit record shows that authentication-related files were changed, the rule was triggered, and human approval was required before merge readiness.

## 3. Infrastructure Configuration Change

### Scenario

An AI coding assistant updates Kubernetes deployment configuration to adjust resource limits and environment variables.

Changed files:

```text
k8s/api-deployment.yml
helm/values-production.yml
```

### Governance Risk

Infrastructure changes can affect system availability, deployment behavior, runtime configuration, production resilience, and security posture.

### Accountability Trigger

AIMS Guard ATE matches the changed files against:

```text
infrastructure-configuration-change
```

### Human Oversight Response

A maintainer or platform owner reviews the infrastructure change. The workflow remains blocked until human approval is provided through the configured approval phrase.

### Audit Evidence

The generated audit record provides traceability between the infrastructure files, the matched governance rule, the pull request, and the final governance decision.

## 4. AI Governance Policy Change

### Scenario

A contributor uses an AI assistant to draft updates to internal responsible AI policy documentation.

Changed files:

```text
governance/ai-use-policy.md
responsible-ai/model-review-process.md
```

### Governance Risk

AI governance policy changes may affect organisational accountability, risk treatment, oversight expectations, and assurance evidence.

### Accountability Trigger

AIMS Guard ATE matches the changed files against:

```text
ai-governance-policy-change
```

### Human Oversight Response

The change requires review by an accountable human stakeholder before the pull request can be treated as approved from a governance perspective.

### Audit Evidence

The audit trail records that AI governance controls were changed and that oversight was required due to the nature of the policy impact.

## 5. Audit Logging Control Change

### Scenario

An AI-assisted change modifies logging behavior for security events and compliance records.

Changed files:

```text
audit/event-schema.yml
logging/security-logger.js
controls/audit-retention.md
```

### Governance Risk

Audit logging changes can affect traceability, incident investigation, compliance evidence, and the organisation's ability to reconstruct important events.

### Accountability Trigger

AIMS Guard ATE matches the changed files against:

```text
audit-control-change
```

### Human Oversight Response

A governance or security reviewer checks whether the audit trail remains complete, reliable, and fit for review. Approval is required before the workflow can pass.

### Audit Evidence

The audit record captures the affected audit-control files, the rule ID, the governance decision, and whether human approval was found.

## Summary

These scenarios demonstrate how Accountability Triggers make governance risk visible inside ordinary development workflows.

Rather than applying the same review intensity to every pull request, AIMS Guard ATE activates human oversight when predefined risk conditions are met. This supports risk-proportional oversight, human accountability, traceability, auditability, and practical AI governance controls for AI-assisted development environments.

