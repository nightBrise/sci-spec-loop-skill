# Decision: Research report language and figures

Status: accepted
Date: 2026-09-05
Specs: none — governs the workflow skill repo itself

This record governs the workflow repo itself, whose governance decisions live in
`docs/decisions/` rather than a product `docs/specs/` tree (see `AGENTS.md`). It
extends — without superseding — the research-reporting decision in
`spec-granularity-and-research-reporting.md`, and touches neither the spec-freeze
regime nor the decision-container model of `workflow-governance-v2.md`.

## Problem

The research reporting layer had no rule for the language its deliverables are written
in and no rule for figures. Reports differ from the eight English skill texts: they
are point-in-time deliverables read by the repository owner, whose working language is
Chinese and who steers direction by what these reports say. Writing them in Chinese
collides with `trim-cot-leakage`'s `### Class 8: Authoring-language slips`, which
flags English fragments inside Chinese prose for translation or deletion — while the
reports' cross-file anchors (skeleton headings, leaf status labels, spec anchors,
paths) must stay English to remain greppable and resolvable by the rules that cite
them by name.

Figures had no home anywhere in the repo. The research layer's evidence is mostly
experiment data, measurements, and prototype behavior — curves, distributions,
comparisons, time series; prose paraphrase loses shape information and adds retelling
bias, and the owner steers by exactly those shapes.

## Decision

- **The three research reports — stage, overall, deep-dive — are written in Chinese**
  (home: `skills/write-research-report/SKILL.md`, the skill owning these artifacts).
  Skeleton section headings stay English as stable cross-file anchors: the skill's
  trigger rules and other files reference them by name. Technical tokens — leaf status
  labels, spec and decision anchors, paths, code identifiers — stay untranslated
  inside Chinese prose; the authoritative token list lives in the skill. The language
  → style-file index in `AGENTS.md` (`## 编码规则`) resolves *code* style documents;
  it is not this decision's home and is not extended into a documentation-language
  index. Rationale: the owner, whose working language is Chinese, reads these reports
  to steer direction, while English headings and tokens keep cross-file references
  resolvable and anchors stable under grep — matching the repo's practice of Chinese
  prose with English technical identifiers.
- **Class 8 gains a technical-token exemption, and the reports become its second
  project-rule override instance** (home: `skills/trim-cot-leakage/SKILL.md`,
  `### Class 8: Authoring-language slips`). Class 8 already yields when a project rule
  mandates a writing language for a surface; `references/style/python.md` supplies the
  first instance, the report language rule the second. Without the exemption, Class 8
  would flag the must-stay-English tokens as slips and its translate-or-delete repair
  would break cross-file anchors and traceability. Class 8 keeps full force against
  genuine slips: ordinary English prose fragments in a Chinese report remain slips.
- **Figures are mandatory wherever the evidence is data-shaped** (home:
  `skills/write-research-report/SKILL.md`, `## Figures`). The trigger is evidence
  type, not report-type counts: any finding supported by data, measurement,
  experiment, or prototype behavior is presented by at least one figure; purely
  literature-based conclusions are exempt. A floor supplements the trigger: a stage
  or overall report with any data-backed finding carries at least one summary
  figure. A deep-dive report figures its method and its results — the content that
  makes it the reproduction-detail carrier — each as its own evidence type requires,
  with no deep-dive-specific quota, consistent with the fixed-quota rejection below.
  Figures live in `docs/research/assets/<topic>/`, are named after their report's
  id, and are embedded with relative-path Markdown image syntax; the naming template
  and the caption contract — including the data-source-or-generation anchor that
  makes each figure reproducible — live in the skill. Figures meet the text evidence
  bar: one not traceable to a leaf's evidence reference is decoration and is deleted
  — the same lineage as "Prose is not evidence". Figures freeze with their report:
  image files are never overwritten or edited in place, and dead-end leaves' figures
  carry the same rigor as resolved leaves'. A corrected figure ships as a new file
  in the next report covering the same topic — after closure, a supplementary stage
  report written at the owner's request or produced when a later unattended run ends
  — and the carrying report names the report and figure it corrects; deep-dive
  figures route the same way. A presentation-only error travels this correction
  channel; one that changes a finding updates the living outline first, and the
  corrected figure ships with that leaf's later reports. The rendered image is
  actually viewed before insertion; where a harness cannot read images, verification
  falls back to the generation command's output plus the declared axes, units, and
  data range, and the caption records which verification was used — an unverified
  figure is not verified evidence. Rationale: the reproducibility anchor holds
  figures to the prose evidence standard instead of letting them become unverifiable
  illustration.

