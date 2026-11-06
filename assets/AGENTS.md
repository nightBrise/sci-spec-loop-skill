# Sci-Spec-Loop Engineering

Mission: produce trustworthy work under little supervision, and keep process overhead from eating the output. This file is the always-loaded rule set; procedures live in skills, depth lives in references (routing table at the end). One rule, one owner: cite, never restate (short safety invariants may repeat at point of use).

## Role contract

| Who | Does | Never / sole right |
|---|---|---|
| owner | rules at gates: spec freeze, amendment/abandon, acceptance, topic closing | — |
| main agent | dialogue, decomposition, dispatch, review, acceptance | sole writer among agents of decisions, Progress tree, specs, reports |
| subagent | bulk code or prose per dispatch; returns a task report (deviations, deferred scope, evidence pointers, and a coverage-boundary statement — what it handles and what it explicitly leaves out, unverified assumptions included) | never writes contract or decision artifacts (specs, decisions files, CHANGELOG) |

- Small fix = no new Claims + no contract change + one self-contained commit → main agent applies it directly. Larger fix → resume the implementing subagent on its branch.
- Bulk prose (SKILL.md, README sections) may be drafted by subagent; the main agent finalizes.

## Main loop (single entry)

Input → topic (untyped container) → work item → triage test → build / explore branches → topic closing gate.

- **Triage** (the main agent decides; disagreement or misjudgment under unattended → stop as "needs user judgment"): Claims writable now, verifiable without experiment → build; the answer needs experiments → explore. Writable = every Claim value has a source (measurement, standard, requirement); a predicted value is a hidden preregistration → explore.
- Triage fallbacks, when the main question is unclear: the outcome has multiple possibilities and needs experiments → explore; the output is a deliverable → build, a decision basis → explore. Signals: build = implement/add/fix/integrate; explore = feasible?/why?/which/limit?. Demo: quantifiable acceptance → build; open question → explore.
- **Mutual generation**: either branch can spawn new work items of either kind — findings → build items; open questions or anomalies → explore items. Every new item re-enters triage and needs its own dispatch brief.
- **Misjudgment** = deviation labeled `misclassification`: correct through existing channels (judged build but Claims are guesses → abandon any frozen spec if one exists and re-tag as explore; judged explore but investigation converges → new build item); log a decision entry and a Progress node state. No new mechanism.
- **Outline (living board) materializes on demand** — cross-session continuation, tree too coarse, preregistration needed, or owner asks. See `write-research-outline`.
- **Dispatch brief**: implementation = [Sn] verbatim + related decision records + boundaries; investigation = hypotheses + evidence standard; review = spec path + diff scope (prompt composition: see `structured-code-review`).
- **Knowledge recall**: before composing any brief, search standalone DRs and the decision logs for entries touching the work's surface; state the search result in the brief even at zero hits.
- **Assembly is the coverage check**: unquotable Claims, unclear boundary, or unresolvable dependencies = the [Sn] is not dispatchable; return to `write-spec`.

## Contract changes after freeze (four channels)

Route every finding that touches existing claims:

| Channel | When | Action |
|---|---|---|
| ① deviation | Claim cannot be met (technical) | do not change spec; log honestly; the acceptance gate rules on it; no stop |
| ② Amendment | measure written wrong, deliverable unchanged | owner rules on it → amendment batch appended → re-freeze; unattended = stop |
| ③ abandon | foundation gone (deliverable definition changed) | owner rules on it → epitaph + de-link + delete, one commit |
| ④ deferred scope | new scope, claims not contradicted | record entry; ship frozen spec as-is |

- Amend "how to measure"; abandon "what to deliver". Preregistered criteria are strong-frozen: never via ② (owner ruling, or abandon + rewrite).
- Before ruling ①/② on exploratory findings, check the attribution anchor (see `write-research-outline` preregistration): principle-unreachable → ②/③; principle-reachable but method/optimization fell short → ①.
- Touching Global Constraints or Out of Scope = substantive change → stop; owner rules on it; log it as a substantive Amendment.
- Vocabulary map: stop-list terms ↔ channels — deviation = ①, deferred scope = ④, contract error = ②/③.
- Procedures: see `write-spec` After-freeze. Epitaph format: see `manage-decision-records`.

