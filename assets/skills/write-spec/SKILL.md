---
name: write-spec
description: Use when a build work item starts, or when a live spec meets a deferred-scope, amendment, abandon, or preregistered-criterion finding. Owns the contract — [Sn] slices, Claims, Global Constraints, Out of Scope, freeze, and the after-freeze change procedures.
---

# Write Spec

A spec is the promise a build work item is dispatched against. It turns
requirements into a frozen contract: `[Sn]` slices an implementer can take
whole, Claims that are both the behavior and its acceptance criterion, and
boundaries that say what the change is not. Requirements behind it are inputs;
the frozen text is what implementation and review answer to.

This is guidance, not a script. The judgments below decide what to promise and
whether a slice is dispatchable; a spec that passes them can still promise the
wrong thing.

- **Routing:** `AGENTS.md` owns triage and four-channel routing; this skill
  supplies the contract and the channel procedures.
- **Decisions:** `skills/manage-decision-records` owns entry format,
  supersession, epitaphs, and the Progress tree.
- **Records:** `skills/record-discipline` owns the ticket, source/projection,
  and revision style; Claims are source, evidence is a pointer.
- **Review:** `skills/structured-code-review` owns the freeze-gating review and
  its evidence standard; this skill owns what is reviewed.
- **Governing rule:** promise only what can be verified against evidence; freeze only what
  was reviewed.

## Inputs and exclusions

**Inputs.**

- The requirements: dialogue, design doc, issue, or a converged spec leaf
  (`skills/write-research-outline`).
- The requirements baseline: the owner's goal quoted verbatim, plus the derived
  requirements.
- Existing records on the topic: `docs/specs/*.md`, their `.decisions.md`,
  standalone Decision Records.

A missing required input is reported and stops the write; never infer the
baseline or the requirements from context.

**Scope.** One deliverable change, from requirements to the freeze commit, plus
the after-freeze channels for that spec.

**Mode.** Interactive — the owner approves the freeze and rules on amendments
and abandons. Unattended — an `approve` verdict freezes, and an amendment or
abandon request stops the run.

**A spec is required when any one holds.**

- It introduces or changes an external contract — API, data format, config
  schema, protocol, or CLI surface.
- It spans 2+ modules that cannot roll back as one unit.
- It will run unattended; the frozen text is the only backstop.
- Two or more defensible designs must be chosen between before implementation.

The build-versus-explore route is `AGENTS.md`'s; this list decides spec versus
no spec.

**Always excluded.**

- Triage, dispatch, and acceptance: `AGENTS.md` and `skills/pr-description`.
- Decision format, lifecycle, and retention: `skills/manage-decision-records`.
- Review method, verdicts, and evidence: `skills/structured-code-review`.
- Preregistration content and its freeze: `skills/write-research-outline`.
- Git topology, push, and merge: `references/workflow/github-flow.md`,
  `skills/pre-push-checks`, `skills/merge-stack`.

**Exemptions.**

- Mechanical multi-file edits need no spec: renames, reformatting, dependency
  upgrades, tests for existing behavior; file count never triggers a spec.
- A fix with no new Claim and no contract change is applied directly
  (`AGENTS.md`, Role contract).
- An existing frozen spec is never duplicated; its changes route through
  After freeze.

## The one test

**The dispatch test.** Could an implementer who never spoke to the owner take
one `[Sn]` from the frozen text and know what to build and when it is done —
every Claim quotable, the boundary stated, the dependencies resolvable, the
required evidence nameable? Any question sent back to the author is a failure.

A spec passes only when every `[Sn]` passes; one undispatchable section blocks
the freeze.

## Taxonomy

Slice kinds, by what the Claims touch:

| Kind | Sign | Disposition |
|---|---|---|
| Contract | A Claim touches an external contract, a Global Constraint, or a cross-module boundary | Reviewed before merging into the spec branch |
| Mechanical | Tests-only, docs-only, or a mechanical edit | Merges on L0/L1 evidence; batch-reviewed |

Merge rules and evidence tiers: `references/workflow/github-flow.md`,
`references/workflow/testing.md`.

Ways a draft fails:

| Defect | Sign | Disposition |
|---|---|---|
| Untestable Claim | No test, command output, `file:line`, or observable state could contradict it | Rewrite as an observable promise or cut it |
| Compound Claim | Two outcomes in one sentence | Split into separate Claims |
| Strategy in a Claim | A library, algorithm, or structure the outcome does not require | Move the choice to a decision entry |
| Requirement gap | A baseline requirement no Claim answers | Add a `[Sn]` or a Claim; never a note |
| Contract prose | Motivation, data, history, or explanation inside contract text | Move it to its home |

