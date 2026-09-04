---
name: prose-quality
description: >
  Editorial standard for all agent-generated prose. Use when writing, reviewing,
  restoring, trimming, or auditing prose — including deciding where documentation
  or comments are required across Markdown, docstrings, code and test comments,
  prompts, descriptions, diagnostics, and UI strings. Covers proposition
  preservation, required coverage by location, structure-before-prose, corpus
  auditing, and borderline decisions.
type: prompt
whenToUse: When writing, reviewing, restoring, trimming, or auditing any prose — comments, docstrings, docs, prompts, diagnostics, UI strings — or deciding where documentation is required
---

# Prose Quality Standard

Write enough to preserve the contract, then remove reasoning transcripts, repetition, and decoration. A contract is an obligation, invariant, precondition, postcondition, or compatibility promise that a caller, callee, implementer, producer, or consumer relies on. This skill owns editorial judgment and required prose coverage; use trim-cot-leakage for hunting and fixing reasoning-transcript leakage. It is guidance, not a script.

## Check-before-use rule

Treat `contract`, `boundary`, `shape`, `surface`, `seam`, `gate`, `vocabulary`, and similar abstraction terms as words to check before use, not banned words. First ask: does the exact rule, API, field set, type, validation, timing point, component split, or failure state state the fact better? Keep the term when it names the exact technical subject, including caller/callee contracts and security/process boundaries.

## Comments principle

Comments describe non-obvious contracts or rationale that code cannot express; they do not restate what code already implies.

## Inputs and exclusions

Require an explicit `scope`. If missing, report the required input and stop; do not infer a repository-wide scope.

Accept `mode: automatic | interactive`; default to `automatic`.
- **automatic:** apply clear edits when authorized, report borderline cases without asking
- **interactive:** present 2-3 viable versions when explicitly requested by the user

`mode` controls questions, not write authority. Review and audit tasks report findings without editing; explicitly requested write, fix, or trim tasks apply changes.

### Exclusions (always, regardless of scope)

- External dependencies (`../FALCON/`, third-party vendored code) — do not follow symlinks into them
- Generated files (`__pycache__/`, `.mypy_cache/`, build artifacts)
- Test fixtures and recorded snapshots
- Decision Log (`.decisions.md`) — allowed to reference session context
- Process journals — allowed to narrate process (5-item limit)

Treat generated catalogs, snapshots, and fixtures as derivative. Edit the owning source or scenario first, then regenerate the artifact.

## Preserve the complete proposition

Before editing, identify every proposition in the passage. Preserve each relevant:

- actor and action
- condition, timing, and ordering
- modality such as must, may, or never
- negative guarantee and exception
- ownership, side effect, failure mode, and consequence

Remove adjectives, repetition, and narration only when every factual clause survives and the result is clearer. A smaller word count alone is not an improvement.

### Local contract at point of use

Keep a complete local contract at the point of use: behavior, failure, ownership, and consequence that a caller or maintainer needs there. Aggressively link to the owning document for architecture, rationale, algorithms, history, or extended examples. One explanation has one home; essential contract facts may repeat locally.

### Non-obvious rationale

Keep non-obvious rationale when omitting it could plausibly cause misuse or an incorrect simplification. Otherwise state the consequence and link the rationale home.

### Searchable names and emphasis

Preserve searchable mechanism names and meaningful modal, temporal, or negative emphasis. Normalize decorative emphasis only.

## Required coverage by prose location

This is not a one-way shortening pass. Add or restore prose when code, types, and structure do not communicate a required contract below. Do not add a comment when those facts are already obvious locally.

