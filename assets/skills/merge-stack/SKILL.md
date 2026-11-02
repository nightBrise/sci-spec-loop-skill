---
name: merge-stack
description: Use when merging a pull request or landing a stacked slice or spec series. Owns landing order, the per-layer merge gate, and propagation of upstream review fixes into downstream layers.
---

# Merge Stack

A stack lands as a sequence: each layer merges only when everything it depends
on is already in its base, its review requirement is met, and its evidence
holds. A review fix does not stay where it was made — it must reach every
downstream layer that carries the affected code before that layer merges.

This is guidance, not a script. See `references/workflow/github-flow.md` for the
git topology and merge method; `AGENTS.md` for the red lines, stop list, and
governance direct-push list; `skills/structured-code-review` for the verdict and
evidence standard.

## Inputs and exclusions

Required inputs:

- The layer list: for each layer, its branch, base, head, and declared dependencies.
- Each layer's review verdict and the evidence behind it, both at the current head.
- The merge method and red lines from `references/workflow/github-flow.md`.

Scope is one merge train: a spec's slice series into its spec branch, or a
stack of spec PRs into `main`.

Always excluded:

- Reviewing the diff; verdicts arrive from `skills/structured-code-review`.
- Writing the PR narrative; `skills/pr-description` owns it.
- Resolving semantic conflicts; a merge conflict is a stop-list item — stop and report.
- Rebasing, force-pushing, or any other history rewrite; a stop-list red line, never a tool.

Exemption: governance direct pushes — the freeze commit, Progress updates, and
DR status transitions on `main` — are not layers: never order them, wait on
them, or merge them as a layer (see `AGENTS.md`, GitHub Flow conventions).

## The one test

Is this layer mergeable on its own evidence — the verdict its review tier
requires, evidence run at the current head, a base that already contains its
dependencies — with no rewritten history anywhere beneath it?

## Taxonomy

| Failure | Sign | Remedy |
|---|---|---|
| Out-of-order merge | A dependent layer lands first, e.g. `[S2]` merges into the spec branch while `[S1]` is open | Re-derive order from live bases before every merge; never merge a layer whose base lags a dependency |
| Lost fix | A review fix lands in layer n while layer n+1 still carries the pre-fix code | After landing a fix, merge the updated upstream layer into every affected downstream layer and re-run its evidence |
| History pollution | A layer is rebased or force-pushed, rewriting history that dependents build on | Update a branch only by merging its base in; stop on any rewrite attempt (stop list) |

## Negative definition

- Not the review — it consumes verdicts, never issues them (see `skills/structured-code-review`).
- Not the PR narrative — the description and its evidence pointers belong to `skills/pr-description`.
- Not conflict arbitration — a semantic conflict stops the run; history rewriting is never the answer.
- Not a merge-method chooser — merge commits and merge-only updates are fixed by `references/workflow/github-flow.md`.

## Specialized mechanisms

### Landing order

- Order layers by dependency, not by PR number, creation time, or review readiness.
- The next mergeable layer is the one whose base already contains every declared dependency.
- Independent layers may land in any order, one at a time.
- Re-derive the order after every merge; each merge moves the bases of the layers above it.

### Per-layer gate

All four hold before a layer merges (merge preconditions: see `AGENTS.md`,
GitHub Flow conventions):

- A contract layer or a PR has an `approve` verdict covering its head, and every commit after it has been re-reviewed (see `skills/structured-code-review`, Incremental re-review).
- Evidence for the layer's Claims was run at the current head (see `skills/pre-push-checks`).
- The base already contains every dependency.
- The diff does not touch the frozen spec (see `AGENTS.md`, pre-merge spec gate).

A mechanical slice is the exception: it merges on its L0/L1 evidence and
receives the batch review at wave completion (see
`references/workflow/github-flow.md`, Slice merge rules).

A failed gate returns the layer to the fix loop; never merge around it.

### Evidence before merge

- Run the layer's evidence before merging it, not merely collect an earlier run.
- Select the checks by change surface with `skills/pre-push-checks`; the test layers are `references/workflow/testing.md`'s.
- When the base advanced after the evidence run, merge the base into the layer, re-run the evidence, then merge.

### Fix propagation

- Treat every review fix as a change with a blast radius: identify each layer above the fixed layer that contains the affected code.
- Land the fix in its own layer first; then merge that updated layer into each affected downstream layer before that layer merges.
- Re-run the downstream layer's evidence after propagation; a red run returns to the fix loop and repeats the propagation.
- When a propagated fix changes a downstream layer's approved scope, run an incremental re-review of that layer (see `skills/structured-code-review`).

### Merge method

- Merge each layer with a merge commit into its base (see `references/workflow/github-flow.md`).
- Never rebase, force-push, or otherwise rewrite a branch (see `AGENTS.md`, stop list).
- Merge one layer at a time; re-derive the remaining order before the next.

## Workflow

1. Read live refs: each layer's base, head, dependencies, verdict, and
   evidence; never trust an earlier plan.
2. Order by dependency; pick a layer whose base contains every dependency —
   any qualifying layer may go first.
3. Gate it: the tier's review requirement, evidence run at the head, spec
   untouched, base current.
4. Run its evidence; red returns it to the fix loop and blocks the merge.
5. Merge with a merge commit into its base.
6. Propagate any fix this layer carried into every affected downstream layer;
   re-run each one's evidence.
7. Confirm the merge landed, re-derive the remaining order, and repeat from
   step 2.
8. Report: the merged order with merge-commit ids, one evidence pointer per
   layer, propagation actions, and every unmerged layer with its blocker.

## Collaboration

- `references/workflow/github-flow.md` owns branch topology, merge-only updates, commit format, and the direct-to-main list.
- `AGENTS.md` owns the stop list, the pre-merge spec gate, and the governance direct-push list.
- `skills/structured-code-review` owns the verdict, its scope after a push, and the evidence standard.
- `skills/pre-push-checks` owns check selection; this skill calls it before every merge.
- `skills/pr-description` owns the narrative and the evidence pointers this skill consumes.
- `skills/write-spec` owns the `Dependencies` declarations that define the order.
