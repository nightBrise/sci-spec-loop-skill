---
name: simplification-audit
description: >
  Find non-obvious simplification candidates in a codebase. Use when asked to
  simplify, clean up, reduce surface area, find dead code, identify over-engineering,
  or audit for unused APIs. Produces proposed standalone Decision Records for
  durable cross-feature proposals, Decision Log entries for feature-bound items,
  and inline TODO/FIXME/XXX notes for small local cleanups. Especially targets:
  dead, duplicated, speculative, over-built, added-then-removed, or
  hand-rolled-where-a-dependency-exists surfaces.
type: prompt
whenToUse: When the user asks to simplify code, clean up, reduce surface area, find dead code, audit for unused APIs, or identify over-engineering
---

# Simplification Audit

Turn a broad "find things to simplify" request into evidence-backed Decision Records that remove or collapse existing surface area. It is guidance, not a checklist: follow the code, keep judgment active, and prefer a few well-proven candidates over a pile of thin guesses.

## Start with project context

- Read the project's `AGENTS.md` and architecture documentation before judging anything. Simplifications that fight the architecture or service map need extra evidence.
- Read existing Decision Records to understand intentional architecture. Do not propose deleting a deliberate design decision without new evidence that beats the recorded rationale.
- Treat documented seams and dual implementations as intentional by default. Do not propose deleting either as "low effort" unless the user explicitly overrides that constraint.

## What counts as a strong candidate

A strong simplification removes, folds, or demotes something real and has clear evidence that the current design costs more than it buys:

- **No production consumer:** a public method, event, config knob, helper, or test artifact has no production consumer.
- **Tests/docs only:** tests or docs are the only consumers, and the behavior they pin is not load-bearing.
- **Duplicated fact:** two representations mirror the same fact (e.g., durable events and transient state carrying the same information).
- **Unused seam methods:** an interface has methods every implementation must support but no consumer uses.
- **Speculative generality:** a feature implements multi-session support, background jobs, live invalidation, mid-turn steering, or similar designs with no product owner.
- **Protecting unused API:** an invariant, rollback path, or special-case test exists only to protect an unused API.
- **Hand-rolled where dependency exists:** code reimplements what a well-maintained external package or language builtin already provides, and the swap would delete the implementation plus its dedicated tests.
- **Simplified behavior still reasonable:** the simplified behavior may differ slightly, but the new behavior is still correct and easier to explain.

Thin candidates are usually not enough for a Decision Record: deleting one typo, running a linter once, removing an intentionally documented backend, or flagging "this looks complex" without call-site proof.

## Survey broadly

Use parallel subagents when the user asks for breadth or many candidates. Give each agent a domain and require evidence, not guesses. Adapt domains to the project:

- Core logic and data flow
- UI/API layer
- Configuration and tooling
- Tests and documentation
- External integrations

If subagents are unavailable, simulate the same breadth yourself. Do not let the first good candidate stop the survey.

Start with the largest production-code deltas. A broad audit that stops after obvious unused symbols can miss the files where duplicated lifecycle or defensive machinery carries most of the cost.

## Audit trust and lifecycle boundaries

For every defensive copy, freeze, validator, and callback capture, name where the value came from and who owns it next. Same-process calls ordinarily borrow readonly values; parsers, config loaders, queues, durable files, workers, and wire decoders own or validate their data. Tests built around hostile getters, fake typed objects, or mutation after a same-process handoff are evidence of a potentially speculative contract, not automatic justification for keeping it.

For complex asynchronous code, draw the ownership graph and map each sentinel, readiness promise, cancellation path, disposer, and state flag to a distinct owner or transition. When several mechanisms mirror the same liveness or settlement fact, propose one controller instead. Preserve separate machinery where it protects synchronous publication and rollback, callback containment, first-terminal-outcome arbitration, or dispose-to-quiescence.

## Hand-rolled code versus a dependency

Introducing a dependency is a valid simplification move. When surveying, ask: does a well-maintained package or a language builtin already do this?

Prove a dependency-swap candidate like any other, plus:

