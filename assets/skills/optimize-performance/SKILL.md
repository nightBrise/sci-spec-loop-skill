---
name: optimize-performance
description: Use when optimizing performance, diagnosing a performance regression, designing a benchmark, or deciding a performance gate — registers the campaign's Plan, establishes a calibrated baseline before production changes, and iterates candidates through a versioned measurement card with append-only Runs until the registered stopping rule fires.
---

# Optimize Performance

Turn "make it faster" into measured, comparable results: register the campaign, measure the baseline, change one causal factor at a time, and adopt only what the registered evidence supports. This is guidance, not a script. The skill prescribes no tool, no threshold, and no sample count — every number comes from the campaign's own registered Plan, and a measurement that cannot say what it compared proves nothing.

- **Claims and acceptance:** `skills/write-spec` owns Claim wording, freeze, and the After-freeze channels; the outcome vocabulary for any Claim (`met` / `unmet` / `unevidenced`) is the spec's.
- **Orchestration:** `AGENTS.md` owns the budget check, the stop list, the acceptance gate, and the role contract; a campaign is a build or explore work item under the normal triage.
- **Progress:** `skills/manage-decision-records` owns the tree and state words; the campaign reports through its owning node.
- **Isolation:** `skills/test-reliability` owns resource allocation and quiescence; this skill applies it to the measured process.
- **Record structure:** `skills/record-discipline` owns the source/projection model and the write-before ticket; the measurement card below is a first-hand evidence record.
- **Governing rule:** no comparison without a registered basis — a Run is evidence only against the Plan version it cites.

## Inputs and exclusions

**Inputs.** The performance goal, gate requirement, or regression report; the operation to measure; existing benchmarks, calibration records, and prior measurement cards; the environment the result must hold in.

**Mode.** Optimization — a candidate change is iterated against a baseline. Gatekeeping — a performance Claim or gate needs acceptance evidence, with no change yet. Diagnosis — a regression is explained; a diagnosis-only request stays read-only and reports through its owning explore item.

**Scope.** Campaign registration, baseline validity, measurement-card structure, iteration and stopping, adoption, and comparability.

**Always excluded.**
- Claim wording, freeze, and change channels: `skills/write-spec`. A measurement change that alters what a Claim promised routes through its owning After-freeze channel, never a Plan edit.
- Progress nodes and state words: `skills/manage-decision-records`.
- Test-level concurrency, allocation, and teardown method: `skills/test-reliability`.
- Tool selection, benchmark frameworks, profilers, and gate wiring: ordinary project work; this skill owns the measurement discipline, not the tooling.

**Exemptions.**
- **Diagnosis-only.** A read-only regression explanation that changes no production code and adopts no candidate is not a campaign; it registers as an explore item (`AGENTS.md` triage, `skills/write-research-outline` preregistration).
- **Card reuse.** When a calibrated card already covers the operation, the benchmark field cites it and the campaign does not redesign or rewrite the cited measurement; its own Plan still carries the scope assertion, hypothesis, guards, stopping rule, and evidence home.

## The one test

**The comparability test.** For any difference a Run reports — improvement, regression, or parity — a reader must be able to reproduce both sides from the card: the Plan version governing each measurement, the operation, the exact command, and the registered environment. A difference whose conditions the Plan does not pin (protocol, workload, environment, or sampling changed without a Plan version) is not evidence: mark the comparison `unevidenced` and recalibrate before the next one.

## Taxonomy

### Path selection

| Situation | Path |
|---|---|
| A calibrated benchmark exists, its scope covers this operation, and one causal hypothesis is registered | **Light** |
| The campaign needs a new or recalibrated measurement asset | **Full** |
| More than one independent causal hypothesis is live | **Full** |
| New workload or environment calibration is needed | **Full** |
| Noise or resource tradeoffs are unresolved | **Full** |

- The light path adds no measurement design: it runs inside the cited card's calibrated scope.
- **Escalation.** The moment any full-path trigger appears — including a second hypothesis discovered mid-campaign — stop iterating under the light registration; register the full Plan, recalibrate, and re-baseline before the next candidate. Escalation never happens retroactively: a comparison taken on a light card before the trigger was visible stays valid only within that card's scope.

### Comparison validity

| State | Meaning | Consequence |
|---|---|---|
| Comparable | Both Runs cite the same Plan version, and guards are recorded | The registered verdict rule applies |
| Drifted | Protocol or environment changed materially, or the negative control failed | Affected comparisons are `unevidenced` until recalibration (new Plan version, fresh baseline) |
| Out of scope | The result lies outside the Plan's declared scope | No aggregation or extrapolation beyond the scope a Claim declares |

