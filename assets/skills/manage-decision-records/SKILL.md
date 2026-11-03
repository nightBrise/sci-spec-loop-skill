---
name: manage-decision-records
description: Use when adding, auditing, superseding, or closing out decisions — a Decision Log entry, a standalone Decision Record, an epitaph, a Progress-tree node, or a topic-closing batch. Owns the single decision-entry format, the Progress-tree format, supersession as the only revision style, the deletion policy, the three standalone states, and the closing batch that triages epitaphs and promotes knowledge.
---

# Manage Decision Records

A decision corpus stays useful only while every entry says what binds and what
was rejected, without carrying the same text twice. This skill owns that corpus:
the entry format, the Progress tree, supersession, the deletion policy, the
standalone lifecycle, and the topic-closing batch. It is guidance, not a script:
an entry that fills every field can still record the wrong decision.

- **Record structure:** `skills/record-discipline` owns the source/projection
  model, the one-line definition, budgets, and the ticket/verify/batch programs;
  the templates here cite it.
- **Expression:** `skills/prose-quality` owns how an entry reads; this skill owns
  what it must carry.
- **Pointer repair:** `skills/trim-cot-leakage` owns dead and stale pointers;
  this skill requires the pointer to exist.
- **Contract mechanics:** `skills/write-spec` owns Amendment and Abandon
  procedures after freeze; this skill owns the epitaph's content and the
  deletion policy.
- **Orchestration:** `AGENTS.md` owns the topic-closing gate and the governance
  direct-push list; this skill owns the batch procedure the gate calls.
- **Governing rule:** one home per decision, and supersession is the only
  revision style.

## Inputs and exclusions

**Scope.** Decision Log entries, standalone Decision Records, epitaphs, the
Progress tree, and the topic-closing batch. The unit is the entry or the node,
not the file.

**Inputs.** The decision, the rejected alternatives and their reasons, and the
existing corpus to scan. For a closing batch: the period's epitaphs, their
review conditions, and the work items each governed.

**Mode.** The procedure is the same interactive and unattended. The owner rules
on activations and on anything the closing gate escalates; under unattended
operation that is a stop, not a ruling.

**Always excluded.**

- Research records — outline leaves and conclusions, findings files, reports —
  are outside this governance (`skills/write-research-outline`,
  `skills/write-research-report`).
- Spec contracts, Amendment, and Abandon mechanics: `skills/write-spec`.
- Progress projections outside the tree: `skills/record-discipline` owns their
  refresh and reconciliation.
- Prose quality and pointer repair: cited above.

**Exemptions.**

- A Progress node state update with its evidence pointer is a status line, not a
  decision; it needs no decision entry.
