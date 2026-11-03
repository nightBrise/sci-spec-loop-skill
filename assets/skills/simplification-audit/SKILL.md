---
name: simplification-audit
description: Use when the owner asks to simplify, clean up, reduce surface area, find dead code, or audit over-engineering, and at the topic-closing governance scan — finds maintenance obligations that can be deleted, classifies each candidate as delete / narrow / keep, and records it in manage-decision-records' formats. Retention judgment stays with manage-decision-records.
---

# Simplification Audit

Find work the system still pays for and no longer needs. The unit of value is a deleted maintenance obligation — an API, a representation, a lifecycle state, a configuration path, a dependency, a test, or a document that someone must keep true — not a deleted line count.

This is guidance, not a script. Six discovery questions generate candidates; a three-way classification disposes of them; two guards keep the audit from becoming churn. Entry formats, retention judgment, and supersession live in `skills/manage-decision-records`; the lifecycle and concurrency vocabulary lives in `skills/structured-code-review`; the proposals' prose follows `skills/prose-quality` and `skills/trim-cot-leakage`; the closing trigger lives in `AGENTS.md`.

Governing rule: remove the obligation, not the symptom. A candidate earns its place only when the obligation's complete maintenance cost disappears and no replacement grows to carry it.

## Inputs and exclusions

**Inputs.**

- The scope: a repository, a module set, or the topic's own asset tree (the closing routine).
- The consumer corpus: production code, tests, documentation, configuration, manifests, generated outputs.
- The recorded rationale a candidate must beat: `.decisions.md`, `docs/specs/decisions/`, and architecture documents.

**Mode.**

- Survey — the owner asks for simplification; the whole requested scope is in play.
- Closing routine — the topic-closing governance scan (`AGENTS.md` checklist item 5); one time-boxed pass over the topic's own assets, not a repository audit.

**Always excluded.**

- Implementing the candidates: this skill records proposals; implementation is a separate work item.
- Retention judgment, supersession, and entry lifecycle: `skills/manage-decision-records`.
- Whether a capability should exist at all: an owner decision, not an audit finding.
- Style and formatting: cosmetic churn is excluded by the one test.

**Exemptions.**

- A deliberate seam or dual implementation recorded in a decision is exempt from deletion proposals until new evidence beats the recorded rationale.

## The one test

Does the candidate delete a maintenance obligation, with nothing taking its place? If the obligation survives in another form — a wrapper, a gate, a renamed concept — the change is a relocation, and a relocation does not count.

## Taxonomy and coverage

### Six discovery questions

Ask each question across the scope; every answer that exposes a removable obligation is a candidate.

1. **Does a declared feature have a complete effect path?** Trace producer, transformations, provider or endpoint support, and observable result. A field copied everywhere can still have no setter, no reader, or only implementations that reject it. For configuration and CLI pass-throughs, follow the authoritative read and precedence to find forwarded values shadowed before use; search constructors and discriminant emitters as well as callers.
2. **Which distinctions change a consumer's action?** Ask whether the distinction, field, or adapter is needed at all. Trace existing fields and discriminants through their emitters and authorization or capability checks before adding a transport-specific marker. Deleting a distinction and relocating its declaration are separate candidates; state which inputs or capabilities each admits. Preserve required authorization, residency, durability, and ownership behavior.
3. **Could a smaller explicit behavior remove the subsystem?** A fixed interval, a caller-supplied time zone, or a reported activation failure can eliminate a generalized calendar, persisted defaults, or automatic rollback. Name the capability given up and the machinery deleted. A production caller makes this a behavior decision, not an automatic rejection.
4. **Can a consumer read the authoritative value when needed?** Look for copied histories, promotion ledgers, invalidation events followed by reads, and feature caches beside a shared projection stream. Derivation or reuse can delete subscriptions, retained data, stale-response handling, and recovery paths together. Establish the required time of observation first.
5. **Is composition being mistaken for policy?** Optional service presence, a provider method, or a sibling tool can express availability without deciding deployment behavior. Explicit configuration or a caller-intent operation can remove registries and dependency checks. Preserve distinct operations when their ownership or completion timing differs.
6. **What owns the complete maintenance cost?** Trace duplicate application trees, demo launchers used by products, resolver-only workspaces, and installation helpers with their own upgrade lifecycle. Compare the entire removed system with its replacement, residual glue included. Moving an unnecessary concept closer to its owner, or adding a gate that keeps duplicate definitions equal, does not remove the cost.

