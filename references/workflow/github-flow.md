# GitHub Flow for spec-loop runs

The git conventions that govern a spec-loop dispatch run: how branches,
commits, merges, and the pull request are shaped so that one spec lands as one
reviewable, revertible change on a `main` that stays deployable. This file
owns the git topology and its gates; the review tiers, the layered test
evidence (L0/L1), and the review checklists are owned by write-spec,
structured-code-review, and the layered-testing rules.

## Branch topology

- One spec = one branch = one PR. The spec branch `spec/<slug>` is cut from
  `main`, and only the spec branch merges into `main` — through the spec's
  single PR. `main` is deployable at every commit.
- Each `[Sn]` works on a slice branch named `spec/<slug>-s<n>` (`[S2]` →
  `spec/<slug>-s2`) and lands on the spec branch by a merge commit.
- A slice with no unmet `Dependencies` branches from `main`. A slice whose
  `Dependencies` are unmet branches from the dependency-satisfied point — the
  branch state that already contains its dependencies' work — stacking on it
  at slice level the way stacked PRs stack on their base.
- Every branch update is merge-only: a branch is brought forward by merging
  its upstream (`main` or the branch it stacks on) into itself. Rebase and
  force-push are banned at slice level exactly as they are at PR level, so no
  branch's history is ever rewritten.

## Slice merge rules

- The main agent merges slices into the spec branch serially, in dependency
  order, always with merge commits — even when the slices were implemented in
  parallel.
- A contract slice (review tier `contract` in its `[Sn]` header) merges into
  the spec branch only after its slice-level review returns `approve`.
- A mechanical slice (review tier `mechanical`) merges on its L0/L1 test
  evidence alone, with no per-slice review round. Its full diff is still
  reviewed twice before anything reaches `main`: the batch review of all
  mechanical slices merged since the last batch review, which runs when a
  dependency wave completes, and the whole-spec review that gates the PR.

## Commits

- One main commit per slice, tagged with the owning section:
  `[S2] feat: <summary>`.
- Follow-up commits fixing review findings keep the tag and switch the type:
  `[S2] review: <what was fixed>`.
- Banned throughout the run: `git commit --no-verify` (it bypasses the L0
  pre-commit gate), `--amend` on any pushed commit, and force-push of any
  kind. Force-push is additionally a stop-list item in unattended runs.

## Direct-to-main list

Three kinds of commits go straight to `main`, with no branch and no PR:

- The freeze commit that adds `docs/specs/<slug>.md` and its
  `<slug>.decisions.md` (write-spec's save-and-confirm commit).
- Progress updates to the `.decisions.md` `## Progress` board.
- Standalone Decision Record transitions (`proposed` → `accepted`/
  `rejected`) in `docs/specs/decisions/`; the main agent commits these
  directly on `main`, and the next review or audit re-checks each transition.

After the freeze, the Decision Log and the Progress board are written only
direct-to-main, never on the spec branch, so every PR diff carries
implementation code alone and merges stay clean.

## Pull requests

- The spec's PR is `spec/<slug>` → `main`, and its description contains at
  minimum: the spec path, each slice's Claims with evidence pointers (test
  names, command output, `file:line` — prose is not evidence), the deviation
  list, and the deferred-scope list. The last two are the same lists the
  acceptance gate reports.
- All three merge preconditions must hold: the whole-spec review has returned
  `approve`; the claimed evidence exists; and the diff does not touch
  `docs/specs/<slug>.md` — the gate that mechanically enforces the frozen
  contract's immutability.

## Stacked spec PRs

- When a spec builds on an unmerged spec, its PR bases on the earlier
  branch. The base is updated only by merging `main` into it. Rebase onto
  the new `main` plus force-push is banned — it rewrites the branch history
  that the stack's descendants are built on.

The summary of these rules lives in `AGENTS.md` (GitHub Flow section); this
file is the detail home.