- A formatting or typo fix that changes no decision content needs no ticket
  (`record-discipline`'s mechanical exemption).

## The one test

**The two-question test.** A decision entry must answer two questions for a
reader who never saw the work: what binds now, and which alternative was
rejected — or why none was. An entry that answers neither is a status note, not
a decision; one that answers only one is a half-record.

## Taxonomy

| Kind | What it is | Disposition |
|---|---|---|
| Decision Log entry | a feature-bound decision in `<slug>.decisions.md`, appended once | stays for the item's life; never deleted entry by entry |
| Standalone Decision Record | a durable cross-feature decision with three states | lifecycle below; superseded by an overlay |
| Epitaph | the record of an abandon: reason, review condition, historical pointer | triaged at closing; knowledge → rejected DR, situational → condition check |
| Progress node | one work item's state line in the Progress tree | one line, updated in place |
| Not a decision | a report finding, an outline conclusion, a spec claim, status narration | route to its owner |

An epitaph is **knowledge-class** when it states a general judgment or owner
will that outlives its context. It is **situational** when the reason is bound
to a version, a budget, or a constraint that can change.

Examples: "the hardware lacks X" is situational — its review condition is the
hardware; "never derive state into the spec" is knowledge — it belongs in a
rejected record.

Retention is judged by re-proposal value, never by age or length; there is no
quota.

## Negative definition

- **Not a research record.** Outline leaves, findings, and reports are research
  records with their own skills; this skill never audits their content.
- **Not the content of progress.** The tree carries state and pointers;
  conclusions live at their homes.
- **Not a spec channel.** Amendment and Abandon are `write-spec`'s; this skill
  receives their outputs.
- **Not a prose standard.** Expression belongs to `prose-quality` and the
  one-line form to `record-discipline`; this skill cites both.
- **Not an archive.** No decision artifact is deleted for being old, long, or
  unwelcome; deletion follows the policy alone.
- **Not a deletion license for history.** Superseded entries and rejected
  records stay alive and annotated.

## Specialized mechanisms

### Decision entry format (the single home)

Other skills cite this section; none restates it. A Decision Log entry:

```markdown
## D<n>: <title>
**Phase:** <write-spec | implementation | review | abandon | triage>
**Chosen:** <what binds>
**Rationale:** <why, one or two sentences>
**Rejected:** <alternative> — <reason>
**Spec section:** [S<n>]                         <!-- omit when none -->
**History:** <abandoned slug and path>           <!-- epitaphs only -->
**Review condition:** <the state that would overturn this>
**Status:** superseded by [D<m> in <location>]   <!-- appended only on supersession -->
```

- `Phase: abandon` marks an epitaph; its review condition and historical pointer
  are mandatory.
- `Review condition` is mandatory on every epitaph and on any decision a future
  agent could plausibly reverse; write the condition, never a date.
- A missing review condition means the classification was never decided:
  re-judge knowledge versus situational before writing the entry.
- `Status` is the only overlay; no other in-body annotation is allowed.
- A triage correction is a normal entry tagged `misclassification: <item> from
  <X> to <Y>`, with its evidence and the node-state update.
- A decision that constrains several features or outlives its feature becomes a
  standalone record, not a log entry.

A standalone Decision Record:

```markdown
# Decision: <title>

Status: <proposed | accepted | rejected — reason>
Date: YYYY-MM-DD
Specs: <implementing spec links>  or  `Specs: none — <why>`

## Problem
## Decision          (accepted: present-tense, what shipped)
## Proposal          (proposed: what is proposed)
## Alternatives Considered
## Acceptance criteria   (proposed only)
## Risks                 (proposed only)
## Consequences          (accepted; on a rejected record it answers "when would this be overturned")
```

### Supersession is the only revision style

- Before writing, scan the corpus for the same mechanism, alternative, or topic;
  classify the match as full, partial, or none.
- Full supersession: annotate the old entry's `Status` line, add `Supersedes:`
  to the new one, and transfer every unique rationale, alternative, and
  consequence.
- Partial supersession: keep both active and cross-link; neither is subordinate.
- Never append an in-body correction while the old statement stands — the reader
  cannot tell which binds, and the text doubles.
- Never delete a superseded artifact as a revision act; it stays as history,
  marked non-authoritative (whole-file deletion under the policy is separate).
- A legacy `## Decisions` section inside a frozen spec is a snapshot: never edit
  it; route the supersession to that feature's log.

### Deletion policy

| Artifact after death | Disposition | Why |
|---|---|---|
| abandoned spec, its `.decisions.md`, plans and other process/contract artifacts | delete in the same commit as the epitaph | zero work value, pure interference |
| the epitaph: decision, reason, review condition, historical pointer | keep in the live decision file or CHANGELOG | prevents re-proposal |
| research report | keep | a deliverable is not a corpse |
| superseded entry | keep, annotated | the revision chain stays traceable |
| rejected standalone record | keep | the home of promoted knowledge |

- Delete an abandoned item's process file whole; never delete an individual
  entry from a live log.
- The epitaph lands in the same commit as the deletion; git history keeps the
  past, the worktree keeps current truth (`write-spec` owns the procedure).
- Age, length, and dislike are never deletion criteria.

### Standalone lifecycle

Only standalone records have states; the `Status:` line is the state, and
`superseded` is an overlay on it.

| State | Meaning | Sections |
|---|---|---|
| `proposed` | a durable proposal not yet implemented | Problem, Proposal, Alternatives, Acceptance criteria, Risks |
| `accepted` | shipped reality | Problem, Decision, Alternatives, Consequences |
| `rejected` | evaluated and declined | the sections it was written with, frozen, plus Consequences with when-to-overturn |
| `— superseded by <ref>` | no longer authoritative | prior sections kept; marker on the status line |

- **proposed → accepted:** when the change ships, rewrite Proposal as a
  present-tense Decision, fold Acceptance criteria and Risks into Consequences,
  fill `Specs:`, and commit on main after the merge; note remaining gaps.
- **proposed → rejected:** append `rejected — <reason>`, freeze the sections,
  and append `## Consequences` with the when-to-overturn answer.
- **any → superseded:** use the supersession mechanics; the old file is never
  deleted.
- A rejected record without a when-to-overturn line is incomplete; if you cannot
  state one, the record is not rejected but undecided.

### Topic-closing batch

`AGENTS.md`'s closing gate calls this procedure for checklist items 1 and 2; the
Progress-tree reconciliation belongs to `record-discipline`'s batch and is not
repeated here.

1. Collect every epitaph of the period.
2. Triage by class:
   - **Knowledge-class** → promote to a standalone `rejected` record: Problem,
     Decision, Alternatives, and Consequences with the when-to-overturn answer.
   - **Situational** → keep as a one-line entry and run its review condition.
3. Review-condition check:
   - condition now true → list it for owner ruling; activation becomes a new
     work item, never a reopened dead item.
   - condition still holds → compress to the one-line epitaph and keep it.
   - no condition → the class was never decided: re-judge it and write the
     condition before continuing.
4. Promote knowledge: the new rejected record becomes the home; the log line
   shrinks to the epitaph plus a pointer (the one-line form is
   `record-discipline`'s).
5. Deliver the review-check report to the owner — triggered conditions and
   recommended dispositions — and let the owner rule before the gate closes.
6. Audit the rejected corpus: supersede a record that no longer holds, merge a
   duplicate, and move over-budget narrative to an evidence file; a rejected
   record is simplified, never deleted.
7. Record the batch outcome with evidence pointers: triaged, promoted,
   conditions checked, triggered, and borderline cases.

### Progress tree (the sole format)

The tree lives under `## Progress` in the decision file that owns the work items
— `<slug>.decisions.md` alongside a spec; the topic's decision file otherwise.
It is the only progress truth; every status statement elsewhere is a projection.

```markdown
- [<ID>] <type>: <title> · <status> (<evidence pointer>)
  - [<ID>] <type>: <title> · <status> (<evidence pointer>)
```

- One line per node, nothing else; prose and conclusions belong at their homes
  (`record-discipline` sets the line budget).
- `ID` is the work item's identifier, assigned once and never reused (`[W<n>]`
  in a topic; `[S<n>]` for a spec slice).
- `type` is the registered triage result, `build` or `explore`; there is no
  other type vocabulary.
- `status` reuses the existing state words: `pending`, `in progress`, `done`,
  `dead-end`, `pivot`, `misclassified`.
- `dead-end` stops the inquiry, `pivot` continues it in a child leaf, and `done`
  meets the item's criterion; these are the only meanings the words carry.
- A corrected triage keeps its history in place: `misclassified → done |
  dead-end | absorbed`, the replacement drawn from the same words.
- Indentation is derivation: a spawned child node is indented under its
  parent; a flat list is wrong when the work produced children.
- State words are grep-able — that is the batch-reconciliation entry point — and
  every line is a stable diff line.

## Workflow

**Adding or revising a decision**

1. Place it: feature-bound → the feature's Decision Log; cross-feature or
   durable → a standalone record.
2. Scan for supersession and classify each match; handle a known match in the
   same change, never defer it to an audit.
3. Write the entry from the format; chain supersession in both directions and
   transfer the unique content.
4. Update the owning Progress node when the decision changes a state; keep the
   tree and the entry consistent in the same change.
5. Migrate a proposed record to accepted when its implementing change has
   merged; record the migration on main.

**Closing batch**

6. Run the batch procedure; deliver the review-check report; apply the owner's
   rulings.
7. Report: entries added, supersessions with successors, migrations, promoted
   records, checked and triggered review conditions, borderline cases.

**Report content.** Every claim carries a path or a state word; counts travel
with their evidence pointers.

## Collaboration

- **`record-discipline`:** owns the one-line definition, budgets, the
  source/projection model, and the ticket/verify/batch programs; this skill owns
  the entry format, tree shape, and state vocabulary.
- Its closing batch reconciles the tree and its projections; this skill's batch
  triages epitaphs.
- **`write-spec`:** owns the Amendment and Abandon procedures and the review
  gate; it cites this skill's entry format, epitaph, and Progress tree, and this
  skill never restates its procedures.
- **`write-research-outline`:** a leaf status is a projection of a tree node;
  knowledge-class findings reach this skill through the closing batch for
  promotion.
- **`write-research-report`:** reports are research records outside this
  governance, and the deletion policy never deletes one.
- **`simplification-audit`:** writes its durable proposals in this skill's
  `proposed` format and delegates retention judgment here.
- **`prose-quality` / `trim-cot-leakage`:** expression and pointer repair; this
  skill cites both.
- **`AGENTS.md`:** owns the closing gate, the stop list, and the governance
  direct-push list; this skill supplies the batch procedure and the tree format.
