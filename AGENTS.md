# Sci-Spec-Loop Engineering

## Core model

The main agent (the main loop in the dialogue loop) is the controller. The harness dispatches subagents by **capability profile**: a read-only advisor, a writable implementer, a read-only reviewer. Any harness that can dispatch subagents can execute this methodology directly; the kimi mapping is `plan`/`explore`, `coder`, `reviewer`.

- **Advisor:** read-only (inspects the repo/web, cannot write) — produces a textual proposal for the main agent to adopt.
- **Implementer:** read-write-execute — the only subagent that can write files / run commands.
- **Reviewer:** read-only (may inspect diff/repo, cannot write) — produces a review report.

## Main loop (spec-driven, 4 phases)

`brainstorm (requirements) → write-spec (freeze spec) → dispatch loop (implement/commit/review/fix) → acceptance against spec`

- No separate planning phase; `plan` serves only as a read-only advisor.
- **The coverage check is done by the main agent before dispatch**: every `[Sn]` is independently dispatchable (has Claims, a clear boundary, resolvable dependencies).
- **The acceptance gate re-checks two lists**: the claims-deviation list (deviations are ruled on by this gate, not by the reviewer) and the deferred-scope list; both are reported to the user together with evidence (deferred-scope classification is in the "How to write a spec" section; deviation attribution is in the boundary notes of the stop list).

## How to write a spec (the core of this methodology)

- **Research topics first go through `write-research-outline`** (living outline + leaf classification); freeze them into spec leaves once converged.
- **A spec is needed iff any criterion is hit**: it introduces or modifies an external contract (API, data format, config schema, protocol, CLI surface) / spans 2+ modules that cannot be rolled back as a single unit / will run unattended / needs a trade-off decision first (2+ defensible designs). Mechanical multi-file changes (renames, reformatting, dependency upgrades, tests for existing behavior) are exempt — they touch many files but create no contract needing arbitration. Details in `write-spec`.
- **1 spec = 1 deliverable change** (operational definition in `write-spec`): `[Sn]` are its internal dispatchable units.
- Each `[Sn]`: `Claims` (verifiable behavior), `Dependencies` (optional), clear boundary.
- Each spec contains `Global Constraints` (mandatory) and `Out of Scope`.
- **Splitting criteria**: one spec contains multiple `[Sn]` by default; the three criteria for splitting into multiple specs, the implicit size ceiling, and “`[Sn]` count is not the criterion, cohesion is” are in `write-spec`.
- **New work discovered during implementation is handled in three classes**: implementation detail absorbable by an existing `[Sn]`'s Claims / the contract is wrong (go with abandon) / adjacent new scope (i.e., deferred scope: record an entry in `.decisions.md` and ship the frozen spec as-is); criteria, entry format, and guardrails are in `write-spec`; after the merge the main agent collects the deferred entries and decides on follow-up.
- **Each feature always has 2 documents**: `docs/specs/<slug>.md` (frozen spec, pure contract, no decision sections) + `<slug>.decisions.md` (decisions + `## Progress` table).
- Specs are immutable once frozen; all design decisions (from brainstorm on) go directly into `.decisions.md`; durable decisions spanning features/specs go into standalone DRs (`docs/specs/decisions/`, proposed/accepted/rejected, see `manage-decision-records`); the progress board is folded into decisions but scoped to progress (`manage-decision-records` excludes it).
- This repository itself has no product `docs/specs/` tree: governance decisions are recorded in `docs/decisions/` (treated as standalone DRs, read during review); product repos follow the `docs/specs/` convention above.

## Dispatch-loop run parameters (not modes)

