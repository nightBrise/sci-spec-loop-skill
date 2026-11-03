---
name: structured-code-review
description: Use when reviewing a code change, a slice or batch diff, a whole spec branch, or subagent task output, and when composing a dispatched-review prompt — supplies the two-layer review methodology, evidence admissibility, the three-state verdict and report format, and the dispatch prompt composition.
---

# Structured Code Review

A review is a verdict backed by evidence, not a reading. It applies two layers in order: blocking requirements every review must verify, then semantic checks applied where the change makes them relevant. Findings are graded, and a short review with one substantiated blocker beats a list of nits.

This is guidance, not a script. Prose review is `skills/prose-quality`'s and leakage detection is `skills/trim-cot-leakage`'s; outgoing evidence selection is `skills/pre-push-checks`'s; the test method is `references/workflow/testing.md`'s and test reliability is `skills/test-reliability`'s; contract semantics are `skills/write-spec`'s and decision lifecycle is `skills/manage-decision-records`'s. This skill owns the review standard itself: the two layers, evidence admissibility, the verdict, the report, and the prompt that dispatches a review.

Governing rule: no evidence, no approve.

## Inputs and exclusions

**Carriers.** The carrier assignment is `AGENTS.md`'s review mechanism; this skill is the standard for code and task-output reviews, whoever carries them.

- **Owner direct review** — spec drafts before freeze, outline skeletons, reports. The owner applies the owning skill's checklist (`write-spec` "Verify the spec"; `write-research-outline` skeleton review) or, for a report, reads it as its intended reader. The code taxonomy below does not apply to an artifact that makes no behavioral claim.
- **Main agent review, or dispatched review, of subagent-written code** — the writer never reviews its own output. The main agent applies both layers itself, or hands a generic read-only subagent the composed review prompt below; whole-branch scope defaults to dispatch.
- **Main-agent self pass** — small prose and small fixes; blocking requirement 1 plus a trim pass is the whole review.

**Review objects.** A slice diff, the accumulated diff of a batch of mechanical slices, a whole spec branch against its base, or a subagent's task output. Name the object before reading; the rejection cap counts per object.

**Inputs.** Read the sources of truth present in the project — not all exist in every project:

- Project rules: `AGENTS.md`, `CONVENTIONS.md`, or the equivalent standing rules.
- GitHub Flow: `references/workflow/github-flow.md` — branch topology, commit format, direct-to-main list; the PR narrative and its minimum items live in `skills/pr-description` — verify description compliance against it.
- Code style: the style document for each language the diff touches, resolved through the language → file index in the project rules (this workflow keeps its entries at `references/style/<lang>.md`).
- Defensive patterns: the project's defensive-patterns documentation, if present.
- Prose standard and leakage detection: `skills/prose-quality`, `skills/trim-cot-leakage`.
- Testing conventions: the project's testing documentation and CI configuration; layers and the gate boundary in `references/workflow/testing.md`.
- Decision Logs: the feature's `.decisions.md`.
- Standalone Decision Records: `docs/specs/decisions/` — proposals and decisions in their three states.
- The frozen spec (`docs/specs/<slug>.md`) and the Decision Log and records it references, when the change belongs to a spec loop.
- For subagent output: the task report, carrying the deviations, deferred scope, and evidence pointers the review reconciles against.
- For a re-review: the prior findings and their dispositions.

**Mode.** Interactive — the owner may overrule a suggestion; blocking findings stand. Unattended — fix blockers only; record suggestions and report them.

**Always excluded.**

- Selecting or running the outgoing evidence set: `skills/pre-push-checks` owns it.
- Test design and reliability: `references/workflow/testing.md` and `skills/test-reliability`.
- Fixing the change: the review reports; the author fixes.
- Rewriting the contract: a contract problem routes through `AGENTS.md`'s four channels.
- A full style audit: the declared-style check is bounded below.

**Exemptions.**

