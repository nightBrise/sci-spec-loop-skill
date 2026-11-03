# GitHub Flow for spec-loop runs

The git topology that governs a spec-loop run: branch names, commit format,
stacking, and the governance direct-push list. The procedures live in the
workflow skills; pointers are at the end.

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

- The main agent merges slices into the spec branch always with merge commits;
  landing order and fix propagation: see `merge-stack`.
- Review tier decides the slice-level review: a contract slice merges only
  after its slice-level review returns `approve`; a mechanical slice merges on
  its L0/L1 test evidence with no per-slice review round.
- A mechanical slice's full diff is still reviewed twice before anything
  reaches `main`: the batch review of all mechanical slices merged since the
  last batch review, at wave completion, and the whole-spec review that gates
  the PR.

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

- The spec's PR is `spec/<slug>` → `main`; it merges with a merge commit.
- The description and its minimum items are owned by `pr-description`.
- The frozen-spec gate: the PR diff must not touch `docs/specs/<slug>.md`.
  Merge preconditions and landing: see `merge-stack`.
- A spec that builds on an unmerged spec bases its PR on the earlier branch.
  The base is updated only by merging `main` into it; rebase plus force-push
  is banned — it rewrites the history the stack's descendants build on.

## Post-merge rollback

- When merged work turns out wrong — a mistaken acceptance, a real regression,
  a collapsed foundation — the owner rules revert or fix-forward.
- A revert is an ordinary forward commit: never `git reset`, never force-push,
  never `--amend`. One merge per revert commit; several merges roll back in
  reverse dependency order. Revert commits go direct-to-main.
- What rolls back: the deliverable content — everything the reverted merge
  changed. What does not: the records layer — the Progress node updates in
  place ("rolled back, see <sha>"), and the lesson lives in the revert message
  (one line of why) and the redo's spec Claims. A guardrail-grade lesson
  becomes a knowledge-class decision record only at the owner's word.
- A revert that hits conflicts stops and reports (stop list: merge conflict);
  the owner may switch to fix-forward.
- The redo is an ordinary new work item: it re-enters triage and carries the
  fixed deficiency as Claims.

## Hook contract

Hooks are optional per-harness implementations of three abstract guardrails.
The table below is the harness-neutral contract — wire each one to your own
harness's extension points. Kimi Code reference implementations live in
`assets/adapters/kimi-hooks/`; R3 is plain git, portable to any harness via
this repository's `.githooks/pre-commit`. Hooks are fail-open by design: on a
harness without hook capability, the rule layer covers all three completely.

| Hook | Trigger point | Action | Guards | Failure mode | Required capability |
|---|---|---|---|---|---|
| R1 dangerous-command guard | before a shell or git command executes | block commands in the danger set (force-push, rebase, `reset --hard`, `--no-verify`) | merge-only red line; stop-list "history rewrite" | fail-open | pre-command hook |
| R2 push-evidence reminder | before a push | non-blocking reminder of the evidence requirement | "prose is not evidence"; `pre-push-checks` | fail-open | pre-push hook |
| R3 L0 floor | git `pre-commit` | run the product's `scripts/run-l0` (L0 is defined per product; tiers: `testing.md`) | the L0 mechanical floor | no L0 defined → skip with a loud warning | git hooks |

## Pointers

- Before a push, a ready-for-review transition, or any claim that checks pass:
  `see skills/pre-push-checks`.
- Creating or updating a PR description: `see skills/pr-description`.
- Merging a PR or landing a stack: `see skills/merge-stack`.
