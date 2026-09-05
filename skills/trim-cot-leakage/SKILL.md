---
name: trim-cot-leakage
description: >
  Audit and fix LLM-generated prose that leaks reasoning-session artifacts into
  the repository. Use when reviewing code comments, docstrings, README/docs,
  spec, plan, report, Decision Log, prompts, or UI strings for dead citations,
  change narration, review choreography, hedged planning residue, and other
  chain-of-thought leakage. Provides an 8-class taxonomy, per-class fix rules,
  surface tolerance table, overcorrection traps, and recall batteries.
type: prompt
whenToUse: When reviewing or fixing comments, docstrings, docs, spec, reports, prompts, or UI strings for reasoning-transcript leakage — dead session citations, change narration, review choreography, hedging residue
---

# Trimming Chain-of-Thought Leakage

Chain-of-thought leakage is prose whose vantage is the authoring session rather than the repository — it cites artifacts only that session could see, narrates the change instead of the state, or argues with a reviewer who has left.

**Fix principle:** restate each surviving factual clause to stand at HEAD, then delete the transcript around it. A passage carrying zero propositions is deleted outright.

**REQUIRED BACKGROUND:** prose-quality owns the complete-proposition rule this skill applies before any deletion. It is guidance, not a script.

## The one test

For every suspect passage ask: **could a reader at HEAD, with no access to any session transcript, PR thread, or uncommitted draft, resolve every reference and verify every claim?**

- **No** → restate the surviving facts from the repository's vantage and delete the rest.
- **Yes** → it is not leakage. However, resolvability only clears this skill's bar: on current-state surfaces (code comments, docstrings, READMEs, docs) a resolvable change story is still change narration, and class 3 routes it to its sanctioned home via the surface tolerance table.

## Taxonomy

### Class 1: Dead design-session citations

`(decision 7)`, `(audit C2)`, `design §4.7`, `plan §1.4`, phase labels (`T4`, `W3`, `P-I`), "the design ledger", "(B ruling)".

**Spec-loop equivalents:** dead `[Sn]`/`Cn`/`Dn` references to superseded or uncommitted specs, dead coverage declarations, plan-step labels from abandoned plans.

**Fix:** If the decision has a committed owner (spec, Decision Record, plan file), cite it by name and path. Otherwise delete the citation and restate its factual clause to stand alone.

**Resolvable-anchor protection:** `[S1]`, `D3` anchors in active spec/plan/Decision Log files are committed artifacts — they resolve at HEAD and are NOT leakage.

### Class 2: Stack and PR vantage

"a later PR in this stack", "this PR adds", "the previous commit".

**Fix:** state the shipped mechanism or the extension point; deferred work moves to a `TODO` marker or an issue reference.

### Class 3: Change narration and version stamps

"used to", "no longer", "the old X", indexical stamps ("v1", "this cut", "today", "now" contrasting with a past state).

**Fix:** state the present behavior. A fixed regression becomes a present-tense counterfactual ("without X, Y happens"), never repo history ("used to Y").

### Class 4: Review choreography

"Rejected in review:", "the reviewer confirmed", draft ordinals ("v5 of this note"), round attributions.

**Fix:** keep the surviving decision and rationale as plain fact; delete who said it when. The alternatives-considered genre in Decision Logs is the sanctioned home.

### Class 5: Reviewer-addressed justification

"the cast is safe — it simply…", "this is correct because…".

**Fix:** state the invariant that makes the code safe, or delete the comment if the code shows it. Correctness claims cite invariants or tests, never people.

### Class 6: Restatement and derivation transcripts

control-flow narration ("first we X, then we Y"), test walkthroughs, proofs of obvious branches.

**Fix:** delete; keep only a non-obvious contract or invariant.

### Class 7: Hedges and planning residue

"probably fine for now", "should be enough", deferrals with no marker.

**Fix:** promote to `TODO`/`FIXME` with an owner, or restate as the actual bound with failure behavior. Delete the hedge.

### Class 8: Authoring-language slips

untranslated working-language fragments (端, 设计稿, `---- 私有 ----` separators) in prose whose language is otherwise English, or the reverse in a zh counterpart.

