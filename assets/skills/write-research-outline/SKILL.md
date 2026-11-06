---
name: write-research-outline
description: Use when an outline must be materialized — cross-session continuation, a Progress tree too coarse to navigate, an experiment that needs preregistration, or the owner asks for a board — and when registering a leaf status, a one-line conclusion, a newly spawned leaf, or a preregistration before work starts. Owns outline materialization, dual-speed registration, and the preregistration three-piece.
---

# Write Research Outline

The outline is a navigation projection of a topic's work items, materialized
only when navigation needs it. It is not a second decomposition method: every
status and conclusion line projects a Progress node, a findings record, or a
decision entry, and the board can be regenerated from those sources at any
time. The research question, hypotheses, leaf definitions, and preregistration
criteria are first-hand here. This is guidance, not a script: a board that
passes every check can still point the wrong way.

- **Record structure:** `skills/record-discipline` owns the one-line definition,
  budgets, the source/projection model, and the ticket/verify/batch programs;
  the templates here cite it.
- **Triage:** `AGENTS.md` owns the build/explore test and routes materialization
  here; this skill owns the signals and registers the result.
- **Progress:** the Progress tree is the only progress truth, and a leaf status
  is its projection (`skills/manage-decision-records` owns the tree format and
  state words).
- **Contracts:** `skills/write-spec` owns spec freezing and the After-freeze
  channels; a build leaf hands off there.
- **Reports:** `skills/write-research-report` owns report triggers, structure,
  and content bar; this skill owns the deep-dive path convention.
- **Governing rule:** the board projects sources; preregistration is the one
  thing it owns first-hand.

## Inputs and exclusions

**Scope.** The topic's outline at `docs/research/<topic>.md`, its leaves, and
preregistration blocks. The unit is the leaf or the preregistration part, not
the file.

**Inputs.** The topic's question; the work items and their Progress nodes; leaf
outcomes with evidence pointers; the triage result for each work item; the
experiment's target criterion and attribution design before work starts.

**Mode.** Materialization and the skeleton review are owner-gated. An unattended
run may use an approved skeleton and register into it; it never establishes a
new skeleton or a new top-level branch — that is a stop.

**Always excluded.**

- The triage decision itself: `AGENTS.md` owns it; a leaf records the result.
- Spec contracts and their change channels: `skills/write-spec`.
- Report triggers, structure, and content bar:
  `skills/write-research-report`.
- Decision lifecycle, epitaphs, and the Progress-tree format:
  `skills/manage-decision-records`.
- Prose expression and pointer repair: `skills/prose-quality`,
  `skills/trim-cot-leakage`.

**Exemptions.**

- **Light registration.** A leaf status change, a one-line conclusion, or a
  newly spawned leaf registers immediately with an inline one-line ticket
  judgment; `record-discipline` grants the exemption and this skill runs it.
- **No board.** A build-only topic whose work items fit the Progress tree needs
  no outline; no outline means no leaves, only work items. An explore work item
  always gets a leaf for its preregistration.

## The one test

**The regeneration test.** Given the Progress tree, the findings records,
decision entries, and the preregistration blocks, every status and conclusion
line on the board must be reproducible. A line that cannot be regenerated from
those sources makes the board a second source: move the content to its home and
leave one line.

## Taxonomy

### Materialization signals

| Signal | What it means | Response |
|---|---|---|
| cross-session continuation | the next session must resume the topic without this session's context | materialize leaves and statuses from the tree |
| the Progress tree is too coarse | the tree names work items but not hypotheses, definitions, or evidence | add leaf blocks |
| an experiment needs preregistration | the criterion and attribution design have no leaf to live on | materialize the leaf, then preregister |
| the owner asks for a board | the owner wants a navigable view | materialize; no further justification needed |

- Never materialize because a topic is "complex" or "large": difficulty is not
  a signal, and the board costs maintenance.
- Materialization is regeneration, not migration: read the tree, findings, and
  frozen specs, then write the board from them.

### A leaf

- A leaf is a work item's registered projection: one work item, one leaf, one
  tree node.
- `Type` is `build` or `explore` — the triage result, registered and never
  re-derived here. A build leaf hands off to `write-spec`; an explore leaf runs
  the investigation loop.
