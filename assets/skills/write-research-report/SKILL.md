---
name: write-research-report
description: >
  Produce the research-layer reports the project owner steers a research topic
  by: stage reports covering cross-leaf progress since the previous record
  stage report, one overall report at topic closure, and deep-dive reports for
  single leaves whose conclusion outgrows its one-line record. Use when a batch
  of leaves reaches a terminal state, when a research topic closes, when an
  unattended run ends, or when the owner asks for a readout or a formal report.
  Reports aggregate and interpret findings for direction decisions; they never
  restate the outline and never authorize implementation. Record reports are
  write-once after handoff; deliverable reports are reviewed with the owner to a
  final, frozen version.
---

# Write Research Report

Reports turn the accumulated state of a living research outline into deliverables for direction decisions: what changed, what the findings mean, and which ways forward are open. This skill owns the three report forms and their two lifecycles — names, triggers, structure, language, figure requirements, evidence bar, audience, and the review-to-final procedure. It is guidance, not a script: keep every finding traceable to leaf evidence and keep reports at the altitude of findings and options.

**Inputs.** The covered period; every leaf terminal in it, with its evidence references; the decision entries ruled in it. A missing required input is reported and stops the write; never infer a finding, a period boundary, or an evidence reference from context. For a deliverable report, a review change that requires a new input returns the report to `Status: draft` until the input exists.

## The one test

**The altitude test.** A passage belongs in a report only when it changes a direction decision or is needed for the reader to trust a finding. Implementation detail — code layout, API shape, test internals — lives in the spec, the deep-dive report, or the code.

A report passes only when every passage earns its place; one that does not is cut, not shrunk.

## The three reports

| Report | Scope | File | Default lifecycle |
|---|---|---|---|
| stage | one topic, all leaves, since the previous record stage report | `docs/research/<topic>-report-<NNN>.md`, `NNN` counting up from `001` per topic | record |
| overall | one topic, the topic's closing report | `docs/research/<topic>-final-report.md` | deliverable |
| deep-dive | one leaf whose conclusion needs more than its one-line record | `docs/research/<topic>-<leaf-slug>.md` (path owned by write-research-outline) | record |

All reports live beside the outline in `docs/research/`. Ordinal numbering keeps stage record reports ordered without depending on dates: one day of unattended work can produce several checkpoints, and each record report covers the span since its predecessor rather than a fixed interval. A leaf slug must not begin with the reserved prefix `report-` or equal `final-report`, which would collide with the stage and deliverable report names.

## Report lifecycle

Two lifecycles, chosen when the report is opened:

- **record** — a checkpoint. Handoff is final: never edit it afterwards. Later findings and corrections go into a later report covering the same topic or leaf (figures: correction routing). The closed record is what makes the report chain a trustworthy history.
- **deliverable** — a document the owner accepts. The main agent drafts it (`Status: draft`), hands it to the owner (`Status: in review`), and revises it in place from the owner's review (`Status: draft` again); repeat until the owner accepts. The main agent then sets `Status: final` and commits; that commit is the sign-off. After `final` the report freezes and later corrections route like a record report. Git history is the revision record; never create a draft file per review round.

`Status: draft | in review | final` is the header field of a deliverable report: `draft` while the main agent writes or revises, `in review` while the owner reviews, `final` once the owner accepts. It is a production lifecycle, not a decision state machine: no proposed/accepted/rejected states, no supersession; reports stay outside `manage-decision-records` governance. A record report carries no `Status` field; it is final at handoff.

A deliverable report never serves as a stage checkpoint. A stage-span deliverable uses a distinct file name, `<topic>-report-<slug>.md`, because `report-<NNN>` numbering is reserved for record stage reports. If an existing `report-<NNN>` is reclassified as a deliverable by owner ruling, it keeps its name and stops being a checkpoint; the next record report's `Period:` anchors to the last record report, not to the deliverable.

## Boundary with the outline

- The living outline is the research board; leaf status lives in the Progress tree and projects into the outline (see `skills/manage-decision-records`); reports are deliverables derived from it, in one of the two lifecycles.
- A **record** report is never edited once handed off. Later findings and corrections go into a later report covering the same topic or leaf rather than into the closed one — for figures, by the correction routing in the Figures section — because the closed record is what makes the report chain a trustworthy history.
- A **deliverable** report is edited until the owner signs it off (`Status: final`); after that it freezes and later corrections route like a record report. Its revision history is the git history of the file, not a chain of draft files.
- The outline enumerates; the report aggregates, interprets, and recommends direction. A report that copies leaf status without interpreting it fails — the owner can read the outline for enumeration.

