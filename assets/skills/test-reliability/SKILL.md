---
name: test-reliability
description: Use when adding or modifying tests that own concurrency, shared resources, subprocesses, ports, clocks, or asynchronous teardown, or when diagnosing a flaky failure — models the execution topology, allocates resources atomically, and settles isolation and teardown decisions.
---

# Test Reliability

This is guidance, not a script. A test is reliable when it stays correct under the topology it actually runs in — parallel files, worker processes, shared CI hosts — not when it passes alone on a quiet machine. Model the overlap, own every resource atomically, and dispose to quiescence.

- **What to test:** `references/workflow/testing.md` owns the test method, including coverage planning ("How to write tests") and the L0–L3 tiers.
- **When to run it:** `pre-push-checks` owns outgoing command selection and the push gate (`see skills/pre-push-checks`); this skill never builds the outgoing evidence set.
- **How it will be judged:** `structured-code-review` owns the test-strength check and evidence standards (`see skills/structured-code-review`); this skill supplies the reliability criteria.
- **Governing rule:** serialization does not fix isolation — narrow the exclusive scope or change the allocation, never the schedule.

## Inputs and exclusions

**Inputs.**
- A test or fixture being added or changed, with its resources and its runner configuration.
- Or a flaky failure report: job, test name, failure output, frequency, and environment.

**Mode.** Design — the test is not yet trusted, and the design settles before green counts. Diagnosis — an existing failure is explained; a diagnosis-only request stays read-only.

**Scope.** Reliability decisions: execution topology, resource acquisition, process-global state, synchronization, teardown, and proof that the intended failure is caught.

**Always excluded.**
- What behavior to test and how to plan coverage: the test method in `references/workflow/testing.md`.
- Whether a passing assertion is meaningful: `structured-code-review` ("Test strength"; `see skills/structured-code-review`).
- Which commands to run before a push: `pre-push-checks` (`see skills/pre-push-checks`).
- Production concurrency design; test reliability borrows its vocabulary, not its scope.

**Exemption.** A test over pure functions with no acquisition, clock, subprocess, or async work needs no topology ceremony; do not manufacture it.

## The concurrent-copy test

Ask whether a second copy of this test could pass at the same moment as the first. If the answer needs "not at the same time", the test is not isolated — fix the allocation or the ownership, not the ordering.

## Taxonomy of flaky classes

| Class | One-line remedy |
|---|---|
| Shared mutable state — env, cwd, timers, mocks, registries, global fetch | Inject instead of mutate; capture absent-versus-present and restore exactly |
| Port collision — `EADDRINUSE` under parallel runs, green alone | Bind `listen(0)` and read the assigned address after the listening signal; never scan then bind |
| Clock or order dependence — fails at time boundaries, asserts callback order | Inject or fake the clock and restore it; assert observable state, never scheduler order |
| Async teardown race — the next test or job sees this one's work | Register cleanup at acquisition and await child exit, server close, or worker termination |
| Predictable filesystem path — fixture roots overwrite each other | `mkdtemp` per test; exclusive create where absence is the contract |
| Timeout drift — the same literal blocks under load though the lane budget was wider | Size the budget from the lane; raise hook and case budgets together |

A flake is a class, not an instance: fix the class, then search for its other occurrences.

## What this is not

- **Not a what-to-test skill.** A reliable test of the wrong behavior is still wrong; the test method owns that choice.
- **Not flake masking.** Retries, sleeps, whole-file serialization, weakened assertions, and swallowed rejections hide the race; none is a remedy.
- **Not the outgoing runner.** It may run the smallest focused probe to prove its own design; selecting and sequencing evidence for a push is `pre-push-checks`.
- **Not a review verdict.** It supplies criteria; `structured-code-review` rules on strength and evidence.
- **Not a stress-test mandate.** A stress run supplements a deterministic regression; it never replaces one.

## Specialized mechanisms

