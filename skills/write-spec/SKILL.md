---
name: write-spec
description: >
  Converts gathered requirements into a frozen spec document with numbered claims
  and verifiable acceptance criteria. The spec becomes the single source of truth
  for all downstream planning, implementation, and review. A spec MUST precede
  implementation when a task touches an external contract, spans 2+ modules that
  cannot roll back as one unit, runs unattended, or needs a trade-off decided
  between defensible designs; mechanical multi-file edits are exempt.
type: prompt
whenToUse: When a task introduces or changes an external contract, spans 2+ modules that cannot roll back as one unit, will run unattended, or requires choosing between defensible designs — or when requirements need to be frozen into a verifiable contract before implementation begins
---

# Write Spec

Convert gathered requirements into a structured, frozen spec that downstream
planning and implementation consume. The spec is the arbitration document — once
confirmed, it binds all planning, implementation, and review.

A spec is required when a task meets any one of four criteria:

- **It introduces or changes an external contract** — an API, a data format, a
  configuration schema, a protocol, or a CLI surface.
- **It spans 2+ modules and cannot be rolled back as a single unit.**
- **It will run unattended** — with nobody in the loop to correct course, the
  frozen contract is the only backstop.
- **It needs a trade-off decided first** — two or more defensible designs exist.

Mechanical multi-file edits are exempt: renames, reformatting, dependency
upgrades, and adding tests for behavior that already exists. They touch many
files but produce no contract that needs arbitration, so file count alone never
triggers a spec.

## Role in the workflow

```
requirements → WRITE-SPEC → dispatch loop → implementation + review
(main-agent    (this skill)   (main agent)     (coder + reviewer)
 dialogue)
```

How downstream consumers use the spec:
- **dispatch loop (main agent)** reads `[Sn]` sections, dispatches one implementer
  per independently-available `[Sn]`, and verifies every `[Sn]` is dispatched
- **implementer prompt** receives verbatim `[Sn]` text as the intent for that task
- **reviewer agent** enumerates individual Claims from `[Sn]` sections, verifies
  each against the code and `git diff`, and requires evidence (test name / command output / file:line)

## Check for existing spec

Before producing a new spec:

1. `glob docs/specs/*.md` — check if a spec for this feature already exists
   - Exclude `*-design.md` (design doc from the requirements phase — treat as INPUT, not an existing spec)
   - Exclude `*.decisions.md` (per-feature Decision Logs)
2. If the project maintains a spec index (e.g. `docs/specs/README.md`), check whether this spec path was recorded there

If a matching spec file (not design doc, not decision log) is found: read the
existing spec and skip to Confirmation. Do not duplicate.

If a design doc is found but no spec: treat the design doc as brainstorm output
and proceed to Convert — the design doc is input material, not a frozen spec.

If not found: proceed to Produce the spec.

## Determine the slug

Derive a kebab-case `<feature-slug>` from the feature name. Examples:
- "orbit correction" → `orbit-correction`
- "FEL simulator grid layout" → `fel-grid-layout`
- "magnet control refactor" → `magnet-control-refactor`

### Spec directory

The spec directory is `docs/specs/` by convention (register it in the project's
AGENTS.md if the project uses a different location). Keep specs, their Decision
Logs, and standalone decision records under this one directory. `<spec-dir>` in
the paths below refers to this directory.

Target path: `docs/specs/<feature-slug>.md`
Decision Log path: `docs/specs/<feature-slug>.decisions.md`

## Gather requirements

Read the requirements collected by the main agent (dialogue, design doc, or
issue). Extract:
- The core problem or goal
- Desired behaviors
- Known constraints or dependencies
- Edge cases mentioned
- Anything explicitly out of scope

If key details are missing (ambiguous behavior, unclear boundaries, conflicting
requirements), ask the user before writing. Do not guess acceptance criteria.

## Write the spec

Create the directory if it does not exist (`mkdir -p docs/specs`), then
write the file.

### Format

```markdown
# <Feature Name> Spec

## [S1] <Section Title>

<Brief description of this functional unit — what it does and why.>

**Dependencies (optional):** [S0], [S2]

### Claims

- C1: <Verifiable behavior statement.>
- C2: <Verifiable behavior statement.>
- C3: ...

## [S2] <Section Title>

### Claims

- C1: ...
- C2: ...

## Global Constraints

- <Project-wide rule that binds every task.>
- <Another constraint.>

## Out of Scope

- <Explicitly excluded behavior.>
```

### Section rules (`[Sn]`)

- **1 spec = 1 deliverable change**: the smallest unit that merges on its own,
  rolls back on its own, maps to one PR, and whose acceptance a set of Claims can
  express completely. `[Sn]` are its internal dispatchable units, and one spec
  normally holds several of them.