Calibration pair:

- `WHEN the operator confirms a correction THEN the system SHALL write the
  strengths to the magnet controller.`
- `Orbit correction should work well and be fast.` — two promises, a
  preference, no observable outcome.

## Negative definition

- **Not a plan.** `[Sn]` is a contract unit, not a phase, schedule, or task
  breakdown.
- **Not a design document.** Rationale, alternatives, and trade-offs live in
  decision entries.
- **Not a findings file.** Data, measurements, and test counts live in evidence
  files; the spec points at them.
- **Not a history.** No changelog, no inline correction; amendments append, git
  holds the past.
- **Not a test plan.** Claims name behavior and its evidence class; test design
  is `references/workflow/testing.md`.
- **Not the review.** Freeze consumes a verdict
  (`skills/structured-code-review`).
- **Not a preregistration.** Explore criteria belong to
  `skills/write-research-outline`; a restating Claim inherits strong freezing.
- **Not a requirements transcript.** The baseline is an input; the frozen text
  is the promise.

## Specialized mechanisms

### One deliverable, one spec

- One spec = one deliverable change: it merges alone, rolls back alone, maps to
  one PR, and its Claims express its acceptance completely.
- `[Sn]` are its internal dispatchable units; one spec normally holds several.
- Split into a second spec only when all three hold: no contract coupling,
  independent ship and rollback, a different outcome.
- The size ceiling stays implicit: one PR must carry the spec and be reviewable
  end to end, with `main` deployable after the merge.
- Separate merge batches needed to keep `main` deployable signal a split;
  `[Sn]` count never does — cohesion is the criterion.

**Paths.** `docs/specs/<slug>.md`, `docs/specs/<slug>.decisions.md`, and
`docs/specs/decisions/` for standalone records; a project may register another
spec directory in its `AGENTS.md`.

**Slug.** Kebab-case feature name; a rewritten spec takes a new slug.

### The spec skeleton

```markdown
# <Feature> spec

**Status:** frozen

## [S1] <title>
**Review tier:** contract
**Dependencies:** [S0]          <!-- omit when none -->

### Claims
- C1: <promise sentence>

## Global Constraints
- <rule binding every slice>

## Out of Scope
- <behavior a reader would otherwise assume is included>
```

- One `[Sn]` = one dispatchable unit: one implementer, one slice branch, one
  main commit (`references/workflow/github-flow.md`).
- Every `[Sn]` carries a review tier, an optional dependency list, and at least
  one Claim; a section without Claims gains one or merges into another.
- A tier found wrong mid-run is handled as contract from discovery onward,
  recorded in a decision entry; the frozen text is not edited.
- `Dependencies` lists the `[Sn]` that must land first; the section stays
  pending until they are done.
- `Global Constraints` and `Out of Scope` are mandatory; the spec carries no
  decisions and no `## Decisions` section.

### Claims

- A Claim is a promise sentence: imperative, one actor, one action, one
  observable outcome.
- A Claim is both behavior and acceptance criterion; never duplicate it in an
  Acceptance section.
- Claims are quoted verbatim into the implementer brief and enumerated by
  review; write each to stand alone.
- A Claim is verifiable when a test, command output, `file:line`, observable
  state, or metric could prove it; the PR carries the actual pointer.
- Write obligations with `SHALL`; never use `should`, `may`, or `ideally`
  inside a Claim.
- EARS (`WHEN <trigger> THEN <system> SHALL <response>`) is permitted, not
  mandatory; bounds and limits are Claims without it.
- One Claim lives in exactly one `[Sn]`, numbered C1..Cn within it; amendments
  refer to it by that number.

### Contract text

- Contract text is promise and boundary only: what is delivered, how it is
  measured, what is excluded.
- Never write motivation, data, history, or explanation. Homes: decision
  entries (why), evidence files (data), reports (narrative), git (past).
- Never embed measured results, test counts, or data tables; a performance
  bound is a promise, a reading is evidence.
- A sentence that changes neither what is built nor what is accepted is not
  contract text; cut it.
- Never add an inline correction or "previously" note; Amendment is the only
  revision channel (`skills/record-discipline`).

### Global Constraints and Out of Scope

- `Global Constraints` binds every `[Sn]`: naming, dependency policy, framework,
  performance floor, compatibility.
- Write at least one; an empty section leaves the spec without a binding rule.
- `Out of Scope` names behavior a reader would otherwise assume is inside:
  excluded capabilities, adjacent fixes, deferred formats.
- Either section changing after freeze is a substantive change
  (`AGENTS.md`, boundary notes).