**Fix:** translate or delete. External references that resolve outside the repo (Figma frame names, RFC sections) stay as-is. If a project rule mandates a writing language for a surface (e.g. Chinese comments per `references/style/python.md`, Chinese report bodies per write-research-report's Report language), that rule sets the surface's language and overrides this class; ordinary prose fragments in a language other than the mandated one are still slips and still get translated or deleted.

**Technical tokens keep their form.** A token that is an identifier rather than prose is never a slip in any surface language: values of a controlled vocabulary defined by the rule owning that surface, structured anchors (`[Sn]`, `Cn`, `Dn`), file paths, `file:line` references, code identifiers, spec slugs, and status-field values. Translating one breaks the cross-file anchor or the path that resolves at HEAD, so it stays as written inside prose of either language. Where the rule owning a surface enumerates that surface's own mandated tokens, its list extends the categories above rather than replacing them, and the surface's list prevails where the two conflict.

## What is not leakage

Unaided citation passes fail in both directions — deleting durable references and keeping dead ones. Apply these keep rules as written:

1. **Issue references** — `#1470`, `TODO(name):`, "issue #N owns the follow-up" resolve at HEAD; keep them on any surface, including READMEs. Do not relocate them to Decision Logs.
2. **Merged-PR and issue citations inside Decision Logs and process journals** — these are the sanctioned evidence surfaces in the spec-loop workflow. Prose-quality exempts them from the session-context ban only; the narration ban and coverage rules still apply.
3. **Suppression justifications** — `ruff: noqa … -- reason`, `type: ignore … # reason`, coverage-ignore reasons, empty-catch explanations are required prose; fix a false reason, never delete it.
4. **Counterfactual-present regression pins** — "without X, Y happens".
5. **Measured bounds** — "(measured: 512 nests ≈ 0.15s)" calibrating a constant; the provenance word "measured" is load-bearing.
6. **Runtime old/new states** — "the old connection drains before the new one accepts" is runtime lifecycle, not change history.
7. **Historical stage names inside Decision Log phase entries** — `Phase: implementation (Task 2)` in a Decision Log is the sanctioned home; indexical stamps ("this cut") stay banned everywhere else.
8. **External references that resolve outside the repo by design** — standards sections (RFC 9110 §10.1.5), Figma frame names; the §-ban covers uncommitted internal drafts, not external standards.
9. **Project voice and genre forms** — "we" as project voice; a Decision Log's Rejected field.

## Surface tolerance

Different surfaces allow different leakage classes. This table overrides the blanket ban for specific surfaces:

| Surface | Allows narration? | Allows session references? | Notes |
|---|---|---|---|
| Code comments/docstrings | No | No | Strictest — only HEAD-resolvable facts |
| README/docs | No | No | Current-state only |
| Spec Claims (`[Sn]`) | No | No | Frozen contract |
| Legacy Spec Decisions (frozen specs only) | No | User dialogue as WHY | Historical snapshot; specs written under write-spec carry no `## Decisions` section |
| Decision Log (`.decisions.md`) | No | Phase field + user dialogue | Sanctioned evidence surface |
| Standalone DR (`docs/specs/decisions/`) | No | Merged-PR/issue citations + user dialogue | `## Problem`/`## Alternatives Considered` state the pre-decision state; `## Decision`/`## Consequences` are present tense (per prose-quality) |
| Plan Steps | No | No | For workflows that produce plan documents |
| Delivery summary "What Was Built" | No | No | For workflows that produce delivery summaries; final state, self-contained |
| Delivery summary "Design Decisions" | "we chose X because Y" | No | For workflows that produce delivery summaries; decision framing allowed |
| Research outline leaf | No | Leaf status tags (`dead-end`, `pivot`) + evidence refs | Leaf conclusions and one-line reasons are sanctioned |
| Research report (stage, overall, deep-dive) | No | Leaf status tags (`dead-end`, `pivot`) + evidence refs | A point-in-time deliverable that must stand alone for a reader outside the session; leaf conclusions and their one-line reasons are sanctioned. write-research-report owns the body language (Report language) and the figures with their captions (Figures), so the English technical tokens and section anchors inside a report are sanctioned per Class 8 |
| Process journal | Yes (≤5 items) | `[dead end]`/`[pivot]`/`[lesson]` tags | Sanctioned narrative surface |
| Prompts/UI strings | No | No | Wording is behavior |

## Overcorrection traps

Every trap below is an overcorrection observed in practice. **Enumerate a passage's propositions before trimming it.**

### Trap 1: Flipping an obligation into an endorsement

**Original:** "These direct registrations are exceptions pending migration to slots."
**Overcorrected:** "These direct registrations are sanctioned exceptions."
**Right:** keep the original. "Pending migration" is an obligation; "sanctioned" blesses the status quo. The trim inverted the sentence's modality while shortening it.

### Trap 2: Promoting a hypothetical to a shipped feature

**Original:** "A future IPC-based shell subclasses the executor and overrides `spawn`."
**Overcorrected:** "An IPC-based shell subclasses the executor and overrides `spawn`."
**Right:** "A hypothetical IPC-based shell — no such shell exists — would subclass the executor and override `spawn`." Deleting the future-marker alone turns a design illustration into a shipped claim. Mark the hypothetical explicitly instead of just unmarking the future.

### Trap 3: Deleting a true fact with the transcript around it

**Original:** "The gate notice narrates the check order; the notice text is also what `verify-doc-typecheck` compiles against."
**Overcorrected:** (whole sentence deleted as narration.)
**Right:** "The notice text is what `verify-doc-typecheck` compiles against." Half the sentence was narration; the other half was a load-bearing coupling. Delete clauses, not sentences, when propositions share a line.

### Trap 4: Dropping provenance while keeping the number

**Original:** "The 4 MiB ceiling is measured: the largest generated module is 3.1 MiB."
**Overcorrected:** "The ceiling is 4 MiB; the largest module is 3.1 MiB."
**Right:** keep "measured". Without it the 3.1 MiB reads as a definition rather than an observation, and nobody re-measures before raising the ceiling.

## Recall batteries

Probes for the taxonomy. Every hit needs semantic judgment — the batteries over-match by design, and they under-match by nature, so pair them with an unpatterned read of the densest prose in scope.

### Invocation rules

- Add `--hidden --glob '!.git/**'` so dot-directories are searched; ripgrep skips them by default.
- Exclusions go last so a later include cannot re-admit them: `--glob '!__pycache__/**' --glob '!.venv/**' --glob '!<external-dependency-dir>/**' --glob '!node_modules/**'`. Also exclude the skill's own directory (it quotes leaked wording as calibration) and recorded fixture/snapshot directories.
- Natural-language lines carry `-i` so sentence-initial capitals hit; numeric code-token patterns in the batteries (e.g. `\bW\d\b`, `\bT\d\b`) stay case-sensitive — `-i` would turn them into noise. `[Sn]`/`Dn` anchors are not probed raw: the class 1 resolvable-anchor rule protects them.
- A zero-hit pattern proves nothing until you have seen it match: test it against a known-positive string before trusting the negative.

### English battery

```sh
rg -n --hidden '\(decision \d|\(audit [A-Z]\d|design §|plan §|design ledger|\(B ruling|\bP-I\b|\bW\d\b|\bT\d\b' ...
rg -n --hidden -i 'this PR|this branch|this stack|later PR|previous commit|this commit' ...
rg -n --hidden -i 'used to |no longer|previously|the old |was renamed|was moved' ...
rg -n --hidden -i '\bv1\b|this cut|\bcut \d|\btoday\b|\bfor now\b|roadmap' ...
rg -n --hidden -i 'rejected in review|review round|reviewer|as of v\d' ...
rg -n --hidden -i 'probably |should be enough|should suffice|it simply|is safe —|is safe --' ...
rg -n --hidden '§\d' ...
```

### Chinese battery

```sh
rg -n --hidden '设计稿|评审|上一?轮|旧版|老的|不再|以前|本版|遗留|私有' ...
rg -n --hidden '(^|[^a-zA-Z])端([^a-zA-Z]|$)' --glob '*.md' ...
```

### Known false-positive families

Judged and kept as false positives in past purges; expect them again:

- **Instrumental "used to"** — "the key used to sign requests" is instrumental, not temporal.
- **Runtime old/new** — "the old connection drains before the new one accepts" names live objects during handover, not repo states.
- **"This PR" in process docs** — documentation *about* PR workflow legitimately says "PR"; the ban is on a doc adopting one PR's vantage about the code.
- **`v1` as protocol or path segment** — `/v1/chat` endpoints and wire-format names are identifiers, not version stamps.
- **`§N` with a committed owner** — external standards (RFC 9110 §10.1.5) and committed docs that own their §-numbering stay citable by section.
- **"Today" in generated timestamps and CLI output samples** — recorded output keeps its voice.
- **本版本 in zh prose** — a legitimate rendering of "this release" in versioned-artifact contexts; the banned indexical is 本版 as a bare stamp mirroring "this cut".
- **English technical tokens on a surface whose language is mandated zh** — `dead-end`, `[S3]`, `docs/research/<topic>.md`, and a `<report>.md:41` reference inside a Chinese report body are identifiers under Class 8's technical-token rule, not authoring-language slips.
- **`[Sn]`/`Dn` anchors in active spec/plan/Decision Log** — these are the spec-loop anchoring system, resolvable at HEAD, not leakage.

## Workflow

1. **Scope and exclusions** per prose-quality: require an explicit scope; apply its always-excluded list (external dependencies, generated files, test fixtures and snapshots, frozen specs and research reports — scanned and reported on only). This skill's own directory (it quotes leaked wording as calibration) and recorded fixture/snapshot directories are additionally excluded. Frozen spec `[Sn]` anchors are protected (class 1 resolvable-anchor rule).

2. **Audit read-only first:** run the recall batteries with `--hidden` (see invocation rules), then judge every hit semantically. The batteries are probes, not the definition — they under-match by nature (see Recall batteries), so also read the densest prose in scope (module docstrings, READMEs, Decision Records) without a pattern in hand.

3. **Fix owner-first per surface:**
   - Generated catalogs → fix the source docstring or generator template, then regenerate
   - Model-visible strings → wording is behavior, flag for snapshot-backed change instead of silently rewording
   - Bilingual pairs → update the counterpart (if a surface has a derived/paired counterpart, update it)
   - Decision Log → session-context entries are tolerated per surface table; dead citations are fixed
   - Research reports → report findings only; never edit a written report and never overwrite a figure file it cites. A figure error that changes no finding is corrected by a new figure file carried by the next report covering the same topic or leaf — once the topic has closed, by a supplementary stage report written at the owner's request or by a stage report from a later unattended run (write-research-report's `## Figures` owns the channel's rules)
     - A figure error that changes a finding is substantive: the living outline (leaf status or conclusion) is updated first, and the corrected figure ships with the next report covering that leaf

4. **Overcorrection check before deleting:** enumerate the passage's propositions (per prose-quality's complete-proposition rule), then check the 4 overcorrection traps:
   - Does deleting flip an obligation into an endorsement?
   - Does deleting promote a hypothetical to a shipped feature?
   - Does deleting remove a true fact that shares a line with the transcript?
   - Does deleting drop provenance while keeping the number?