## Triggers

Stage reports are checkpoint-driven, not calendar-driven: the workflow runs both interactively and unattended, so no fixed interval fits every topic. Write a stage record report when any of these holds:

- A batch of leaves reached a terminal status (`resolved` / `dead-end` / `pivot`) since the previous record stage report.
- The owner asks for a readout.
- The owner set a cadence for the topic; honor it at the nearest checkpoint.
- An unattended run ended — the stage report is mandatory then, because it is what the owner reads afterward.

An owner request fixes the form and lifecycle: a readout defaults to the record lifecycle; a formal report uses the deliverable lifecycle.

Write the overall report at topic closure: every leaf is `resolved`, `dead-end`, or `pivot` with the pivot's successor leaf itself terminal, and no leaf remains `open` or `in-progress`. It is the topic's default deliverable report: it may be drafted earlier at the owner's request or when the remaining work is acceptance and closure; a draft states its verdict as provisional, and is finalized at closure.

Decide the deep-dive per leaf. The one-line leaf conclusion suffices when the outcome and its evidence pointer fit a single proposition. A deep-dive earns its file when any of these holds:

- Reproducing the result requires method detail beyond a pointer.
- The evidence is a dataset, experiment, or prototype record too intricate to summarize in one line.
- A later leaf depends on how the result was obtained, not only on the result.
- The result overturned a hypothesis in a way that deserves a full explanation.

The leaf conclusion stays the summary and links the deep-dive file (per write-research-outline). A deep-dive is a record by default; when the owner asks for a formal readout, write it as a deliverable and use the same lifecycle.

## Report structure

Stage report skeleton:

```markdown
# <topic> — stage report <NNN>

Date: YYYY-MM-DD
Period: since record stage report <NNN-1> (or since the outline was created)
Outline: docs/research/<topic>.md

## Research question
The topic's question, restated so the report stands alone.
## What changed
Which leaves moved and which experiments ran since the previous report.
## Leaf transitions
Every leaf terminal in the period — resolved, dead-end, pivot — each with its evidence reference.
## Findings
The aggregated findings across leaves, each with its confidence and supporting evidence; the figures for findings in this section appear here, under the trigger and summary-floor rules in the Figures section.
## Direction options
What the findings mean for direction, as options with tradeoffs; the report does not pick for the owner.
## Risks and unknowns
Open questions, threats to validity, unresolved dependencies.
## Suggested next leaves
The proposed next batch of leaves, each typed spec or investigation.
```

Overall report skeleton:

```markdown
# <topic> — overall report

Date: YYYY-MM-DD
Status: draft | in review | final
Outline: docs/research/<topic>.md

## Research question
The question the topic set out to answer.
## Verdict
The answer the research reached, or the reason the question was abandoned.
## Findings
Positive and negative findings across all leaves, each with confidence and evidence; the figures for findings in this section appear here, under the trigger and summary-floor rules in the Figures section.
## Deliverables
The frozen specs, prototypes, and promoted knowledge records the topic produced, cited by path.
## Limitations and unknowns
What the topic did not settle and where the findings are weakest.
## Follow-up options
Directions the owner may take, including leaving the topic closed.
```

The overall skeleton is the deliverable form; a record overall report omits the `Status:` line. A stage-span deliverable adds the same `Status:` line to the stage skeleton. The deep-dive report has no fixed skeleton. It must state the leaf's question, the method, the evidence, the conclusion, and what a reproducer needs. A deliverable deep-dive carries the same `Status:` line. When the leaf's evidence is data, experiment results, or prototype behavior, the deep-dive's figures cover two content classes — the method and the results — and which of the two triggers a figure, together with how many figures result, follows the evidence-type criteria in the Figures section; the deep-dive carries no figure quota of its own. The outline's one-line leaf conclusion stays the summary of record.

## Report language

The body prose of all three reports is written in Chinese. This section is the language home for research reports; the forms kept in their original shape below stay that way by rule, not by slip.

