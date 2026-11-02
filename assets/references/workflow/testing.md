# Layered testing for spec-loop runs

This file is the detail home for the test method, the four test tiers that
govern a spec-loop dispatch run, the boundaries between the test gate and the
review gate, and the git pre-commit hook that mechanically enforces L0. The L1
claim-mapping rule is owned by write-spec, evidence selection and test
strength by structured-code-review, reliability design by `test-reliability`,
and the git topology the tiers run on by `github-flow.md` in this directory.

## Test tiers (L0–L3)

| Layer | Scope | When | Enforcement |
|---|---|---|---|
| L0 focus self-test | Changed-file-scoped focused tests | Per slice, before every commit | Git pre-commit hook — mechanical |
| L1 claim mapping | Claim → named verification artifact | At slice completion; checked at review and acceptance | write-spec rule, verified at review and the acceptance gate |
| L2 integration | Cross-slice behavior through real entry paths | At wave completion or after merging into the spec branch | Batch review / slice-merge evidence |
| L3 full regression | Whole suite, plus CI | Before PR merge, and in CI | Merge precondition; never inside a hook |

**L0 — focus self-test.** Before a slice commit exists, the focused tests
covering the staged changed files run and pass. Scoping follows
structured-code-review's evidence selection: the smallest set that covers the
outgoing diff, never the full suite by reflex. The pre-commit hook below
enforces this mechanically — L0 green is a property the hook establishes, not
one the implementer attests to. Its green run is also what structured-code-
review's rule against manually repeating a passing check builds on: the
review verifying the evidence exists rather than re-running it.

**L1 — claim mapping.** Every Claim in a `[Sn]` maps to at least one named
verification artifact from write-spec's evidence list — a test name, a
`file:line` reference, an observable UI state, or a measurable metric; where
the evidence class is a test, it is a named test the slice's run executes. A
claim without a mapping leaves the slice unfinished. write-spec owns this
rule; this file records only its position in the stack: L1 is the
contract-level completion criterion that the L0 run, the review evidence
check, and the acceptance gate all serve.

**L2 — integration.** Cross-slice behavior is exercised through the shipped
entry paths — CLI, loader, worker, subprocess — not through hand-mounted
modules, which do not catch invalid exports or wiring mistakes. L2 runs at
wave completion or after slices merge into the spec branch, catching what
per-slice focused tests cannot: two individually green slices that disagree
at their boundary.

**L3 — full regression.** The whole suite runs before the spec PR merges and
again in CI. It never runs inside a hook: a hook that runs the full suite on
every commit taxes every slice to guard against every regression, while
merge-time plus CI already covers the whole diff exactly where that is
cheapest.

## How to write tests

Write tests against the change, not the file tree. Plan coverage from the diff
before writing assertions, map each Claim to named evidence, and exercise both
the promised path and the paths that must reject.

### Coverage planning

Start from the outgoing diff and list every behavior it adds or changes: a new
branch, a changed default, a new error path, a boundary value, a new entry
path. Each item needs a test at the lowest tier that can observe it, or an
explicit reason it is untested — never silent omission.

| Diff surface | Coverage obligation |
|---|---|
| New or changed branch or default | The promised path plus the path not taken |
| Validation or error path | A rejection asserting the specific failure and unchanged state |
| Boundary constant or range | Minimum, maximum, and just outside |
| Wiring or entry path (export, registration, CLI, config) | One integration-path test through the real entry (L2) |
| Persisted or wire format | Round-trip plus malformed input |
| Bug fix | A test that fails before the fix and passes after |

- Prefer one behavior per test; assert observable outcomes, not internal call
  sequences.
- Prefer the smallest test that reaches the behavior through a public surface.
- A test that passes only because it encodes the current implementation is not
  coverage; structured-code-review owns test strength.

### Claims mapping

Claims mapping is a test-writing obligation: every Claim in a `[Sn]` needs
named evidence, and where that evidence is a test, the test is written for
that Claim. The formal rule is write-spec's; L1 above records its place in the
stack.

- Name the test after the behavior the Claim promises, so the PR description
  can point at it.
