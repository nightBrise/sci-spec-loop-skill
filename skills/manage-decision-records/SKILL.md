---
name: manage-decision-records
description: >
  Manage the lifecycle of decision artifacts in the spec-loop workflow. Use when
  adding, auditing, superseding, reviewing, or migrating decisions in Decision
  Logs and standalone Decision Records. Checks every new decision for superseded
  active records, classifies records by future decision value, migrates proposed
  records to accepted when they ship, and maintains a focused active corpus
  without erasing history that can still guide work.
type: prompt
whenToUse: When adding, auditing, superseding, reviewing, or migrating decisions in Decision Logs or standalone Decision Records
---

# Manage Decision Records

Reduce the active decision corpus without erasing history that can still guide work. Judge every artifact semantically; word count and age are discovery aids, never archive criteria.

## Decision artifacts and their homes

A **decision artifact** is either a Decision Log entry or a standalone Decision
Record; unqualified, "Decision Record" means the standalone artifact. The two
containers are distinguished by scope, not by importance:

| Container | Scope | Written by | Format | Lifecycle |
|---|---|---|---|---|
| Decision Log (`.decisions.md`) | one feature; created with its spec | write-spec (brainstorm entries) + main agent | D1, D2, ... continuous per feature | entries are appended once and never deleted; no state machine |
| Standalone Decision Record (`docs/specs/decisions/`) | a durable cross-feature or cross-spec topic | main agent | full DR format, one of three states | proposed → accepted / rejected; superseded as an overlay |

Routing: a feature-bound decision goes in that feature's Decision Log and stays
there. A decision that constrains or outlives a single feature becomes a
standalone Decision Record. A decision has exactly one home; other files
reference it and never copy its rationale.

Research outcomes are two kinds: a leaf conclusion recorded inside a living
outline (`docs/research/<topic>.md`) is a research record, not a decision
artifact — this skill does not audit outlines. A conclusion promoted as a
durable guardrail (a dead end a future agent might re-propose) becomes a
standalone Decision Record with `Status: rejected` in `docs/specs/decisions/`.

The Decision Log is the primary working document. The append-only constraint
governs its `## Dn` entries; the `## Progress` board in the same file is a
status table that the main agent updates in place. A frozen spec that contains a
`## Decisions` section (frozen before this model) is a historical snapshot:
never add records to it, and route its supersession notes to that feature's
Decision Log.

## Check supersession when adding a decision

Every new decision triggers a scoped check of existing artifacts covering the same topic. Before writing:

1. Search existing Decision Logs and standalone DRs for the same mechanism, alternative, or topic
2. Classify each match:
   - **Full supersession:** the new decision completely replaces the old one → mark the old as superseded, link to the new
   - **Partial supersession:** the new decision overlaps but does not fully replace → keep both active, cross-link
   - **No supersession:** the decisions are independent → proceed normally
3. Do not defer a known match to a later audit — handle it in the same change

## Classify by future value

Apply these outcomes when auditing existing decision artifacts. Audits are
explicitly triggered by the user or the main agent; they are not part of the
dispatch loop, so the delete window below opens only at audit time.

- **Accepted — keep active:** retain when its rationale, alternatives, negative guarantees, ownership boundary, security rule, or reintroduction condition is likely to guide a future change. Length does not matter.
- **Accepted — supersede:** mark as superseded when a newer decision completely replaces it and the old artifact adds no independent value. Link to the successor. The old artifact remains as historical reference but is no longer authoritative.
- **Proposed — keep until resolved:** a proposed standalone record is never deleted; keep it until it is implemented (migrated to accepted) or evaluated and rejected.
- **Rejected — keep as guardrail:** retain a rejection only when the losing alternative remains a tempting, meaningful mistake and the record explains why it loses.
- **Rejected — delete:** delete an obsolete rejected standalone file when the rejected idea is no longer plausible and is unlikely to prevent re-litigation. This is the only physical deletion window; Decision Log entries are never deleted.

Do not maintain decisions toward a quota. Inspect every artifact in scope, classify analogous groups under one principle, use best judgment for close cases, and record genuinely borderline decisions for the handoff.

## Calibrated examples

These examples set the bar; word count demonstrates that size is not the test.

### Keep active

- **SVD without regularization** (3 sentences): foundational algorithm choice that constrains all orbit correction behavior; revisiting would require re-evaluating the entire spec
- **Qt as sole UI framework** (1 paragraph): cross-product ownership rule; affects every page implementation
- **pvAccess over Channel Access** (2 sentences): interface protocol decision with hardware compatibility implications

### Supersede

- **Initial response matrix format** (1 paragraph): superseded by the optimized sparse format; the old format is no longer used
- **Original topology detection algorithm** (4 sentences): replaced by the improved version; old algorithm's rationale is fully captured in the new DR

### Keep as guardrail (rejected)

- **Regularization considered and rejected** (3 sentences): keeps the team from re-proposing Tikhonov regularization every time the lattice changes; the "well-conditioned" rationale still holds
- **Tab layout considered and rejected** (2 sentences): the cognitive-overhead argument against tabs remains valid for any multi-plot page

