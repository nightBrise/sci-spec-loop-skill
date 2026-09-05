# Decision: Spec granularity, deferred scope, research reporting, and style enforcement

Status: accepted
Date: 2026-09-05
Specs: none — governs the workflow skill repo itself

Like `workflow-governance-v2.md` in this directory, this record governs the workflow
repo itself, which keeps governance records in `docs/decisions/` rather than in a
product `docs/specs/` tree (see `AGENTS.md`). It supersedes nothing: the spec-freeze
regime that `workflow-governance-v2.md` retains stays in force, and the
deferred-scope decision below widens the exits from a frozen spec without touching
freeze semantics.

## Problem

The spec trigger read "a task spanning 2+ files or 2+ steps", which almost every
small change satisfies, and each firing produced a frozen spec plus its Decision Log
— the main source of `docs/specs/` growth. Beside it, "when in doubt, keep one spec"
read as permission to split, and "deliverable change" was never defined.

A frozen spec had one exit, abandon, conflating a contract that is **wrong** (a Claim
infeasible, or requirements substantially changed, so the frozen `[Sn]` no longer
hold) with one that is **incomplete** (adjacent work the freeze did not foresee,
every `[Sn]` still holding and verifiable). Abandoning the second kills a merely
inexhaustive spec and yields a new slug, spec, and Decision Log, the old pair staying
on disk: enlarging specs to reduce churn made abandon likelier, and both pressures
grew the document count.

The research layer produced living outlines, one-line leaf conclusions, and a
deep-dive report specified only by path. Nothing aggregated findings across leaves,
so a topic gave its owner no readout to steer direction by.

Dispatch guidance referenced three undefined things: the task report an implementer
returns, when a read-only advisor is worth dispatching, and the reviewer-rejection
limit the stop list names without a number — leaving an unattended run unable to
decide whether to stop.

The Python style document sat at the repository root, where its position read as
universal coverage, and no review path consumed it: `agents/reviewer.md` never
mentions style, `structured-code-review` ranks correctness above style, and no Layer
1 blocking requirement covers it, while `AGENTS.md` declares conformance mandatory.

## Decision

- **The spec trigger is four criteria, any one sufficient** (home:
  `skills/write-spec/SKILL.md`, opening section): the task changes an external
  contract, spans 2+ modules that cannot roll back as one unit, will run unattended,
  or needs a trade-off decided between defensible designs; mechanical multi-file
  edits are exempt. Rationale: the test becomes whether a contract needs arbitration
  rather than how large the diff is, and the unattended criterion gives long
  autonomous runs a contract as their only backstop.
- **One spec holding several `[Sn]` is the default, not the fallback** (home:
  `skills/write-spec/SKILL.md`, its section rules for `[Sn]`). A spec splits only
  when all three split criteria hold at once, and that section supplies the
  operational definition of a deliverable change: the smallest unit that merges
  alone, rolls back alone, maps to one PR, and whose acceptance a set of Claims
  expresses completely. The size limit stays implicit and numeric-free — one PR still
  reviewable end to end with `main` deployable after the merge — so `[Sn]` that must
  merge in separate batches are the signal to split. Rationale: cohesion and
  reviewability are the criteria, and neither reduces to a count.
- **Deferred scope is a first-class exit that does not abandon** (home:
  `skills/write-spec/SKILL.md`, `## Frozen spec rules` and `## Decision Log rules`,
  which hold the entry format and the guardrail against abuse; the `AGENTS.md` stop
  list carries the boundary note). Work discovered during implementation falls into
  three classes: absorbed by an existing Claim, so an implementation detail recorded
  as a design-choice entry; contradicting a Claim or `Global Constraints`, so a wrong
  contract that goes to abandon; or neither, so adjacent scope recorded as a
  deferred-scope entry in the Decision Log while the frozen spec ships as-is — no new
  section, no edited word, no abandon. After the PR merges the main agent decides
  whether the collected entries become one follow-up spec, several, or none. Deferral
  never stops a run: an unattended run records the entry, continues, and reports the
  deferred list at the acceptance gate with the evidence. Rationale: freeze semantics
  need no change — the Decision Log is already unfrozen and accepts
  implementation-phase entries, so deferred scope only names an existing channel. The
  regime `workflow-governance-v2.md` records as accepted is preserved, not
  superseded.
- **The research reporting layer is a skill in its own right** (home:
  `skills/write-research-report/SKILL.md`). It owns three report forms — stage
  (checkpoint-driven, cross-leaf), overall (once at topic closure), and deep-dive
  (single leaf, which gives that report's specification a home) — and the boundary
  against the outline: the outline stays the living board and the single source of
  truth for leaf status, a report is a point-in-time deliverable never edited once
  written, reports interpret rather than restate the outline, they sit outside
  manage-decision-records governance, and their recommendations become work only as
  spec leaves frozen through write-spec. Dead-end leaves carry the same reporting
  rigor as resolved ones. Rationale: the repository owner steers direction and
  consolidates findings through these reports, the research layer's most important
  deliverable.
- **Dispatch is guidance, and three dangling definitions are filled** (home: the
  dispatch rules in `AGENTS.md`). No prompt template ships with the repo; the rules
  state what to attach per task type and leave assembly to the main agent. They
  define the task report's minimum contents (deviations from Claims, deferred scope
  found, evidence pointers), the advisor trigger (three consecutive failures to reach
  the same goal), and the reviewer-rejection limit (three consecutive `needs fixes`
  or `reject` verdicts on one `[Sn]` stop the run and escalate). Rationale: harness
  independence is this repo's claim, so a dispatch prompt's shape belongs to the
  harness and the task.