- Split into a new spec only when all three criteria hold at once: the candidate
  specs share no contract coupling, they ship and roll back independently, and
  they serve different outcomes. When any one of the three fails, keep one spec.
- The size limit stays implicit: a spec grows no larger than one PR can carry and
  still be reviewed end to end, with `main` deployable after the merge. If some
  `[Sn]` must merge in separate batches to keep `main` deployable, that is the
  signal to split. The number of `[Sn]` is never the criterion — cohesion is.
- One section per independently dispatchable unit — each `[Sn]` is handed to a single implementer.
- `Dependencies (optional)`: list the `[Sn]` that must be done first; the section stays pending until its dependencies are done.
- Every section SHOULD contain Claims. A section without claims is a warning —
  add at least one or merge it into another section.
- `Global Constraints` is mandatory. Write at least one constraint (naming
  convention, dependency policy, framework choice, performance floor).

### Claim rules (`Cn`)

- Each claim is one verifiable behavior statement — one actor, one action, one
  observable outcome
- Claims are both the behavior description AND the acceptance criteria — do not
  duplicate them in a separate "Acceptance" block
- Prefer EARS format: `WHEN <trigger> THEN <system> SHALL <response>`
  - Not all claims fit EARS. Architecture constraints, performance bounds,
    data formats are valid without EARS. Use it when it fits.
- Every claim MUST be testable: mappable to a test name, a `file:line`
  reference, an observable UI state, or a measurable metric
- Each claim appears in exactly one section. If a claim spans two sections,
  split it or choose the primary owner.
- Number claims sequentially within each section: C1, C2, C3, ...

### What makes a good claim

**Good — specific, testable, one behavior:**
- `WHEN the user clicks "Correct Orbit" THEN the system SHALL compute corrector strengths using SVD decomposition`
- `The grid spacing SHALL be 12px between cells`
- `Correction SHALL complete within 2 seconds for a 200-BPM lattice`
- `WHEN FALCON is not installed THEN the page SHALL display an installation guide`

**Bad — vague, untestable, or compound:**
- `The system should work correctly` (what is "correctly"?)
- `Implement orbit correction with good performance` (no measurable target)
- `The UI should be responsive and handle errors gracefully` (two claims fused)

**Traps to avoid:**
- A claim that cannot fail: if nothing observable contradicts it, it is not a claim
- Mixing implementation strategy into a claim: "use numpy.linalg.svd" is a
  design choice, not a behavior requirement
- Acceptance criteria that only say "tests pass": name the specific behavior
  the test must verify

### Brainstorm decision entries (`Dn`)

Brainstorm design choices are recorded directly in the Decision Log as
`Phase: write-spec` entries — the WHY that code and Claims cannot carry.

- Record an entry only when a genuine alternative was considered and rejected.
  If there was no real choice (only one viable approach), do not fabricate alternatives.
- Each entry has: chosen option, rationale (1-2 sentences), rejected alternatives
  with reasons.
- Link each entry to its relevant `[Sn]` section if applicable.
- If no meaningful alternatives were discussed during brainstorm, write no
  entries; the Decision Log holds only its header.
- Write entries with prose-quality's complete-proposition rule, and run
  manage-decision-records' supersession check against existing records before
  recording a decision that overlaps one. If an existing standalone Decision
  Record covers the topic, reference it instead of re-deciding.

### Decision Log file

The Decision Log is the feature's single decision home. Create it alongside the
spec, holding the brainstorm entries written under the decision rules above. The
log persists beyond the spec freeze and captures decisions from the entire
lifecycle — brainstorm through review and user interaction. The spec itself
carries no decisions.

**Path:** `docs/specs/<feature-slug>.decisions.md` (same directory as spec)

**Format:**

```markdown
# Decision Log: <Feature Name>

<!-- Continuously appended, never deleted. Records decisions from all phases. -->

## D1: <Decision title>
**Phase:** write-spec
**Chosen:** <what was selected>
**Rationale:** <why>
**Rejected:** <alternative> — <reason>
**Spec section:** [S1]
**Status:** superseded by [D<n> in <location>]   <!-- optional; appended per manage-decision-records' supersede mechanics -->

## D2: <Decision title>
**Phase:** write-spec
...
```

Numbering runs as a single continuous stream in `.decisions.md`: D1, D2, ...
Brainstorm entries are written during write-spec (`Phase: write-spec`);
post-brainstorm decisions (implementation, review, user interaction) are
appended with later numbers — the spec is frozen.

**Lifecycle decisions beyond the requirements phase:**

