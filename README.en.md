# Spec-Loop Skill

A methodology for **collaborating with AI on research and engineering work**: the owner sets direction and rules at gates, the main agent decomposes, dispatches, and accepts, and subagents implement — packaged as a rule set and skill corpus that ports across devices and harnesses.

中文版: [README.md](README.md)

## Design philosophy

### Division of labor: three roles, one dialogue line

```mermaid
flowchart LR
    O["owner (human)"] <-->|"dialogue: requirements, rulings, acceptance"| M["main agent"]
    M -->|"dispatch brief (assembled per task type)"| S["subagent"]
    S -->|"task report: deviations / deferred scope / evidence / coverage boundary"| M
```

- **Owner (human)**: sets direction and requirements, and rules at the key gates — spec freeze, amendment/abandon, acceptance, topic closing.
- **Main agent**: talks with the human, understands requirements, decomposes work, dispatches, reviews, and accepts; the **sole writer** among agents of decisions, progress, contracts, and reports (the owner rules on a deliverable report's draft and may edit it directly). Applies small fixes directly; resumes the implementing subagent for large ones.
- **Subagent**: implements the dispatched task (bulk code or prose) and returns a task report; never writes contract or decision artifacts.

### Six core ideas

1. **Single entry + triage test** — no "engineering vs research" split up front. Each work item gets one question: "Can the Claims be written now?" Yes (writable = every value has a source — measurement, standard, requirement; a predicted value is a hidden preregistration) → build, through a spec contract; only experiments can tell → explore, through preregistration.
2. **Mutual generation** — exploration findings spawn build items; implementation anomalies spawn explore items. "Testing while exploring" needs no track switch, only new work items.
3. **Four channels for claim changes** — a frozen spec is not dead: deviation (contract unchanged), Amendment (the measure changes), Abandon (foundation gone, cleanly deleted), deferred scope (new scope recorded elsewhere), each with a controlled exit.
4. **One source, many projections** — the same fact appearing in several artifacts serves several readers and is not the disease; unspecified copying is. Each fact has one authoritative home; every other appearance is a one-line projection, and projections of projections are forbidden.
5. **Preregistration = attribution anchor** — freeze the target criterion and attribution design before an exploratory experiment; only then do "met" and "missed" carry causal meaning. FAIL analysis is exploration's most valuable output.
6. **Progressive disclosure + four enforcement layers** — rules load in three tiers on demand (always-loaded rule file → event-loaded skills → references for depth); enforcement is layered: mechanical interception > process structure (gates/checklists) > rule text > role discipline.

### The main loop

```mermaid
flowchart TB
    IN["Task input"] --> T["Topic (untyped container)"]
    T --> WI["Work item"]
    WI --> Q{"Triage: can Claims be written now?"}
    Q -->|"yes"| B["Build: write-spec<br/>review → freeze → dispatch → accept → merge"]
    Q -->|"needs experiments"| E["Explore: preregister → experiment → conclude"]
    E -.->|"conclusion → new work item"| WI
    B -.->|"implementation finding → new work item"| WI
    B --> C["Topic closing gate"]
    E --> C
```

### Four channels for claim changes

```mermaid
flowchart TD
    F["A finding touches existing spec claims"] --> J{"Judge the nature"}
    J -->|"Claim cannot be met (technical)"| C1["① Deviation<br/>spec unchanged · acceptance gate rules"]
    J -->|"the measure is wrong"| C2["② Amendment<br/>owner rules → amendment batch → re-freeze"]
    J -->|"the foundation is gone"| C3["③ Abandon<br/>epitaph + clean deletion, one commit"]
    J -->|"new scope, no contradiction"| C4["④ Deferred scope<br/>record an entry · ship the spec as-is"]
```

### Topic closing gate

```mermaid
flowchart LR
    C["Topic closing"] --> A["① Triage epitaphs"] --> B["② Condition-review report ruled"] --> C3["③ Deferred scope disposed"] --> D["④ Deliverables shipped"] --> E["⑤ Governance scan"] --> OK["Terminal state allowed"]
```

All five must pass before a topic may close (under unattended operation, failure = stop and report). Item ⑤ forces the scan, not the resolution — governance candidates are recorded and never block closing.

### Unattended envelope and safety net

Long unattended runs hang at the topic level, backed by a four-part safety net:

- **Budget checkpoints**: at every work-item / batch boundary, compare remaining budget against remaining work; stop and report when short — never lower the gates to keep running.
- **Stop list**: history rewrite, secret leak, needs-user-judgment, substantive spec change, real regression red … hit any one and stop + report.
- **Recovery point**: the Progress tree is the only progress truth — one line per node, grep-able state words, updated at every work-item boundary; resume a broken session from it.
- **Rejection cap and advisor**: three consecutive rejections of one review target stop the run; three consecutive failures on one objective dispatch a read-only advisor (the consultation and its disposition are logged as a decision entry).

```mermaid
flowchart LR
    W["Work item / batch boundary"] --> Q{"Budget sufficient?<br/>Stop list clear?"}
    Q -->|"yes"| G["Continue (or auto-advance)"]
    Q -->|"no"| S["Stop and report<br/>Progress tree = recovery point"]
```

## The skill set (13, in four layers)

```mermaid
flowchart TB
    subgraph IN["Scene entries"]
        WS["write-spec"]
        WRO["write-research-outline"]
        WRR["write-research-report"]
    end
    subgraph RG["Record governance"]
        MDR["manage-decision-records"]
        RD["record-discipline"]
    end
    subgraph AC["Standards"]
        PQ["prose-quality"]
        TCL["trim-cot-leakage"]
        SCR["structured-code-review"]
        SA["simplification-audit"]
    end
    subgraph FL["Process execution"]
        PPC["pre-push-checks"]
        PRD["pr-description"]
        MST["merge-stack"]
        TR["test-reliability"]
    end
    WS -->|"decision bookkeeping"| MDR
    WRO -->|"board registration"| RD
    WRR -.->|"suggestions return as new leaves"| WRO
    SCR -->|"Layer 1"| PQ
    SCR -->|"Layer 1"| TCL
    SA -->|"proposals"| MDR
    PPC -.->|"risky tests pass through"| TR
    PRD -->|"evidence pointers"| MST
```

**Scene entries** — three kinds of writing:

| Skill | Owns | Trigger |
|---|---|---|
| `write-spec` | Contract writing: `[Sn]`/Claims, freeze, after-freeze change procedures | A build work item starts; amendment / abandon / deferred handling |
| `write-research-outline` | Board writing (materialized on demand), preregistration, dual-speed registration | Board materialization; lightweight registration; before experiments |
| `write-research-report` | Explanatory writing: stage / overall / deep-dive reports; record reports are write-once, deliverable reports are reviewed to final | Leaf batches terminal; topic closing; owner asks for a readout or formal report |

**Record governance** — putting "one source, many projections" into practice:

| Skill | Owns | Trigger |
|---|---|---|
| `manage-decision-records` | Decision governance: entry and Progress-tree format, supersession, epitaphs, closing batch | Adding/revising decisions; amendment bookkeeping; closing triage |
| `record-discipline` | Record structure discipline: source/projection, budgets, ticket / verify / batch programs | Before writing any record; review; closing; source change |

**Standards** — expression and review:

| Skill | Owns | Trigger |
|---|---|---|
| `prose-quality` | Editorial standard: complete propositions, required coverage, no redundancy | Always (writing/reviewing/fixing/trimming any prose) |
| `trim-cot-leakage` | Session-leakage detection and repair (8-class taxonomy) | Reviewing / fixing prose |
| `structured-code-review` | Two-layer review methodology, evidence rules, dispatch-review prompt composition | Self pass; PR / diff / task-output review |
| `simplification-audit` | Architecture simplification: delete maintenance obligations | Owner request; topic-closing governance scan |

**Process execution** — engineering-action gatekeeping:

| Skill | Owns | Trigger |
|---|---|---|
| `pre-push-checks` | Push gatekeeping: minimal check set per change surface, evidence out the door | Before push / marking ready |
| `pr-description` | PR narrative (four sections) + acceptance minimums (two lists) | Creating / updating a PR |
| `merge-stack` | Merge landing: dependency order, fix propagation, merge-only | Merging PRs / stacked slices |
| `test-reliability` | Test reliability: topology modeling, atomic resources, isolation and teardown | Concurrency/resource-heavy tests; flaky diagnosis |

## How the skills collaborate

```mermaid
flowchart LR
    subgraph W["Writing chain"]
        T1["RD ticket"] --> T2["genre writing"] --> T3["RD verify"] --> T4["hand-off"]
    end
    subgraph R["Review chain"]
        R1["Layer 1: prose + trim"] --> R2["Layer 2: semantic checks"] --> R3["verdict + evidence"]
    end
```

- **Writing chain**: `record-discipline` tickets every unit before writing (belong? where? how big? source?) → the artifact skill's genre writing → RD verification → hand-off. Record reports are final at hand-off; deliverable reports enter the owner's review loop and freeze at `Status: final`. High-frequency outline updates ride the light path (registration completes immediately).
- **Review chain**: `structured-code-review` is the single methodology — Layer 1 runs `prose-quality` + `trim-cot-leakage` first, Layer 2 applies semantic checks per change surface. Carriers as needed: owner direct review of documents, main agent review of subagent code (writer ≠ reviewer), or a dispatched review. Evidence is mandatory: **prose is not evidence**.
- **Change chain**: a finding touching claims → the four channels → Amendment / Abandon bookkeeping and epitaphs live in `manage-decision-records`; de-linking pointers is `trim-cot-leakage`'s.
- **Quality-gate chain**: risky tests pass `test-reliability` design criteria → `pre-push-checks` selects evidence before push → `pr-description` records the two lists → `merge-stack` lands with approve + evidence. Engineering red lines: merge-only, never rebase / force-push, never `--no-verify`; a post-merge rollback is an owner-ruled revert commit (history moves forward; the lesson lands in the redo's spec).
- **Governance cross-cut**: `simplification-audit` runs the governance scan at topic closing (candidates recorded, never blocking), and its proposals use `manage-decision-records` formats and retention judgment; once the standalone corpus crosses a growth threshold, the scan raises a knowledge-base pruning for the owner to rule on.

## Adapting to your harness

The corpus itself is harness-agnostic. Harnesses differ only in a few lines of text (capability mapping, model-pool rules, install paths), kept in an **adapter fragment** and composed at install time — the installed rule file is a **generated artifact, never hand-maintained**.

Adapting means three things: compose the rule file, mirror skills and references, attach hooks if the harness supports them. The full Kimi Code procedure follows; MiMo Code is the next section, and a new harness needs only a new adapter fragment.

```mermaid
flowchart LR
    A["assets/AGENTS.md<br/>body: zero harness names"] --> P["compose at install"]
    B["assets/adapters/&lt;harness&gt;.md<br/>adapter fragment: increments only"] --> P
    P --> I["installed rule file (generated)"]
    C["assets/skills + references"] --> J["installed skills / references (mirror sync)"]
    H["hooks & git hooks (optional)"] -.-> J
```

### Migrating to Kimi Code

Prerequisite: Kimi Code is installed, signed in, and connected to a model (a new session can converse). Run the commands below from the repository root.

#### 1. Compose the rule file

```sh
mkdir -p ~/.kimi-code
{ cat assets/AGENTS.md; echo; cat assets/adapters/kimi.md; } > ~/.kimi-code/AGENTS.md
```

- Global rules load from `~/.kimi-code/AGENTS.md`; a project's own `AGENTS.md` loads additively, not as an override.
- The installed file is a generated artifact: re-compose after changing the body or the fragment; never hand-edit it.
- The adapter carries only capability mapping, model-pool constraints, install paths, and hooks. The main loop, dispatch briefs, and review mechanism stay in the body, shared by every harness.

#### 2. Skills and references (mirror sync)

```sh
mkdir -p ~/.kimi-code/skills ~/.kimi-code/references
cp -r assets/skills/*     ~/.kimi-code/skills/
cp -r assets/references/* ~/.kimi-code/references/
```

- The sync is a mirror: the repository is authoritative — besides overwriting, a re-sync deletes whatever the repository no longer carries (`diff -rq` shows the residue); files that never came from the repository stay.
- A skill's name comes from its `SKILL.md` frontmatter, not its directory.
- References are the deep layer, resolved by path from rules and skills; they are not injected automatically.

#### 3. Hooks and git hooks (optional)

Hooks are fail-open guardrails against slips: **the rule layer stands complete on any harness without hooks** — the methodology does not depend on them. The three hooks are abstract guardrails; the contract below (authoritative definition: "Hook contract" in `assets/references/workflow/github-flow.md`) lets any harness implement them against its own extension points:

| hook | trigger point | action | guards | failure mode | required capability |
|---|---|---|---|---|---|
| R1 dangerous-command guard | before a shell or git command executes | block commands in the danger set (force-push, rebase, `reset --hard`, `--no-verify`) | merge-only red line; stop-list "history rewrite" | fail-open | pre-command hook |
| R2 push-evidence reminder | before a push | non-blocking reminder of the evidence requirement | "prose is not evidence"; `pre-push-checks` | fail-open | pre-push hook |
| R3 L0 floor | git `pre-commit` | run the product's `scripts/run-l0` (L0 tiers: `references/workflow/testing.md`) | the L0 mechanical floor | no L0 defined → skip with a loud warning | git hooks |

Kimi Code reference implementations live in `assets/adapters/kimi-hooks/`. Install R1/R2 globally:

```sh
mkdir -p ~/.kimi-code/hooks
cp assets/adapters/kimi-hooks/*.mjs ~/.kimi-code/hooks/
```

Merge the two `[[hooks]]` blocks from `assets/adapters/kimi-hooks/config.toml` into `~/.kimi-code/config.toml` — never replace the whole file: your provider/model configuration lives there.

R3 is plain git, installed per product repository (the product must define its own `scripts/run-l0`):

```sh
cp .githooks/pre-commit <your-product-repo>/.githooks/
cd <your-product-repo> && git config core.hooksPath .githooks
```

#### 4. Verify

```sh
{ cat assets/AGENTS.md; echo; cat assets/adapters/kimi.md; } | diff -q - ~/.kimi-code/AGENTS.md
find ~/.kimi-code/skills -mindepth 1 -maxdepth 1 -type d | wc -l   # should be 13
ls ~/.kimi-code/hooks/block-dangerous-git.mjs ~/.kimi-code/hooks/push-evidence-reminder.mjs
```

Verify in a new session that the rules and skills load.

### Migrating to MiMo Code

MiMo Code differs from Kimi Code only in install paths, agent names, model tiers, and hook carriers; the method body is shared. The steps below bind no provider, model, or machine path.

#### 1. Skills and references

```sh
for s in assets/skills/*/; do
  n=$(basename "$s")
  mkdir -p ~/.config/mimocode/skills/"$n"
  cp -r "$s/." ~/.config/mimocode/skills/"$n"/
done
mkdir -p ~/.config/mimocode/references
cp -r assets/references/. ~/.config/mimocode/references/
```

- Keep personal skills that never came from this repository; the mirror only overwrites repository content.
- A skill's name comes from its frontmatter, not its directory; duplicate names are last-loaded-wins.
- The default global directory is scanned automatically; add `skills.paths` only for extra roots.

#### 2. Compose the global rules

```sh
mkdir -p ~/.config/mimocode
{ cat assets/AGENTS.md; echo; cat assets/adapters/mimo.md; } > ~/.config/mimocode/AGENTS.md
```

- The installed file is a generated artifact; never hand-edit it. Re-compose after changing the body or the fragment.
- MiMo Code loads a **project** `AGENTS.md` and the **global** file additively, not as overrides; `instructions` files are merged too.
- The adapter carries only paths, capability mapping, model tiers, local mechanisms, and hooks. The main loop, dispatch briefs, and review mechanism stay in the body, shared by every harness.

#### 3. Model tiers

```jsonc
{
  "$schema": "https://mimo.xiaomi.com/mimocode/config.json",
  "model": "standard",
  "model_groups": {
    "lite": "<provider>/<small-model>",
    "standard": "<provider>/<main-model>"
  },
  "agent": {
    "general":    { "model": "lite" },
    "explore":    { "model": "lite" },
    "title":      { "model": "lite" },
    "summary":    { "model": "lite" },
    "compaction": { "model": "lite" }
  }
}
```

- The main agent and `plan` use the top-level `model`; do not set `agent.build.model` / `agent.plan.model`, so the user can adjust them.
- Every subagent uses a lower tier; **review ≥ implement** (the main agent's tier is not below the subagent it reviews).
- Adjust tier count and names to your model pool; do not use the legacy `small_model`; cheap tasks go through the `lite` group.
- `mimo run -m <group>` does not resolve groups; use a literal `-m <provider>/<model>` for headless checks.

#### 4. Hooks

**R1 dangerous-command guard**: global plugin `~/.config/mimocode/plugin/spec-loop-guard.ts`.

```ts
// R1: block history-rewriting git commands.
// Fail-open: a load or hook failure leaves the rule layer as the guard.
const BANNED: { re: RegExp; why: string }[] = [
  { re: /git\s+push\b[^;&|]*\s(?:--force-with-lease|--force|-f)\b/, why: "force-push is banned (history rewrite)" },
  { re: /git\s+rebase\b/, why: "git rebase is banned (merge-only flow)" },
  { re: /git\s+reset\s+--hard\b/, why: "git reset --hard is banned" },
  { re: /--no-verify\b/, why: "--no-verify is banned" },
]

export default async () => ({
  "tool.execute.before": async (input: any, output: any) => {
    if (input?.tool !== "bash") return
    const command = String(output?.args?.command ?? input?.args?.command ?? "")
    for (const { re, why } of BANNED) {
      if (re.test(command)) throw new Error("Blocked: " + why)
    }
  },
})
```

- This is an undocumented MiMo Code surface; `--pure` / `MIMOCODE_PURE` disables plugins, and upgrades should be re-verified.
- Do not trust it untested: temporarily add a marker rule, run `echo <marker> > /tmp/probe-ran`, and confirm the file is absent while the tool reports Blocked; run a benign command as the negative control, then remove the marker rule.

**R2 push-evidence reminder**: MiMo Code has no pre-command text-injection hook; the rule layer carries it — the trigger line in the body's GitHub Flow section plus the `pre-push-checks` skill, with evidence landing in `pr-description`.

**R3 L0 floor**: installed per repository, not globally.

```sh
git config core.hooksPath .githooks
```

- Make `.githooks/pre-commit` executable; the product repository defines `scripts/run-l0` (tiers: `references/workflow/testing.md`).
- Three-state test in a temporary repository: no `run-l0` → warn and pass; exit 1 → commit blocked; exit 0 → pass.

#### 5. Verify

```sh
wc -l ~/.config/mimocode/AGENTS.md          # keep ≤ 200
mimo agent list                              # built-in agents only; no custom overrides
mimo debug config                            # model / model_groups / agent overrides
mimo debug skill                             # repository skills visible
mimo models <provider>                       # tier model IDs exist
mimo run -m <provider>/<model> "Reply with exactly: ok"
```

#### 6. Pitfalls

| Pitfall | Handling |
|---|---|
| A project `AGENTS.md` is present, so the global rules seem inactive | They load additively; the global rules still apply |
| A style document sits in both `instructions` and references | Duplicate injection; keep references plus the index |
| `skills.paths` uses `~` | Use an absolute path, or rely on the default global scan |
| A custom `agent/<name>.md` shares a built-in name | It overrides the built-in's base prompt; delete it to restore |
| A custom primary agent's body | It replaces the model-family prompt; environment/skills/instructions blocks are still appended |
| `mimo run -m <group>` | Groups do not resolve there; use a literal `provider/model` |
| The plugin does not fire | `--pure` disables it; the plugin API is undocumented, so re-verify after upgrades |
| `git commit --no-verify` bypasses R3 | R1 blocks it; do not use `--no-verify` |
| Config changed but the current session is unchanged | New sessions/restarted TUI; model selection is session-scoped |

### Generic verification

```sh
{ cat assets/AGENTS.md; echo; cat assets/adapters/<harness>.md; } | diff -q - ~/.<harness>/AGENTS.md || echo "stale: re-run step 1"
find ~/.<harness>/skills -mindepth 1 -maxdepth 1 -type d | wc -l   # expect 13
```

## Repository layout

| Path | Role |
|---|---|
| `assets/AGENTS.md` | The rule body (harness-agnostic; half of the composed file) |
| `assets/adapters/` | One adapter fragment per harness + optional hook scripts |
| `assets/skills/` | 13 skills, one directory with one `SKILL.md` each |
| `assets/references/` | `style/` (style, engineering principles, error handling) and `workflow/` (test method, GitHub Flow) |
| `.githooks/` | R3 pre-commit hook reference implementation (plain git, portable to any harness) |
| `README.md` / `README.en.md` | The bilingual front page (this file) |
| `CHANGELOG.md` | Version changes and rationale (incl. the language policy) |

The corpus (`assets/`) is maintained in English — one source language keeps cross-device diffs stable; `README.md` is Chinese, `README.en.md` English. Full language policy: [CHANGELOG.md](CHANGELOG.md).

## Versions and rationale

What each version changed, why, and which alternatives were rejected — all recorded in [CHANGELOG.md](CHANGELOG.md).