- Read the hand-rolled implementation and name the exact surface the package covers; residual semantics the package does not cover count against the swap.
- Check the package's health honestly (maintenance, adoption, transitive footprint) and prefer builtins when available.
- Check existing Decision Records first: a swap that collapses a recorded design decision needs to beat the recorded rationale.
- Weigh net deletion: implementation plus dedicated tests plus docs, minus the glue that remains. A wrapper that relocates the same complexity is not a win.

## Prove or reject each candidate

For every symbol or behavior, classify consumers before writing:

- **Production corpus:** source code, runtime scripts, configuration paths, loader paths.
- **Non-production corpus:** tests, README/docs, Decision Records, snapshots, generated outputs, and comments.
- **Ambiguous corpus:** examples and scripts that may be production smoke paths. Inspect usage before classifying.

Search the exact symbol, event name, config key, method name, and wire strings. Then read the call sites.

Reject or downgrade a candidate when:

- A production caller exists and the simplification would be a feature decision rather than a cleanup.
- The API is explicitly justified by an existing Decision Record or a hard-won defensive pattern, and the new evidence does not beat that reason.
- The removal would force unrelated churn without actually reducing the public API or required behavior.
- The idea is correct but tiny. Add a targeted TODO/FIXME/XXX instead.

## Coalesce superseded Decision Records

Audit Decision Records when the user asks to reduce or coalesce them, or when the simplification being implemented makes an owning record obsolete. Retention judgment and the full/partial classification belong to manage-decision-records; this section only adds the audit-specific owner search.

For each candidate chain:

1. Identify the current owner from shipped code, configuration, newer Decision Records, and inbound links.
2. Classify the old record and mark it per manage-decision-records' supersede mechanics (full vs partial); do not restate the mechanics here.

## Write the Decision Record

Create one record per durable proposal. Route by scope:

- A decided, feature-bound item goes in that feature's Decision Log (`.decisions.md`) as a numbered entry.
- A durable cross-feature or cross-spec proposal becomes a standalone file in `docs/specs/decisions/` with `Status: proposed`, even when it is small — it needs a home that outlives any single feature.
- A correct-but-tiny cleanup becomes an inline TODO note instead of a record.

Write standalone proposals in manage-decision-records' proposed format (`## Problem` / `## Proposal` / `## Alternatives Considered` / `## Acceptance criteria` / `## Risks`) with these audit-specific contents:

- `## Problem` names the current API, cites the relevant files, and separates production callers from tests/docs (consumer evidence).
- `## Proposal` says exactly what to remove, fold, demote, or rehome, including tests, docs, and generated-file cleanup.
- `## Alternatives Considered` and `## Risks` make the strongest counterargument legible: why not keep it, and what the change gives up.

Be concrete enough that an implementing change can follow the trail. Avoid vague "simplify this" proposals. When a proposal overlaps an existing Decision Record, consolidate the useful details into the existing one rather than creating a duplicate.

## Inline TODO notes

Use inline TODO/FIXME/XXX only for small, local cleanups that are clearly useful but not durable design decisions. Keep them short and actionable:

- Name the smell with a stable tag, e.g. `TODO(double-default)` or `XXX(unused-default)`.
- Explain why it is safe to revisit and what action would simplify it.
- Do not add TODOs for speculative complaints or for behavior that needs a Decision Record.

## Validation

Run lint, typecheck, and `git diff --check`. For each simplification summary, report:

- How many Decision Records and inline notes were added, consolidated, or superseded
- The main areas surveyed
- What was intentionally excluded
- Which checks passed

## Collaboration

This skill is the maintenance layer for simplification candidates.

- **manage-decision-records:** delegates retention judgment and supersession mechanics to it, and writes standalone proposals in its `proposed` format.
- **prose-quality / trim-cot-leakage:** candidate proposals' prose obeys the complete-proposition rule; no leakage.
- **main agent:** invokes it when asked to simplify, find dead code, or reduce surface area.
- It produces standalone proposals, Decision Log entries, or inline TODO notes; the retention decision belongs to manage-decision-records.