| Phase | Who appends | Trigger |
|-------|-------------|---------|
| write-spec | this skill | requirements-phase alternatives |
| implementation | main agent | user makes a design choice during Q&A |
| implementation | main agent | implementer reports adjacent scope that no frozen Claim covers |
| review | main agent | reviewer flags an issue, user decides how to handle |
| any session | main agent | user states a design preference in conversation |

The main agent appends to `.decisions.md` using the same format, incrementing
the D number. Include the `Phase` field to mark where the decision happened.

The `.decisions.md` file also carries a `## Progress` status board — a per-`[Sn]`
table (`[Sn] | commit | review | status`), **not** a decision. The main agent updates
it as the dispatch loop runs; it survives context compaction and is excluded from
manage-decision-records' scope. Keep one section for decisions (`## Dn`) and one for
progress (`## Progress`); a `[Sn]` stays `pending` until its dependencies are `done`.

## Verify the spec

After writing, verify:
1. Every `[Sn]` section contains at least one claim (warning if missing)
2. `Global Constraints` is present with at least one entry
3. Every claim is testable: can you name a test, a file:line, or an observable
  outcome? If not, rewrite.
4. No requirement from the gathered requirements is unaddressed — list any gap
  and add a section or claim
5. Every brainstorm Decision Log entry has a Chosen option, Rationale, and at
  least one Rejected alternative with a reason

## Save and confirm

1. Write the spec to `<spec-dir>/<feature-slug>.md`
2. Write the Decision Log to `<spec-dir>/<feature-slug>.decisions.md`,
   holding the brainstorm entries written above (if no decisions were made,
   create the file with the header only and no entries)
3. Commit both files:
   ```bash
   git add <spec-dir>/<feature-slug>.md <spec-dir>/<feature-slug>.decisions.md
   git commit -m "spec: add <feature-name> spec and decision log"
   ```
4. Display the full spec and the Decision Log's brainstorm entries to the user
5. Ask the user in conversation for explicit approval to freeze:
   - question: `Spec and its brainstorm decisions saved to <spec-dir>/. Approve to freeze?`
   - Approve: freeze the spec — planning and implementation will follow it
   - Revise: user has changes — fix them and re-present

   **Autonomous mode:** If no user is available to approve, treat as approved
   and proceed to the dispatch loop.

If the user requests changes: revise and re-present. Loop until approved.

## After freeze

Once approved, the spec is a frozen contract. The Decision Log is NOT frozen —
it continues to accumulate decisions throughout implementation and review.

1. If the project maintains a spec index, record both paths there:
   `- **Spec: <feature-name>**: <spec-dir>/<feature-slug>.md — frozen`
   `- **Decision Log: <feature-name>**: <spec-dir>/<feature-slug>.decisions.md — active`
   Otherwise rely on glob discovery of `docs/specs/*.md`; do not create an index.

2. Hand off to the dispatch loop (main agent). It must:
   - Read the spec file and the Decision Log's brainstorm entries
   - When an entry references a standalone Decision Record, attach that record
     to the implementer prompt for the `[Sn]` it constrains
   - Dispatch one implementer per `[Sn]`, honoring `Dependencies` (a section stays
     pending until its dependencies are done)
   - Verify every `[Sn]` is dispatched before implementation
   - When sections are independent, dispatch in parallel — one implementer per
     `[Sn]`, each citing the section it covers

3. Mark the Decision Log as an active, continuously-appended artifact.
   Add this comment at the top of the `.decisions.md` file:
   `<!-- ACTIVE LOG — continuously appended throughout lifecycle; do not treat as stale -->`

## Frozen spec rules

- The spec MUST NOT be modified during implementation
- If a claim proves infeasible: record the problem, continue implementing the
  rest of the `[Sn]` that owns the claim, and note the deviation in the task's
  report. Do not edit the spec. The acceptance gate rules on the deviation; the
  reviewer does not. The reviewer reports that Claim as unmet and cites the
  recorded deviation as its explanation. That report is a finding, not a
  rejection, and does not count toward the consecutive-rejection limit.
- If requirements change substantially: abandon the old spec, invoke
  write-spec again to produce a new one
- An ambiguity found during implementation that needs a clarification: record
  it in the Decision Log as a new entry (`Phase: implementation`) — never as a
  comment in the spec

**Work discovered during implementation** falls into exactly one of three
classes. Classify it before acting:

- **An existing Claim absorbs it.** Some `[Sn]` already obliges the work at a
  finer grain, so it is not new scope. Do it, and record the design choice as one
  Decision Log entry (`Phase: implementation`).
