---
name: structured-code-review
description: >
  Two-layer code review methodology for agent-team workflows. Layer 1: blocking
  requirements checklist (prose quality, docs-match-code, evidence exists).
  Layer 2: semantic check taxonomy (contract tracing, lifecycle/concurrency,
  capability fit, scope necessity, test strength). Reports defects with
  location/impact/evidence, separating blockers from suggestions. Use when
  reviewing any code change — PR, diff, or task output.
type: prompt
whenToUse: When reviewing any code change — PR, diff, spec compliance, or task output — and when acting as or briefing the reviewer agent
---

# Structured Code Review

**This skill is guidance, not a complete checklist.** Prioritize correctness, lifecycle, security, and broken required behavior over style; a short review with one substantiated blocker is better than a list of nits.

Verify the change's base and head before reading the diff. Read enough surrounding code to understand the design — the diff alone does not show intent. Re-establish the base and rerun after a retarget or merge. `git` access is read-only (`diff`/`log`/`show`/`status`/`merge-base`); never run mutating git commands. Reviews face the PR/task branch range rather than a single file.

## Sources of truth

Read the applicable sources before reviewing. Not all will exist in every project — read what is present:

- **Project rules:** `AGENTS.md`, `CONVENTIONS.md`, or equivalent standing rules
- **Defensive patterns:** project-specific defensive-patterns documentation (if present)
- **Prose standard:** prose-quality skill — required coverage and editorial judgment
- **Leakage detection:** trim-cot-leakage skill — reasoning-transcript leakage
- **Testing conventions:** project testing documentation or CI configuration
- **Decision Logs:** `.decisions.md` files — per-feature design rationale
- **Standalone Decision Records:** `docs/specs/decisions/` — cross-feature proposals and decisions (proposed / accepted / rejected states)
- **Spec:** the frozen spec (if this review is part of a spec-loop workflow)

## Layer 1: Blocking requirements

Every review MUST verify these. A single failure blocks the change.

### 1. New prose receives semantic review

Use prose-quality to critically review every added or changed comment, docstring, documentation, prompt, description, diagnostic, and visible string. Use trim-cot-leakage to detect reasoning-transcript leakage. Verify required coverage, accuracy, placement, and editorial quality against the owning code or behavior; automated checks do not establish these properties.

### 2. Docs match the code

Configuration, defaults, errors, wire fields, events, and public behavior update the README and docstrings in the same diff. Comments state non-obvious contracts; flag implementation narration, test walkthroughs, review history, and duplicated rationale for deletion or a link to their one home.

### 3. Core type/interface docs match

Changes to core vocabulary (shared types, interfaces, protocols, schemas) update the appropriate documentation. Internal types need no catalog entry.

### 4. Registrations clean up

Verify each new registration (event listener, subscription, connection, resource handle) has a corresponding cleanup path. Resources that are acquired must be released; subscriptions that are opened must be closed.

### 5. Test assertions are semantic

For every test, require an assertion that verifies external observable behavior — state, output, side effects, events, logs — rather than restating the implementation or trusting an agent's report. Coverage is necessary but not evidence that the scenario is correct.

### 6. Required evidence exists

Verify the author ran the relevant checks for the diff. Use the evidence selection table to determine what is required. CI covers exhaustive coverage; local checks cover the focused scope.

## Layer 2: Semantic checks

Apply these checks where relevant. Not every check applies to every change — use judgment.

### Intent and interface contracts

Trace both sides of every changed interface. Confirm the implementation matches the spec or Decision Record, including errors, cancellation, ownership, and disposal.

### Lifecycle and concurrency

For async setup, callbacks, threads/processes, or teardown, check:
- Races before publication
- Cancellation during awaits/waits
- Independent error reporting (one failure does not swallow another)
- Callback containment (callbacks do not leak into unrelated scope)
- Ownership before reentry
- Complete detach cleanup
- Quiescent disposal (resources fully released before declaring done)

### Capability and consumer fit

Trace every current consumer of the changed interface. Flag:
- Consumer-specific behavior leaking into a generic interface
- The inverse: a new public method on a generic service whose only caller is one internal consumer — this is an unnecessary API expansion. Prefer a private capability closure handed to that consumer at construction instead.

### Scope, ownership, and necessity

Map each abstraction, state machine, option, defensive copy, and compatibility path to its current contract, production consumer, and owning module or service. Challenge:
- Unrelated features bundled into the same change
- Speculative generality (abstractions with no current consumer)
- Over-engineering beyond what the spec requires

### Configuration and public choices

For each default, public operation set, format, or imported external concept, ask: what current-consumer evidence or prior art supports this? Require an explicit choice or deferral when that evidence is absent.

### Enforcement

Follow every denial path (validation, access control, type guards) to the operation that actually executes it. Exercise direct and alternate callers that can bypass schemas, wrappers, facades, or listener ordering.

### Borrowed and derived state

Determine whether each retained value is borrowed or owned under the contract. Trace notifications and every cache, UI echo, replay, and query view to the documented success point and authoritative source.

