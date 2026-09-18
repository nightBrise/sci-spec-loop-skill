# Spec-Loop Skill 仓库

跨设备、跨 harness 的工作流恢复仓库：承载 spec-loop（规格驱动）工程方法论与评审 agent，说明如何把仓库资产复原到各 harness。

> 语言策略：`AGENTS.md`、`skills/`、`agents/`、`references/workflow/` 以英文维护（跨设备移植语料）；本 README 面向人阅读，保持中文。规则见 `docs/decisions/repo-language-policy.md`。

## 目录结构

```
├── AGENTS.md            # 全局规则与 skill 调用指南（主循环、派发参数、门禁、协作）
├── agents/
│   └── reviewer.md      # 严格评审 agent（只读；方法论指针 → structured-code-review；含 spec 合规、spec 草稿与大纲骨架评审）
├── docs/
│   └── decisions/       # 本仓库自身的工作流治理决策记录（不随安装拷贝）
├── references/
│   ├── style/
│   │   └── python.md    # Python 风格文档（Google Python 改编 + 注释中文团队规则）
│   └── workflow/
│       ├── github-flow.md  # GitHub Flow 细则（分支拓扑、汇入规则、提交格式、PR 描述最低项）
│       └── testing.md      # 测试分层 L0–L3 与 pre-commit hook 脚本（含安装步骤）
├── skills/              # 八个 skill，每个目录一个 skill（SKILL.md）
│   ├── write-research-outline/
│   ├── write-research-report/
│   ├── write-spec/
│   ├── prose-quality/
│   ├── structured-code-review/
│   ├── manage-decision-records/
│   ├── trim-cot-leakage/
│   └── simplification-audit/
```

## 恢复到新设备 / 新 harness

Kimi Code：skill 装到 `~/.kimi-code/skills/`、agent 装到 `~/.kimi-code/agents/`、全局规则在 `~/.kimi-code/AGENTS.md`。按目录对应拷贝：

```sh
mkdir -p ~/.kimi-code/skills ~/.kimi-code/agents ~/.kimi-code/references
cp -r skills/*     ~/.kimi-code/skills/
cp agents/*        ~/.kimi-code/agents/
cp AGENTS.md       ~/.kimi-code/AGENTS.md
cp -r references/* ~/.kimi-code/references/
```

维护要点：

- **每次改动 `skills/`、`agents/`、`AGENTS.md` 或 `references/` 后都要重跑拷贝**——仓库是唯一权威，本机安装只是镜像。
- `cp -r skills/*` 只增不删：先删除 `~/.kimi-code/skills/` 里已废弃的 skill 目录再拷贝。
- `cp AGENTS.md ~/.kimi-code/AGENTS.md` 覆盖本机全局规则：覆盖前先 `diff` 确认无本地定制。
- 安装后校验 `~/.kimi-code/` 镜像：skill 目录计数为 8、关键文件非空：

```sh
n=$(find ~/.kimi-code/skills -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l); [ "$n" -eq 8 ] || echo "skill count: $n, expected 8"
for s in ~/.kimi-code/skills/*/; do [ -s "$s/SKILL.md" ] || echo "missing: $s/SKILL.md"; done
[ -s ~/.kimi-code/references/style/python.md ] || echo "missing: references/style/python.md"
[ -s ~/.kimi-code/agents/reviewer.md ] || echo "missing: agents/reviewer.md"
[ -s ~/.kimi-code/references/workflow/github-flow.md ] || echo "missing: references/workflow/github-flow.md"
[ -s ~/.kimi-code/references/workflow/testing.md ] || echo "missing: references/workflow/testing.md"
```

- `docs/` 是本仓库自己的治理记录，不随安装拷贝。

### Mimo Code

恢复方式：skill 目录原样拷贝进 `~/.config/mimocode/skills/`（mimocode.jsonc 的 `skills.paths` 需包含该目录）；`agents/` 下的 agent 前端是 harness 相关（本仓库按 kimi 格式书写），需翻译成 mimo 格式放进 `~/.config/mimocode/agent/`；AGENTS.md 按需同步（见下）。skill 与 agent 的改动下一轮热重载生效，用 `mimo agent list` 校验。

同步 skill（原样覆盖，只增不删）：

```sh
for s in skills/*/; do
  n=$(basename "$s")
  mkdir -p ~/.config/mimocode/skills/"$n"
  cp -r "$s/." ~/.config/mimocode/skills/"$n"/
done
```

维护要点：

- **只增不删**：mimo 全局 skills 目录里可能还有本仓库之外的 skill，禁止删除整个目录或用 `--delete` 同步；只清理本仓库中已废弃的 skill 目录。
- skill 正文是 harness 无关的纯方法论，原样覆盖即可，无需按 mimo 改写。

适配 agent（每次改动 `agents/` 后都要重翻译）：

| 本仓库（kimi） | mimo | 翻译规则 |
|---|---|---|
| 文件名（如 `agents/reviewer.md`） | `~/.config/mimocode/agent/<name>.md` | `mode: subagent`；正文即 persona/system prompt |
| `description` + `whenToUse` | `description` | 合并为触发条件，改中文 |
| `tools` / `disallowedTools` | `permission` | 只读 agent：`write`/`edit` deny，`bash` `"*"` deny + git 只读白名单（`git diff/log/show/status/rev-parse *` allow） |
| `model` | `model` | reviewer 档 ≥ implementer 档；`temperature: 0.2` |
| 正文 | 正文 | 同一角色语义改写：只读薄角色 + 委托 `structured-code-review` + 加载 `prose-quality`/`trim-cot-leakage` 做 prose pass + spec 合规程序 + spec 草稿评审（冻结前）与大纲骨架评审两个模式 + 三态 verdict |

同步 workflow 细则（AGENTS.md 与 structured-code-review 引用为细节权威；按需阅读，不注册进 instructions）：

```sh
mkdir -p ~/.config/mimocode/references/workflow
cp -r references/workflow/. ~/.config/mimocode/references/workflow/
```

AGENTS.md：先 `diff` 仓库版与 `~/.config/mimocode/AGENTS.md`；mimo 版的本地定制原样保留，把仓库增量（spec 评审闸、Review tier、派发参数、GitHub Flow、停止清单、验收闸口）合并进去，不整文件覆盖。

校验：

```sh
mimo agent list                    # 已翻译的 agent 以 (subagent) 出现
for s in skills/*/; do diff -q "$s/SKILL.md" ~/.config/mimocode/skills/$(basename "$s")/SKILL.md; done
for f in references/workflow/*.md; do diff -q "$f" ~/.config/mimocode/"$f"; done
```

范围说明：本仓库不含 mimo 主 agent 的提示词，该文件不在本节恢复范围内。

其他 harness：把 `skills/*/SKILL.md` 的方法与 `agents/*` 的提示词装到各自约定位置。技能正文是 harness-agnostic 方法论；只有前端 `type: prompt`、`whenToUse` 与 `agents/` 是 harness 相关，可按需改写。