### Model the execution topology
- Assume overlap across four layers unless the configuration proves otherwise: tests in one file, files or worker processes, independent processes in one job, and jobs sharing a host.
- Process isolation does not isolate host ports, predictable paths, databases, sockets, external services, or inherited children.
- For every acquired resource, answer five questions: who owns it, how it is allocated atomically, what signals readiness, where cleanup is registered, and what signals completion.

### Allocate resources atomically
- Bind port 0 (or take a dedicated port) and read the assigned address only after the listening signal; never scan for a free port and bind later.
- Use `mkdtemp` for per-test roots, unique namespaces for shared services, and exclusive creation where the path must not already exist.
- Keep stable recorded identifiers separate from ephemeral transport addresses; translate inside the fixture.
- A literal path used only as parser input or an expected value is not an acquired resource; leave it alone.

### Contain process-global state
- Treat `process.env`, cwd, fake timers, locale, timezone, module mocks, registries, console hooks, `globalThis`, and global `fetch` interception as exclusive mutable resources.
- Prefer an injected dependency or instance-local adapter over mutation.
- When mutation is required, capture absent-versus-present and restore that exact state, registering restoration immediately.
- Wrap the smallest scope in `try/finally`, with an `afterEach` fallback for a failure before the local cleanup.

### Synchronize on state, not time
- Wait for a readiness event, handshake, owned promise, or observable condition; a fixed sleep is not evidence that setup finished.
- Use barriers or deferreds to place a race at a deterministic point and prove the operations overlap.
- Use a timeout only to bound a wait, never as the condition that makes an assertion correct.
- Set case and hook budgets from the lane; where a timeout is the subject, keep the outer wait far above it.

### Dispose to quiescence
- Register cleanup immediately after acquisition, so an assertion failure also releases the resource.
- Cleanup stops new callbacks, detaches listeners, restores global hooks, terminates owned work, and awaits the completion signal.
- Calling abort, close, or kill without awaiting completion is incomplete teardown.

### Prove the intended regression
- Observe the intended failure before the fix where practical; for a new guard, introduce the rejected case and watch it fail.
- For a race, prove overlap with barriers; repeated execution alone is not a race test.
- For host resources, run independent test processes concurrently when cross-process isolation is the fix.
- Verify external state — files, logs, exit codes, disposal — rather than the component's self-report.

## Workflow

1. Name the mode and the stake: a design risk on a new or changed test, or a reported flaky failure.
2. Inventory the overlap: the layers that can run simultaneously, and every resource the test acquires.
3. Answer the five resource questions; a missing owner, allocator, readiness signal, cleanup, or completion signal is the defect.
4. Decide isolation at allocation or ownership; if the candidate fix is "serialize", return to step 3.
5. Settle synchronization and teardown: wait on state, clean up from acquisition, await quiescence.
6. Prove the intended regression with the smallest focused probe; this is design proof, not the outgoing evidence set.
7. In diagnosis mode, reproduce under the reported lane, classify the failure against the taxonomy, and fix the class and its other occurrences; a diagnosis-only request reports cause and evidence without editing.
8. Stop at the design: outgoing command selection belongs to `pre-push-checks` (`see skills/pre-push-checks`).

**Report content.** The failure class, the resources that lacked isolation, the proof that the intended failure is caught, and the exact commands with observed results. A retried green, a skipped test, or a pending job is never reported as passing.

## Collaboration

- **`references/workflow/testing.md`:** owns the test layers, gate boundaries, and the test method ("How to write tests"); this skill owns reliability inside those layers.
- **`pre-push-checks`:** owns outgoing command selection and the push gate; it routes risky tests here before accepting green, and this skill returns the design verdict plus the focused probe command.
- **`structured-code-review`:** its test-strength check consumes this skill's criteria — isolation, determinism, quiescent teardown, and a proven regression.
- **`AGENTS.md`:** owns the coding rules that bind test code; this skill supplies the reliability procedure behind them.
- **`main agent`:** dispatches this skill when a slice adds concurrency or resource risk, or when a flaky failure is reported.
