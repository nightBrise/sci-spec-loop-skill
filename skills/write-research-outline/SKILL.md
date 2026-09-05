---
name: write-research-outline
description: >
  Convert a research question into a living research outline that decomposes the
  question into sub-questions, hypotheses, and experiment areas, classifies each
  leaf as a spec (concrete and verifiable) or an investigation (open exploration),
  and hands each leaf off. The outline is a living document; only derived spec
  leaves freeze.
type: prompt
whenToUse: When the task is an open research question rather than a concrete feature — the "what to build" is not yet known, and the work decomposes into hypotheses and experiments
---

# Write Research Outline

Convert a research question into a living outline. The outline is NOT a frozen
contract: it is revised as the research learns (dead ends, new hypotheses, pivots).
Only leaves that converge into a concrete, verifiable unit become frozen specs.

## When to use this skill

- The task is a research question: the answer and the concrete deliverable are unknown.
- If requirements are already concrete enough to write a spec, skip this skill and
  use write-spec directly.

## Produce the outline

Write one living document per research topic at `docs/research/<topic>.md`. Structure:

- **Research question** — the top-level question.
- **Sub-questions / hypotheses** — H1, H2, ... each falsifiable.
- **Experiment areas** — where and how each hypothesis is tested.
- **Leaves** — one block per leaf:
  - Type: `spec` | `investigation`
  - Dependencies: which leaves must resolve first
  - Status: `open` | `in-progress` | `dead-end` | `pivot` | `resolved` (`pivot`: the hypothesis failed but the inquiry turns to a new one; `dead-end`: the inquiry stops)
  - Output: the frozen spec path for a spec leaf; for an investigation leaf, a
    conclusion — one line stating the outcome plus the evidence reference.
    Deep-dive reports are optional linked files
    (`docs/research/<topic>-<leaf-slug>.md`); the leaf conclusion stays the
    summary.

The outline is the research-level progress board: its leaf status is the single
source of truth for where the research stands.

## Classify each leaf

- **spec leaf** — concrete enough that "do this and get a verifiable result" holds:
  it has testable claims and known boundaries. Hand to write-spec.
- **investigation leaf** — an open question with no known answer yet. Run the
  investigation loop.
- Decide by the same probes as spec granularity (contract coupling, independent
  ship+rollback, different outcome) plus one more: is there already a verifiable
  acceptance criterion? If not, it is an investigation, not a spec.

## Hand off

- **spec leaf** → write-spec produces the frozen spec and Decision Log.
- **investigation leaf** → investigation loop: propose a hypothesis → run the
  experiment/prototype → record the conclusion in the leaf (one line plus the
  evidence reference) → update the leaf `Status` (`dead-end` / `resolved` /
  `pivot`). Leaf outcomes are research records, not Decision Records.
- **durable guardrail** → when a dead end or rejection would still tempt a
  future agent, the main agent promotes the conclusion to a standalone Decision
  Record (`Status: rejected` — guardrail semantics) per manage-decision-records.
  Promotion is the exception, not the rule, for every negative result.

## Review and evidence

- spec leaves: standard evidence — test name / command output / file:line (wording per AGENTS.md, review gate).
- investigation leaves: evidence is experiment data, measurement, literature, or
  prototype behavior; the review standard is "conclusion is supported and the
  process is reproducible", not "behavior tests pass".

## Collaboration

This skill is the research-layer entry point above the spec loop.

- **write-spec:** receives converged spec leaves and freezes them.
- **manage-decision-records:** governs promoted standalone guardrails (`Status: rejected`) from concluded leaves; in-outline leaf records are research records outside its scope.
- **prose-quality / trim-cot-leakage:** the outline and investigation reports obey the complete-proposition rule; no leakage.
- **main agent:** invokes this skill when the task is a research question, before any spec is written.