- **It contradicts a Claim, or it changes `## Global Constraints`.** The contract
  is wrong rather than incomplete, and the frozen `[Sn]` no longer hold. Go to
  `## Abandoning a spec`. Proportionality separates this class from an infeasible
  Claim. A contradiction means the contract's premises failed: Claims that
  cannot all be true at once leave no `[Sn]` trustworthy, so the whole spec
  goes. One Claim that proves infeasible leaves the rest of the contract
  coherent and deliverable, so the response is a deviation that the acceptance
  gate rules on while the remaining Claims ship.
- **It neither contradicts a Claim nor is covered by one.** This is adjacent new
  scope that the freeze did not foresee, while every frozen `[Sn]` still holds and
  stays verifiable. The implementer reports it upward and the main agent records a
  deferred-scope entry (format in `## Decision Log rules`). The frozen spec ships
  as-is: no new section, no edited word, no abandon.

Deferred scope never stops a run. An unattended run records the entry and keeps
going; deferred scope is not a stop condition, and the deferred list is reported
at the acceptance gate together with the evidence. This is the boundary against
the second class: a contract that is wrong stops the run, a contract that is
merely incomplete does not.

After the spec's PR merges, the main agent collects every deferred entry for that
spec and decides: fold them into one follow-up spec, split them across several,
or drop them all — much deferred scope turns out not to be worth doing.

## Decision Log rules

- The Decision Log (`.decisions.md`) is NOT frozen — it accumulates decisions
  throughout implementation and review
- The main agent appends new entries when the user makes design choices during
  implementation, review, or any interactive session, and when implementation
  reports deferred scope
- Each entry must include: Phase, Chosen, Rationale, and at least one Rejected
  alternative with a reason. In a deferred-scope entry the `Not absorbed because`
  line discharges the Rejected-alternative requirement — the rejected alternative
  is absorbing the work into the frozen spec.
- Decisions stay in `.decisions.md`; only durable cross-feature or cross-spec
  proposals and decisions earn a standalone record in `docs/specs/decisions/`
  (per manage-decision-records). Do not promote a feature-bound decision into a
  standalone record for prominence, and do not create a separate
  `## Architecture decisions` document — the per-feature Decision Log is the
  single home for feature-bound decisions.

**Deferred-scope entries are a first-class entry type**, written when
implementation finds adjacent scope that no frozen Claim covers and no frozen
Claim contradicts:

```markdown
## D<n>: Defer <adjacent work> to a follow-up spec
**Phase:** implementation
**Chosen:** defer to follow-up spec
**Rationale:** <why the work belongs outside this frozen spec>
**Not absorbed because:** <the Claims nearest the work, and why they do not cover it>
```

The `Not absorbed because` line is the guardrail against abuse: if you cannot
state why no existing Claim covers the work, then the work is an implementation
detail rather than deferred scope — do it and record a design-choice entry
instead.

## Abandoning a spec

Abandon only when the contract's premises have failed: Claims that contradict
each other, work discovered during implementation that contradicts a frozen
Claim, or requirements that changed substantially — so the frozen `[Sn]` no
longer hold. A single Claim that proves infeasible is not premise failure: it is
a deviation, ruled on at the acceptance gate under `## Frozen spec rules`. A
contract that is correct but incomplete does not come here either — adjacent
scope that no Claim contradicts is deferred scope, recorded in the Decision Log
while the frozen spec ships as-is (see `## Frozen spec rules`).

When either condition holds:

1. Record the reason in the Decision Log as the final entry:
   `**Phase:** abandon — <reason for abandoning>`
2. Invoke write-spec again to produce a new spec
3. The old spec and Decision Log remain as historical reference — do not delete them
4. The new spec gets a new slug (append `-v2` or a distinguishing suffix)
5. Record the successor: if the project maintains a spec index, update its entry to the new spec; otherwise append the new slug to the abandon entry written in step 1

## Collaboration

This skill is the producer layer: it converts requirements into the frozen contract and Decision Log that drive the whole loop.

- **write-research-outline:** hands this skill the spec leaves that converged in a living research outline; this skill freezes them.
- **write-research-report:** its reports recommend direction only — a recommendation becomes work when it lands as a spec leaf in the outline and freezes through this skill.
- **prose-quality:** write-spec applies the complete-proposition rule to spec sections and Decision Log prose.
- **trim-cot-leakage:** audits this skill's outputs for reasoning-transcript leakage; the Decision Log is a sanctioned surface per its tolerance table.
- **manage-decision-records:** write-spec applies the supersession check to Decision Log entries it writes; an overlapping standalone Decision Record is referenced, not re-decided.
- **simplification-audit:** writes its feature-bound candidates as Decision Log entries in the format this skill owns.
- **structured-code-review:** the reviewer consumes this skill's Claims for spec-compliance verification.
- **main agent:** invokes write-spec when a task meets any of the four spec-trigger criteria this skill defines.
