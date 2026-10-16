# Repository operating model

Second Bite uses the repository as its durable system of record. The model is adapted from BeyondPilot's, which itself follows [glebfox/playbook — Repository as System of Record](https://github.com/glebfox/playbook/blob/main/harness/operating-model.md).

## Goals

- A new team member or a fresh agent session finds the current state without reconstructing chat history.
- Each fact has one canonical home.
- Readers start from a small map and open detail only as needed.
- Code, design intent, decisions and verification move together.

## Document layout

| Location | Owns |
| --- | --- |
| `AGENTS.md` | The thin navigation map and the mandatory working rules |
| `CLAUDE.md` | Claude Code's import of `AGENTS.md`; no rules of its own |
| `README.md` | Entry points and basic commands |
| `ARCHITECTURE.md` | The system structure and runtime flows as implemented |
| `docs/brief/` | The founder's product brief, kept as received |
| `docs/vision.md` | Product outcomes and stable principles |
| `docs/roadmap.md` | Delivered, active and candidate increments |
| `docs/conventions.md` | Cross-cutting engineering conventions, independent of language |
| `docs/guidelines/` | Reusable engineering and operational policy per topic |
| `docs/specs/` | Current behavior and invariants of each module |
| `docs/tests/` | Requirement-to-verification matrix of each module |
| `docs/decisions/` | Accepted, append-only architecture decisions |
| `docs/increments/active/<increment>/` | Design, plan and verification evidence of a change in flight |
| `docs/increments/completed/<increment>/` | The record of an increment after it has landed |
| `docs/runbooks/` | Repeatable developer and operator procedures |
| `docs/research/` | Dated notes on what was studied before a design, and the sources behind them |

A folder is created with its first document; the layout above names where a document goes when it exists.

## Linear as the record of work

Linear is the source of truth for who did what, what was learned and how far each piece of work has come. A piece of work that is not in Linear did not happen as far as the team's tracking is concerned.

- Every piece of work has an issue with one assignee before it starts: research, design, code, operations and questions to the founder or the sponsor alike. Work done by an agent is recorded under the member who directed it.
- Keep the issue current while working, not at the end: move its status as the work moves (Backlog, Todo, In Progress, Done), tick its checklist, and attach each pull request and the deployed result.
- After research, write the findings on the issue: what was studied, what was concluded and what was ruled out, with links to the sources and to the note under `docs/research/` when there is one.
- After implementation, write what was delivered and how it was verified, and any decision taken on the way with its reason. A decision that changes a plan says what it replaced.
- Write it for a reader who was not there: a member, the founder, the sponsor's representative or whoever assesses the work later.
- The repository stays the home of the detail. The issue summarizes and links to the increment, the runbook or the ADR instead of copying them. No secret value or personal data is written to Linear; record only where a secret is managed.

## Source classification

Before adding text, choose its owner:

- **Implemented fact:** `ARCHITECTURE.md` or the module's spec.
- **Desired outcome:** vision.
- **Reusable rule:** convention or guideline.
- **Accepted tradeoff:** ADR.
- **Detail of the current change:** the active increment.
- **Repeatable command sequence:** runbook.
- **What was studied, and its sources:** a research note. It records findings, never decisions.
- **Task status:** the Linear issue, summarized in the roadmap.

If the same statement would appear twice, keep the detailed version in the deeper source and replace the other copy with a link.

## Increment lifecycle

An increment is one change that adds or alters a business capability: a module, a user journey or a data lifecycle. Tooling, dependency and documentation changes need only their Linear issue.

1. Create `docs/increments/active/<increment>/design.md` and `plan.md` before implementation, named after the Linear issue (for example `sb-12-reservation-expiry`). A new module starts with [boundary discovery](../conventions.md#boundary-discovery).
2. Define the outcome a customer, a seller or an operator will see, the boundaries, the data lifecycle, the failure behavior and the verification plan.
3. Implement a complete vertical slice. Do not make incomplete behavior operable through temporary production code ([change design](../conventions.md#change-design)).
4. Record the commands run and the outcomes observed in `verification.md`; never copy raw logs, secrets or personal data.
5. Update the architecture, the module's spec and test matrix, guidelines and ADRs to match the verified implementation.
6. Land the change on `main` ([operating rules](../../AGENTS.md#operating-rules)).
7. Move the increment directory to `docs/increments/completed/` and reconcile `docs/roadmap.md`.

An abandoned increment is kept only if its reasoning is reusable; otherwise delete it. Accepted decisions stay in ADRs.

### What a design holds

A `design.md` opens with its status and its Linear issue, then:

- **What a person can do** when it lands, in the words of the customer, the seller or the operator.
- **Boundary discovery**, for a new module or a changed boundary: story with its failure paths, glossary, commands and facts, owner of data and rules, communication.
- **The contract**: the operations, their answers and failures, with the codes.
- **Data**: tables, constraints, lifecycle, retention.
- **Failure behavior** and **verification plan**.
- **Open questions**, each with who answers it.

A `plan.md` is a numbered table of steps with their state; each step is one commit on the increment's branch.

## Decision lifecycle

Evaluate alternatives in the active increment's `design.md`, or in the Linear issue for a change that has no increment. Create an ADR only after the decision is accepted and implementation has started. ADRs are append-only: a later ADR supersedes an earlier one, and each links to the other.

An ADR is `docs/decisions/NNNN-<what-was-decided>.md` and holds: status, date and decision owner; context; decision; alternatives considered; consequences.

## Verification and consolidation

Verification exercises the changed surface, not only compiles it. The active increment owns temporary evidence while the change is in flight. Before completion, consolidate stable contracts into `docs/specs/`, stable checks into `docs/tests/`, the current shape into `ARCHITECTURE.md` and repeatable operations into `docs/runbooks/`.

Repository documents win over stale chat or tracker summaries. Current runtime and test evidence wins over stale repository prose; correct the prose in the same change.
