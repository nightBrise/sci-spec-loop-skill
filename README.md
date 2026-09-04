# Spec-Loop Skill 仓库

这是我自己的跨设备、跨 harness 工作流恢复仓库：承载 spec-loop（规格驱动）工程方法论与评审 agent。`archive/` 是作为参考留存、**不参与提交**的 deepseek-harness 原始材料。

## 这是什么

Spec-loop engineering 的核心：任何跨 2+ 文件或 2+ 步骤的任务，都先冻结一份带 `[Sn]` 章节与 Claims 的 spec，再按派发循环实现、由评审 agent 验收。方法论是 **harness 无关**的：凡能派发 subagent 的 harness 都能直接执行。

## 目录结构

```
├── AGENTS.md            # 全局规则：主循环、spec 写法、派发参数、GitHub Flow 约定、编码规则、停止清单、skill 调用指南
├── agents/
│   └── reviewer.md      # 严格评审 agent（两层结构化审查 + spec 合规核对；只读 + git diff）
├── skills/              # 六个 skill，每个目录一个 skill（SKILL.md）
│   ├── write-spec/
│   ├── prose-quality/
│   ├── structured-code-review/
│   ├── manage-decision-records/
│   ├── trim-cot-leakage/
│   └── simplification-audit/
├── Google_code_style.md # 全局代码风格（Google Python + 注释中文）
└── archive/             # 参考资料（dsh-* 等；由 .gitignore 排除，不提交）
```

## 恢复到新设备 / 新 harness

Kimi Code：skill 装到 `~/.kimi-code/skills/`、agent 装到 `~/.kimi-code/agents/`、全局规则在 `~/.kimi-code/AGENTS.md`。按目录对应拷贝：

```sh
cp -r skills/*  ~/.kimi-code/skills/
cp agents/*     ~/.kimi-code/agents/
cp AGENTS.md    ~/.kimi-code/AGENTS.md
cp Google_code_style.md ~/.kimi-code/Google_code_style.md
```

其他 harness：把 `skills/*/SKILL.md` 的方法与 `agents/*` 的提示词装到各自约定位置。技能正文是 harness-agnostic 方法论；只有前端 `type: prompt`、`whenToUse` 与 `agents/` 是 harness 相关，可按需改写。

## 工作流速览

requirements → `write-spec`（冻结 spec，含 `[Sn]`+Claims+`Dependencies`+决策）→ 派发循环（每 `[Sn]` 实现/commit/review）→ 对照 spec 验收。决策累积在 `<slug>.decisions.md`（含 `## Progress` 进度表），按 `manage-decision-records` 维护；prose 与推理泄漏审查由 `prose-quality` + `trim-cot-leakage` 承担；简化用 `simplification-audit`；GitHub Flow 约定见 `AGENTS.md`。

## Skill 协作

- `write-spec` 应用 prose-quality（完整命题）与 manage-decision-records（supersession 检查）。
- `structured-code-review` 层1 调 prose-quality + trim-cot-leakage；`trim-cot-leakage` 删前引用 prose-quality；`simplification-audit` 委托 manage-decision-records 做保留判断。
- 协作声明落盘：`AGENTS.md`（调用指南）+ 各 `SKILL.md` 的 `## Collaboration` 节 + `agents/reviewer.md` + 本文件（协作总图）。

## archive/ 说明

`archive/` 是本地参考资料，被 `.gitignore` 排除、不进入版本控制：含 deepseek-harness 的 `dsh-*` 技能、Agent Notes 文档（`README-agent-notes.zh.md`）、`dsh_skill_AGENTS.md`。用于回溯这些 skill 的原始出处及我提炼它们时的对照，不参与本仓库维护。