- **Public API docstring:** caller-visible return distinctions, throws/rejections, side effects, ownership, timing, cancellation, durability.
- **Internal comments:** orient non-local structure and obviously complicated local structure, including invariants, race ordering, ownership, security boundaries, and surprising failure behavior. Delete control-flow narration and code restatement.
- **Module docstring:** module's role, dependencies, responsibilities, and non-obvious architecture choices; link choices to their owning explanation.
- **Tests:** explain only non-obvious test design — why a fixture, assertion, platform accommodation, real entry path, or indirect observation is necessary. Delete walkthroughs and inventories.
- **READMEs:** consumer contract: configuration, semantics, failures, limitations, extension points, and model-visible effects. Keep durable gaps and maintainer traps, not ordinary cleanup inventories.
- **Decision Records:** unique rationale, mechanisms, alternatives, consequences, shipped verification evidence, and named coverage gaps. Implemented decisions state shipped reality in the present tense; remove planning checklists, not evidence of what pins the decision.
- **Skills and agent instructions:** behavioral guardrails and explicit scope limitations. Keep the workflow concise and link its source of truth.
- **Examples and configuration comments:** access limits, non-obvious wiring or load order, security stance, replay behavior, exceptions, and likely misuse. Do not narrate entries that the configuration already shows.
- **Prompts and visible strings:** treat wording as behavior. Inspect generated output and run behavior validation or state why no snapshot applies.
- **Diagnostics:** name the failing subject or path, violated rule, and correction when it is non-obvious. Remove internal execution narration.

## Structure before prose

Apply to every human-facing document in scope. Do not apply to Decision Records (they follow their own format from write-spec).

1. Locate the document in the repository and navigation trees. State its subject and identify its direct children.
2. Set the permitted level of detail. Keep full detail about the document's subject, summarize direct children by purpose and responsibility, move deeper explanations to their owning descendants with links.
3. Classify by intended use, not path or title. A tutorial leads through ordered work to an observable outcome; a reference supports lookup without sequential reading.
4. For a tutorial, classify the starting reader and concepts as beginner, intermediate, or advanced. Trace prerequisites, reorder premature material.
5. Split substantial mixed forms. Put a small secondary form in a clearly labeled section.

### Placement constraints

- Generated catalogs are never hand-edited; if the fact belongs there, change the generator's source.
- A move is atomic: remove from the old home, add to the new home, and fix every inbound link in the same change.
- Before renaming or moving any doc, grep for inbound references.

## Corpus audit

After the structural pass, hunt slop with the cheapest probes first.

1. **Measure:** word counts to spot outliers and unbudgeted growth.
2. **Hunt reasoning-transcript leakage** with trim-cot-leakage skill (8-class taxonomy, recall batteries, fix rules).
3. **Hunt duplication** by grepping distinctive phrases. Keep one home and replace other copies with links.
4. **Replace hand-written catalogs** and inventories with the authoritative source.
5. **Implemented Decision Records:** remove migration plans, acceptance-task checklists, and future-tense spec language. Keep concise verification contracts that identify the behaviors pinning the shipped decision, plus named coverage gaps.

Keep every load-bearing rule, preferably as one to three lines plus a link to its rationale. Cut stories, duplicates, status notes, and the path used to derive the rule. Do not create a new explanation merely to relocate disposable reasoning.

## Borderline decisions

A case is borderline only when at least two versions satisfy the complete-proposition rule but trade accepted principles. A rewrite with one proposition-preserving answer is not borderline.

In automatic mode: apply clear edits when authorized and report genuine borderline cases without asking. Do not weaken a proposition to make progress.

In interactive mode: group analogous passages under the governing principle. Present two or three viable versions, recommend one, and state the factual or structural difference. Do not offer inferior distractors.

## Workflow

1. Confirm the scope, mode, current branch. Do not inspect unrelated branches.
2. Read this standard and the owning code or document before judging a passage.
3. Inspect the requested scope, not only the largest files. Use searches and word counts to find candidates, then judge passages semantically.
4. Classify each candidate as keep, add, trim, restore, restructure, or defer. Apply clear changes only when the task authorizes edits.
5. Update the owner before derivative artifacts. Re-check analogous passages after learning a new rule.
6. Run the narrow relevant checks: lint, typecheck, git diff --check, and behavior tests for visible strings.
7. Report the inspected scope, clear changes, deliberate keeps, deferred cases, and checks actually run.

## Collaboration

This skill is the standard layer that other skills reference:

- **trim-cot-leakage:** references the complete-proposition rule before deleting leaked prose
- **structured-code-review:** uses this skill's location coverage as a blocking requirement (#1: prose quality)
- **write-spec:** applies this skill's proposition rules to spec and Decision Log documents
