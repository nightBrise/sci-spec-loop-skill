---
name: record-discipline
description: Use when writing, reviewing, or refreshing any record artifact — a living outline, findings or evidence file, decision entry, spec, research report, or the Progress tree — before writing, before hand-off, at a batch or topic closure, or when a source unit changes. Keeps each fact at one authoritative home, every other appearance a one-sentence projection, and every projection current.
---

# Record Discipline

Keep every fact at one authoritative home and every other appearance a
one-sentence projection of it. A record is any artifact the loop keeps for a
future reader: a living outline, a findings or evidence file, a decision entry,
a spec, a research report, a progress line. The loop needs the same fact in
several places because several readers consume it; the failure is not
repetition but an unspecified projection — a copy where a projection belongs, a
source retold at every site, a projection with no budget, and no one refreshing
it when its source moves.

This is guidance, not a script. The questions and checks below are judgments,
and a record that passes them can still be wrong about its subject.

- **Templates and budgets:** paragraph types and their budgets belong to the
  artifact skills (`see skills/write-spec`, `skills/write-research-outline`,
  `skills/write-research-report`, `skills/manage-decision-records`); this skill
  owns the attributes every template declares.
- **Expression:** `skills/prose-quality` owns how a passage is written; this
  skill owns whether it belongs and how much.
- **Pointer repair:** `skills/trim-cot-leakage` owns dead, stale, and
  session-bound pointers; this skill requires a pointer to exist and land.
- **Ticket placement:** `AGENTS.md` pins where the write-before ticket sits in
  a writing flow; this skill supplies the ticket.
- **Governing rule:** one home per fact — every other appearance is a
  projection within budget.

Every content unit is a first-hand source unit, a projected unit, or a status
line; anything else is not a unit at all. Three programs apply the model — a
ticket before writing, a check before hand-off, and a batch pass at closure —
plus a refresh whenever a source unit changes.

## Inputs and exclusions

**Scope.** The record corpus: living outlines, findings and evidence files,
decision entries and standalone Decision Records, specs, research reports, and
the Progress tree. The unit of work is a content unit, not a file — one leaf
row, one decision entry, one Claims section, one report paragraph.

**Inputs.**

- The target artifact and its paragraph-type template.
- The location that will be the unit's home, or the first-hand source it
  projects.
- The unit's budget tier.

An artifact with no type template cannot be ticketed: take the gap to the
artifact's skill rather than invent a template here.

**Mode.** Not applicable: the trigger event selects the program, and the
judgments do not change with the presence of a human.

**Always excluded.**

- Code, code comments, commit messages, and pull-request bodies follow their
  own standards; the source/projection model covers records, not code prose.
- Expression quality, leakage repair, template definitions, and decision
  retention belong to other skills; this skill cites them and never rules on
  them.

**Exemptions.**

- **Outline light registration.** A leaf status change, a one-line conclusion,
  or a newly produced leaf registers through the light path: the ticket
  collapses to an inline one-line judgment and registration completes
  immediately. A full pass would starve the loop's highest-frequency update.
- **Frozen artifacts and reports.** A frozen spec and a written report are
  point-in-time snapshots. Their change route is their own channel — amendment
  for a spec, a later report for a report — never an in-place refresh. Refresh
  obligations attach to live projections only.
- **Mechanical edits.** A formatting or typo change that creates or moves no
  content unit needs no ticket and no check.

## The one test

**The home test.** For every content unit you write, answer one question: is
this unit the home of its content, or a pointer to the home?

The home carries the content in full, within its type's budget. A pointer
carries one sentence plus the location of the home. The failing answer is the
third one: content that lives here without being the home and without pointing
at one — a copy, a paraphrase with no pointer, a second authoritative version.
Move it to its home, shrink it to a pointer, or delete it.

A record passes only when every unit gives one of the two answers; an
untraceable unit is a finding and must be moved, shrunk, or deleted before the
record passes.

## Taxonomy and coverage

The split is by content unit, not by artifact: every artifact is a mixture, and
its coverage row says which slots are authoritative and which must stay
projections. Judge at the granularity of a paragraph or entry type, never
sentence by sentence: the type carries the attribute.

