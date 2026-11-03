## Harness adapter: kimi

- Capability mapping: read-only advisor = `plan`/`explore` subagents; writable implementer = `coder`; review = main agent self pass, or a dispatched generic subagent with a review prompt (see `structured-code-review`). No dedicated reviewer role.
- Model pool: dispatch within the configured pool's declared capability limits; review-typed work never goes to a model whose pool description excludes review (e.g. a cheap tier labeled "no review" → review goes to the primary tier).
- Install layout: harness rules → `~/.kimi-code/AGENTS.md` (composed from `assets/AGENTS.md` + this fragment); skills → `~/.kimi-code/skills/`; references → `~/.kimi-code/references/`; hooks scripts → `~/.kimi-code/hooks/`.
- Hooks: merge `adapters/kimi-hooks/config.toml` entries into `~/.kimi-code/config.toml` (installation steps: README, "Migrating to Kimi Code"). Hooks are fail-open guardrails; the rule layer stands alone on any harness without hooks.