- **Skeleton headings and metadata field labels stay English** — `## Research question`, `## Leaf transitions`, and every other heading in the Report structure skeletons, together with the `Date:` / `Period:` / `Status:` / `Outline:` field labels in their headers. They are stable cross-report structural anchors: the trigger rules in this skill and references in other skills name report sections by these headings, and the field labels keep the three report forms aligned with one another.
- **Technical tokens stay untranslated.** The general token categories are owned by trim-cot-leakage's Class 8; the report-surface increment over them is the set of leaf status values (`pending` / `in progress` / `done` / `dead-end` / `pivot` / `misclassified`) and the report lifecycle values (`draft` / `in review` / `final`) — the leaf status vocabulary owned by the Progress tree in `skills/manage-decision-records`, and the lifecycle vocabulary owned here. The report-surface list extends the general list, and where the two conflict the report-surface list governs. Translating any of these tokens breaks the anchor that keeps a report traceable to its leaves, specs, and code.
- **Text rendered inside a figure follows that figure's own generation constraints**, because the plotting toolchain's font support and localization cost sit outside this workflow's control. The interpretability burden falls on the caption: a caption is report body prose, is written in Chinese, and must let the reader understand what the figure presents without parsing the English inside it.
- **A fenced code block in a report is a verbatim quotation of delivered code, not prose written for the report, so the report language rules do not reach inside it.** The language of the comments inside such a block is governed by the style document for that code's language, indexed in `AGENTS.md`.

## Figures

A figure is evidence and is held to the same standard as text.

- **Trigger by evidence type, not by report type or figure count.** Any finding whose evidence is data, measurement, experiment results, or prototype behavior is presented by at least one figure; a finding resting only on literature is exempt. Triggering per finding keeps every figure evidential and leaves no quota to fill with decorative charts.
- **Summary floor.** A stage or overall report that contains any data-backed finding includes at least one figure summarizing the key findings of the period (stage) or the topic (overall).
- **Location.** Figure files live in `docs/research/assets/<topic>/`, a per-topic subdirectory that keeps `docs/research/` readable as figures accumulate.
- **Naming.** `<report-id>-<figure-slug>.<ext>`, where `<report-id>` matches the owning report: `report-<NNN>` for a record stage report, `report-<slug>` for a stage-span deliverable, `final-report` for the overall report, the leaf slug for a deep-dive report.
- **Reference.** Embed a figure with Markdown image syntax and a path relative to the report file.
- **Caption.** Every figure carries a caption stating at least four things: what the figure shows; its axes and units, where applicable; which finding it supports; and the data source or generation method — script, command, or data-file path — as the reproducibility anchor.
- **Traceability.** Every figure traces to a leaf's evidence reference; a figure that cannot be traced is decoration — delete it.
- **Freeze and correction routing.** A figure freezes with its report: a record report's figures freeze at handoff; a deliverable report's figures freeze at `Status: final`. During a deliverable report's review loop, a figure may be regenerated or replaced as part of the report revision; after freeze, never overwrite a figure file and never edit one in place. A corrected figure ships as a new file in the next report covering the same topic or leaf, and the report that carries it names the report and the figure it corrects. While the topic runs, that carrier is the next stage record report. After the topic has closed, the two stage-report triggers that can still fire carry it: a supplementary stage report written at the owner's request, or the stage report produced at the end of a later unattended run. A corrected deep-dive figure routes the same way, to the next report covering that leaf. Presentation-only errors — a wrong axis label, a series mislabeled in the legend — change no finding, so this routing is the whole remedy. An error that changes a finding is substantive: update the living outline first, at the leaf's status or conclusion, and the corrected figure ships with the next report that leaf produces; the outline is a living board that keeps taking updates, and a report does not.
- **Negative results.** A figure for a `dead-end` leaf meets the same caption and traceability bar as one for a `resolved` leaf, per Negative results carry equal weight.
- **Inspection.** Inspect the rendered figure before inserting it into the report; where the harness cannot read a rendered image, verify instead the output of the command that generated the figure plus the axes, units, and data ranges the figure declares, and state in the caption which verification was performed. An uninspected figure is not verified evidence. Re-inspect a figure after any replacement.

## Reader and altitude

- The reader is the repository owner steering the project who did not participate in the run that produced the report.
- Every report is self-contained: no session-context references, and no phrasing such as "we discussed", "as noted earlier", or their Chinese equivalents. These rules constrain content in any language and apply to the Chinese body prose in full. Each claim carries enough of its basis to stand alone, and anything in the repository is cited by path.
- Reports serve direction decisions and stay at the findings-and-options altitude.
- "Detailed and reasonable" names interpretive quality, not word count: explanation depth earns its place by serving direction decisions; the size soft cap and its overflow rule are `skills/record-discipline`'s.
- The constraint is altitude, not word count; length follows content under that test.
- Report prose obeys the complete-proposition rule owned by prose-quality and is an audit surface for trim-cot-leakage.