### Delete (rejected, standalone only)

- **Python 2 compatibility** (1 sentence): Python 2 is EOL; no risk of re-litigation
- **REST API considered over pvAccess** (2 sentences): the pvAccess decision is firmly established; REST alternative no longer plausible

## Supersede a Decision Record

When a new decision supersedes an old one:

1. In the old artifact, append the marker:
   - standalone record: render it on the `Status:` line, e.g. `Status: accepted — superseded by [Standalone DR: <title>]`
   - Decision Log entry: append a line, e.g. `**Status:** superseded by [D<n> in <location>]`
2. In the new artifact, reference the old:
   `**Supersedes:** [D<m> in <location>]` or `[Standalone DR: <title>]`
3. Do not delete the old artifact — it remains as historical reference
4. For full supersession, transfer every unique rationale, alternative, consequence, and named coverage gap into the current owner before marking the old artifact
5. If the old artifact sits in a frozen spec's `## Decisions` section (frozen before this model), do not edit the spec — append the supersession note to that feature's Decision Log instead

## Standalone Decision Record lifecycle

Standalone files are the only decision artifact with a state machine. The state
is the value of the `Status:` line; `superseded` is an overlay appended to that
line, never a standalone value of its own. Each state binds its own section
skeleton:

| State | Meaning | Sections |
|---|---|---|
| `proposed` | durable proposal, not yet implemented | `## Problem` / `## Proposal` / `## Alternatives Considered` / `## Acceptance criteria` / `## Risks` |
| `accepted` | implemented; describes shipped reality | `## Problem` / `## Decision` / `## Alternatives Considered` / `## Consequences` |
| `rejected` | evaluated and declined | the sections it was written with, frozen |
| (overlay) `— superseded by <ref>` | no longer authoritative | prior sections kept; marker on the `Status:` line |

### Transitions

- **proposed → accepted:** when the decision first ships, the main agent
  rewrites `## Proposal` as a present-tense `## Decision`, folds `## Acceptance
  criteria` and `## Risks` into `## Consequences` (keeping the verification
  contracts that pin the shipped behavior), fills the `Specs:` field with the
  implementing spec, and commits the migration on main after the implementing
  change merges. Partial implementations note remaining gaps in
  `## Consequences`. A later review or audit verifies the migration landed.
- **proposed → rejected:** append `rejected — <reason, one line>` to the
  `Status:` line and freeze the sections. The file stays as a guardrail unless a
  later audit classifies it obsolete (the deletion window above).
- **proposed → superseded:** a newer proposal completely replaces it before
  implementation; transfer its rationale into the new owner and mark it
  superseded.
- **accepted → superseded:** use the supersede mechanics above; the old file is
  never deleted.

### Format

```markdown
# Decision: <title>

Status: <proposed | accepted | rejected — reason>  <!-- superseded appends to this line -->
Date: YYYY-MM-DD
Specs: [<spec-1>](../<slug>.md)                    <!-- accepted records; proposed leave empty -->
       or `Specs: none — <why>` for records that govern no spec

## Problem
<What needed to be decided.>

## Decision            (accepted: present-tense, what was chosen and shipped)
## Proposal            (proposed: what is being proposed)
<...>

## Alternatives Considered
- **<Alternative 1>** — rejected: <reason>
- **<Alternative 2>** — rejected: <reason>

## Acceptance criteria  (proposed only)
<Observable end state and gates.>

## Risks                (proposed only)
<Behavior changes and why the tradeoff is still reasonable.>

## Consequences         (accepted only)
<What the tradeoff cost and bought, plus any remaining coverage gaps.>
```

Decision Log entries have no state machine: they are appended once, never
deleted, and the only sanctioned edits are appending a supersession or Status
note in place and restating an implemented decision as present-tense shipped
reality.

## Validate and report

After an audit or supersession pass:

1. Run lint and `git diff --check`
2. Report:
   - Active decisions kept
   - Decisions superseded (with successor references)
   - Proposed records migrated to accepted (and which implementing change)
   - Rejected decisions kept as guardrails
   - Rejected standalone files deleted
   - Genuinely borderline cases with their reasoning

## Collaboration

This skill is the governance layer for the decision corpus. It owns the status
vocabulary, migration rules, supersession mechanics, retention judgment, and
deletion windows; other skills only reference, never duplicate.

- **write-spec:** consults it for the supersession check when writing a spec's brainstorm Decision Log entries.
- **simplification-audit:** writes durable proposals as standalone `proposed` records in this skill's format and delegates retention judgment to it.
- **write-research-outline:** promotes durable research guardrails as standalone `rejected` records; in-outline leaf records stay outside this skill's scope.
- **reviewer / main agent:** reference it as decisions evolve during implementation and review; the main agent executes state transitions (including proposed → accepted migration) on main.
- Its scope covers decision artifacts only; the per-feature `## Progress` board (a status table, not a decision) is excluded from its audit rules.
