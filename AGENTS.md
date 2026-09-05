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
- **验收闸口复核两份清单**：Claims 偏差清单（偏差由本闸口裁决，不由 reviewer 裁决）+ 延迟范围清单，两份都连同证据上报用户（延迟范围的分类见「怎么写 spec」节，偏差的归属见停止清单的边界注记）。

## 怎么写 spec（本方法论重心）

- **研究课题先走 `write-research-outline`**（活大纲 + 叶子分类），收敛成 spec 叶子后再冻结。
- **需要 spec 当且仅当命中任一判据**：引入或修改对外契约（API、数据格式、配置 schema、协议、CLI 表面）/ 跨 2+ 模块且不能作为单一单元回滚 / 将在无人值守下执行 / 需先做取舍决策（存在 2 个以上站得住脚的方案）。机械性多文件改动（重命名、重新格式化、依赖升级、给既有行为补测试）豁免——它们触及很多文件却不产生需要仲裁的契约。细则见 `write-spec`。
- **1 spec = 1 可交付变更**（操作定义见 `write-spec`）：`[Sn]` 是其内部可派发单元。
- 每 `[Sn]`：`Claims`（可验证行为）、`Dependencies`（可选）、边界清晰。
- 每份 spec 含 `Global Constraints`（强制）与 `Out of Scope`。
- **拆判据**：一份 spec 默认包含多个 `[Sn]`；拆成多份 spec 的三条判据、隐式规模上限、以及「`[Sn]` 数量不是判据，内聚性才是」见 `write-spec`。
- **实现期发现的新工作按三分类处置**：可被现有 `[Sn]` 的 Claims 吸收的实现细节 / 契约错了（走 abandon）/ 邻近新范围（即延迟范围，记条目进 `.decisions.md`、冻结 spec 原样交付）；判据、条目格式与护栏见 `write-spec`，合并后由主 agent 汇总延迟条目决定后续处置。
- **每 feature 恒 2 文档**：`docs/specs/<slug>.md`（冻结 spec，纯契约，不含决策节）+ `<slug>.decisions.md`（决策 + `## Progress` 进度表）。
- spec 冻结后不可改；全部设计决策（brainstorm 起）直接进 `.decisions.md`；跨 feature/跨 spec 的耐久决策进 standalone DR（`docs/specs/decisions/`，proposed/accepted/rejected，见 `manage-decision-records`）；进度板并入 decisions 但作用域为进度（`manage-decision-records` 排除它）。
- 本仓库自身无 product `docs/specs/` 树：治理决策记录在 `docs/decisions/`（按 standalone DR 对待，审查时读取）；产品仓库按上文 `docs/specs/` 约定执行。

## 派发循环运行参数（不是模式）

- **人工闸口在环（交互）** 或 **无人+预算（goal 自主）**；**是否并行**独立 `[Sn]`。
- **无人值守（goal）**：逐 `[Sn]` 实现→commit→review→修复复审→整份 spec 全通过后**合并 PR + 删分支**（可用 `gh pr merge`）。
- **并行 `[Sn]`**：每 `[Sn]` 独立 worktree+分支；**合并由主 agent 串行**；**决策/进度单写者（主 agent）**；`coder` 禁写 `docs/specs/<slug>.md`。
- **派发前绑定**：主 agent 读 `.decisions.md` 的 brainstorm 条目；被引用的 standalone DR 附进对应 implementer prompt（细则见 `write-spec` After freeze）。
- **派发指导（不给模板）**：不同 harness 有不同的派发标准，具体 prompt 由主 agent 在派发时按任务类型决定。建议侧重——实现类附 `[Sn]` 逐字文本 + 相关 standalone DR + 边界与禁令；调查类附假设 + 证据标准；审查类附 spec 路径 + diff 范围。
- **task report（实现者回报）**：最小必含内容——Claims 的偏差、发现的延迟范围、证据指针；形状由主 agent 定，不给模板。
- **顾问触发**：主 agent 对同一目标连续 3 次未达成后，派只读顾问咨询。
- **reviewer 拒绝上限**：同一 `[Sn]` 连续 3 次 `needs fixes`/`reject` → 停机上报（见停止清单）。

## GitHub Flow 约定（非 skill）

- 1 spec = 1 分支 = 1 PR；一 `[Sn]` 一 commit；并行用 **merge commit**；`main` 永远可部署。
- 栈式 PR 只用来自 main 的 merge 更新 base（禁 rebase+force-push）。
- **合并前 spec 门禁**：diff 未触碰 `docs/specs/<slug>.md`；合并前置：reviewer `approve` + 证据存在。
- **治理性直推例外**：standalone DR 的状态迁移（proposed→accepted/rejected）由主 agent 在 main 直接提交（无分支/PR）；该迁移在下一次 review 或 audit 中复核。

## 编码规则

- 编码守则：Think Before Coding / Simplicity First / Surgical Changes / Goal-Driven。
- 语言 → 风格文件索引：命中索引的语言，实现**遵循**其风格文档；该遵循由 `structured-code-review` 的 `Declared style conformance` 检查按下表解析风格文档并在审查中核验，而风格发现按该检查自身的排序低于正确性/生命周期/安全缺陷、不单独否决合并。

| 语言 | 风格文件 |
|---|---|
| Python | `references/style/python.md` |

- 未列入索引的语言沿用该项目自身的风格约定；产品仓库自己的 AGENTS.md 索引优先于本全局索引。
- 风格文档拥有自己声明的规则，别处只引用不复述；风格文档与 `trim-cot-leakage` Class 8 冲突时的优先级裁决归该 skill 的 Class 8 修复规则。

## 严重风险停止清单（无人值守命中即停+上报）

