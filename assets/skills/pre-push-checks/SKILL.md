---
name: pre-push-checks
description: Use when about to `git push`, republish an authorized rewrite, mark a branch ready for review, or claim that checks pass — selects the minimal local check set for the outgoing change surface, runs each check once, and reports only what actually ran.
---

# Pre-Push Checks

This is guidance, not a script. A push is a claim that the change is worth someone else's time, and the evidence must be commensurate with what changed. Inspect the outgoing change, select the smallest set that covers it, run each check once, and go out with the results.

- **Floor:** L0 is the floor — the git pre-commit hook gates slice commits; `references/workflow/testing.md` owns the L0–L3 tiers and the hook.
- **Push rules:** `references/workflow/github-flow.md` owns push, rewrite, and PR conventions, including which pushes are permitted; this skill adds none of its own.
- **Suspect tests:** a change to a concurrency-, resource-, subprocess-, or async-heavy test does not count green until its design is settled (`see skills/test-reliability`).
- **Governing rule:** run the smallest set that covers the change — never the smallest set you can justify skipping.

## Inputs and exclusions

**Inputs.**
- The outgoing change: every commit the remote ref will receive, plus index or worktree content only if this push publishes it.
- The session evidence ledger: checks already run for this tree (see "Evidence ledger").

**Mode.** Interactive — the person may overrule the selection; record the reason in the report. Unattended — no overrule; a selected check that cannot run stops the push and is reported.

**Always excluded.**
- Deciding what behavior to test: `references/workflow/testing.md` owns the test method.
- Judging test strength: `structured-code-review` owns it ("Test strength"; `see skills/structured-code-review`).
- Exhaustive regression, the platform matrix, credentialed services: CI owns them.
- Watching CI after the push: a pending check is reported as pending.

**Exemptions.**
- A push publishing no new tree (the remote ref already equals local `HEAD`) has no outgoing change; verify the refs and stop.
- A merge-only update whose diff against the remote base is empty selects no checks; say so.

## The failing-check test

For each changed surface, name the check that would fail if that surface regressed. If you cannot name one, the change is not ready to push.

## Change surface to check

| Surface | Selected check |
|---|---|
| Source code behavior | Focused test file or test name owning the changed behavior |
| Added or modified tests | The new or changed tests themselves |
| Docs (README, specs, prose-only comments) | The project's documentation consistency check (build, link check, or doc-sync) |
| References and links (`see <path>`, anchors, URLs) | Resolve each added or changed pointer; the file and the section exist |
| Config, manifests, build entries | Build plus a smoke run of the artifact the config feeds |
| Public interface, schema, or wire format | Owning contract test plus one consumer-path smoke |
| Dependency or lockfile change | Build smoke plus the tests of the modules that import it |

- Take the union across touched surfaces and deduplicate: one command may discharge several rows.
- Broaden to the package or module only when the diff crosses that boundary; full regression is L3, at PR merge and in CI.
- A filtered run counts only when the runner reports a non-zero selected test count.
- When the owning tests are unclear, use the project's test discovery, then read the selected tests before trusting the run; discovery misses behavior reached through configuration, subprocesses, workers, or built artifacts — select those explicitly.
- A skipped, suppressed, or silently narrowed check is not evidence; report it as not run.

## What this is not

- **Not a full-suite launcher.** Reflexive whole-suite runs on every push pay for everything to catch anything; L3 and CI own that cost.
- **Not a permission slip.** A push without the selected checks is a bare push, however obvious the change looks.
- **Not a re-run ritual.** A green already proven for this tree is spent; only an edit to that surface invalidates it.
- **Not CI's local stand-in.** CI owns the platform matrix and exhaustive coverage; a local green does not predict CI green, and a local failure is not excused by hoping CI differs.
- **Not a test-design authority.** An unreliable test is a `test-reliability` question, never a retry question.

## Specialized mechanisms

### Evidence ledger
- Record each run as it happens: the exact command, the result, and the tree it ran on (`HEAD`, dirty or clean).
- A result binds to its tree; after an edit, re-select and re-run only the checks whose surface the edit touched.
- The ledger is session state feeding the report, not a committed artifact.

### Outgoing range shapes
- Ordinary push: commits on local `HEAD` the remote ref lacks; a dirty worktree is future work until this push will publish it.
- Republished history (where the owning rules permit a rewrite): the range is every rewritten commit; evidence tied to the old tree is void.
- Merge-only update: diff against the remote base; only paths the merge introduces select checks.
- Ready for review: the whole PR diff from its base, not the last commit.

### Hooks
- A harness `Bash` hook may print an evidence reminder before `git push`; it is advisory and fail-open, and this skill is the procedure when no hook exists.
- L0's green belongs to the git hook; do not re-run its selection at push time, and do not bypass it (`references/workflow/github-flow.md` owns the ban).

### Failures
- A selected check fails: stop and fix, then re-run that check; never push hoping CI differs.
- An environment-specific failure must be proven before it is attributed: record the command, the failing assertion, and the platform mismatch, and confirm the non-platform evidence.
- A check that cannot run is reported as not run; when it is required for the claim, the push waits.

## Workflow

1. Confirm the checkout, the branch, and the remote ref this push updates; compute the outgoing range against it.
2. Classify every changed path against the surface table; take the union and drop duplicates.
3. Route risky tests: if the range adds or changes a concurrency-, resource-, subprocess-, or async-heavy test, settle its design first (`see skills/test-reliability`).
4. Run each selected check once, writing the ledger entry as it finishes.
5. On failure, fix and re-select; do not push until the failing surface is green on the current tree.
6. Push, then verify the remote ref matches local `HEAD`.
7. Report only what ran: each command, its result, and the tree state; list selected-but-unrun checks with the reason; name the verified ref.

**Report content.** Exact command lines and observed results, the tree they ran on, and every selected check that did not run with its reason. A check not run, a filtered run that selected nothing, or a pending CI job is never reported as passing.

## Collaboration

- **`references/workflow/testing.md`:** owns the L0–L3 tiers and the pre-commit hook; this skill sits above L0 and below L3.
- **`references/workflow/github-flow.md`:** owns push, rewrite, and PR rules, including the ban list; this skill selects evidence, never permissions.
- **`test-reliability`:** owns test reliability design; this skill forwards risky test changes and consumes its verdict before accepting green.
- **`structured-code-review`:** owns test strength and review-side evidence admissibility; review checks that the reported evidence exists rather than re-running it.
- **`main agent`:** invokes this skill before a push, a ready-for-review transition, or any claim that checks pass.