### Bounds cover the final operation

Locate the owner of the complete emitted or retained result, including wrappers and metadata. Probe:
- Tiny and exact limits
- Oversized single chunks
- Multibyte text for byte limits

### Real entry path

Tests exercise the shipped entry point (CLI, loader, worker, subprocess) where relevant. A hand-mounted module does not catch invalid exports; a function module must have a clear public interface.

### Test strength

Assertions fail on the intended regression and verify external state — logs, events, output, disposal — rather than restating the implementation. A test that only passes because it restates the implementation's current behavior (bug included) is not evidence.

### Decision Record matches shipped reality

When a change implements a proposed standalone Decision Record, the pre-merge
review verifies that the diff satisfies the record's `## Acceptance criteria`
and does not modify the frozen spec file (`docs/specs/<slug>.md`), then reports
the migration as pending. Main-agent governance commits to a feature's
`.decisions.md` or to `docs/specs/decisions/` are not implementer diffs and are
not in scope of this gate. The
main agent executes the migration to `accepted` (transition rules per
manage-decision-records; present-tense text per prose-quality's Decision-artifact
coverage) on main after the change merges; a later review or audit verifies the
migration landed against shipped code. Conversely, flag design choices visible
in the diff that no Decision Record or Decision Log entry covers — report them;
the main agent appends the entry.

### Snapshot and visible-output changes

User-visible or otherwise observable output changes update snapshots or explain why no snapshot applies. Review expected-output diffs as behavior changes, not formatting noise.

### Model-visible changes

For agent-team workflows, inspect the exact prompts, tool schemas, results, and diagnostics the model receives across affected modes. Flag concepts outside the model's task, then verify stable text verbatim and dynamic behavior through snapshots or end-to-end coverage.

### Translation and i18n

For bilingual or internationalized content, compare meaning and terminology on both sides. Automated pairing checks (hash match, structure validation) do not prove translation quality — semantic review is required.

## Evidence selection

Select the smallest tests and checks that cover the outgoing diff. Do not reflexively run the full test suite. Every behavior change needs the narrowest available test or purpose-built check that would fail for its regression; add broader checks only for surfaces the diff actually reaches.

| Change type | Minimum evidence |
|---|---|
| Module/function behavior | Focused test file or test name for the owning module |
| Documentation, comments, prose | Lint + project documentation checks (if configured) |
| Visible output (UI/CLI/strings) | Snapshot test or behavior validation for the affected surface |
| Build config, entry points, manifests | Build + smoke test for the affected artifact |
| External service interaction | E2E test (when credentials/environment available); never print secrets |

Run the full test suite only when: the user explicitly requests it, diagnosing a CI failure, or the change spans the codebase so broadly that no narrower set is credible.

Do not manually repeat a passing check merely because commit or push follows. Use the project's test runner to focus on affected scope:

```sh
# Generic pattern — adapt to project's test framework
<test-runner> <test-file-or-pattern> -- <flags-for-focused-scope>
```

When the owning tests are unclear, use the project's dependency/test-discovery mechanism to find candidates, then inspect the selected tests before treating the run as evidence. Note that test-discovery mechanisms cannot discover behavior reached only through configuration, dynamic loading, subprocesses, workers, built artifacts, or external providers — select those owning tests explicitly. Do not use options that suppress failure reporting, lower coverage thresholds, or narrow scope merely to hide an uncovered affected file. If a local failure looks environment-specific, prove it: record the exact command, failing test, and platform-specific mismatch, confirm the relevant non-platform evidence, and prefer fixing cross-platform nondeterminism. Do not dismiss a local failure hoping CI will differ.

## Reporting findings

State the defect, location, impact, and evidence. Place a localized defect inline on the tightest relevant diff range; use a project-level comment for cross-cutting architecture, scope, or review-wide synthesis.

### Format

**Blocking issues (must fix):**
```
- [defect description] @ file:line
  Impact: [what breaks or what risk is introduced]
  Evidence: [test name | command output | file:line reference]
```

**Suggestions (optional improvement):**
```
- [suggestion] @ file:line
  Rationale: [why this would be better]
```

### Rules

- Separate blockers from suggestions
- Omit issues already enforced by a green gate (passing CI, lint, typecheck)
- When receiving review, verify each claim and fix or rebut it on technical grounds without performative agreement
- Reply in the existing review thread; do not start parallel ones

## Collaboration

This skill is the review layer that orchestrates other skills:

- **prose-quality:** invoked by blocking requirement #1 (prose semantic review)
- **trim-cot-leakage:** invoked by blocking requirement #1 (leakage detection)
- **write-spec:** produces the frozen spec and Decision Log that this review verifies against
- **manage-decision-records:** owns the migration and supersession semantics the "Decision Record matches shipped reality" check verifies
- **simplification-audit:** may reference this skill's lifecycle vocabulary when analyzing asynchronous ownership
- **reviewer agent:** this skill's methodology is what the reviewer agent (or the main agent's review flow) applies as the code quality layer