### Freeze

- Freeze is one commit: the spec and its `.decisions.md`, direct to `main`
  (`references/workflow/github-flow.md`).
- Never commit the draft before the freeze.
- Gate: the owner's approval in interactive mode; an `approve` verdict from the
  dispatched review in unattended mode (`skills/structured-code-review`).
- The pre-freeze review re-runs the dispatch test and the defect taxonomy
  against the draft.
- Never freeze an unreviewed draft, or one whose latest verdict is
  `needs fixes` or `reject`.
- Re-review after revision is full-text; incremental re-review is code-only.
- Three consecutive `needs fixes`/`reject` on the draft stop the run.
- The `.decisions.md` is never frozen; entries keep accumulating (format:
  `skills/manage-decision-records`).
- After freeze the spec is point-in-time: immutable except through Amendment
  (`skills/record-discipline`, refresh exemption).

## After freeze

After freeze the spec is a frozen contract; the Decision Log is not. Every
finding touching a Claim routes through one of the four channels (`AGENTS.md`,
Contract changes after freeze); this section owns the deferred-scope,
amendment, abandon, and preregistered-criterion procedures. A deviation needs
no procedure here: record it, finish the `[Sn]`, and let the acceptance gate
rule.

Never edit the frozen spec in place and never leave an inline correction; the
amendment batch or the epitaph is the record. Boundary notes — deviation versus
contract error, substantive change on `Global Constraints` or `Out of Scope`,
attribution anchor — are `AGENTS.md`'s. These channels cover contract changes
only; a spec whose Claims all pass while the topic's value collapses is a
closing-gate and `simplification-audit` question.

### Deferred scope

Use when work discovered during implementation is covered by no frozen Claim
and contradicts no frozen Claim; every `[Sn]` still holds.

1. **Classify.** A Claim that obliges the work makes it an implementation
   detail: do it and record a decision entry. A Claim it contradicts makes it a
   contract error: stop. Only the third answer is deferred scope.
2. **Record the entry** in `.decisions.md`
   (`skills/manage-decision-records`), naming the nearest Claims and why none
   covers the work.
3. **Ship the spec as-is** — no new `[Sn]`, no edited word, no abandon.
4. **Report it** at the acceptance gate with the deviation list; deferred scope
   never stops a run.
5. **Dispose after the merge**: fold the spec's entries into one follow-up
   spec, several, or nothing.

If you cannot name why no Claim covers the work, it is an implementation
detail, not deferred scope.

### Amendment

Use when the measure is wrong and the deliverable is unchanged.

1. **Judge the nature.** Changing how the deliverable is measured — method,
   calibration, acceptance operation — is an amendment; changing what is
   delivered — capability, scope, goal — is an abandon; unsure goes to the
   owner.
2. **Check hard boundaries.** A change touching `Global Constraints` or
   `Out of Scope` is substantive: stop and take the owner's ruling. A
   preregistered criterion never enters this procedure.
3. **Compute the information duty.** Count every amendment batch on this spec,
   including the requested one; summarize original versus current Claims.
   Present both in the ruling request.
4. **Check the cumulative trigger.** The third amendment, or any amendment
   touching ≥3 Claims, forces a whole-contract ruling: original and current
   Claims side by side, owner decides continue or abandon. An alarm, not a
   quota.