- A small-prose self pass runs blocking requirement 1 only.
- A mechanical-slice batch review may work from the checklist and the reported evidence instead of reading every hunk, provided the evidence exists and covers the accumulated diff.

## The one test

Every blocking finding names the promise it breaks and the evidence that proves the break. A finding that cannot name the promise is a suggestion, not a blocker; a promise the change claims but cannot evidence is not met, whatever the diff looks like.

## Layer 1: Blocking requirements

Every review MUST verify these. A single failure blocks the change; the verdict is never `approve` while one stands.

### 1. New prose receives semantic review

Use prose-quality to critically review every added or changed comment, docstring, documentation, prompt, description, diagnostic, and visible string. Use trim-cot-leakage to detect reasoning-transcript leakage. Verify required coverage, accuracy, placement, and editorial quality against the owning code or behavior; automated checks do not establish these properties.

### 2. Docs match the code

Configuration, defaults, errors, wire fields, events, and public behavior update the README and docstrings in the same diff. Comments state non-obvious contracts; flag implementation narration, test walkthroughs, review history, and duplicated rationale for deletion or a link to their one home.

### 3. Core type/interface docs match

Changes to core vocabulary (shared types, interfaces, protocols, schemas) update the appropriate documentation. Internal types need no catalog entry.

### 4. Registrations clean up

Verify each new registration (event listener, subscription, connection, resource handle) has a corresponding cleanup path. Resources that are acquired must be released; subscriptions that are opened must be closed.

### 5. Test assertions are semantic

For every test, require an assertion that verifies external observable behavior — state, output, side effects, events, logs — rather than restating the implementation or trusting an agent's report. Coverage is necessary but not evidence that the scenario is correct. Reliability criteria — isolation, determinism, quiescent teardown, and a proven regression — are `skills/test-reliability`'s; a concurrency- or resource-heavy test that fails them is a finding.

### 6. Required evidence exists

Verify the author ran the checks the changed surface requires; `skills/pre-push-checks` selects them. The reported evidence must exist and cover the changed surface; admissibility is defined below. CI covers exhaustive coverage; local checks cover the focused scope. A pending, skipped, suppressed, or unrun check is not evidence.

### 7. Claims are accounted for

When a frozen spec governs the change:

- Read the spec, its `.decisions.md`, and every standalone Decision Record the spec or log references.
- For every `[Sn]` the diff touches, enumerate the Claims; each Claim is implemented with evidence pointing at the code, or reported unmet with the recorded deviation as its explanation.
- `## Global Constraints` and `## Out of Scope` are not violated.
- Behavior that no Claim covers is a finding — deferred scope or an uncovered design choice. Report it; the main agent records the entry or routes a contract change.
- A Claim left unmet by a deviation recorded in the task report is a finding for the acceptance gate, not a blocking defect, and it never counts toward the rejection cap.
- The diff does not edit the frozen spec (`docs/specs/<slug>.md`).

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

Assertions fail on the intended regression and verify external state — logs, events, output, disposal — rather than restating the implementation. A test that passes only because it restates the implementation's current behavior, bug included, is not evidence. The reliability criteria this check applies are `skills/test-reliability`'s: isolation (atomic resource allocation, never serialization), determinism, quiescent teardown, and a proven regression.

### Decision Record matches shipped reality