| Kind | What it is | Disposition |
|---|---|---|
| First-hand source unit | Content that is authoritative at this location: a definition, claim, decision, method, data point, or interpretation (a spec Claim, a decision rationale, a report's direction recommendation). | Write it in full within its type's budget; every other location points here. |
| Projected unit | Content whose home is elsewhere (a leaf conclusion line, an evidence pointer in a spec, a status sentence in a report). | One sentence plus a pointer; refresh when the home changes. |
| Status line | A position marker whose content is a state and an evidence pointer (for example `[F-004] experiment: s30 probe · done (findings#s30-04)`). | One line; the Progress tree is the canonical instance (see `skills/manage-decision-records`). |
| Not a unit | A restatement, session narration, a duplicated table, or a template segment with no content. | Do not write it; delete it if it exists. |

### One line, defined here

**A projected unit is one sentence plus a pointer.** It has no paragraph
rights: it may sit inside a paragraph, it may not be one. When the content
needs a second sentence of substance, the substance belongs at the home or in
an evidence file, and the projection keeps one sentence and its pointer.

This is the only definition of "one line" in the skill set. Every artifact
template cites it and never restates it, so the rule cannot drift into several
informal versions. Do not soften it to "brief": a projection that has grown to
two sentences is already the failure this skill exists to prevent.

### Artifact coverage

| Artifact | First-hand content (authoritative here) | Projected content (drawn from elsewhere) |
|---|---|---|
| Outline | Research question, hypotheses, leaf definitions, pre-registered criteria. | Leaf status and conclusion lines (from findings or decision entries). |
| Findings / evidence files | Experiment method, data, figures, FAIL and PASS facts. | Quoted criteria text (from outline pre-registration or spec Claims). |
| Decision entry | The decision, rationale, rejected alternatives, review condition. | Conclusion summary (from findings), Claim citations. |
| Spec | Claims, obligations, criteria. | Evidence pointers (from findings). |
| Report | Interpretation, meaning, direction recommendations. | Data references (figure plus anchor, never raw data tables), status narration. |
| Progress tree | Current state. | One-line conclusion summaries (one line plus pointer). |

Read each row as a question: does this artifact keep its authoritative slots
authoritative and its projected slots as projections? A spec that retells
evidence instead of pointing at it, or a report that copies a data table,
inverts its row and fails the home test however well it reads.

### Budgets and attributes

Every paragraph type in an artifact template declares two attributes: **source
or projection**, and **a budget tier**. Templates are owned by the artifact
skills; this skill owns the requirement that every type declares them, and the
tiers themselves. A template that leaves any type undeclared is out of
conformance, and the fix belongs in the template, not in the write.

| Tier | Kind | Budget |
|---|---|---|
| S | Source unit | The size the type needs to carry its content completely, declared by the template. No system-wide word quota. |
| P | Projection | One sentence plus a pointer (the one-line definition). |
| L | Status line | One line: state word plus evidence pointer. |
| C | Table cell | The cell's content; no paragraph rights. |

**The soft cap.** A unit is over budget when it carries content its type does
not need. Over-budget content must move to an evidence file, or to its home,
and leave a pointer. The system fixes no numeric quota: the cap is a judgment
about the type's job, and the overflow is an action, not a suggestion.

### Refresh

**A source change refreshes every live projection in the same pass.** Find them
by the home's identifier or pointer target, not by memory.

**A report's interpretation triggers no refresh.** Interpretation and direction
judgment in a report are first-hand source; changing either creates no refresh
obligation for any other artifact.

## Negative definition

- **Not a prose standard.** It does not decide what good prose looks like, how
  a sentence is phrased, or which propositions a passage must carry. That is
  `skills/prose-quality`.
- **Not a template library.** It does not define paragraph types, section
  order, or heading names. Each artifact skill owns its template; this skill
  only requires every type to declare its attribute and budget.
- **Not a leakage detector.** It requires a pointer at write time; hunting and
  repairing dead, stale, or session-bound pointers is
  `skills/trim-cot-leakage`.
- **Not a decision lifecycle.** It does not decide which decisions survive, how
  they supersede, or what a tombstone says. That is
  `skills/manage-decision-records`.
- **Not a content-sufficiency standard.** It does not decide how deep a
  report's interpretation goes or whether a Claim is well formed; those are
  `skills/write-research-report` and `skills/write-spec`.
- **Not a brevity mandate.** Shorter is not the goal. A record that drops a
  required proposition is worse, not leaner; the test is one home per fact.
- **Not a generator.** No script fills a template. The programs are judgments
  made at named moments.

## Specialized mechanisms

The three programs cover a record's life — before writing, before hand-off, at
closure. The four boundaries and five rules are what they enforce.

### Write-before: the five-question ticket

Ask the five questions in order for each unit you intend to write. A failed
question stops that unit — drop it, shrink it, or route it — and the later
questions are not asked for it. The ticket is a judgment, not a section of the
record: it does not appear in the artifact, and the check below demonstrates
its answers.

1. **Necessity — should this be recorded at all?** Name the future reader and
   the decision or action the record serves. If there is none, do not write it;
   a record nobody will consult is cost without benefit.
2. **Placement — does it belong in this artifact, and in which slot?** Name the
   artifact and the template slot. Content that duplicates its home becomes a
   pointer; content that belongs to another artifact is routed there. Fail: no
   slot in the target template fits.
3. **Size — which budget tier, and where does overflow go?** Name the tier (S,
   P, L, or C). For a unit likely to pass its tier, name the evidence file that
   takes the excess. Fail: a projection proposed at paragraph size, or a source
   unit with no tier.
4. **Source ownership — what is the first-hand source?** Name the location
   where the content is authoritative. A new source unit declares its own home;
   a projection names the home it draws from. Fail: no location can be named,
   or the named location is itself a projection.
5. **Form — which paragraph type, and what sentence form?** Name the type from
   the artifact template. A projection uses the one-line form. Fail: the type
   is not in the template, or the projection will not fit one sentence.

### Verify-after: the four checks

Before hand-off, check the record against its ticket and its template. The
checks are cumulative; a failure is fixed in place, never carried into hand-off.

1. **Completeness.** Every ticketed unit landed, every landed unit has a
   ticket, and every mandatory segment of each type template is present. A
   pre-registration is complete only when all three parts its template requires
   are present (see `skills/write-research-outline`). Fail: an unticketed unit
   or a missing mandatory segment.
2. **Size.** Every unit sits within its tier: projections are one sentence plus
   pointer, source units are within the template's budget, and no over-budget
   content stays behind. Fail: an over-sized unit with no pointer to where the
   excess went.
3. **Source-form.** Each unit has the form its kind requires: a source unit
   carries its content, a projection carries a sentence and a pointer rather
   than a copy or a pointerless paraphrase of the home, a status line carries
   state and pointer. No inline attribute labels; no empty projected segment;
   the record matches its coverage row. Fail: a copy, a pointerless paraphrase,
   or a paragraph-sized projection.
4. **Pointer validity.** Every pointer resolves to an existing location, names
   it precisely enough to land on the content, and lands on a first-hand
   source. Fail: an unresolvable pointer, a pointer that names only a file, or
   a pointer that lands on a projection.

### Closing batch: refresh, overflow, reconcile

Run at a batch boundary and as one item of the topic-closure checklist; the
closure gate itself is `AGENTS.md` orchestration.

1. **Refresh live projections.** List the source units changed since the last
   batch, and refresh every live projection of each in the same change. Grep
   the home's identifier; do not rely on memory.
2. **Execute overflow moves.** Every deferred over-budget unit moves its excess
   to an evidence file now and leaves a pointer. No unit stays over budget
   because closure is near.
3. **Reconcile against the Progress tree.** The tree is the only progress
   truth. Grep the status vocabulary; for each node verify that its evidence
   pointer resolves, and that every progress projection elsewhere — outline
   leaf status, report status narration, any README or `AGENTS.md` statement —
   matches the tree or is deleted. Correct the tree first, then its
   projections.

### The four over-growth boundaries

These hold at every write and again at the closing batch. Check them as a list.

- [ ] **Source content obeys the same soft cap.** First-hand status makes a
  location authoritative; it does not make its size unbounded. When a narrative
  or explanation unit passes its tier, the excess moves to an evidence file and
  a pointer stays. "Detailed and reasonable" describes interpretive quality,
  not word count; that genre judgment belongs solely to
  `skills/write-research-report`.
- [ ] **A projection is one line.** Use the definition under One line, defined
  here. A projected unit that needs a second sentence of substance sends the
  substance home and keeps one sentence.
- [ ] **No projection of a projection.** A projection draws directly from a
  first-hand source. The ticket names that source, and fails if the named
  source is itself a projection; a pointer that lands on a projection fails the
  pointer check. Desync symptoms are exposed by `skills/trim-cot-leakage`'s
  existing detection, which this skill does not restate.
- [ ] **Attributes stay in the template.** Source and projection status is
  declared by the paragraph type, never labeled in body text — no `[source]`
  or `[projection]` markers or variants. A segment materializes only when it
  has content; an empty projected segment is deleted. Generic metadiscourse
  noise is `skills/prose-quality` and `skills/trim-cot-leakage` territory.

### The five record-keeping rules

1. **Single source of truth.** Write a conclusion's full text once, at its home
   — the evidence set for an experimental result, the decision entry for a
   decision — and put one line plus status everywhere else. Test: grep a
   distinctive phrase; it appears once, and elsewhere only as a pointer.
2. **Single progress board.** The Progress tree is the only progress truth.
   `AGENTS.md` and READMEs must not embed status narration; a report's status
   narration is a projection of the tree. Test: every status statement outside
   the tree matches it or is deleted. Tree format:
   `skills/manage-decision-records`.
3. **No point-in-time numbers in rule documents.** Test counts and performance
   readings live only in evidence files; rule and contract documents cite the
   pointer, never the number. Test: a rule document contains no test count or
   performance reading.
4. **Size soft cap with overflow.** Every unit type has a budget; excess moves
   to an evidence file and leaves a pointer. No numeric quota exists. Test: an
   over-budget unit carries a pointer to where the excess went.
5. **Unique revision style.** Never keep the original text and append an inline
   correction in the body. Revise by the artifact's own channel: supersession
   for a decision entry, amendment for a spec, a later report for a report.
   Test: the artifact holds one current statement and no in-body correction
   note. Mechanics: `skills/manage-decision-records`, `skills/write-spec`,
   `skills/write-research-report`.

An inline correction leaves both statements standing: the reader cannot tell
which one binds, and the artifact carries the same text twice.

## Workflow

Match the step group to the event that brought you here. A write runs the first
two groups in order; a source change runs the third when it happens; a batch
boundary or topic closure runs the fourth.

**Write-before**

1. Run the five-question ticket on each unit. Drop or reroute units that fail a
   question; do not write around a failed ticket.
2. Write from the ticket answers: source units in full within their tier,
   projections in the one-line form with a first-hand pointer. The genre's own
   writing procedure (see the artifact skill) runs between the ticket and the
   check.

**Verify-after**

3. Run the four checks over what you wrote. Fix failures in place; a failing
   check blocks hand-off.
4. Report the outcome: units by kind, overflow moved, pointers created, and
   anything deferred to the closing batch.

**Source change**

5. Find every live projection of the changed unit and refresh each in the same
   change.
6. If a projection lives in a frozen artifact, do not edit it: route the change
   through that artifact's revision channel.
7. Do not search for projections of a report's interpretation: interpretation
   is source, and changing it creates no refresh obligation.

**Batch boundary or topic closure**

8. Refresh every live projection whose source changed since the last batch.
9. Execute every deferred overflow move and leave the pointers.
10. Reconcile the Progress tree and its projections, correcting the tree first.
11. Report refreshed units, evidence files created, nodes reconciled, and
    anything that still blocks closure.

## Collaboration

This skill owns the structure of records. It cites the owners of expression,
templates, and lifecycle, and restates none of their rules.

- **Artifact skills own paragraph templates.** See `skills/write-spec` (Claims,
  Global Constraints, decision entry slots), `skills/write-research-outline`
  (leaf definition, status line, pre-registration),
  `skills/write-research-report` (narrative, recommendation, and evidence
  segments), and `skills/manage-decision-records` (decision entries and the
  Progress tree). This skill defines the attribute discipline every template
  declares; it defines no template. Templates cite the one-line definition here
  and never restate it.
- **`skills/prose-quality` owns expression.** Three boundaries hold:
  - This skill decides whether a passage belongs and how much; prose-quality
    decides how it is written once it belongs.
  - Content obligations by location type belong to prose-quality's coverage
    table; the source/projection distribution and budgets of a concrete
    artifact belong here.
  - Whether a record is needed at all is this skill's first ticket question;
    prose-quality never rules on it.
- **`skills/trim-cot-leakage` owns pointer health in review.** This skill
  requires a pointer to exist, name a precise location, and land on a
  first-hand source at write time. Detecting and repairing dead, stale, or
  session-bound pointers — including the desync dead text that projection
  chains leave behind — is trim-cot-leakage's.
- **`skills/manage-decision-records` owns decision lifecycle and the Progress
  tree format.** This skill owns the single-progress-board rule and the refresh
  and reconciliation of progress projections; the tree's shape, status
  vocabulary, and entry format are MDR's.
- **`skills/write-research-outline` owns pre-registration content and the
  freezing step.** This skill's completeness check verifies the three parts are
  present; the template and the freeze mark are the outline skill's.
- **`skills/write-spec` owns amendment and freeze semantics.** This skill's
  refresh obligation stops at a frozen artifact and hands the change to that
  channel.
- **`AGENTS.md` pins the programs into the writing flow.** The writing skeleton
  is four steps: this skill's ticket, genre writing, self-check, hand-off. The
  outline light registration is exempt — the ticket collapses to an inline
  one-line judgment and registration completes immediately. The closing batch
  is one item of the topic-closure checklist. This skill does not restate
  orchestration.
- **Review.** A review that checks record structure applies these programs as
  its criteria; the verdict format and evidence rules are
  `skills/structured-code-review`'s.
