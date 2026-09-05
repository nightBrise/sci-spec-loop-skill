---
name: write-spec
description: >
  Converts gathered requirements into a frozen spec document with numbered claims
  and verifiable acceptance criteria. The spec becomes the single source of truth
  for all downstream planning, implementation, and review. Every feature spanning
  2+ files or 2+ steps MUST have a spec before implementation begins.
type: prompt
whenToUse: When the user asks to plan or implement a feature spanning 2+ files or 2+ steps, or when requirements need to be frozen into a verifiable contract before implementation begins
---

# Write Spec

Convert gathered requirements into a structured, frozen spec that downstream
planning and implementation consume. The spec is the arbitration document — once
confirmed, it binds all planning, implementation, and review.

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
Logs, and standalone decision records under this one directory.

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

If the task is trivial (single file, single behavior), skip this skill and
implement directly.

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

- **1 spec = 1 deliverable change**; `[Sn]` are its internal dispatchable units. Split into a new spec only when units share no contract coupling, ship and roll back independently, and serve different outcomes; when in doubt, keep one spec.
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
- If a claim proves infeasible: record the problem, continue implementation,
  and note the deviation in the task's report. Do not edit the spec.
- If requirements change substantially: abandon the old spec, invoke
  write-spec again to produce a new one
- An ambiguity found during implementation that needs a clarification: record
  it in the Decision Log as a new entry (`Phase: implementation`) — never as a
  comment in the spec

## Decision Log rules

- The Decision Log (`.decisions.md`) is NOT frozen — it accumulates decisions
  throughout implementation and review
- The main agent appends new entries when the user makes design choices during
  implementation, review, or any interactive session
- Each entry must include: Phase, Chosen, Rationale, and at least one Rejected
  alternative with a reason
- Decisions stay in `.decisions.md`; only durable cross-feature or cross-spec
  proposals and decisions earn a standalone record in `docs/specs/decisions/`
  (per manage-decision-records). Do not promote a feature-bound decision into a
  standalone record for prominence, and do not create a separate
  `## Architecture decisions` document — the per-feature Decision Log is the
  single home for feature-bound decisions.

## Abandoning a spec

If requirements change substantially during implementation:

1. Record the reason in the Decision Log as the final entry:
   `**Phase:** abandon — <reason for abandoning>`
2. Invoke write-spec again to produce a new spec
3. The old spec and Decision Log remain as historical reference — do not delete them
4. The new spec gets a new slug (append `-v2` or a distinguishing suffix)
5. Update project memory to point to the new spec

## Collaboration

This skill is the producer layer: it converts requirements into the frozen contract and Decision Log that drive the whole loop.

- **prose-quality:** write-spec applies the complete-proposition rule to spec sections and Decision Log prose.
- **manage-decision-records:** write-spec applies the supersession check to Decision Log entries it writes; an overlapping standalone Decision Record is referenced, not re-decided.
- **structured-code-review:** the reviewer consumes this skill's Claims for spec-compliance verification.
- **main agent:** invokes write-spec when a task spans 2+ files / 2+ steps.