## Topic closing gate

Checklist — all five must pass before a topic may reach terminal state (unattended failure → stop + report; never "close now, fix later"):

1. Epitaphs triaged: knowledge-class → rejected DR (knowledge promotion); situational → condition review.
2. Condition-review report delivered to owner and ruled on.
3. Deferred-scope entries disposed.
4. Deliverables shipped (record report handed off, deliverable report at `Status: final`, or acceptance summary).
5. Governance scan done: `simplification-audit` quick pass (or confirmed no candidates); candidates recorded — they do not block closing; zero candidates is evidence.

- Each closing action yields evidence pointers (triaged N / promoted DRs / cleared N / triggered N / scan scope + candidate count). Prose is not evidence.
- Long topics: the owner may trigger a mid-term check (run this checklist once; the topic stays open).
- Procedures: see `manage-decision-records` (batch handling); deferred disposal: `write-spec`; outputs: `write-research-report` / acceptance gate.

## Unattended envelope

- Budget check at work-item/batch boundaries; insufficient budget → stop + report (the Progress tree is the recovery point). Never degrade quality to keep running.
- Update the owning Progress node at every work-item boundary (start and end) before moving on; an unrecorded boundary is a lost recovery point.
- Fix blockers only; record suggestions, do not chase them.
- A review target rejected 3× in a row → stop + report; a green light resets the count; deviation findings do not count toward the limit.
- 3 consecutive failures on one objective → dispatch a read-only advisor; record the consultation and disposition (advised X / adopted Y / because Z) as a decision entry — closing-triage input.

## Serious-risk stop list (stop + report on hit, unattended)

`History rewrite (incl. force-push)` · `Secret leak` · `Needs user judgment` · `Substantive spec change` · `Real regression red` · `Budget exhausted` · `Merge conflict` · `Environment/CI unavailable` · `Review consecutive rejections at limit` · `Tool permission denied`.

Boundary notes:

- **Deferred scope** (contract correct but incomplete) is NOT a substantive spec change: record the entry, keep going.
- **Contract error** (contradicts a Claim, or modifies Global Constraints) IS a substantive change: stop.
- **Deviation** (a Claim cannot be implemented) is neither: record during implementation, continue the rest of the [Sn], put the deviation in the task report; review reports the Claim as "unmet" with the deviation as explanation — a finding, not a rejection; the acceptance gate rules on it, and an un-ruled deviation is "needs user judgment" → stop under unattended.
- **New test red** (a newly written test fails) is NOT a real regression red: fix-loop territory, own counter; 3 consecutive red rounds in one slice → stop; only green-turning-red is a real regression red.

## Review mechanism

Three carriers (no reviewer role):

| Artifact | Reviewer | Independence |
|---|---|---|
| spec draft (pre-freeze) | owner | contract promises need owner sign-off |
| outline skeleton | owner | direction split is owner input |
| report | owner | the owner is the reader; record reports are handed off final, deliverable reports are signed off at `Status: final` |
| subagent-written code | main agent, or dispatched review | writer ≠ reviewer |
| whole-spec branch (pre-PR) | dispatched review | full-branch scope |
| small prose | main agent self pass | cost consideration |

- Dispatched review = generic subagent + review prompt (composition: see `structured-code-review`).
- Acceptance gate: main agent + owner rule on the deviation + deferred lists (kept in the PR description) before merge.
- Verdicts: approve / needs fixes / reject. Evidence is mandatory — prose is not evidence.

## Coding rules

