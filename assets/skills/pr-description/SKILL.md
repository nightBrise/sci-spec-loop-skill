---
name: pr-description
description: Use when creating a pull request or updating its description after review rounds make it stale. Owns the PR narrative — Motivation / Changes / Testing / AI Usage — and the workflow's minimum items — spec path, Claims evidence pointers, claims-deviation list, and deferred-scope list.
---

# PR Description

The PR description is the deliverable narrative: what the change does, why, how
it was verified, and how it reconciles with its spec. It is also the acceptance
gate's reconciliation entry — the claims-deviation and deferred-scope lists it
carries are the material that gate rules on.

This is guidance, not a script. See `references/workflow/github-flow.md` for
branch, commit, and PR topology; `skills/structured-code-review` for the verdict
and evidence standard; `skills/write-spec` for Claims and the two list types.
This skill owns only how the description is written.

## Inputs and exclusions

Required inputs:

- The PR's base and head, and the diff between them.
- The governing spec path and its `[Sn]` Claims.
- The feature's `.decisions.md` — the deviation and deferred-scope entries.
- Evidence actually produced: named tests, command output, `file:line`.

A missing required input is reported and stops the write; never reconstruct an
entry from memory.

Scope is the PR's own diff against its base; for a stacked PR, that is this
layer only.

Always excluded:

- Version history and review chronology — describe the current head, not how it got there.
- Design essays beyond what the diff needs; rationale lives in the spec and `.decisions.md`.
- Pasted logs as body text; keep the pointer and result, and put long output in a collapsed block or a linked artifact.
- Session narration — no transcripts, timestamps, or tool calls.

Exemption: `## AI Usage` is the one place the description states who did which
work; it still carries no session detail.

## The one test

Can a reader who never saw the session verify every sentence and every list
entry against the diff, a named test, or a spec record? A sentence that matches
none of the three is the lying description this skill exists to prevent.

## Taxonomy

| Defect | Sign | Remedy |
|---|---|---|
| Unbacked claim | `Changes` asserts a behavior no test exercises — "retries back off exponentially" with no timing test | Delete the sentence or add the test before merge |
| Stale section | The head moved after the description was written and the sentence describes the old behavior | Rewrite the affected sections against the current head |
| Missing reconciliation item | The spec path, a deviation, or a deferred-scope entry is absent from the description | Copy the entry in; never reconstruct it from memory |
| Layer bleed | A stacked layer's description narrates another layer's changes | Cut every sentence not backed by this layer's diff against its base |
| Changelog drift | The description records rounds, fixes, or previous states | Restate the delivered state only; history belongs to git |

## Negative definition

- Not a changelog — no version history, no round log, no previous-state sections.
- Not a design document — motivation stops at what this diff needs.
- Not a log dump — evidence pointers and results, not raw output.
- Not a commit list — group by behavior, not by commit.
- Not a review transcript — no reviewer dialogue, no per-comment dispositions.

## Specialized mechanisms

### Section contract

Four second-level headings, in this order. The minimum items ride inside them;
never add a fifth heading.

| Section | Must state |
|---|---|
| Motivation | The problem in one sentence and the outcome this PR delivers |
| Changes | Interface and behavior changes the diff guarantees, state None where a kind is absent; the claims-deviation and deferred-scope lists at the end |
| Testing | The test design mapping coverage to each Changes item, then one entry per run: what ran, the behavior it covers, the result, local or CI; tag each entry with the Claims or `[Sn]` that it evidences |
| AI Usage | What the AI did — implementation, review, or none — and who made the decisions |

- `Changes` lists only behavior the diff guarantees and tests cover. Untested behavior is untested work or an untested claim; fix the gap instead of narrating around it.
- Interface changes cover the consumer-visible surface: API, config, CLI, protocol, persisted format.

### Minimum items

- **Spec path** — in `Motivation`: `docs/specs/<slug>.md`, the frozen spec this PR delivers.
- **Claims evidence pointers** — in `Testing`: every entry names the Claim or `[Sn]` it evidences; a Claim with no entry is a gap to report, not to omit.
- **Claims-deviation list** — at the end of `Changes`: one line per deviation — the Claim, what shipped instead, and why — transcribed from `.decisions.md`.
- **Deferred-scope list** — at the end of `Changes`: every adjacent-scope entry the frozen spec did not absorb, transcribed from `.decisions.md`.

The claims-deviation and deferred-scope lists are the acceptance gate's
reconciliation material: the gate rules on each deviation and reports both
lists with evidence, so every entry appears, not a summary (see `AGENTS.md`,
Main loop).

### Evidence entries

- One entry per test or command actually run; state the command, the covered behavior, and the result.
- Mark whether the run is local or CI; never list a run that was not observed.
- Long output belongs in a collapsed block or a linked artifact; the entry keeps the command, counts, and result.
- Select the checks with `skills/pre-push-checks`; the evidence standard is `skills/structured-code-review`'s.

### Stacked PRs

- Each layer's description covers only that layer's diff against its base.
- State the position in one line and link the layer below; never restate lower layers' changes.
- When an upstream fix propagates into this layer, update this layer's `Changes` and `Testing` before its merge (propagation: see `skills/merge-stack`).

### Keeping it true

- The description is part of the deliverable; a stale or lying description is a defect, not an omission.
- After a review round changes behavior, evidence, or AI participation, rewrite the affected sections to the current head.
- Overwrite sections; never append an update history.

### AI Usage

- State which stages the AI performed — implementation, review, or none — and which decisions a human made.
- Write settled facts; no session references, no hedges about what may have happened.

## Workflow

1. Re-read the current head and diff; discard every description fact that no
   longer holds.
2. Collect evidence pointers from task reports and actual runs; drop any
   pointer you cannot open.
3. Write `Motivation` from the spec's problem statement; add the spec path.
4. Write `Changes` as behavior guarantees; append the claims-deviation and
   deferred-scope lists from `.decisions.md`.
5. Write `Testing` as design then entries; select checks with
   `skills/pre-push-checks`.
6. Write `AI Usage` for the work that ends up in this PR.
7. Self-check with the one test and the Taxonomy; fix each hit.
8. Report: the description location, the reconciliation items answered, and
   every evidence gap that remains.

## Collaboration

- `references/workflow/github-flow.md` owns branch and commit topology and the minimum-item list; this skill owns how each item is written.
- `skills/write-spec` owns Claims, deviations, and deferred-scope semantics; this skill transcribes them and never reclassifies an entry.
- `skills/structured-code-review` owns the verdict and the evidence standard; this skill records what the review concluded.
- `AGENTS.md` owns the acceptance gate that reconciles the two lists.
- `skills/merge-stack` consumes the evidence pointers and propagates fixes that make a description stale.
- `skills/pre-push-checks` selects the checks reported under `Testing`.
- `skills/prose-quality` and `skills/trim-cot-leakage` govern the description's prose.