- Leaf block fields: `ID`, `Type`, `Question` or hypothesis (explore) /
  `Deliverable` (build), `Dependencies`, `Status`, `Conclusion`, `Prereg`,
  `Deep-dive`.
- `Question`, the hypothesis, and the leaf definition are first-hand; `Status`
  and `Conclusion` project their homes in `record-discipline`'s one-line form.
- `Status` carries the tree node's state word; the vocabulary belongs to
  `manage-decision-records`, and a leaf never invents a second one.
- `Dependencies` names the leaf IDs that must resolve first; the leaf starts
  only when they are terminal.
- `Conclusion` is one line plus the pointer to its home; a deep-dive link never
  replaces it.
- `Deep-dive` links `docs/research/<topic>-<leaf-slug>.md` when
  `write-research-report`'s triggers fire; that skill owns the reserved-token
  rule.
- A leaf that becomes a spec keeps its node and status; the frozen spec path
  goes in `Deliverable` and the contract lives in `write-spec`.

### Registration speed

| Speed | Trigger | Steps | Gate |
|---|---|---|---|
| full | first materialization; a new top-level branch | skeleton → owner review → leaves start | owner approves the skeleton |
| light | leaf status, one-line conclusion, newly spawned leaf | correct the source, write the line, inline one-line judgment | none; registration completes immediately |

- The light channel is the default for a living board; routing it through the
  full flow is how the board starves.
- A new top-level branch is a new skeleton; adding or reclassifying leaves
  inside a branch is light.
- A reclassification is a `misclassification` record first (decision entry plus
  tree state, `AGENTS.md`), then a light board update.

## Negative definition

- **Not a decomposition method.** The triage splits work into items; the board
  registers them and never re-splits the topic.
- **Not a spec.** Only a build leaf's deliverable freezes, through `write-spec`;
  the outline itself never freezes.
- **Not the progress source.** The Progress tree is; a leaf status is a
  projection and is corrected after the tree.
- **Not a decision record.** A leaf conclusion is a research record; promotion
  is the closing batch's (`manage-decision-records`).
- **Not a report.** Reports have their own two lifecycles (record and
  deliverable) and their own skill; the board is living and carries no narrative.
- **Not a difficulty classifier.** There is no "simple/complex"
  preclassification; only work items and their registered types.

## Specialized mechanisms

### Materializing the board

1. Read the Progress tree, the existing findings, and any frozen specs.
2. Write the research question (first-hand) and the sub-questions or
   hypotheses, each falsifiable.
3. Write one leaf block per tree node; carry `ID`, `Type`, `Dependencies`, and
   the current `Status`.
4. Mark every `explore` leaf as requiring a preregistration before its work
   starts.
5. Send the skeleton to the owner for review (checklist below); leaves start
   only after approval.
6. Keep the board live afterward through the light channel.

### Skeleton review

The owner reviews a new skeleton before its leaves start. The checklist, owned
here:

- the sub-question partition divides the topic without gaps or overlap;
- every leaf carries its triage result and a one-line basis for it, and the
  review never re-runs the triage;
- every `explore` leaf states a testable hypothesis and its preregistration
  route;
- dependencies form no cycle and name real leaves;
- every leaf names its evidence standard.

- A build leaf cut from an approved skeleton still passes `write-spec`'s review
  at freeze; the skeleton review gates decomposition, not contracts.
- Living updates carry no gate; direction-level judgment is the stage report's
  job (`write-research-report`).
- A new top-level branch is a new skeleton and gets its own review before its
  leaves start.

### Preregistration (the sole template home)

An experiment's number is an attribution anchor, not a target: with the number
and the interpretation frozen, "met" and "missed" can be explained. Without the
freeze the target moves with the result, and the attribution chain fails.

```markdown
### Prereg: <leaf ID>

1. Target criterion: <number or condition> — the attribution anchor.
2. Attribution design: <what each possible result would mean — controls, ablations, discriminating conditions>.
3. Result duty: an attribution analysis is produced whether the criterion is met or missed; "principle-reachable but not reached" must be analyzed.

Version: v1
```

- All three parts are written before work starts; a missing part fails
  `record-discipline`'s completeness check and blocks the start.
- The number and the attribution design freeze together; a design added after
  the results is not an attribution design.