### Three dispositions

Classify every candidate and act on the classification; an unclassified candidate is not a proposal.

| Disposition | Criterion | Action |
|---|---|---|
| **Delete** | No production consumer, or the distinction changes no consumer's action | Remove the obligation with its dedicated tests, documentation, configuration, and generated files |
| **Narrow** | A consumer exists, but the obligation is broader than any consumer's need | Reduce the public or product behavior and name the capability given up. Demo-to-product promotion is this branch: code that only demonstrates a capability is narrowed to the product's actual use, or deleted |
| **Keep** | A retained obligation, or evidence too weak to beat the recorded rationale | Record the rejection reason at the level of the proposed change; refresh the evidence before re-proposing |

- A stale inventory, or a rejected item inside a mixed proposal, does not settle the proposal's independent items; judge each at the level of its own change.
- A candidate too small to outlive the change — a one-line cleanup inside the touched file — becomes an inline `TODO`/`FIXME`/`XXX` with a stable tag, not a decision record.
- Examples: a configuration key forwarded by the loader but read by nobody → delete the key and its forwarding path; multi-session support with no product owner → narrow to the single-session behavior the product uses; two adapters recorded as an intentional seam → keep unless new evidence beats the record.

### Consumer evidence

Search exact symbols, property reads and writes, discriminants, event and wire strings, config keys, package names, and both `obj.method(` and `method(` forms; then read the matches. Classify consumers by their actual entry point, not their directory name:

- **Production:** source code, runtime scripts, configuration and loader paths, shipped manifests, generated assets consumed at runtime.
- **Non-production:** tests, README and docs, decision records, snapshots, documentation-only listings.
- **Ambiguous:** examples, fixtures, and scripts that can be production smoke paths. Inspect the usage before classifying.

A public third-party extension path can be intentional with zero in-repository call sites. Tests and declarations prove a contract only when a shipped producer or consumer also exists.

## What this is not

- **Not a dead-code linter.** A symbol-level unused report is an input; a symbol with no in-repo caller can still be a documented seam.
- **Not a rewrite program.** This skill records candidates; implementation goes through a work item and its spec.
- **Not a style pass.** Renames, reformatting, and comment rewording that leave the obligation intact are excluded.
- **Not permission to delete recorded design.** A deliberate decision stays until evidence beats its rationale.
- **Not a counting exercise.** Zero candidates is a valid result and is reported as evidence at the closing gate.

## Specialized mechanisms

### Anti-over-fixing guard

- Never propose cosmetic churn: if the proposal would not delete a maintenance obligation, it is not a candidate.
- Narrowing must not change observable behavior beyond the one capability named. If behavior changes and no consumer's need requires it, the change is a feature decision — take it to the owner, not into a simplification proposal.
- One candidate states one obligation; never bundle unrelated deletions into a single proposal.
- Never add a gate, test, or wrapper that keeps a duplicated definition equal.
- Prefer a few proven candidates over a long list of thin ones.

### Dependency replacement only on net reduction

Introducing or replacing a dependency is a valid move when the net maintenance cost falls. Prove it like any other candidate, plus:

- Name the exact surface the package or builtin covers; residual semantics it does not cover count against the swap.
- Check the package's maintenance, adoption, and transitive footprint; prefer a language builtin.
- Read the recorded decisions first; a swap that collapses a recorded design decision must beat its rationale.
- Weigh net deletion: implementation plus dedicated tests plus documentation, minus the glue that remains. A wrapper that relocates the same complexity is not a win.
- Exercise the mismatches most likely to defeat the replacement: truncation, cancellation and teardown, configured bounds, deterministic test clocks, platform packaging, and source versus built entry points.

### Ownership and lifecycle boundaries

For every defensive copy, freeze, validator, and callback capture, name where the value came from and who owns it next. Same-process calls borrow readonly values unless the callee stores or hands them off; parsers, config loaders, queues, durable files, workers, and wire decoders own or validate their input. Tests built on hostile getters do not establish a requirement by themselves.