## Evidence

- Reports inherit the investigation evidence standard from write-research-outline (Review and evidence): experiment data, measurement, literature, or prototype behavior; the bar is "conclusion is supported and the process is reproducible". Prose is not evidence.
- Every finding traces to a leaf's evidence reference or its deep-dive report, and states a confidence grounded in that evidence.
- Figures are part of the evidence chain: the figure rules in the Figures section — traceability to a leaf's evidence reference plus the caption's reproducibility anchor — are part of this evidence standard.

## Negative results carry equal weight

- A dead-end leaf is reported with the same rigor as a resolved one: the dead-end record is what keeps future work from re-walking the same failed path.
- Hard requirement: a stage or overall report that omits any leaf that reached a terminal status in its covered span — dead-ends included — is incomplete. An overall report without the topic's dead-ends hides the most expensive knowledge the topic produced.

## Reports are records, not decisions and not specs

- A report is a research record, outside manage-decision-records' governance. It carries no decision state machine; `Status:` on a deliverable report is a production lifecycle, not a governance state.
- A knowledge-class conclusion discovered while writing is promoted by the main agent to a standalone `rejected` Decision Record per write-research-outline's handoff rules; the report records the finding, and the promotion has its own governance.
- A recommendation becomes real work only when it lands as a spec leaf in the outline and freezes via write-spec. A report never authorizes implementation directly.

## Writer

The main agent is the sole writer of all three report forms among agents, consistent with the single-writer principle for decisions and progress in `AGENTS.md`. Implementer and investigation subagents supply material upward — leaf conclusions, evidence references, experiment records — and never write report files. For a deliverable report, the owner reviews and rules; the owner may edit the draft directly, in which case the main agent treats those edits as owner rulings and continues from the owner's version.

## Workflow

1. Fix the inputs, the form (stage, overall, or deep-dive per Triggers), and the lifecycle (record or deliverable; defaults per the form table; the owner may rule otherwise).
2. Run `skills/record-discipline`'s write-before ticket over the planned units; a report is a record, and its narrative and recommendation segments are source units under the soft cap.
3. Write from the Report structure skeletons: findings at the Evidence bar, rulings from decision entries, interpretation at the altitude the one test allows.
4. Render and inspect every figure before insertion (Figures, Inspection); drop any that fail traceability.
5. Self-check: the one test on every passage; Report language and its token rules; the negative-results rule — every leaf terminal in the span appears.
6. Hand off. A record report is handed off final; every fix belongs before this step. A deliverable report is handed to the owner as `Status: in review`; revise it in place (`Status: draft`) from the owner's review until acceptance; then set `Status: final` and commit, and freeze it.

**Report content.** The report's path and number; its lifecycle (record or deliverable) and, for a deliverable report, the `Status:` and the owner sign-off commit; the covered period and leaf span; each figure with its verification method (rendered inspected, or command-verified as its caption states); and every gap left open — a leaf whose evidence is missing, an uninspected figure, a finding without its evidence reference.

## Collaboration

This skill is the research layer's reporting layer; write-research-outline owns the board the reports read from.

- **write-research-outline:** the outline is the living board and a projection of the Progress tree's leaf status; reports consume leaf status without restating the outline. Record reports are write-once after handoff; deliverable reports are revised to `Status: final`. The outline skill owns the deep-dive file's path; this skill owns its triggers, structure, and content bar.
- **write-spec:** a report's recommendation becomes work only as a spec leaf in the outline frozen via write-spec.
- **manage-decision-records:** reports are research records outside its governance; knowledge-class conclusions found while reporting are promoted to standalone Decision Records by the main agent per write-research-outline's handoff rules.
- **prose-quality / trim-cot-leakage:** report prose obeys the complete-proposition rule and is a leakage audit surface; reports carry no session context. A deliverable report before `Status: final` is an editable surface; a record report and a finalized deliverable report are scan-only. The Report language section is the project rule that trim-cot-leakage's Class 8 override for mandated writing languages defers to, and its token rule — the report-surface increments over the Class 8 categories — defines which English tokens in Chinese report prose are mandated rather than slips.
- **main agent:** the sole writer of every report; produces a stage report at the end of each unattended run and finalizes deliverable reports with the owner.