5. **Take the ruling.** Unattended, an amendment request is a stop ("needs user
   judgment"). The owner approves with new criteria text or declines; never
   self-approve.
6. **Append the batch** at the end of the spec: number, replaced Claims, new
   promise sentences, decision pointer. Original Claims stay untouched.
7. **Record the decision entry** and supersede the old criteria in the log
   (`skills/manage-decision-records`); never mark the correction in the Claim.
8. **Re-freeze** by naming the amendment's decision entry on the status line.
   The owner's ruling outranks the pre-freeze gate, which is not re-run.

```markdown
## Amendment 1 — <what changed>
**Replaces:** C2 in [S1]
**New criteria:** C2: <promise sentence>
**Decision:** D7
```

### Abandon

Use when the foundation is gone: the deliverable definition changed.

1. **Confirm premise failure.** Claims contradicting each other, implementation
   contradicting a frozen Claim, substantially changed requirements, or a
   preregistered criterion that must change. An infeasible Claim is a
   deviation; a correct-but-incomplete contract is deferred scope.
2. **Take the owner's ruling.** Unattended, an abandon request is a stop; never
   self-abandon.
3. **Write the epitaph** in a surviving decision home
   (`skills/manage-decision-records`): slug, reason, historical pointer, and
   the mandatory review condition.
4. **Write the review condition or stop.** It states when the decision should
   be reopened; with none, the author has not settled permanent versus current
   infeasibility — re-judge, it may not be an abandon.
5. **De-link inbound references.** Every pointer to the spec, log, or plan
   becomes a standalone statement or an epitaph pointer
   (`skills/trim-cot-leakage`, Class 1 fix); no surviving pointer, the Progress
   node included, may target a deleted file.
6. **Delete the process artifacts** — spec, `.decisions.md`, PLAN, other
   process files — in one commit with the epitaph and de-links.
7. **Start a successor through triage**; a rewritten spec takes a new slug.
   Never revive the deleted file.

| Artifact | After abandon | Why |
|---|---|---|
| Spec, `.decisions.md`, PLAN, other process/contract files | Delete | No working value; only noise |
| The abandon decision and its reason | Keep as the epitaph | Prevents re-proposal |
| Research reports | Never delete | A deliverable, not a corpse |
| Superseded decision entries | Keep alive with the supersession marker | The revision chain stays traceable |

Git history keeps the deleted text; the worktree keeps only current truth.

### Preregistered criteria

- A preregistered criterion — target criterion, attribution design, result
  obligation — is frozen when the explore item starts
  (`skills/write-research-outline`).
- It is strong-frozen: Amendment never touches it; moving the attribution
  anchor after results destroys the causal reading.
- Only an explicit owner ruling that voids the criterion, or abandon and
  rewrite, changes it.
- A spec Claim restating a preregistered criterion inherits strong freezing;
  cite the preregistration in the decision entry.

## Workflow

**Write and freeze**

1. Confirm the entry: build work item (`AGENTS.md`, Main loop), no frozen spec
   covers it — glob `docs/specs/*.md`; a design doc is input, `.decisions.md`
   is a log.
2. Fix the deliverable: the one change, what it excludes, the slug, the two
   paths.
3. Run record-discipline's write-before ticket per planned unit, then draft:
   boundary, `[Sn]`, Claims, `Global Constraints`, `Out of Scope`.
4. Create `.decisions.md`; record requirements-phase choices with real
   alternatives (`skills/manage-decision-records`, supersession check).
5. Self-check: dispatch test, defect taxonomy, record-discipline's verify-after
   checks; fix in place.
6. Hand the draft, baseline, and brainstorm entries to review before freeze:
   owner (interactive) or dispatched review (unattended), per
   `skills/structured-code-review`.
7. Loop review → revise → re-review until `approve`; freeze on the owner's
   explicit approval or the unattended verdict. Never freeze on `needs fixes`
   or `reject`.
8. Commit spec and log in the freeze commit, direct to `main`
   (`references/workflow/github-flow.md`).
9. Hand off: the main agent dispatches one implementer per `[Sn]` with its
   entries and attached records; an unassemblable brief returns here
   (`AGENTS.md`, Dispatch brief).
10. Report: spec path, `[Sn]` and tier counts, verdict, freeze state, entries,
    open questions.

**After freeze.** Match the finding to a channel (`AGENTS.md`), then run that
channel's numbered steps: Deferred scope, Amendment, Abandon, Preregistered
criteria.

## Collaboration

This skill is the producer layer: it freezes the contract the loop follows and
owns the procedures that change it; routing, decisions, records, review, and
git mechanics are cited, never restated.

- **`AGENTS.md`**: triage, four-channel routing, dispatch brief, stop list,
  acceptance gate.
- **`skills/manage-decision-records`**: entry format, supersession, epitaphs
  and review condition, Progress tree; this skill writes in that format.
- **`skills/record-discipline`**: writing skeleton, source/projection, revision
  style; this skill supplies the spec genre and amendment mechanics.
- **`skills/structured-code-review`**: spec-draft review, verdicts, evidence.
- **`skills/write-research-outline`**: spec leaves and preregistered criteria,
  which arrive strong-frozen.
- **`skills/prose-quality`**: complete propositions in spec and decision prose.
- **`skills/trim-cot-leakage`**: Class 1 de-linking on abandon; leakage audit.
- **`references/workflow/github-flow.md`**: branch per spec, freeze commit,
  slice merge rules, pre-merge spec gate.
- **`skills/pre-push-checks`**, **`skills/merge-stack`**: push evidence and
  merge order; this skill adds no git rule.
- **`skills/pr-description`**: carries the deviation and deferred lists this
  skill's entries feed.
- **`skills/write-research-report`**: reports are deliverables; abandon never
  deletes them.
- **The main agent**: sole writer, invokes this skill at a build item's start
  and at each after-freeze channel.