For asynchronous machinery, map each promise, flag, cancellation path, disposer, and reservation to its owner and transition. Collapse mechanisms only when they express the same fact; preserve synchronous publication and rollback, callback containment, first-terminal-outcome arbitration, worker or process ownership, and dispose-to-quiescence where required. Vocabulary: `skills/structured-code-review`, "Lifecycle and concurrency".

### Closing routine (checklist item 5)

- Run the six questions once over the topic's own assets — skills, references, `AGENTS.md`, adapters — and stop at one pass; this is not a repository audit.
- Record each candidate as a `manage-decision-records` entry; a candidate too small to decide becomes an inline TODO or is left out.
- Never block closing on the routine: the gate requires that the scan happened, not that its candidates are resolved.
- Report the scan scope and the candidate count; zero candidates is evidence.
- Count the standalone corpus at each scan; when it has grown by ten records since the last pruning, raise a knowledge-base pruning for the owner to rule on (the owner may also call one at any time). The run is `manage-decision-records`' retention judgment — its topic-closing batch step 6 as a dedicated pass, with the owner ruling on each disposition.

## Workflow

1. Establish the scope and read the standing rules: `AGENTS.md`, architecture documents, `.decisions.md`, and `docs/specs/decisions/`. Note protected seams and dual implementations; treat them as intentional until evidence beats the record.
2. Survey the scope. For a broad request, split independent domains across subagents, each with a bounded domain and a requirement of consumer evidence; otherwise sweep core logic and data flow, UI or API, configuration and tooling, tests and documentation, and external integrations yourself. Start from the largest production deltas; do not stop at the first good candidate or at obvious unused symbols.
3. Put every candidate through the six questions; drop the ones that expose no obligation to delete.
4. Prove reachability with the consumer-evidence rules. A production caller turns a deletion into a behavior decision.
5. Classify delete / narrow / keep; for keep, write the reason at the level of the change.
6. Apply the anti-over-fixing guard and, for a dependency swap, the net-reduction proof.
7. Record. A durable cross-feature proposal goes to `docs/specs/decisions/` as a standalone `proposed` record in `manage-decision-records`' format — `## Problem`, `## Proposal`, `## Alternatives Considered`, `## Acceptance criteria`, `## Risks` — with the audit-specific contents below. A decided, feature-bound item goes to the feature's `.decisions.md` in that skill's entry format; a tiny local cleanup becomes an inline TODO.
   - `## Problem` names the current surface, cites the files, and separates production consumers from tests and docs.
   - `## Proposal` states exactly what is removed, narrowed, or rehomed, including tests, docs, configuration, and generated files.
   - `## Alternatives Considered` and `## Risks` make the strongest counterargument legible: why not keep it, and what the change gives up.
   - `## Acceptance criteria` states the observable condition that proves the obligation is gone.
8. Consolidate rather than duplicate: when a proposal overlaps an existing record, fold the new evidence into that record; retention and supersession are `manage-decision-records`'.
9. Validate the recorded output: prose follows `skills/prose-quality`, no session leakage per `skills/trim-cot-leakage`, and every cited path and line resolves. Select the checks for the resulting documentation change with `skills/pre-push-checks`.
10. Report the scope surveyed, candidates by disposition, records added or consolidated with their paths, keeps with their reasons, what was intentionally excluded, and the commands actually run. Prose is not evidence.

## Collaboration

- **`manage-decision-records`:** owns retention judgment, supersession, lifecycle states, and the proposed/accepted/rejected formats; this skill supplies candidate contents, writes in those formats, and never rules on retention.
- **`structured-code-review`:** owns the lifecycle and concurrency vocabulary this skill cites, and the review standard its proposals are judged by.
- **`write-spec`:** owns Claims and the after-freeze procedures; a candidate that would change a frozen contract routes through `AGENTS.md`'s four channels instead of being recorded as a simplification.
- **`prose-quality` / `trim-cot-leakage`:** own the proposals' expression and leakage checks.
- **`pre-push-checks`:** selects and runs the evidence for the documentation change this skill produces.
- **`AGENTS.md`:** pins the closing gate (item 5) and the non-blocking rule for candidates.
- **main agent and subagents:** the main agent invokes the skill and is the sole writer of decision entries; a broad survey may be split across subagents, each with a bounded domain and a requirement of consumer evidence.
