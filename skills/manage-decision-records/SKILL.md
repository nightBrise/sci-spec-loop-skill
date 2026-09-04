---
name: manage-decision-records
description: >
  Manage the lifecycle of Decision Records in the spec-loop workflow. Use when
  adding, auditing, superseding, or reviewing decisions in specs, Decision Logs,
  and standalone Decision Records. Checks every new decision for superseded
  active records, classifies records by future decision value, and maintains
  a focused active corpus without erasing history that can still guide work.
type: prompt
whenToUse: When adding, auditing, superseding, or reviewing decisions in specs, Decision Logs, or standalone Decision Records
---

# Manage Decision Records

Reduce the active decision corpus without erasing history that can still guide work. Judge every record semantically; word count and age are discovery aids, never archive criteria.

## Decision Record locations

In the spec-loop workflow, decisions live in three places:

| Location | Format | Written by | Lifecycle |
|---|---|---|---|
| Spec `## Decisions` | D1, D2, ... per spec | write-spec | Frozen with spec |
| Decision Log (`.decisions.md`) | D1, D2, ... continuous | write-spec + main agent | Active, continuously appended |
| Standalone DR files (`docs/specs/decisions/`) | Full DR format | main agent | Active → superseded |

The Decision Log (`.decisions.md`) is the primary working document. Standalone DR files are for major cross-spec architectural decisions only. The spec's `## Decisions` section is frozen with the spec and serves as a historical snapshot.

## Check supersession when adding a decision

Every new decision triggers a scoped check of existing decisions covering the same topic. Before writing:

1. Search existing Decision Logs and standalone DRs for the same mechanism, alternative, or topic
2. Classify each match:
   - **Full supersession:** the new decision completely replaces the old one → mark the old as superseded, link to the new
   - **Partial supersession:** the new decision overlaps but does not fully replace → keep both active, cross-link
   - **No supersession:** the decisions are independent → proceed normally
3. Do not defer a known match to a later audit — handle it in the same change

## Classify by future value

Apply these outcomes when reviewing existing Decision Records:

- **Accepted — keep active:** retain when its rationale, alternatives, negative guarantees, ownership boundary, security rule, or reintroduction condition is likely to guide a future change. Length does not matter.
- **Accepted — supersede:** mark as superseded when a newer decision completely replaces it and the old record adds no independent value. Link to the successor. The old record remains as historical reference but is no longer authoritative.
- **Proposed (in spec Decisions) — keep until frozen:** proposed decisions in a spec are frozen with the spec. If the spec is abandoned, the decisions become historical reference.
- **Rejected (in spec Decisions) — keep as guardrail:** retain a rejection only when the losing alternative remains a tempting, meaningful mistake and the record explains why it loses.
- **Rejected — delete:** delete when the rejected idea is obsolete, superseded, no longer plausible, or unlikely to prevent re-litigation.

Do not maintain decisions toward a quota. Inspect every record in scope, classify analogous groups under one principle, use best judgment for close cases, and record genuinely borderline decisions for the handoff.

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

### Delete (rejected)

- **Python 2 compatibility** (1 sentence): Python 2 is EOL; no risk of re-litigation
- **REST API considered over pvAccess** (2 sentences): the pvAccess decision is firmly established; REST alternative no longer plausible

## Supersede a Decision Record

When a new decision supersedes an old one:

1. In the old record (in `.decisions.md` or standalone file), append:
   `**Status:** superseded by [D<n> in <location>]`
2. In the new record, reference the old:
   `**Supersedes:** [D<m> in <location>]`
3. Do not delete the old record — it remains as historical reference
4. If the old record is in a frozen spec's `## Decisions` section, do not edit the spec. Add the supersession note to the Decision Log instead.

## Standalone Decision Record format

For major cross-spec architectural decisions, create a standalone file in `docs/specs/decisions/`:

```markdown
# Decision: <title>

Status: accepted
Date: YYYY-MM-DD
Specs: [<spec-1>](../<slug>.md), [<spec-2>](../<slug>.md)

## Problem
<What needed to be decided.>

## Decision
<What was chosen.>

## Alternatives Considered
- **<Alternative 1>** — rejected: <reason>
- **<Alternative 2>** — rejected: <reason>

## Consequences
<What the tradeoff cost and bought.>
```

Standalone DRs follow the same lifecycle rules as Decision Log entries: accepted → superseded.

## Validate and report

After an audit or supersession pass:

1. Run lint and `git diff --check`
2. Report:
   - Active decisions kept
   - Decisions superseded (with successor references)
   - Rejected decisions kept as guardrails
   - Rejected decisions deleted
   - Genuinely borderline cases with their reasoning

## Collaboration

This skill is the governance layer for the decision corpus.

- **write-spec:** calls it when writing the `## Decisions` section (supersession check on new decisions).
- **simplification-audit:** delegates retention judgment to it when coalescing superseded Decision Records.
- **reviewer / main agent:** reference it as decisions evolve during implementation and review.
- It owns the lifecycle rules (keep / supersede / guardrail / delete); other skills only reference, never duplicate.
- Its scope covers decisions only; the per-feature `## Progress` board (a status table, not a decision) is excluded from its audit rules.