- The result duty is a template part, not advice: a missed criterion without an
  attribution analysis is an incomplete leaf.
- Every `explore` work item is preregistered in a leaf; if no board exists,
  materialize the leaf before the experiment starts.
- A spec Claim that restates a preregistered criterion inherits its strong
  freezing (`write-spec`).

**Freeze semantics.**

- Before work starts, a revision appends `prereg v2: <changed part>` and leaves
  the original text untouched; the highest version binds.
- At work start the leaf carries `preregistered @ <version>`; the start step is
  `AGENTS.md` orchestration, and the marker's form is owned here.
- After the marker the preregistration is strong-frozen: change only by owner
  ruling or by abandoning the work item. Amendment never applies — changing the
  criterion changes the experiment's promise.
- A run that needs a change after the marker stops for the owner; unattended
  operation never edits a frozen criterion.

**Result duty.**

- Report the attribution analysis for a met criterion as well as a missed one:
  distinguish the method's contribution from the principle's necessity.
- For a missed criterion, analyze the "principle-reachable but not reached" case
  before concluding anything; it separates an unreachable principle from a
  method or optimization shortfall.
- A dead-end with a completed attribution analysis is a result; one without it
  is an unfinished experiment.

### Attribution-anchor usage

- An exploratory finding that touches an existing spec's Claims goes to
  `AGENTS.md`'s four channels; this skill supplies the anchor the routing reads.
- Before ruling ① deviation or ② Amendment, read the leaf's attribution design:
  principle-unreachable → ② or ③; principle-reachable but method or optimization
  short → ①.
- Never rule from the raw number alone; the number means nothing without the
  frozen design that says what it would imply.
- A finding with no preregistration has no anchor: the owner rules on it, and it
  never drives a ①/② ruling by itself.

### Evidence standard

- A `build` leaf's evidence is the review gate's: test name, command output,
  `file:line` (`structured-code-review` owns the evidence standard).
- An `explore` leaf's evidence is experiment data, measurement, literature, or
  prototype behavior; the bar is "the conclusion is supported and the process is
  reproducible", not "the tests pass".

## Workflow

**Materialize**

1. Test the signals; if none holds, stop — no board.
2. Regenerate the skeleton from the tree, findings, and specs.
3. Send the skeleton to the owner; revise until approved, then let leaves start.

**Register (light, any time)**

4. Correct the source first: the tree node for a state change, the findings
   record for a conclusion.
5. Write or update the leaf line and make the inline one-line ticket judgment
   (what binds, where the home is, what the pointer is); registration is
   complete.
6. For a new leaf, record its triage result and dependencies; for a
   reclassification, record the `misclassification` entry first.

**Preregister (before an experiment)**

7. Write the three-piece into the leaf; version pre-work revisions by appending
   and leave the originals untouched.
8. At work start, confirm the three-piece is complete and add
   `preregistered @ <version>`.
9. At the end, update the leaf status, the one-line conclusion, and the
   attribution-analysis pointer.

**Report content.** What was materialized, leaves registered, preregistrations
and their versions, terminals reached, and anything that blocks a start or a
conclusion.

## Collaboration

- **`AGENTS.md`:** owns the triage, the work-start marker, the four channels,
  and the closing gate; this skill owns the signals, board procedure,
  preregistration template, and the anchor the routing reads.
- **`record-discipline`:** owns the one-line definition, budgets, and tickets;
  it grants the light-registration exemption, and its completeness check
  verifies the three-piece. This skill's templates cite it and never restate it.
- **`manage-decision-records`:** owns the Progress-tree format and state words;
  a leaf status is a projection of a node, and knowledge-class promotion runs in
  its closing batch.
- **`write-spec`:** receives build leaves and freezes their deliverables; owns
  the After-freeze channels this skill's anchor feeds, including the strong
  freezing a restated criterion inherits.
- **`write-research-report`:** owns report triggers, structure, and content bar,
  including the reserved-token rule; this skill owns the deep-dive path
  convention and the leaf conclusion as the summary of record.
- **`prose-quality` / `trim-cot-leakage`:** expression and leakage repair for
  board prose.
- **`main agent`:** the sole writer of the outline; subagents supply leaf
  conclusions and evidence upward.