When a change implements a proposed standalone Decision Record, the pre-merge review verifies that the diff satisfies the record's `## Acceptance criteria` and reports the migration as pending. Main-agent governance commits to a feature's `.decisions.md` or to `docs/specs/decisions/` are not implementer diffs and are not in scope of this gate. The main agent executes the migration to `accepted` (transition rules per `skills/manage-decision-records`; present-tense text per `skills/prose-quality`'s Decision-artifact coverage entry) on main after the change merges; a later review or audit verifies the migration landed against shipped code. Conversely, flag design choices visible in the diff that no Decision Record or Decision Log entry covers — report them; the main agent appends the entry.

### Snapshot and visible-output changes

User-visible or otherwise observable output changes update snapshots or explain why no snapshot applies. Review expected-output diffs as behavior changes, not formatting noise.

### Model-visible changes

For agent-team workflows, inspect the exact prompts, tool schemas, results, and diagnostics the model receives across affected modes. Flag concepts outside the model's task, then verify stable text verbatim and dynamic behavior through snapshots or end-to-end coverage.

### Translation and i18n

For bilingual or internationalized content, compare meaning and terminology on both sides. Automated pairing checks (hash match, structure validation) do not prove translation quality — semantic review is required.

### Declared style conformance

Resolve the style document for each language the diff touches through the language → style-file index in the project's standing rules, and read it. Verify only its always-applicable core items:

- Naming conventions
- Language and presence of comments and docstrings
- Line width
- Function length

This is not a full style audit: everything the resolved document states outside these four items stays out of this check, the green-gate exclusion in the reporting rules applies, and each item carries the modality its own document gives it — a stated preference is not a requirement. Report violations as findings with `file:line` evidence; they rank below correctness, lifecycle, and security defects and do not block a change on their own.

## What this is not

- **Not the outgoing evidence set.** Selection and execution belong to `skills/pre-push-checks`; a review admits or rejects the evidence it is given.
- **Not a test-design authority.** The test method is `references/workflow/testing.md`'s and reliability is `skills/test-reliability`'s.
- **Not a fix round.** Findings are reported; the author fixes them. A fix applied by the main agent re-enters review as a new diff.
- **Not a contract rewrite.** A contract problem routes through `AGENTS.md`'s four channels; the review reports the mismatch and does not amend the spec.
- **Not a full style audit.** The declared-style check is bounded and never vetoes a merge on its own.
- **Not a proof of correctness.** Judgment is required; an absence of findings is not a guarantee.

## Specialized mechanisms

### Read-only review discipline

The review is read-only in every respect. File reads and a git whitelist — `diff`, `log`, `show`, `status`, `merge-base`, `rev-parse` — are the available commands; never run a mutating git command, and never write a file, including through shell redirection. The final message is the complete review report for the caller. Verify the base and head before reading the diff; after a retarget or merge, re-establish the base and rerun.

### Evidence admissibility

Outgoing-change evidence selection is `skills/pre-push-checks`'s; this skill consumes the selection and rules on what may count.

- Admissible: a named test that exercises the changed behavior (file and test name); command output reproducing the claim; a `file:line` reference the caller can open.
- Not admissible: prose, a plan, an intent statement, a task report's self-description, "tested locally" without a command and result, or a pointer that does not resolve.
- A skipped, suppressed, or silently narrowed check is not evidence; a pending check is reported as pending.
- The review verifies that evidence exists and covers the changed surface; it does not re-run the suite. Re-running a targeted check to settle a rebuttal is allowed, and its output is evidence.
- No evidence, no approve: the verdict caps at `needs fixes` until the promise is evidenced.

### Incremental re-review

A re-review covers the diff from the last review head to the current head, plus the disposition of every prior blocker — each fixed or rebutted on technical grounds. Approved scope is not reopened unless the fix touches it. A rebuttal always receives a review round. For a batch review, the scope is the accumulated diff since the last batch review, and each finding routes to the owning slice's implementer. After a retarget or merge, re-establish the base and rerun.

### Dispatch-review prompt composition

A dispatched review is a generic read-only subagent carrying a composed prompt. Compose four blocks and no more; the methodology is loaded, never paraphrased into the prompt.

1. **Read-only constraints.** State the available tools and permissions: file reads and the git whitelist above; never write a file, including through shell redirection; never run a mutating git command. Require the final message to be the complete, self-contained review report.
2. **Methodology.** Instruct the subagent to load `structured-code-review` and apply its two layers, evidence admissibility, and report format. Do not restate the methodology in the prompt — a second copy drifts from this skill.
3. **Review object.** Give the frozen spec path, its `.decisions.md`, and every referenced standalone Decision Record; the diff range (slice `base..head`, the accumulated range since the last batch review, or the whole branch against its base for a whole-spec review); and what lies outside the review scope. For task output, attach the task report so a recorded deviation is distinguished from an unexplained unmet Claim.
4. **Verdict contract.** Require the three-state verdict, the evidence rule (no evidence → never `approve`), the findings format, the review object named for the rejection cap, and the report content. Never accept a verdict that lacks evidence; send it back for the missing proof.

- Dispatch to a model satisfying the review role's relative constraint (`AGENTS.md`, model rules); the mapping lives in the harness adapter. Never name a model in the prompt.
- The prompt names paths, scope, and the contract; judgment stays with the methodology.

### Verdict and report format

Three states:

- `approve` — no blocking finding; suggestions may remain open.
- `needs fixes` — at least one blocking finding that the author can fix within the reviewed scope.
- `reject` — the approach fails its contract, or a fix requires a design decision outside the reviewed scope; state what would have to change.

State the defect, location, impact, and evidence. Place a localized defect inline on the tightest relevant diff range; use a project-level comment for cross-cutting architecture, scope, or review-wide synthesis.

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

Rules:

- Separate blockers from suggestions.
- Omit issues already enforced by a green gate (passing CI, lint, typecheck).
- When receiving review, verify each claim and fix or rebut it on technical grounds without performative agreement.
- Reply in the existing review thread; do not start parallel ones.
- Three consecutive rejections of the same review object stop and report (`AGENTS.md` stop list); an `approve` resets the count, and deviation findings do not count toward it.

## Workflow

1. Identify the carrier and the review object; for a re-review, set the range from the last review head.
2. Confirm base and head, and read the sources of truth that exist.
3. Read the diff and enough surrounding code to state the design; the diff alone does not show intent.
4. Run Layer 1; a single failure blocks. When a spec is in scope, enumerate the Claims of every touched `[Sn]`.
5. Run the Layer 2 checks the change makes relevant.
6. Admit evidence; mark each promise evidenced, unmet, or unevidenced.
7. Write the findings and the verdict: verdict, blockers with location/impact/evidence, suggestions, unevidenced Claims, the coverage boundary, and for a batch, the owning slice per finding.
8. For a dispatched review, compose the prompt from the four blocks and verify the returned report is self-contained and evidence-backed.

**Report content.** The verdict; every blocker with `file:line` and evidence; suggestions kept separate; the Claims accounted for; the coverage boundary — independently state what the change handles and explicitly leaves out, unverified assumptions included; where a task report exists, compare against its statement, and a mismatch is a finding; the owning slice for each finding in a batch review; and every check reported pending or not run.

## Collaboration

- **`skills/prose-quality` / `skills/trim-cot-leakage`:** supply the prose and leakage passes that Layer 1 requirement 1 invokes.
- **`skills/pre-push-checks`:** owns outgoing-change evidence selection and the push gate; this skill owns review-side admissibility of the evidence it receives.
- **`skills/test-reliability`:** owns the reliability criteria the test-strength check applies.
- **`references/workflow/testing.md`:** owns the test method, the L0–L3 layers, and the test-gate/review-gate boundary.
- **`skills/write-spec`:** owns Claims, `## Global Constraints`, `## Out of Scope`, and the after-freeze procedures; the four channels are routed by `AGENTS.md`.
- **`skills/manage-decision-records`:** owns decision lifecycle and the migration/supersession semantics the "Decision Record matches shipped reality" check defers to.
- **`skills/simplification-audit`:** cites this skill's lifecycle and concurrency vocabulary and is judged by its review standard.
- **`references/style/`:** the per-language style documents the declared-style check resolves and reads; those documents own the rules they state.
- **`AGENTS.md`:** owns carrier assignment, the acceptance gate, the stop list, the model rules, and the four change channels.
- **`skills/pr-description`:** hosts the claims-deviation and deferred-scope lists the acceptance gate reconciles.