## What this is not

- **Not a threshold or quota.** No universal number appears here; "fast enough" exists only where a registered acceptance criterion says so.
- **Not the acceptance gate.** Claim outcomes and delivery dispositions belong to `skills/write-spec` and the `AGENTS.md` gate; this skill supplies the measurement they consume.
- **Not stopping-equals-acceptance.** The stopping rule ends iteration, never a Claim; a stopped campaign with an unmet criterion reports `unmet` — execution stopping without acceptance is a designed outcome, not a failure.
- **Not a functional-test replacement.** Behavior guards come from the owning tests; a faster result that changes behavior is a defect, not a win.
- **Not a card per Run.** Runs are append-only entries in one card; a prose report per Run is the failure mode this skill forbids.
- **Not a monitoring or production-experiment skill.** Deployment, production monitoring, and production-side-effect authorization are out of scope.

## Specialized mechanisms

### The measurement card

One campaign, one card: a single evidence record at the campaign's evidence home (under the topic's `evidence/` area) holding a versioned Plan and append-only Runs. A campaign is defined by its measurement scope — one operation under one protocol and environment — never by who runs it; two agents working in one scope feed the same card, and a campaign that needs a different scope opens a new card. The Plan is the first-hand home for every registration field; Runs are the first-hand home for results. A Plan revision before results appends `Plan v2: <changed part>` and leaves the original text untouched; after candidate results, a measurement-semantics change is recalibration — a new Plan version plus a fresh baseline — and if it touches a frozen Claim it takes `skills/write-spec`'s channels.

### Registration (the Plan)

Every campaign registers, before optimization starts: **operation** (the exact measured action and its externally observable completion condition), **acceptance basis** (the Claim, gate criterion, or registered improvement rule a result is judged against), **benchmark**, **baseline and no-change check**, **hypothesis**, **behavior guards**, **resource guards**, **stopping rule**, and **evidence home and writer**.

| Field | Light path | Full path |
|---|---|---|
| Benchmark | pointer to the existing calibrated card, plus the assertion that its scope covers this operation | the benchmark's design or redesign, with its calibration evidence |
| Hypothesis | exactly one causal hypothesis | every live hypothesis, each falsifiable and ranked |
| Baseline / no-change check | reproduce the cited calibration on the unmodified base | fresh baseline; the no-change check shows the unmodified base against the acceptance basis |
| Workload | inherited from the cited card | fixed inputs and dimensions, with why they exercise typical and tail use |
| Entry path | inherited | the production composition measured, built artifacts, and excluded boundaries |
| Measurement semantics | inherited | what the clock covers and excludes, cold versus warm state, retained versus transient resources |
| Environment and sampling | inherited | the environment the result is registered for, and how samples aggregate into the reported number |
| Noise and verdict | inherited | how noise is handled and the rule that decides a result |
| Negative control | — | a deliberately introduced or reintroduced cost the verdict rule must detect |
| Hypothesis ranking | — | the order hypotheses are tried and the basis for the order |

- "Inherited" means asserted by pointer to the cited card's Plan — the light campaign binds itself to that Plan's semantics and never silently redefines them.
- Guards name their evidence source: the owning tests or snapshots for behavior; the registered resource condition (allocation, retention, bound) for resources. A campaign is not gated on guards it did not register, but a relevant guard may not be omitted to make a candidate pass; an uncovered guard is a coverage gap, not an exemption.

### The Run record

Every measurement appends one entry; the baseline is a Run (hypothesis `baseline`, candidate equal to the base revision):

```markdown
### Run <n>
- Hypothesis: <registered hypothesis, or "baseline">
- Change: <what was applied — diff pointer or description>
- Command: <the exact measurement command>
- Base: <revision> · Candidate: <revision>
- Result: <registered aggregate, plus pointer to raw samples at artifacts/run-<n>/>
- Guards: <behavior and resource guard outcomes>
- Disposition: observed | adopted | rejected | unevidenced
```

- Append-only: a correction cites the earlier Run (`see run <n>`); it never rewrites one.
- Raw artifacts live isolated per Run; the card carries results and pointers, never raw dumps (`skills/record-discipline`).

### Baseline before change