- Map at the Claim level, not the slice level: one test may evidence several
  Claims, and one Claim may need positive and negative tests.
- The test must be one the slice's run executes; a skipped, filtered-out, or
  unrun test is not evidence.
- A Claim that cannot be evidenced as written is a deviation to report, never
  a reason to weaken the test.

### Positive and negative design

- Write the happy-path test first: it proves the promised outcome through the
  public surface.
- Add the cases the behavior must distinguish: empty and missing input, minimum
  and maximum, off-by-one edges, malformed input, unmet dependency, forbidden
  caller, and concurrent conflict.
- Negative tests assert the specific failure — error type or discriminant,
  unchanged state, no side effect — not merely that something failed.
- Every guard or validation branch the diff adds gets at least one test that
  exercises the rejection.

The test-behavior iron laws live in `AGENTS.md` (Coding rules); this file does
not restate them. Tests that own concurrency, resources, subprocesses, ports,
clocks, or asynchronous teardown settle their design with
`see skills/test-reliability` before green counts.

## Boundaries

- **The test gate precedes the review gate.** Red tests return the work to
  the implementer; no review runs on a red diff. Review rounds
  are spent on work that is at least mechanically green.
- **A new test failing is a fix loop, not a regression.** It is tracked by
  its own counter, separate from the review-verdict cap: 3 consecutive red
  rounds on the same slice escalate through the stop list, and a green
  commit resets the counter.
- **Previously-green behavior turning red is the regression stop item.** The
  run stops immediately — that is the stop list's real-regression-red, not a
  fix-loop round.
- **The review's test-strength check stays the backstop.** Passing tests
  are a presumption; semantic review keeps it honest (structured-code-review,
  "Test strength"): an assertion that restates the implementation, or a test
  that passes because it encodes the bug, is not evidence even though the
  hook is green.

## The pre-commit hook

The hook turns L0 from a convention into a gate. It is a template each
product repo adapts: the only project-specific piece is the test selector it
calls.

Behavior:

- Collects the staged changed files with `git diff --cached --name-only`
  (deletions filtered out — a deleted path selects no tests).
- Selects the tests for them through a project-configurable command — the
  `TEST_SELECT_CMD` variable, normally the companion `scripts/hooks/test.sh`
  the product repo adapts to its test runner.
- Runs the selection under an internal wall-clock budget
  (`TEST_BUDGET_SECONDS`); a run that exceeds the budget blocks the commit
  like a red run.
- Exit 0 allows the commit; exit 1 blocks it and prints the failing output
  to stderr.
- When changed-file scoping selects no tests (docs-only slices), allows with
  a notice.
- A missing or non-executable selector blocks (fail closed): a silently
  absent gate is worse than a blocked commit.

`scripts/hooks/pre-commit`:

```bash
#!/usr/bin/env bash
#
# L0 focus self-test gate — git pre-commit hook.
#
# Template shipped by references/workflow/testing.md. Keep it generic: the
# only project-specific piece is the test selector (TEST_SELECT_CMD below,
# typically the companion scripts/hooks/test.sh), which each product repo
# adapts to its test runner.

set -u

# ======================= project adaptation point ========================
# Path (relative to the repo root) of the test selector. Contract:
#   stdin:  the staged changed files, one path per line
#   stdout: test commands to run, one per line; empty output means the
#           changed files select no tests (docs-only slices)
#   exit:   0 on a successful selection (including an empty one),
#           non-zero on internal error
TEST_SELECT_CMD="scripts/hooks/test.sh"

# Wall-clock budget for the selected test run, in seconds.
TEST_BUDGET_SECONDS=120
# ========================================================================

main() {
  local root selection log status
  root="$(git rev-parse --show-toplevel)" || exit 1

  if [ ! -x "$root/$TEST_SELECT_CMD" ]; then
    echo "L0: test selector '$TEST_SELECT_CMD' is missing or not executable; commit blocked." >&2
    echo "L0: create it or point TEST_SELECT_CMD at yours (see references/workflow/testing.md)." >&2
    exit 1
  fi

  if ! selection="$(git diff --cached --name-only --diff-filter=ACMR \
        | "$root/$TEST_SELECT_CMD")"; then
    echo "L0: test selector failed; commit blocked." >&2
    exit 1
  fi

  if [ -z "$selection" ]; then
    echo "L0: changed-file scoping selected no tests (docs-only slice?); commit allowed." >&2
    exit 0
  fi

  log="$(mktemp)" || exit 1
  trap 'rm -f "$log"' EXIT

  timeout "$TEST_BUDGET_SECONDS" bash -e -c "$selection" >"$log" 2>&1
  status=$?
  if [ "$status" -eq 0 ]; then
    echo "L0: focused tests green; commit allowed." >&2
    exit 0
  fi
  if [ "$status" -eq 124 ]; then
    echo "L0: test run exceeded the ${TEST_BUDGET_SECONDS}s budget; commit blocked." >&2
  else
    echo "L0: focused tests red; commit blocked (test output below)." >&2
  fi
  cat "$log" >&2
  exit 1
}

main
```