5. **Verify:** re-run the batteries expecting only sanctioned keeps (surface tolerance table entries) and this skill's own directory (it quotes leaked wording as calibration); confirm every remaining citation resolves at HEAD; run the gates for touched surfaces (lint, typecheck, git diff --check, behavior tests for visible strings per prose-quality workflow).

## Collaboration

This skill is the detection/repair layer. It references prose-quality as its standard:

- **prose-quality** owns the complete-proposition rule — trim-cot-leakage enumerates propositions before every deletion to ensure no factual clause is lost
- **prose-quality** defines the surface coverage requirements — trim-cot-leakage's surface tolerance table supplements them with leakage-specific rules
- **structured-code-review** invokes trim-cot-leakage as part of its "prose quality" blocking requirement
- **write-spec** — the Decision Log is a sanctioned surface per the tolerance table; frozen legacy specs keep their historical `## Decisions` sections as snapshots
- **manage-decision-records** — the Decision Log and standalone Decision Records it governs are leakage-checked surfaces per the tolerance table
- **write-research-outline** — the living outline is a leakage-checked surface per the tolerance table
- **write-research-report** — the stage, overall, and deep-dive reports are leakage-checked surfaces per the tolerance table: self-contained for a reader outside the session, never edited after writing. It owns the report body language Class 8 defers to and the figures whose captions freeze with each report
- **simplification-audit** — the candidate proposals it writes are standalone Decision Records, a leakage-checked surface per the tolerance table