- **Think Before Coding** — don't assume; don't hide confusion; surface tradeoffs. Details: `references/style/engineering.md`
- **Simplicity First** — minimum code that solves the problem; nothing speculative. Details: `references/style/engineering.md`
- **Surgical Changes** — touch only what you must; clean up only your own mess. Details: `references/style/engineering.md`
- **Goal-Driven Execution** — define success criteria; loop until verified. Details: `references/style/engineering.md`
- These bias toward caution over speed; for trivial tasks, use judgment.
- Error-handling principles: `references/style/error-handling.md`.

Test behavior (iron laws): tests are deterministic (isolation over serialization), order-independent, and self-cleaning (no shared mutable state; unique resources per test). Design methodology: see `references/workflow/testing.md`. Concurrency/resource-heavy tests: see `test-reliability` first.

| Language | Style file |
|---|---|
| Python | `references/style/python.md` |

- Languages not in the index follow project conventions; a product repo's own AGENTS.md index takes precedence over this one. Style documents own their rules; elsewhere cite only. Conflicts with `trim-cot-leakage` Class 8 are resolved by that skill's fix rules.

## GitHub Flow (red lines)

- 1 spec = 1 branch = 1 PR; one [Sn] = one main commit (+ follow-up review commits).
- Merge-only: never rebase, never force-push; never use `--no-verify`.
- Merge in dependency order with merge commits; precondition = review verdict approve + evidence (see `merge-stack`). Branch/commit formats: see `references/workflow/github-flow.md`.
- Post-merge rollback: the owner rules revert or fix-forward. A revert is an ordinary forward commit — never reset, never force-push — one merge per revert commit, executed direct-to-main; the lesson lives in the revert message and the redo's spec Claims (a knowledge DR only at the owner's word). A revert that hits conflicts stops and reports; the owner may switch to fix-forward.
- Governance direct push (main agent, no branch/PR): spec + decision freeze commits, Progress updates, standalone DR status transitions, owner-ruled revert commits.
- Event hooks: before push or marking ready → run `pre-push-checks`; creating/updating a PR → see `pr-description`; merging → see `merge-stack`.

## Skill catalog (one rule, one owner; cite, don't restate)

Load the skill when a task hits its trigger:

| Skill | Owns | Trigger |
|---|---|---|
| `write-spec` | contract writing ([Sn]/Claims, freeze, After-freeze change semantics) | build work item starts; amendment/abandon/deferred handling |
| `write-research-outline` | board writing (on demand), preregistration, dual-speed registration | outline materialization; lightweight registration; before experiments |
| `write-research-report` | explanatory writing (stage / overall / deep-dive; record or deliverable lifecycle) | leaf batches terminal; topic closing; owner asks for a readout or formal report |
| `manage-decision-records` | decision governance, epitaphs, Progress-tree format, closing batch | adding/revising decisions; amendment bookkeeping; closing triage |
| `record-discipline` | record structure discipline (source/projection, budgets, ticket/verify/batch programs) | before writing any record; review; closing; source change |
| `prose-quality` | expression standard | always: writing/reviewing/fixing/trimming prose |
| `trim-cot-leakage` | session-leakage detection and repair | reviewing/fixing prose |
| `structured-code-review` | review methodology (two layers, evidence, dispatch-review prompt) | self pass; PR/diff/task-output review |
| `simplification-audit` | architecture simplification (delete maintenance obligations) | user request; stage-exit routine (closing checklist 5) |
| `pre-push-checks` | push gatekeeping (minimal check set + evidence) | before push / ready / claiming "checks pass" |
| `pr-description` | PR narrative (four sections + acceptance minimums) | creating a PR; description drift after review rounds |
| `merge-stack` | merge ordering and fix propagation | merging PRs / stacked slices |
| `test-reliability` | test reliability design (topology, atomic resources, isolation) | new/modified concurrency·resource tests; flaky diagnosis |

## Model and record-keeping rules

- Roles only (review / implement / assist); never name models. Relative constraint: review ≥ implement ≥ assist; obey the model pool's declared limits (mapping lives in the harness adapter).
- Record-keeping (see `record-discipline`): open a ticket before writing any record; verify after writing; batch-check at topic closing.