## Alternatives Considered

Report language:

- **Write the reports in English, consistent with the eight skill texts** — rejected:
  skill texts are methodology executed by agents, reports are deliverables read by the
  owner; English reports would tax every direction decision with a translation layer.
- **Translate the skeleton section headings into Chinese too** — rejected: headings
  are the stable anchors other files reference by name; translated names would require
  a maintained Chinese-English mapping for every reference, and grep would lose stable
  tokens.
- **Build a documentation-language index in `AGENTS.md`, mirroring the code style
  index** — rejected: only the research reports have a mandated writing language. A
  table in the always-loaded hub document for a single surface would promote a
  skill-level rule to a global one, against one home per rule.
- **Put the language rule in `prose-quality`** — rejected: prose-quality owns
  language-independent editorial rules; which language an artifact is written in
  belongs to that artifact's owner, just as the Chinese-comment requirement for Python
  lives in `references/style/python.md`.

Figures:

- **Optional figures, at the author's judgment** — rejected: optional means usually
  none; prose paraphrase of data-backed findings loses the shape information the owner
  steers by.
- **A fixed figure quota per report type** — rejected: counts breed decorative charts
  to fill the quota, against this workflow's evidence-driven stance ("Prose is not
  evidence"); the evidence-type trigger keeps every figure carrying a finding.
- **Store images at the `docs/research/` root** — rejected: stage reports accumulate
  per topic and each can carry several figures, so the root would become unreadable; a
  per-topic `assets/<topic>/` subdirectory keeps `docs/research/` browsable.
- **Allow figures to be overwritten in place** — rejected: a report is never edited
  after writing and its figures are part of that moment's evidence; overwriting would
  let a committed report's evidence change silently, destroying the report chain's
  value as trustworthy history.

## Consequences

- Both rules ship in `skills/write-research-report/SKILL.md` and the Class 8 adaptation
  in `skills/trim-cot-leakage/SKILL.md`; per one home per rule, no other file gains a
  copy.
- Named gap — documentation language is legislated for reports only: outlines, specs,
  and Decision Logs have no mandated language, so a topic's outline and its reports can
  end up in different languages — accepted for now and left to a future decision.
- Named gap — figures are binary files entering git: no policy on repository size,
  image formats, or large-file storage accompanies this decision, and a long-running
  topic accumulates an append-only image corpus because frozen figures are never
  overwritten.
- Named gap — the mandatory view step presumes a harness that can read images, while
  this repo claims harness independence: the fallback keeps the rule executable on
  text-only harnesses, but verifying a generation command's output and declared axes,
  units, and ranges is weaker than viewing the rendered figure — a known
  verification-strength drop.
- The Class 8 exemption requires the auditor to distinguish an exempt token from an
  English prose slip — a semantic judgment misapplicable in either direction,
  over-deleting an anchor or keeping a genuine slip.
- Corrected figures ship as new files, so the figure history mirrors the report chain:
  more files, but every committed report's evidence stays exactly as delivered.
- Figures are binary and invisible to the repo's text-based review surfaces:
  `trim-cot-leakage`'s rg batteries, `git diff --check`, and `AGENTS.md`'s text-only
  evidence vocabulary all pass over them. The mitigation is the figure row in
  `skills/structured-code-review/SKILL.md`, `## Evidence selection`, which gives a
  figure a checkable evidence form without making it a Layer 1 merge blocker.