`改历史(含 force-push)` · `泄密` · `需用户判断` · `spec 实质变化` · `真实回归红` · `预算耗尽` · `合并冲突` · `环境/CI 不可用` · `reviewer 连续拒绝达上限` · `工具权限被拒`。

边界注记——三条易混情形的归属：

- **延迟范围**（契约正确但不完整）**不是** `spec 实质变化`：记条目后继续跑，不停机。
- **契约错**（与 Claim 矛盾，或改动 `Global Constraints`）才是 `spec 实质变化`：停机。
- **偏差**（某个 `[Sn]` 自己的 Claim 实现不出来）既非延迟范围也非契约错：实现期记录问题、继续实现该 `[Sn]` 的其余部分、把偏差写进 task report、不改 spec，不停机；reviewer 把该 Claim 报为「未满足」并以该偏差作为解释——这是一条 finding，不是一次拒绝、不计入 3 次上限；偏差由验收闸口裁决，未经裁决的偏差属 `需用户判断`，无人值守下停机上报。

`reviewer 连续拒绝达上限` 的数值见「派发循环运行参数」节。

## 审查门禁

- 每完成一个 `[Sn]` 派 `reviewer`；查 spec 合规（Claims，含 `Global Constraints`/`Out of Scope` 未违例）+ 两层结构化审查。
- **证据要求：测试名 / 命令输出 / file:line。Prose 不是证据。**

## 技能目录与调用指南

技能在 `skills/`（本机装到 `~/.kimi-code/skills/`），每个各司一职。任务命中触发时加载对应 skill：

| Skill | 负责 | 触发时机 |
|---|---|---|
| `write-research-outline` | 把研究问题写成活大纲 + 叶子分类（spec / investigation）+ 叶子结局内联记录（耐久 guardrail 提升 standalone） | 任务是开放研究问题，"要造什么"尚未确定 |
| `write-research-report` | 研究层三种报告（阶段/总体/深潜）的命名、触发、结构、书写语言、配图、证据标准与读者 | 一批叶子到达终态、主题设定了汇报节奏、主题收尾、无人值守运行结束、用户索要进展汇报 |
| `write-spec` | 把需求写成可派发 spec（`[Sn]`+Claims+Global Constraints）+ 配套 `.decisions.md`；**本方法论重心** | 命中「怎么写 spec」节的四维判据任一（机械性多文件改动的豁免清单同在该节） |
| `prose-quality` | 编辑标准——完整命题规则 + 各位置必备文案覆盖率 + 排除清单（冻结 spec 只扫不改） | 写/审/修/剪任何文案：注释、文档、prompt、诊断、UI 字符串 |
| `trim-cot-leakage` | 推理过程泄漏检测与修复（8 类分类 + 表面容忍表） | 审查可能泄漏会话痕迹的文案：死引用、变更叙述、评审编排、模糊措辞与规划残留 |
| `structured-code-review` | 两层审查方法论（阻塞项 + 语义检查）+ 报告格式 + git 只读白名单 | 审任何改动：PR / diff / spec 合规 / 任务产出；评审者 agent 加载 |
| `manage-decision-records` | 决策生命周期——supersession 检查、保留判断、状态迁移（standalone 三状态） | 增/审/覆盖/整改 Decision Log、独立 DR 中的决策 |
| `simplification-audit` | 简化候选挖掘（standalone DR、Decision Log 条目或内联 TODO） | 用户让简化、清理、找死代码、审计未用 API、降表面积 |

### 协作（一规则一归属，只引用不重复）

- `write-spec` 应用 prose-quality（命题）与 manage-decision-records（写日志条目时做 supersession 检查）；`structured-code-review` 层1 调 prose-quality + trim-cot-leakage；`trim-cot-leakage` 删前引用 prose-quality；`simplification-audit` 委托 manage-decision-records 做保留判断，耐久提案按 MDR 的 proposed 格式写 standalone。
- `write-research-outline` 是研究层入口：spec 叶子交给 `write-spec` 冻结；investigation 叶子的结局内联记在大纲（`docs/research/`，研究记录非决策），结论超出单行记录时由 `write-research-report` 的深潜报告承载；满足 guardrail 判据的结论由主 agent 提升为 standalone DR（`Status: rejected`，落 `docs/specs/decisions/`，按 `manage-decision-records` 治理）；大纲 prose 归 `prose-quality`/`trim-cot-leakage`。
- `write-research-report` 是研究层报告层：大纲是活看板与叶子状态真相源，报告是时点交付物、写后不改、消费叶子状态但绝不复述大纲；报告是研究记录，在 `manage-decision-records` 治理范围外；报告里的建议只有变成大纲中的 spec 叶子并经 `write-spec` 冻结才成为工作；主 agent 是报告唯一写者；报告 prose 归 `prose-quality`/`trim-cot-leakage`；报告正文的书写语言归 `write-research-report`，`trim-cot-leakage` Class 8 按它适配。
- `references/style/`：per-language 风格文档由 `structured-code-review` 的 `Declared style conformance` 检查按「编码规则」节的索引表解析并读取。
- 协作声明落盘在：`AGENTS.md`（本调用指南）+ 各 `SKILL.md` 的 `## Collaboration` 节 + `agents/reviewer.md`（评审路径）+ `README.md`（总图）。
- **评审路径**：reviewer agent 加载 `structured-code-review`，用 prose-quality/trim-cot-leakage 做 prose 一遍，不在别处重复这些规则。
- **spec 路径**：需求 → `write-spec`（冻结契约）→ 派发循环 → `structured-code-review` 验收；决策按 `manage-decision-records` 规则累积在 `<slug>.decisions.md`。
