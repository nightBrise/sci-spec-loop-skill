# Sci-Spec-Loop Engineering

## 核心模型

主 agent（对话环中的主循环）是控制器。harness 通过**能力画像**派发 subagent：只读顾问、可写实现者、只读评审者。凡能派发 subagent 的 harness 均可直接执行本方法论；kimi 的映射为 `plan`/`explore`、`coder`、`reviewer`。

- **顾问**：只读（查仓库/网络，不可写）——产出文本方案，由主 agent 采纳。
- **实现者**：可读写可执行——唯一能写文件/跑命令的 subagent。
- **评审者**：只读（可查 diff/仓库，不可写）——出审查报告。

## 主循环（spec 驱动，4 段）

`brainstorm（需求）→ write-spec（冻结 spec）→ 派发循环（实现/commit/审/修复）→ 对照 spec 验收`

- 无独立 planning 阶段；`plan` 仅作只读顾问。
- **覆盖检查在派发前由主 agent 执行**：每个 `[Sn]` 独立可派发（有 Claims、边界清晰、依赖可解析）。

## 怎么写 spec（本方法论重心）

- **1 spec = 1 可交付变更**；`[Sn]` 是其内部可派发单元。
- 每 `[Sn]`：`Claims`（可验证行为）、`Dependencies`（可选）、边界清晰。
- **拆判据**：契约耦合 / 可独立交付+回滚 / 不同结果；**拿不准归一个 spec**。
- **每 feature 恒 2 文档**：`docs/specs/<slug>.md`（冻结 spec）+ `<slug>.decisions.md`（决策 + `## Progress` 进度表）。
- spec 冻结后不可改；实现期设计决策只进 `.decisions.md`；进度板并入 decisions 但作用域为进度（`manage-decision-records` 排除它）。

## 派发循环运行参数（不是模式）

- **人工闸口在环（交互）** 或 **无人+预算（goal 自主）**；**是否并行**独立 `[Sn]`。
- **无人值守（goal）**：逐 `[Sn]` 实现→commit→review→修复复审→整份 spec 全通过后**合并 PR + 删分支**（可用 `gh pr merge`）。
- **并行 `[Sn]`**：每 `[Sn]` 独立 worktree+分支；**合并由主 agent 串行**；**决策/进度单写者（主 agent）**；`coder` 禁写 `docs/specs/*`。

## GitHub Flow 约定（非 skill）

- 1 spec = 1 分支 = 1 PR；一 `[Sn]` 一 commit；并行用 **merge commit**；`main` 永远可部署。
- 栈式 PR 只用来自 main 的 merge 更新 base（禁 rebase+force-push）。
- **合并前 spec 门禁**：diff 未触碰 `docs/specs/<slug>.md`；合并前置：reviewer `approve` + 证据存在。

## 编码规则

- 编码守则：Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven。
- 实现遵循 `Google_code_style.md`（Python，注释用中文）；中文注释规则优先于 trim-cot-leakage Class 8。

## 严重风险停止清单（无人值守命中即停+上报）

`改历史(含 force-push)` · `泄密` · `需用户判断` · `spec 实质变化` · `真实回归红` · `预算耗尽` · `合并冲突` · `环境/CI 不可用` · `reviewer 连续拒绝达上限` · `工具权限被拒`。

## 审查门禁

- 每完成一个 `[Sn]` 派 `reviewer`；查 spec 合规（Claims）+ 两层结构化审查。
- **证据要求：测试名 / 命令输出 / file:line。Prose 不是证据。**

## 技能目录与调用指南

技能在 `skills/`（本机装到 `~/.kimi-code/skills/`），每个各司一职。任务命中触发时加载对应 skill：

| Skill | 负责 | 触发时机 |
|---|---|---|
| `write-spec` | 把需求写成可派发 spec（`[Sn]`+Claims+Decision Log）；**本方法论重心** | 任务跨 2+ 文件/2+ 步，需先冻结契约 |
| `prose-quality` | 编辑标准——完整命题规则 + 各位置必备文案覆盖率 | 写/审/修/剪任何文案：注释、文档、prompt、诊断、UI 字符串 |
| `trim-cot-leakage` | 推理过程泄漏检测与修复（8 类分类） | 审查可能泄漏会话痕迹的文案：死引用、变更叙述、评审编排、兜底残留 |
| `structured-code-review` | 两层审查方法论（阻塞项 + 语义检查） | 审任何改动：PR / diff / spec 合规 / 任务产出；评审者 agent 加载 |
| `manage-decision-records` | 决策生命周期——supersession 检查、保留判断 | 增/审/覆盖/整改 spec、Decision Log、独立 DR 中的决策 |
| `simplification-audit` | 简化候选挖掘（DR 或内联 TODO） | 用户让简化、清理、找死代码、审计未用 API、降表面积 |

### 协作（一规则一归属，只引用不重复）

- `write-spec` 应用 prose-quality（命题）与 manage-decision-records（Decisions/ supersession）；`structured-code-review` 层1 调 prose-quality + trim-cot-leakage；`trim-cot-leakage` 删前引用 prose-quality；`simplification-audit` 委托 manage-decision-records 做保留判断。
- 协作声明落盘在：`AGENTS.md`（本调用指南）+ 各 `SKILL.md` 的 `## Collaboration` 节 + `agents/reviewer.md`（评审路径）+ `README.md`（总图）。
- **评审路径**：reviewer agent 加载 `structured-code-review`，用 prose-quality/trim-cot-leakage 做 prose 一遍，不在别处重复这些规则。
- **spec 路径**：需求 → `write-spec`（冻结契约）→ 派发循环 → `structured-code-review` 验收；决策按 `manage-decision-records` 规则累积在 `<slug>.decisions.md`。