The selector contract is deliberately thin: file paths in, test commands out,
and it sees exactly the staged paths — artifacts kept out of the index by the
project's `.gitignore` never reach it. A minimal pytest-shaped example — adapt
the mapping to the project's layout and runner:

```bash
#!/usr/bin/env bash
# Example selector: pytest. Changed paths on stdin (one per line); test
# commands on stdout (one per line); empty output selects no tests.
while IFS= read -r f; do
  case "$f" in
    tests/*)
      echo "python -m pytest '$f' -q"
      ;;
    src/*.py)
      t="tests/$(basename "${f%.py}")_test.py"
      [ -f "$t" ] && echo "python -m pytest '$t' -q"
      ;;
  esac
done
exit 0
```

### Installation

Option A — `core.hooksPath` (recommended; hooks live in the versioned tree):

```bash
# from the repo root, with the hook stored at scripts/hooks/
chmod +x scripts/hooks/pre-commit scripts/hooks/test.sh
git config core.hooksPath scripts/hooks
```

Two caveats: `core.hooksPath` is per-clone local state, so add the `git
config` line to the project's bootstrap/setup step for fresh clones; and it
redirects every core-hook lookup, so hooks previously sitting in
`.git/hooks/` stop firing unless moved into `scripts/hooks/`.

Option B — copy into `.git/hooks/` (no config change, not versioned):

```bash
cp scripts/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

`.git/hooks/` is not version-controlled, so each clone re-copies; nothing
else moves.

Verify either option: `git config core.hooksPath` prints `scripts/hooks`
(option A), and running `scripts/hooks/pre-commit` directly against a staged
diff reproduces the gate before relying on it. `timeout` ships with GNU
coreutils; on macOS, `brew install coreutils` and point the script at
`gtimeout`.

### The `--no-verify` ban

`git commit --no-verify` skips pre-commit entirely — it defeats the gate, and
is banned alongside force-push (github-flow.md "Commits"; both AGENTS.md
copies' GitHub Flow rules and stop list). A commit made with `--no-verify` is
not an L0-green commit: the main agent treats such work as untested and
returns it to the implementer for a hook-green commit before any merge or
review dispatch.

## Deployment notes (kimi-code harness)

Empirically verified facts about the kimi-code harness, for teams that also
use harness-level hooks alongside the git gate:

- `[[hooks]]` config hot-reloads on `/reload`. Without it, hooks added
  mid-session stay unloaded silently — a hook you believe is gating is not
  running.
- kimi `PreToolUse` hooks do fire on subagent tool calls (verified), but they
  are fail-open: a script error or timeout allows the call, under a
  600-second cap. That shape suits notifications and lightweight
  interception — never the test gate; a gate that allows on its own failure
  is not a gate.
- The git pre-commit hook is the hard gate: verified that a coder subagent's
  red commit is blocked (exit 1) and a green commit passes. This is why L0's
  enforcement lives in git, not in the harness.

The summary of these rules lives in `AGENTS.md`; this file is the detail
home.