- No production code changes for performance before the card holds a baseline Run whose result reproduces the benchmark's calibrated expectation. A baseline that misses calibration is a calibration defect to fix first, not a starting point.
- The no-change check registers how the unmodified base is shown against the acceptance basis. If the base already satisfies it, the campaign closes through the no-change route (accepted in the topic Decision Log, no branch) instead of optimizing.
- For a regression report, the baseline may target the last known-good revision; the same comparability rules then locate the regressing change.

### Stopping and acceptance are different registers

- The stopping rule is registered before the first candidate result is seen and governs iteration only: a candidate budget, a diminishing-returns condition, or guard failure — the campaign's own named conditions, never a universal number. A rule written after candidate results were seen is not a stopping rule; the campaign reports that as a deviation and the acceptance gate rules on it.
- Stopping never moves a Claim, a guard, or the acceptance basis: an unmet Claim does not prove infeasibility, and a met minimum does not demand more iteration.
- An open-ended or direction-only campaign — no registered acceptance criterion — never reports `met`. It reports observations and candidate explanations under the dual-mode rules (`skills/write-research-outline`), and promotion to a confirmed attribution needs a successor investigation.

### Adoption and rejection

- Adopt a candidate only when its Run satisfies the registered improvement rule and every required guard, on a comparable pair. Guards must have run and passed — not be pending, assumed, or waived without a ruling.
- Rejections record a one-line disposition on the Run; the hypothesis stays registered as tried for that scope, and scope never widens to rescue a rejected hypothesis.
- Gains that vanish on the end-to-end path, a material regression on a typical workload, or a resource cost that outweighs the gain are rejections, not candidates.

### Negative control and drift

- The negative control (full path) demonstrates the measurement catches a deliberately introduced cost on the base revision; a control that passes when it should fail voids the card's comparisons.
- A material protocol or environment change — hardware, runner, load, measurement semantics — has the same effect: mark the affected comparisons `unevidenced`, recalibrate through a new Plan version, and re-baseline before the next comparison. Recalibration does not retroactively validate superseded Runs; it re-opens comparison from the new baseline.

### One writer at a time

- A shared card has exactly one writer at a time — the main agent; subagents never edit a shared evidence record (role contract in `AGENTS.md`). A handoff transfers three things to one successor writer: the current Plan version, the latest Run, and every uncollected task report.
- Subagents measure and return task reports: their Run inputs, command, revisions, results, guard outcomes, and artifact pointers. The writer transcribes Runs into the card and keeps raw artifacts isolated per Run.
- Two measurements that can change each other's result — shared CPU, memory pressure, I/O contention, ports — do not run concurrently; the allocation and quiescence method is `skills/test-reliability`'s.

## Workflow

1. Name the work item and mode; search existing cards and calibration for the operation and state what was found, even at zero hits.
2. Pick the path from the taxonomy; watch for escalation triggers at every result.
3. Register the Plan at the evidence home and open the card; every required field for the path is present before any measurement.
4. Run the baseline and the no-change check; only then change production code.
5. Iterate ranked hypotheses one causal factor at a time; one Run per measurement, guards run with every candidate.
6. Apply the stopping rule when its registered condition fires; report Claim outcomes separately from stopping.
7. On a failed negative control or material drift, mark affected comparisons `unevidenced` and recalibrate before the next comparison.
8. Hand off the writer role through the three-item transfer whenever it changes; never leave a card between writers.

**Report content.** The stopping reason and where it fired; Claim outcomes as `met` / `unmet` / `unevidenced`; evidence pointers — card path, decisive Run numbers, artifact homes — and unverified coverage: what the campaign did not measure and which assumptions went unverified, in the task-report form `AGENTS.md` requires.

## Collaboration

- **`AGENTS.md`:** owns the budget check, the stop list, the acceptance gate, and the role contract; subagents return task reports and never write the card.
- **`write-spec`:** owns Claims, freeze, and the four channels; a measurement change that moves what a Claim promised follows its After-freeze channel, not a Plan edit.
- **`manage-decision-records`:** owns Progress nodes and decision entries; calibration rulings and accepted no-change deliveries record there.
- **`write-research-outline`:** owns preregistration and the candidate-explanation boundary; an open-ended campaign reports observations there, never `met`.
- **`test-reliability`:** owns the isolation method; measurement concurrency borrows its allocation and quiescence rules.
- **`record-discipline`:** owns the source/projection model and tickets; the card is first-hand for measurements, and the campaign report points at Runs instead of copying them.
- **`main agent`:** the sole card writer; dispatches measurements, transcribes task reports, and rules adoptions with the owner at the acceptance gate.
