# Decision: Dispatch-loop process, v3

Status: proposed
Date: 2026-09-18
Specs: none — governs the workflow skill repo itself

Location note: this repo has no product `docs/specs/` tree, so its own
governance decisions stay in `docs/decisions/` (same convention as
workflow-governance-v2). The spec-freeze regime itself — the frozen contract,
abandon rules, and deviation classes — is governed by workflow-governance-v2
and is unchanged here.

Supersession note: the reviewer-rejection limit was pinned at "three
consecutive verdicts on one `[Sn]`" by the accepted record
`spec-granularity-and-research-reporting.md` and at `AGENTS.md`'s dispatch
rules. This DR generalizes that limit's unit (see section 3, "Cap semantics")
and therefore partially supersedes both wordings; the supersession marker
lands on the accepted record when this DR is implemented.

## Problem

The `v3` marks the third design iteration of the dispatch-loop process; the
cap and review-gate lineage it amends lives in workflow-governance-v2 and
`spec-granularity-and-research-reporting.md`, not in a v1/v2 process record.
Four structural gaps surfaced by use:

1. **Unattended runs freeze unreviewed specs.** write-spec's autonomous mode
   treats the spec as approved with no independent pass; spec quality rests on
   the main agent's self-check alone, and subjective judgment survives into
   the contract that then drives the whole run.
2. **Slice review is unconditional.** Every `[Sn]` costs a full review round
   regardless of risk, spending reviewer rounds on mechanical slices while the
   durable gate (whole-spec review at PR time) comes only at the end.
3. **Testing has no layer model.** Test requirements are scattered — evidence
   selection in structured-code-review, claim testability in write-spec — with
   no mechanical enforcement at commit time and no defined boundary between a
   fixable red and a run-stopping regression.
4. **GitHub Flow conventions are underspecified.** Branch naming, commit
   routing and format, the many-slice-branches-to-one-PR topology, and PR
   description requirements are absent or ambiguous.

## Proposal

### 1. Spec review gate before freeze

- The spec draft is not committed. The main agent dispatches the reviewer
  (read-only) with the draft, the on-disk requirements, and the Decision
  Log's brainstorm entries. If the requirements are not on disk, the main
  agent writes the baseline first; the baseline quotes the user's goal
  verbatim, and the reviewer receives the original goal text alongside the
  derived baseline — in unattended mode the main agent must not
  self-certify coverage against a baseline it invented.
- The checklist stays owned by write-spec: the reviewer re-runs "Verify the
  spec" adversarially and traces requirement coverage. Items map to blockers
  (untestable claim, missing Global Constraints, coverage gap) and suggestions
  (EARS phrasing, granularity advice); the mapping lives next to the
  checklist.
- Evidence is adapted, not exempt: quoted requirement text plus spec line
  references.
- The loop is review → revise → re-review until approve. Re-review is always
  full-text — incremental re-review is a code-only mechanism. The loop
  contains no testing step.
