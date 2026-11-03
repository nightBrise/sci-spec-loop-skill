## Harness adapter: mimo

- Path base and layout: every `references/...` path resolves under
  `~/.config/mimocode/`. Rules → `~/.config/mimocode/AGENTS.md`; skills →
  `~/.config/mimocode/skills/` (loaded by name); references →
  `~/.config/mimocode/references/`; hook plugins →
  `~/.config/mimocode/plugin/`; settings → `~/.config/mimocode/mimocode.jsonc`.
- Capability mapping: read-only investigation = the `explore` subagent;
  writable implementation = the `general` subagent; review = the main agent's
  own pass, or a dispatched generic subagent carrying `structured-code-review`'s
  prompt. No dedicated reviewer agent and no custom subagent prompts: the main
  agent writes each dispatch brief per `assets/AGENTS.md`'s Dispatch brief rule.
- Built-in agents only: `build` and `plan` are primary; `general` and `explore`
  are subagents. A same-name markdown file under `~/.config/mimocode/agent/`
  overrides a built-in agent's base prompt; removing it restores the built-in.
- Model tiers: the conversational agent (`build`) and `plan` use the top-level
  `model` (default tier, user-adjustable); every subagent uses a lower tier.
  Review ≥ implement holds. Tier definitions live in `mimocode.jsonc`
  (`model_groups`).
- Local mechanisms: the task tree, `workflow` fan-out, and `actor` sessions are
  built-ins; use them to carry the main loop, without adding rules to it.
- Hooks: R1 is a plugin under `~/.config/mimocode/plugin/` (a pre-command
  guard; the plugin API is undocumented, so verify it with a harmless probe
  after upgrades). R2 has no advisory-injection hook, so it stays with the rule
  layer and `pre-push-checks`. R3 is the repository's git pre-commit hook
  (`.githooks/pre-commit`, installed with `git config core.hooksPath
  .githooks`), not a global MiMo Code setting. Hooks are optional and
  fail-open.