- **The style document moves under a language index and gains a review-side hook.**
  The Python text lives at `references/style/python.md` with its content preserved,
  so the Chinese-language rule for comments, docstrings, and TODOs has that file as
  its home. The always-loaded layer (`AGENTS.md`, coding rules) keeps four general
  principles, a language → style-file index, and a fallback: an unlisted language
  follows the project's own conventions, and a product repo's index outranks the
  global one. The hook is `### Declared style conformance` in
  `structured-code-review` Layer 2, which resolves the style file through that index
  and verifies only the document's always-applicable core items, at the modality the
  document gives each. Rationale: Layer 2 placement avoids contradicting this
  workflow's style-deprioritized principle, and the index makes disclosure
  progressive — a Python-only document loads only when the diff touches Python.

## Alternatives Considered

- **Keep the 2+ files / 2+ steps trigger and add only a merge preference** —
  rejected: it controls the size of a spec but not how many come into existence, so
  the growth source stays.
- **An explicit numeric cap on `[Sn]` per spec** — rejected: a stated number becomes
  a target rather than a guardrail, so authors fill the quota and split mechanically
  on exceeding it, manufacturing the specs the cap was meant to prevent.
- **Section-level freeze** — `[Sn]` freeze independently and the spec file accepts
  draft sections during implementation — rejected: it collides with five established
  invariants.
  1. `AGENTS.md` GitHub Flow binds one spec to one branch and one PR; sections frozen
     at different times deliver at different times, so a spec maps to several PRs or
     to one PR open for its whole life.
  2. `AGENTS.md` ends an unattended run by merging after the whole spec passes; a
     growing spec gives "the whole spec" no determinate meaning, so autonomous
     termination fails.
  3. `AGENTS.md` gates merges on the diff not touching `docs/specs/<slug>.md`;
     appending a draft section touches that file, and excepting it removes the teeth
     of a gate whose purpose is that the implementing side cannot change the
     contract.
  4. The spec-compliance procedure in `agents/reviewer.md` enumerates Claims per
     `[Sn]` from the frozen spec; section-level freeze makes the reviewer first
     determine which sections are frozen, adding a state dimension to every review.
  5. `workflow-governance-v2.md` states that the spec-freeze regime is retained
     unchanged and is `accepted`; section-level freeze requires formally superseding
     that accepted record.
  Governance also keeps implementers from ever writing `docs/specs/*`, and under
  section-level freeze the contract grows while it is being executed — a moving
  target at review time, precisely what the freeze mechanism exists to prevent.
  Rebuilding a flexible change regime to route around an incomplete contract, at the
  price of overturning accepted governance, is a trade that does not close.
- **A spec per unit of work** — one research topic or one PR series as one spec,
  accumulating `[Sn]` across sessions — rejected: it conflicts with freeze semantics
  directly, since such a spec either stays unfrozen for life or requires
  section-level freeze, rejected above.
- **Extend `write-research-outline` with a reports section** — rejected: that skill is
  the research layer's only owner and would mix two lifecycles, a continuously
  updated board and a deliverable frozen once written, and its name would no longer
  describe what it holds.
- **One `write-report` skill covering research reports, task reports, and delivery
  summaries** — rejected: the widest scope of the options, reaching into
  trim-cot-leakage's surface tolerance table, the dispatch rules, and the GitHub Flow
  PR-description conventions; the task-report hollow it would fix is a definition,
  filled in the dispatch rules instead.
- **Implementer and reviewer prompt templates** — rejected: templates harden
  harness-specific dispatch shapes into a repo that claims harness independence, and
  remove the main agent's ability to match the prompt to the task.
- **Promote the style document to a skill (`skills/code-style/`)** — rejected: coding
  style applies to nearly every implementation task, so its trigger would be close to
  always true and on-demand loading would buy nothing.
- **Keep the style document at the repository root and add only the review hook** —
  rejected: a Python-only document in the top-level position reads as a general norm,
  and the root offers nowhere to put a second language.

## Consequences

- Freeze semantics are unchanged, so every consumer of the frozen spec — the merge
  gate, the reviewer's Claims enumeration, unattended termination — keeps working as
  specified; the only machinery added is an entry type in an artifact already
  unfrozen.
- Spec count falls and individual specs grow. The acceptance gate reads a deferred
  list alongside the evidence, and the post-merge follow-up decision belongs to the
  main agent. Deferral depends on the implementer reporting upward, and no check
  distinguishes "no adjacent scope found" from "scope not reported" — a named
  coverage gap.
- Of the four trigger criteria, the trade-off criterion is the judgment call, and a
  task meeting only it is the borderline case for whether a spec is required.
- Unattended runs gain determinate stops where the stop list named an unquantified
  limit, and the task report has a minimum contract the acceptance gate reconciles
  against.
- Style findings carry `file:line` evidence, rank below correctness, lifecycle, and
  security defects, and do not block a merge on their own: a style document gains
  authority at the acceptance gate without gaining veto power.
- Reports are a deliverable class outside decision governance, and their chain is a
  history because a written report is never edited — corrections cost a new stage
  report.