- Freeze stays mode-dependent. Interactive: the existing user confirmation
  gate remains and sees a reviewed draft; a substantive user edit triggers one
  more review pass. Unattended: review approve is the freeze precondition —
  the spec auto-freezes on approve with no user step (replacing "treat as
  approved"), and the rejection cap stops the run through the existing
  reviewer-rejection-cap stop item.
- Dispatch: glm-5.3 at high effort (pool default after the config-side change
  in section 7).

### 2. Research outline: one-time skeleton review

- When a topic's outline is first produced, the same review machinery runs
  once against the skeleton: sub-question partition, leaf-classification
  probes actually applied, hypothesis testability. The checklist lives in a
  new write-research-outline subsection; verdict semantics, the rejection
  cap, and the dispatch are identical to section 1.
- Leaves start only after approval. Spec leaves cut from an approved outline
  still pass the section-1 spec review at freeze — the skeleton review gates
  decomposition, not leaf contracts. Living outline updates carry no gate;
  direction-level review remains the stage report's job.
- Adding a new top-level branch to an approved outline is a new skeleton: the
  branch receives its own skeleton review before its leaves start. Adding or
  reclassifying leaves inside existing branches does not re-trigger it.

### 3. Tiered slice review

- At spec time the main agent tags each `[Sn]` with a review tier in its
  section header (`**Review tier:** contract | mechanical`): **contract
  slice** (its Claims touch an external contract, Global Constraints, or a
  cross-module boundary) or **mechanical slice** (tests-only, docs,
  mechanical change).
- Contract slices keep the per-slice loop: implement → review → follow-up fix
  (resume the same implementer) → incremental re-review. A contract slice
  merges into the spec branch only after its slice review approves.
- Mechanical slices skip per-slice review, commit with L0/L1 evidence
  (section 4), and merge into the spec branch on that evidence alone. A
  **batch review** — one review of the accumulated diff of all mechanical
  slices merged since the last batch review — runs when a dependency wave
  completes; whole-spec review at PR time (section 5) reviews the entire
  branch including every mechanical slice, so no mechanical slice reaches
  `main` without review. Batch-review findings route to the owning slice's
  implementer (the resume rule applies to any slice). The term "batch review"
  is deliberate: it does not reuse write-research-report's "checkpoint",
  which means a stage-report trigger.
- The spec review verifies the tiering. A tier discovered mis-tagged mid-run
  is corrected procedurally: the slice is handled as a contract slice from
  discovery onward, and the main agent records a Decision Log entry
  (`Phase: implementation`) — the frozen spec text is not edited.
- **Cap semantics.** The rejection cap generalizes across every review this
  workflow runs: 3 consecutive `needs fixes`/`reject` verdicts **on the same
  review object** stop the run. Review objects are: one slice (slice-level
  review), one batch (batch review), the spec branch (whole-spec review), the
  spec draft (spec review), and the outline skeleton (skeleton review). A
  green round on the object resets its counter. Deviation findings never
  count, in any object.
- Invariant: PR merge still requires whole-spec review approve.

### 4. Layered testing

- **L0 focus self-test** — per slice, before commit; enforced by a git
  pre-commit hook. The rule stays harness-neutral: L0 green before a slice
  commit exists.
- **L1 claim mapping** — every Claim maps to at least one named verification
  artifact from write-spec's evidence list (a test name, a `file:line`
  reference, an observable UI state, or a measurable metric); where the
  evidence class is a test, it is a named test the slice's run executes. A
  claim without a mapping leaves the slice unfinished.
- **L2 integration** — at wave completion or after merging into the spec
  branch: cross-slice behavior through real entry paths.
- **L3 full regression** — before PR merge plus CI; never inside a hook.
- The hook script itself ships in `references/workflow/testing.md` as a
  complete, copy-ready script with installation steps (`core.hooksPath` or
  `.git/hooks`), so a product repo bootstraps L0 from the copied references
  tree alone. When changed-file scoping selects no tests (docs-only slices),
  the hook allows with a notice. When a test fails, the hook blocks with the
  failing output.
- Boundaries: the test gate precedes the review gate — red tests return the
  work to the implementer and no reviewer is dispatched. A new test failing
  is a fix loop tracked by its own counter, separate from the reviewer
  verdict cap: 3 consecutive red rounds on the same slice escalate through
  the stop list, and a green commit resets the counter. Previously-green
  behavior turning red is the existing regression stop item, immediately. The
  reviewer's test-strength check stays: passing tests are a presumption,
  semantic review keeps it honest.
- `--no-verify` joins force-push on the banned list (home: the AGENTS.md
  GitHub Flow rules and the stop list, amended at implementation).

### 5. GitHub Flow detail (progressive disclosure)

- Detail moves to `references/workflow/github-flow.md`; both AGENTS.md copies
  keep summary plus pointer. structured-code-review's "Sources of truth"
  gains references to it and to the testing document, so PR-description
  compliance is reviewable.
- Topology: spec branch `spec/<slug>` from main; slice branches
  `spec/<slug>-s<n>` — dependency-free slices branch from main, dependent
  slices branch from the dependency-satisfied point (slice-level stacking,
  merge-only updates, no rebase or force-push; the PR-level rule extends to
  slice level). The main agent merges slices serially in dependency order
  with merge commits; contract slices wait for their slice review approve
  (section 3), mechanical slices wait only for L0/L1 evidence, and the
  whole-spec review approves the complete branch before the PR merges.
- Direct-to-main list: the spec and Decision Log freeze commit, Progress
  updates, and standalone DR transitions. After the freeze, the Decision Log
  and Progress are written only direct-to-main, never on the spec branch, so
  every merge stays clean.
- Commit format: `[S2] feat: <summary>` for a slice's main commit,
  `[S2] review: <what was fixed>` for follow-ups.
- PR description minimum: spec path, per-slice Claims with evidence pointers,
  the deviation list, and the deferred-scope list — the same two lists the
  acceptance gate reports.

### 6. Unattended cost/effect balance

- Bounded loops (the generalized rejection cap) and tiered dispatch (model
  pool) already exist. Added: at each slice or batch-review boundary the main
  agent compares remaining budget with remaining slices — insufficient budget
  stops the run with a report, and the Progress board makes it resumable;
  gates are never degraded to keep running.