- **Human gate in the loop (interactive)** or **unattended + budget (goal autonomy)**; **whether independent `[Sn]`s run in parallel**.
- **Unattended (goal)**: per `[Sn]` implement → commit → review → fix and re-review → after the whole spec passes, **merge the PR + delete the branch** (may use `gh pr merge`).
- **Parallel `[Sn]`s**: each `[Sn]` has its own worktree + branch; **merging is serialized by the main agent**; **decisions/progress have a single writer (the main agent)**; `coder` is forbidden to write `docs/specs/<slug>.md`.
- **Bind before dispatch**: the main agent reads the brainstorm entries in `.decisions.md`; referenced standalone DRs are attached to the corresponding implementer prompt (details in `write-spec` After freeze).
- **Dispatch guidance (no template)**: different harnesses have different dispatch standards; the specific prompt is decided by the main agent per task type at dispatch time. Suggested emphasis — implementation: `[Sn]` verbatim text + related standalone DRs + boundaries and prohibitions; investigation: hypotheses + evidence standards; review: spec path + diff scope.
- **Task report (implementer's return)**: minimum required content — deviations from Claims, deferred scope discovered, evidence pointers; shape decided by the main agent, no template.
- **Advisor trigger**: after 3 consecutive failures on the same objective, dispatch a read-only advisor.
- **Reviewer rejection limit**: the same `[Sn]` rejected with `needs fixes`/`reject` 3 times in a row → stop and report (see stop list).

## GitHub Flow conventions (non-skill)

- 1 spec = 1 branch = 1 PR; one `[Sn]` one commit; parallel work uses **merge commits**; `main` is always deployable.
- Stacked PRs update their base only with merges from main (no rebase + force-push).
- **Pre-merge spec gate**: the diff does not touch `docs/specs/<slug>.md`; merge prerequisites: reviewer `approve` + evidence exists.
- **Governance direct-push exception**: status transitions of standalone DRs (proposed→accepted/rejected) are committed directly on main by the main agent (no branch/PR); that transition is re-checked at the next review or audit.

## Coding rules

- Coding principles: Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven. These guidelines bias toward caution over speed; for trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

- Language → style-file index: for languages in the index, the implementation **follows** its style document; that conformance is verified in reviews by `structured-code-review`'s `Declared style conformance` check, which resolves the style document via the table below, and style findings rank below correctness/lifecycle/security defects in that check's own ordering and do not veto a merge on their own.

| Language | Style file |
|---|---|
| Python | `references/style/python.md` |

- Languages not in the index follow the project's own style conventions; a product repo's own AGENTS.md index takes precedence over this global index.
- Style documents own their declared rules; elsewhere cite only, do not restate. When a style document conflicts with `trim-cot-leakage` Class 8, the conflict is resolved by that skill's Class 8 fix rules.

## Serious-risk stop list (stop + report on hit, unattended)

`History rewrite (incl. force-push)` · `Secret leak` · `Needs user judgment` · `Substantive spec change` · `Real regression red` · `Budget exhausted` · `Merge conflict` · `Environment/CI unavailable` · `Reviewer consecutive rejections at limit` · `Tool permission denied`.

Boundary notes — attribution of three easily confused cases:

- **Deferred scope** (contract correct but incomplete) **is not** a `substantive spec change`: record the entry and keep going, no stop.
- **Contract error** (contradicts a Claim, or modifies the `Global Constraints`) **is** a `substantive spec change`: stop.
- **Deviation** (some `[Sn]`'s own Claim cannot be implemented) is neither deferred scope nor contract error: record the problem during implementation, continue implementing the rest of that `[Sn]`, put the deviation in the task report, do not modify the spec, no stop; the reviewer reports the Claim as “unmet” with the deviation as the explanation — that is a finding, not a rejection, and does not count toward the 3-time limit; the deviation is ruled on by the acceptance gate, and an un-ruled deviation is `needs user judgment`, requiring a stop and report under unattended operation.

The numeric threshold for `Reviewer consecutive rejections at limit` is in the “Dispatch-loop run parameters” section.

## Review gate

- After each completed `[Sn]`, dispatch the `reviewer`; check spec compliance (Claims, incl. `Global Constraints`/`Out of Scope` not violated) + the two-layer structured review.
- **Evidence requirements: test name / command output / file:line. Prose is not evidence.**

## Skill catalog and invocation guide

Skills live in `skills/` (installed locally to `~/.kimi-code/skills/`), each with one duty. Load the corresponding skill when the task hits its trigger:

| Skill | Owns | Trigger |
|---|---|---|
| `write-research-outline` | Convert a research question into a living outline + leaf classification (spec / investigation) + inline leaf outcome records (durable guardrails promoted to standalone) | The task is an open research question and “what to build” is not yet determined |
| `write-research-report` | The three research-layer report forms (stage / overall / deep-dive): naming, triggers, structure, writing language, figures, evidence standards, and audience | A batch of leaves reaches terminal state, the topic sets a reporting cadence, the topic closes, an unattended run ends, or the user asks for a readout |
| `write-spec` | Convert requirements into a dispatchable spec (`[Sn]`+Claims+Global Constraints) + companion `.decisions.md`; **the core of this methodology** | Any of the four criteria in the “How to write a spec” section is hit (the mechanical multi-file exemption list is in the same section) |
| `prose-quality` | Editorial standard — complete-proposition rules + required coverage per location + exclusion list (frozen specs are scanned only, never edited) | Writing/reviewing/fixing/trimming any prose: comments, docs, prompts, diagnostics, UI strings |
| `trim-cot-leakage` | Reasoning-leakage detection and repair (8-class taxonomy + surface tolerance table) | Reviewing prose that may leak session artifacts: dead references, change narration, review choreography, hedged wording and planning residue |
| `structured-code-review` | Two-layer review methodology (blockers + semantic checks) + reporting format + read-only git whitelist | Reviewing any change: PR / diff / spec compliance / task output; loaded by the reviewer agent |
| `manage-decision-records` | Decision lifecycle — supersession checks, retention judgment, status transitions (standalone three states) | Adding/auditing/superseding/remediating Decision Log entries or decisions in standalone DRs |
| `simplification-audit` | Simplification candidate mining (standalone DR, Decision Log entry, or inline TODO) | User asks to simplify, clean up, find dead code, audit unused APIs, reduce surface area |

### Collaboration (one rule, one owner; cite, don't restate)

- `write-spec` applies prose-quality (propositions) and manage-decision-records (supersession check when writing log entries); `structured-code-review` Layer 1 calls prose-quality + trim-cot-leakage; `trim-cot-leakage` consults prose-quality before deleting; `simplification-audit` delegates retention judgment to manage-decision-records and writes durable proposals as standalone DRs in MDR's proposed format.
- `write-research-outline` is the research-layer entry: spec leaves are handed to `write-spec` for freezing; investigation leaves record their outcomes inline in the outline (`docs/research/`, research records, not decisions); conclusions that outgrow a one-line record are carried by `write-research-report`'s deep-dive reports; conclusions meeting the guardrail criteria are promoted by the main agent to standalone DRs (`Status: rejected`, landed in `docs/specs/decisions/`, governed by `manage-decision-records`); outline prose falls to `prose-quality`/`trim-cot-leakage`.
- `write-research-report` is the research-layer reporting layer: the outline is the living board and the single source of truth for leaf state; reports are point-in-time deliverables, unmodified after writing, consume leaf state but never restate the outline; reports are research records, outside `manage-decision-records` governance; suggestions in a report become work only after becoming spec leaves in the outline and being frozen by `write-spec`; the main agent is the sole writer of reports; report prose falls to `prose-quality`/`trim-cot-leakage`; the body's writing language is owned by `write-research-report`, and `trim-cot-leakage` Class 8 adapts to it.
- `references/style/`: per-language style documents are resolved and read by `structured-code-review`'s `Declared style conformance` check via the index table in the “Coding rules” section.
- Collaboration declarations are persisted in: `AGENTS.md` (this invocation guide) + each `SKILL.md`'s `## Collaboration` section + `agents/reviewer.md` (review path) + `README.md` (overall map).
- **Review path**: the reviewer agent loads `structured-code-review` and runs a prose pass with prose-quality/trim-cot-leakage; these rules are not repeated elsewhere.
- **Spec path**: requirements → `write-spec` (freeze contract) → dispatch loop → `structured-code-review` acceptance; decisions accumulate in `<slug>.decisions.md` per `manage-decision-records` rules.