- Suggestions are recorded but not chased in unattended mode; only blockers
  are fixed.

### 7. Model-side change

- glm-5.3 `default_effort` drops from max to high; the pool description loses
  the "review at max" wording. Spec review and skeleton review dispatch
  glm-5.3 at high. The config change rides with implementation; if it lags
  the doc changes, the acceptance gate records a partial implementation.

## Alternatives Considered

- **Spec review after freeze** — rejected: collides with frozen-spec
  immutability; findings would force abandon-and-suffix cycles.
- **plan advisor as the spec reviewer** — rejected: advisory output has no
  verdict power, so it is useless as an unattended gate.
- **Outline review at every update or stage boundary** — rejected: the living
  outline has no decision moment to gate, and stage reports already carry
  direction review; the one-time skeleton review targets the actual failure
  mode (systematic mis-decomposition) at one review per topic.
- **Whole-spec review only (no per-slice review)** — rejected: moves detection
  to the most expensive point; rework then spans dependent slices.
- **Fixed-N scheduled batch review** — rejected: N is arbitrary — too late
  for contract slices, too eager for mechanical ones; wave completion is the
  natural batch boundary.
- **kimi PreToolUse hook as the test gate** — rejected: fail-open by design
  with a 600-second cap. Verified empirically that it does fire on subagent
  tool calls, so it stays eligible for notification-class auxiliary use, but
  it cannot be a hard gate. git pre-commit is the hard gate: verified that a
  red commit from a coder subagent is blocked (exit 1) and a green one passes.
- **Skipping incremental re-review for pure rebuttals** — rejected: a rebuttal
  without an opponent is a self-cleared gate.
- **No DR, direct doc edits** — rejected: violates this repo's own governance
  convention.

## Acceptance criteria

- reviewer.md carries a spec-review pass and an outline-review mode; both
  reference checklists owned by write-spec and write-research-outline without
  restating them.
- write-spec: draft-not-committed flow (the freeze commit moves after
  approval), the review loop before the confirmation gate, unattended
  auto-freeze on approve, the blocker/suggestion mapping beside "Verify the
  spec", the L1 claim-mapping rule, and per-`[Sn]` review-tier tags.
- write-research-outline: the skeleton-review subsection exists, including
  the new-top-level-branch re-trigger.
- structured-code-review: an incremental re-review scope section exists, and
  "Sources of truth" references both new reference documents.
- `references/workflow/github-flow.md` and `references/workflow/testing.md`
  exist with the content of sections 4–5; testing.md ships the complete
  pre-commit hook script and its installation steps.
- Both AGENTS.md copies amend every touched rule in its home, not just the
  pointers: the main loop gains the spec-review step; the unattended loop
  description matches tiered review and the pre-PR merge path; the
  rejection-cap line states the generalized per-review-object unit; the
  review-gate line states the tier split; the GitHub Flow bullets gain the
  branch topology, commit format, direct-to-main additions, and the
  `--no-verify` ban; the dispatch-loop parameters gain the budget-balance
  rule; the stop list gains the test-failure escalation wording; README's
  workflow diagram and cap mentions match.
- No gate anywhere requires a user in unattended mode; the only unattended
  user touchpoints are the stop list.
- The dispatch guidance names glm-5.3 at high effort for spec review and
  skeleton review; the user-level config's `default_effort` change is a
  side effect, recorded as a partial implementation if it lags.
- The supersession marker is appended to
  `spec-granularity-and-research-reporting.md`'s status line for the
  generalized cap unit.

## Risks

- Net review rounds are roughly neutral (one spec round per spec, one
  skeleton round per topic, minus per-slice rounds for mechanical slices),
  but mechanical-slice detection moves later — to the batch review or
  whole-spec review. The tradeoff holds because mechanical slices carry
  L0/L1 evidence and both later gates still see their full diff before
  `main` receives the PR.
- The rejection cap changes unit from per-slice to per-review-object; a run
  now stops at most one batch review later than before. Bounded either way,
  and the generalized unit removes the old wording's silence on spec and
  skeleton loops.
- The pre-commit hook adds per-commit latency proportional to focused-test
  runtime; changed-file scoping, the internal time budget, and the
  allow-with-notice path for testless changes keep it small.
- Two new reference documents enter the dispatch kit; without the AGENTS.md
  pointers they stay invisible — the acceptance criteria gate on the
  pointers and on every amended rule home.
- Folding the Decision Log and Progress writes into direct-to-main-only
  removes a writer from the spec branch; the cost is that those updates are
  visible on main before the PR merges, which the one-PR-per-spec convention
  already treats as normal for governance artifacts.
