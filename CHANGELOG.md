# CHANGELOG

本文件是仓库的版本变更说明与理由：每一节讲清这一版改了什么、为什么这么改，以及当时为什么排除了其他方案。版本按时间倒序排列，新版本追加在最上面；仓库没有正式版本号，节名取该版的主题，日期用 ISO 格式，文件路径按该节所述版本当时的布局书写，当前布局见最新一节。

## [mimo-migration-guide] - 2026-11-03

**变了什么**

- 新增 `assets/adapters/mimo.md`：MiMo Code 适配片段（安装布局、能力映射、模型档位、hooks），与 `assets/adapters/kimi.md` 同构。
- `README.md` / `README.en.md` 新增「迁移到 MiMo Code / Migrating to MiMo Code」完整指南：skills 与 references 镜像、规则合成、模型档位占位配置、R1/R2/R3 落法、校验与常见坑。
- 根 `AGENTS.md` 的 MiMo Code 安装节从「增量合并」改为「合成式安装」，补全 references、hooks 与验证步骤。

**为什么**

- 原安装说明是 merge-increment，与 v2 的合成式迁移不一致；实机安装还需要补齐 style references、处理 mimo 没有文档化 hooks 的事实。把这条路径写进 README，新用户不必从会话记录复原。
- 指南刻意使用占位符：不绑定供应商、模型或机器路径；agent 分配只用自带 `build`/`plan`/`general`/`explore`，不引入自定义 agent。

**对使用者的影响**

- MiMo Code 用户可按 README 一次装好；Kimi Code 的安装路径不变。
- 个人 skill、个人路径与模型选择仍由使用者自行决定；指南不包含这些信息。

## [mechanism-hardening] - 2026-11-03

这一版补上机制审计发现的三处缺口（合并后回滚无受控出口、hooks 只有实现没有定义、知识层只进不出）与四处强制力薄弱点（分流乐观执行、覆盖盲区、进度树时效、顾问无闭环）。

**变了什么**

- 新增**合并后回滚**规则：owner 裁决 revert 还是向前修；revert 是普通正向 commit（永不 reset / force-push），一次回滚一个 merge、多个时逆依赖序，走治理性直推；教训落在 revert message 与重做 spec 的 Claims，guardrail 级教训经 owner 发话才提升知识类 DR；撞冲突走既有"合并冲突 → 停机"。落点：`assets/AGENTS.md` GitHub Flow 节与直推清单、`assets/references/workflow/github-flow.md` 新增 Post-merge rollback 节。
- hooks 从"给模板"改为"给契约"：`github-flow.md` 新增 Hook contract 节（R1/R2/R3 五字段表：作用点 / 作用方式 / 守护对象 / 失败模式 / 所需能力），README 适配节同步投影并写明 R3 参考实现的拷贝来源；`assets/adapters/kimi-hooks/*.mjs` 降格为 kimi 参考实现，其他 harness 按自己的扩展点自建。
- 知识库闭环补齐：派发前强制检索独立 DR 与决策日志、零命中明写（`assets/AGENTS.md` 主循环 Dispatch brief 一带 + `write-spec` 开工与回报步骤）；知识库精简由收尾治理扫描按累积阈值（独立记录 +10）提请 owner 裁决，执行走 `manage-decision-records` 留存判断（`simplification-audit` 收尾例行 + MDR 批处理第 6 步）。
- 四处薄弱点各以一两行加固或强制问答闭合：分流测试收紧"数值出处"——可预写 = 数值有出处（实测 / 标准 / 需求），预测值 = 隐藏预注册退回探索（`assets/AGENTS.md` Triage + `write-spec` 开工）；Progress 节点钉死在工作项边界更新（无人值守包络节）；顾问咨询与处置（advised X / adopted Y / because Z）记决策条目、进收尾分流；任务报告与审查报告双侧**覆盖边界陈述**（处理了什么 / 明确不处理什么 / 未验证假设），对照不上即发现（`assets/AGENTS.md` task report 元组 + `structured-code-review` 报告内容）。
- 同步语义定案为**镜像**：以仓库为准，覆盖之外，仓库已移除的内容一并从实机删除，非仓库来源文件不动（README 适配节"add-only"表述更正）。

**为什么**

- 对照 README 全景做机制审计，三处缺口各有实害：合并后出事无程序可循（revert 不违 merge-only 却没人敢用）、hooks 换 harness 即失传（模板不可移植）、知识层单向流入（沉淀越多、查得越少，会重复已记录的失败）。三处均以最小文本闭合：零新 skill、零新仪式。
- 回滚记账刻意做轻：教训的权威家是重做的 spec Claims 与 revert message，不另立墓志铭或 supersession 仪式——回滚是 owner 已有结论的撤除，不是判据变更，四通道记账仍只服务 ②③；"记录层不回滚"由既有 Progress 节点更新规则覆盖。
- 排除的方案：回滚带完整记账仪式（四住处表 + supersession + 墓志铭，复杂度超过收益）；随仓分发统一 hook 模板（各 harness 扩展点不同，改为契约 + 参考实现）。
- 四处薄弱点以必答项或时机钉死闭合，其中覆盖盲区（缺失需求）是认识论极限——不加"完整性 checklist"式假严谨，只把边界扫描从隐式改强制：任务报告与审查报告各自独立陈述覆盖边界并对照，分歧即信号。

**对使用者的影响**

- 合并后发现问题有了明确路径：owner 裁决 revert 或向前修，revert 不触发"改历史"停止清单。
- 在非 kimi harness 上自建 hooks 时照契约表实现；kimi 用户可直接用参考实现；R3 需产品自定义 `scripts/run-l0`。
- 派发简报会带一行"检索结果"（含零命中）；独立记录累积后 owner 会在主题收尾收到知识库精简提请。
- 分流、任务报告、审查报告各多一个必答项（Claim 数值出处 / 覆盖边界陈述与双侧对照）；无人值守下进度节点与顾问处置有账可查。
- 重复安装 / 升级不再留下退役文件：以仓库为准的镜像同步会清掉过时件，无需手工清理实机。

## [workflow-v2] - 2026-11-02

这一版把方法论从"双入口 + reviewer 评审"的 v1 升级为"单入口 + 分流测试 + 互产循环"的 v2，并落地配套的记账纪律、变更通道与合成式安装。

**变了什么**

- 流程主干重写：任务输入 → 主题（无类型容器）→ 工作项 → 分流测试（Claims 可预写？）→ 建设/探索双支 + 互产循环 → 主题收尾关卡（5 项 checklist，含治理例行扫描）。判据变更四通道（偏差 / Amendment / abandon 干净处置 / 延迟范围）取代旧的偏差/abandon 二分；大纲改为按需物化的导航投影，实验走预注册三件套（目标判据 = 归因锚 / 归因设计 / 结果义务）。
- skill 集 8 → 13（四层）：新增 `record-discipline`（源/投影记账纪律、防膨胀四边界、开票五问/验票四查/收尾批查）与流程执行四件 `pre-push-checks` / `pr-description` / `merge-stack` / `test-reliability`（吸收 deepseek-harness 对应 skill 精华）；`write-spec` 瘦身并新增 After-freeze 节群；`manage-decision-records` 扩权（条目格式、Progress 树格式、删除政策、收尾批处理、复查条件必填）；`write-research-outline` 扩权（预注册三件套 + 双速登记）；`simplification-audit` 升级；`structured-code-review` 更新。
- **reviewer 角色废止**：`assets/agents/reviewer.md` 删除。审查按需承载——owner 直审（spec 草稿/大纲骨架/报告）、主 agent 自审 subagent 代码（写者≠审者）、派发审（通用 subagent + 审查 prompt，构成归 `structured-code-review`）。
- `assets/AGENTS.md` 整体重写为 11 节恒载骨架（分工契约/主循环/四通道/收尾关卡/包络/停止清单/审查/编码规则/GitHub Flow/技能目录/模型与记账），≤200 行预算 + 行文规范 + 指针双路由（事件钩子 + 目录索引）。
- 安装从镜像拷贝改为**合成式迁移**：`assets/AGENTS.md` 主体（零 harness 专名）+ `assets/adapters/kimi.md` 适配片段拼接注入实机文件（生成物，不手维护）。新增 `assets/adapters/kimi-hooks/`（R1 拦 force-push/`--no-verify`/rebase/`reset --hard`、R2 push 前证据提醒）与 `.githooks/pre-commit`（R3 L0 站岗）。
- `references/` 强化：`style/engineering.md` 新建（四守则全文的唯一归属，恒载只留 mantra）；`style/error-handling.md` 新建；`testing.md` 扩"How to write tests"章；`github-flow.md` 瘦身（push/PR/合并程序细节迁入对应 skill）。`write-research-report` 对齐"详细合理指解释质量不指字数"与 Progress 树状态词表。
- `README.md` / `README.en.md` 重写为 v2 流程图（单入口/四通道/收尾关卡/13-skill 联动/合成部署）。

**为什么**

- 六能力目标里成本可控是前期对一个真实工程仓库做提交实证时暴露的最弱项（69% 流程 commit、验收结论 6–7 倍写）：分流测试在工作项粒度容纳"边测试边探索"（互产循环取代换轨）；四通道给冻结后变更以受控出口（旧二分下 abandon 一刀切，宁可留尸）；`record-discipline` 的源/投影 + 软上限 + 禁投影的投影直接治倍写与无界膨胀；收尾关卡的治理例行扫描（门禁强制"扫了"不强制"清完"）补上治理"易饿死"的固定触发。
- reviewer 不是角色而是行为：契约承诺要 owner 认账，subagent 代码由主 agent 或派发审把关（写者≠审者天然独立），审查 prompt 构成收归 `structured-code-review` 一处。
- 合成式迁移：不同 harness 只差少量文字（能力画像映射、模型池规则），独立片段文件 + 安装时拼接，主体保持零专名、换 harness 只换片段；hooks 把红线从"事后停机"前移为"打不出去"，且 fail-open——没有 hooks 的 harness 由规则层完整兜底，移植性不受损。
- 排除的方案：主题的工程/研究预分类与"复杂/简单"分解分类（与工作项粒度判定自相矛盾，且判定标准不可操作）；写作治理的纯标准层/合并/极简三铁律三案（细则压恒载层 = 永久注意力税）；独立的"覆盖检查"步骤（与派发简报组装是同一个动作，内联即可）；SA 候选阻塞主题关闭（提案是未来工作，不该挡终结）。

**对使用者的影响**

- 从 v1 升级：不再需要 reviewer agent（`assets/agents/` 已清空）；skill 集 8 → 13，按需加载面变大，但恒载规则文件保持 ≤200 行预算。
- 安装方式从镜像拷贝改为合成式迁移：实机规则文件 = 主体 + 适配片段的拼接产物，勿手改；重装与升级按 README「适配到你的 harness」三步执行。
- hooks（kimi）与 git 钩子是可选项，装与不装不影响方法论完整性。

## [repo-structure] - 2026-10-30

这一版把仓库分成"可移植资产"与"本机/人读文件"两层，目录与文档分工随之重排。

**变了什么**

- 随安装拷到其他设备与 harness 的内容收进 `assets/`：`assets/AGENTS.md`（方法论主体）、`assets/skills/`（八个 skill）、`assets/agents/`（reviewer）、`assets/references/`（`style/` 与 `workflow/`）。skill、agent 与 reference 正文原样搬运，规则内容未改。
- `docs/decisions/` 的五份治理决策记录并入本文件，该目录随后删除。
- `README.md` 回到人读门面，解释这套 harness 流程如何运转；`README.en.md` 提供并列的英文版。
- 新增本文件 `CHANGELOG.md`，作为版本变更与决策理由的人读承载。
- 根 `AGENTS.md`（部署与维护手册）退出 git 跟踪，仅本机使用。

**为什么**

这一版把规则文档的三份分工落到目录上：README 负责人读入口、根 `AGENTS.md` 负责部署与维护、方法论文本进 `assets/AGENTS.md`。此前 skill、agent、reference、方法论文本与仓库本地文件平铺在同一层目录，安装时要照着文档逐项挑"哪些会被拷走"；收进一棵 `assets/` 树后，安装只需认一个来源目录，仓库本地文件（README、CHANGELOG、本机手册）自然隔在外面，也不会再被误当成移植语料。

`docs/decisions/` 的用途已经结束：这些记录写给 agent 看决策过程，安装从不拷贝，日常运行也不读；决策稳定后再维护一个目录只是增加表面积。把理由转写进本文件，人读的地方只剩一处。

根 `AGENTS.md` 写的是本机路径与本机安装镜像，是操作者自己的工作副本；留在 git 里只会在跨机器同步时制造噪声，退出跟踪后它仍是仓库里可用的维护手册。

README 曾在 2026-09-18 被精简为纯恢复指南（见 [readme-restore-guide]）：流程讲解与 `AGENTS.md` 及各 skill 重复，整段删掉。这一版把"流程怎么运转"重新长回 README，部署命令同时收录进 README（根手册不入库，入库读者需要在门面上看到怎么装），完整部署与维护契约留在仅本机的根 `AGENTS.md`，形成中文门面加 `README.en.md` 的并列结构。

## [readme-restore-guide] - 2026-09-18

**变了什么**

- README 从"流程说明 + 恢复步骤"收缩为恢复指南：两张 mermaid 流程图（工作流速览、Skill 协作）与逐段流程走查整段删除，只留目录结构、Kimi/Mimo 恢复步骤与安装校验（约一百行）。
- 同日收尾：补全恢复指南的校验（skill 计数、关键文件非空）、写明 Mimo 适配的适用范围与"本仓库不含 mimo 主 agent 提示词"、去掉第一人称的个人化叙述；Mimo 指引与合并策略、`workflow references` 的实际路径对齐。

**为什么**

README 的流程讲解与 `AGENTS.md`（方法论）及各 skill 重复：同一规则有多个家就会漂移，改一处忘一处。这个仓库的 README 只该回答"怎么把资产恢复到新设备/新 harness"，方法论的讲解回到方法论文件。第一人称叙述把仓库写成个人笔记，面向复用的恢复指南应保持中性；Mimo 的边界写明（不含主 agent 提示词），避免读者高估恢复范围。

## [language-policy] - 2026-09-18

**变了什么**

- 记录仓库的双语分区：可移植语料用英文，owner 面向的文件用中文；`docs/decisions/` 的 standalone DR 属语料区，用英文。
- 明确 `references/style/python.md` 的中文 TODO 团队规则、`trim-cot-leakage` 检测模式里的中文是"文档所教、所检的内容"，不是语言违规，不得翻译。
- 部署出去的 harness 规则文件不带任何指向本仓库的政策指针——不指向 README，也不指向 `docs/decisions/`；指针改由 owner 面的 README 承载，部署语料保持仓库无关。
- 完整的两分区表按当前布局重列在文末的 `## 语言政策` 一节。

**为什么**

混排语言如果没写成规则，下一个人（或 agent）会把它当事故来"修"：把 README 翻成英文，或把 AGENTS.md 翻回中文，每修一次就把语料搅一遍。代价不是假设：曾有一台机器把 AGENTS.md 翻成英文，另一台机器在同一文件上还压着未移植的中文增量，两种语言状态相遇时变成整文件合并冲突，而不是一次普通整合。

分区判据沿用安装流程已有的那条：文件是否会被拷到其他设备与 harness。全英文被否，因为 README 是 owner 的操控面、从不随安装出门，英文只增加阅读摩擦；全中文被否，因为语料正是要跨设备、跨 harness 复制的部分，中文源会在每次适配时被重译，而每台机器各自翻译 AGENTS.md 又会重现那个冲突；不写规则同样被否，未记录的混排会被反复"统一"。

报告正文的语言不归这条政策管，归 [report-language] 一节的报告语言决定；两条规则各管一层，互不越界。

## [agents-english] - 2026-09-18

**变了什么**

- `AGENTS.md`（当时是 harness 恒加载的方法论文件）从中文改写为英文，内容不变；编码守则由一行清单展开为四条原则小节——Think Before Coding、Simplicity First、Surgical Changes、Goal-Driven Execution——并进这份恒加载文件。
- 翻译 commit 的日期是 2026-09-09；2026-09-18 与 workflow v3 一并合入 `main`。

**为什么**

这份文件会被装成其他 harness 的全局 AGENTS.md，是每个会话都会读到的规则面。单一源语言可以避免每接一个 harness 就重译一遍语料——Mimo 的适配已经要翻译 agent 前端，英文源把这份工作量封住；跨机器的 diff 也因此稳定。编码守则必须留在恒加载层：语言细节归风格文档，但原则如果不在每次都会读到的文件里，就没有人读到。

## [workflow-v3] - 2026-09-18

**变了什么**

- **spec 冻结前先过评审闸**：spec 草稿不提交；主 agent 把草稿、磁盘上的需求基线、Decision Log 的 brainstorm 条目一起交给只读 reviewer，走 review → revise → re-review 直到 `approve`。复审永远是全文重审，增量复审只用于代码。交互式运行仍由用户确认评审后的草稿，实质修改再评一轮；无人值守运行在 approve 后自动冻结，没有用户步骤。需求不在磁盘上时先写基线，基线逐字引用用户目标，reviewer 同时拿到原始目标文本——无人值守时主 agent 不得对自己发明的基线自证覆盖。评审清单仍归 `write-spec`，清单项映射为阻断项（不可测 Claim、缺 Global Constraints、覆盖缺口）与建议（EARS 措辞、颗粒度建议）。
- **大纲骨架一次性评审**：研究主题的大纲首次产出时，用同一套机制跑一次骨架评审（子问题切分、叶子分类探针是否真的执行、假设是否可检验），verdict 语义与拒绝上限和 spec 评审一致；叶子在 approve 后才开工。给已批准的大纲新增顶层分支视为新骨架、要重新过闸；在既有分支内增删或重分类叶子不重跑。活大纲的日常更新不设闸，方向级评审仍归阶段报告。
- **切片评审分流**：spec 阶段给每个 `[Sn]` 标 `**Review tier:** contract | mechanical`。契约切片（Claims 触及外部契约、Global Constraints 或跨模块边界）保留逐片循环：实现 → 评审 → 跟进修复（续用同一 implementer）→ 增量复审，approve 后才合入 spec 分支。机械切片（纯测试、文档、机械改动）跳过逐片评审，凭 L0/L1 证据提交并合入；一个依赖 wave 完成时对期间合入的全部机械切片做一次批量评审（batch review），PR 时的 whole-spec review 又覆盖整条分支，所以没有机械切片能不经过评审就进 `main`。批量评审的发现交给所属切片的 implementer。标错层级按程序纠正：从发现点起按契约切片处理，并在 Decision Log 记一条 `Phase: implementation`，不改冻结 spec 的文本。
- **拒绝上限按评审对象计数**：连续 3 次 `needs fixes`/`reject` 落在同一个评审对象上才停跑。对象包括一个切片、一个 batch、spec 分支、spec 草稿、大纲骨架；该对象绿一轮即清零；偏差（deviation）发现任何情况下都不计数。
- **测试分层 L0–L3**：L0 是每切片提交前的聚焦自测，由 git pre-commit hook 强制执行；L1 是每条 Claim 映射到至少一个具名验证证据（测试名、`file:line`、可观察 UI 状态或可度量指标），映射不上的切片算未完成；L2 在 wave 完成或合入 spec 分支后跑跨切片集成；L3 在 PR 合并前连同 CI 跑全量回归，永不放进 hook。`references/workflow/testing.md` 直接给出可拷贝的钩子脚本与安装步骤（`core.hooksPath` 或 `.git/hooks`），按改动文件选测试、无测试可跑时放行并提示、测试红则带失败输出阻断。测试闸在评审闸之前：红测试退回 implementer，不派 reviewer。新写的测试红属于修复循环，自带计数器（同一 slice 连续 3 轮红才升级到停止清单，绿 commit 清零）；曾经绿的行为转红才是既有的真实回归停止项——停止清单的边界注记把这条差异写成第四条：新测试红 ≠ 真实回归红。`--no-verify` 与 force-push 一起进禁用清单。
- **GitHub Flow 细则外移**：分支拓扑、汇入规则、提交格式、PR 描述最低项落到 `references/workflow/github-flow.md`，两份 AGENTS.md 只留摘要加指针。spec 分支 `spec/<slug>`，切片分支 `spec/<slug>-s<n>`；无依赖切片从 `main` 切，有依赖切片从依赖满足点切（slice 级 stacking、只 merge 不改基、禁 rebase 与 force-push）；主 agent 按依赖顺序串行 merge；commit 格式 `[S2] feat: <summary>` 加后续 `[S2] review: <what was fixed>`；PR 描述最低项是 spec 路径、每切片 Claims 与证据指针、偏差清单、延迟范围清单——正是验收闸口要报的两份清单。治理直推清单（spec 与 Decision Log 冻结 commit、Progress 更新、standalone DR 状态流转）只写 `main`，冻结后不写 spec 分支。
- **无人值守的预算检查**：每个切片或 batch 边界比较剩余预算与剩余切片，不够就停跑上报，靠 Progress 板恢复；绝不降门禁硬跑。建议只记录不追，只修阻断项。
- **模型侧**：评审类派发从最高档降到 high 档（spec 评审与骨架评审）；模型名与档位的具体映射属 per-harness 适配层，不进语料；配置改动随实现落地，滞后则按部分实现记录。

**为什么**

四个结构性缺口在使用中暴露：无人值守会把未经独立评审的 spec 冻结，spec 质量只剩主 agent 自检，主观判断被冻结进驱动整轮运行的契约；每个 `[Sn]` 无条件走整轮评审，机械切片烧评审轮次，而真正耐久的闸（PR 时的 whole-spec review）来得最晚；测试要求散落在各 skill，提交时没有机械强制，也分不清"可修复的红"与"该停跑的回归"；GitHub Flow 的分支、提交与 PR 约定缺失或含糊。

被否的方向留下几条结论：冻结后再评审与冻结不可变性冲突，发现问题只能 abandon 再换后缀；让 plan 顾问当 spec 评审者不行，建议性输出没有 verdict 权力，做不了无人值守的闸；大纲每次更新都评审没有决策点可守，一次性骨架评审对准的才是真实故障模式（系统性切分错误），一个主题付一次评审；只做 whole-spec review 会把发现推到最贵的时点，返工横跨依赖切片；固定 N 次调度批量评审里的 N 是拍脑袋的，wave 完成才是自然边界；kimi PreToolUse hook 当测试闸被否，它设计上 fail-open 且有 600 秒上限（实测 git pre-commit 能挡住红 commit、放行绿 commit）；纯反驳跳过增量复审等于自己给自己放行。

净评审轮次大致持平：每份 spec 多一轮 spec 评审、每个研究主题多一轮骨架评审，机械切片省下逐片轮次；代价是机械切片的发现时点后移到批量评审或 whole-spec review，但 L0/L1 证据与后两道闸仍然看到完整 diff。

## [mimo-restore-guide] - 2026-09-07

**变了什么**

- README 增加 Mimo Code 的恢复指引：skill 目录按 add-only 循环同步（只增不删，不清理目标目录里的其他 skill）；agent 前端按对照表翻译（`mode: subagent`、`description` 合并 `whenToUse`、`tools`/`disallowedTools` 映射到 `permission`、reviewer 档不低于 implementer 档、`temperature: 0.2`）；workflow references 单独拷贝；全局 `AGENTS.md` 先 diff 再合并增量，不整文件覆盖；附校验命令。
- 次日把这一节收敛为恢复过程本身，不再在 README 里重讲方法论。

**为什么**

Mimo 是第二个实际在用的 harness，它的 skill 目录布局与 agent 前端格式都和 kimi 不同，原样拷贝会失效。方法论本身是 harness 无关的（skill 正文不用改），差的只是前端字段与安装位置，所以 README 给的是对照表与拷贝命令，而不是第二套方法论。收敛为恢复过程，是因为 README 的职责是"怎么恢复"，解释规则应回到规则文件本身。

## [report-language] - 2026-09-05

**变了什么**

- 研究层的三种报告（stage、overall、deep-dive）正文用中文；骨架节标题保持英文，作为跨文件稳定锚点（其他规则按名字引用它们）；叶子状态标签、spec 与 decision 锚点、路径、代码标识符等技术 token 在中文正文里不翻译。
- `trim-cot-leakage` 的 `### Class 8: Authoring-language slips` 增加技术 token 豁免：报告成为 Class 8 的第二个"项目规则覆盖"实例（第一个是 `references/style/python.md` 的中文注释规则）。真正的英文散文碎片仍按泄漏处理。
- 图表在证据是数据形态时强制：任何由数据、测量、实验或原型行为支撑的结论至少配一张图，纯文献结论豁免；stage/overall 报告只要有数据型发现就至少带一张汇总图；深潜报告分别给方法与结果配图。图存在 `docs/research/assets/<topic>/`，按报告 id 命名，用相对路径 Markdown 图片语法嵌入；caption 带数据来源或生成方式锚点，保证可复现。
- 图随报告冻结：图片文件不覆盖、不原地编辑；修正以新文件随下一篇同主题报告发布，并在正文点名它修正的报告与图。插图前要真的看过渲染结果；harness 读不了图时回退为生成命令输出加声明的轴、单位、数据范围，并在 caption 记下用了哪种校验。

**为什么**

报告与八份英文 skill 文本不同：skill 是 agent 执行的方法论，报告是 owner 读来定方向的交付物，而 owner 的工作语言是中文。用英文写报告，每个方向决策都要多一层翻译。标题与技术 token 不译，是因为它们要能被 grep 到、能被其他文件按名字引用；译了就得维护中英映射。Class 8 若不豁免，会把必须保留英文的 token 当成语言滑落，而它的 translate-or-delete 修复会直接打断跨文件锚点与可追溯性。这条规则也没有放进 `prose-quality`，更没有在 `AGENTS.md` 里再建一张文档语言索引：`prose-quality` 只管与语言无关的编辑规则，而只为报告一个表面建全局索引违背一规则一家。

图的理由同样直接：研究层的证据多是实验数据、测量与原型行为——曲线、分布、对比、时间序列，散文转述会丢形状信息，还引入复述偏差，而 owner 正是靠这些形状定方向。被否的方案：可选配图（通常等于不配）、每类报告固定图数（配额会催生装饰性图表）、把图堆在 `docs/research/` 根目录（stage 报告按主题累积，根目录会失控）、允许原地覆盖（已提交报告的证据会悄悄改变，报告链失去可信历史）。

已知缺口一并记下：文档语言只为报告立法，大纲与 spec 没有强制语言，同一主题的大纲与报告可能语言不一致；图片是二进制文件，仓库体积、格式与大文件存储没有配套政策。

## [spec-granularity] - 2026-09-05

**变了什么**

- **spec 触发判据改为四条，命中任一即需要**：改动外部契约（API、数据格式、配置 schema、协议、CLI 表面）／跨 2+ 个模块且无法整体回滚／将无人值守运行／需要先在多个可辩护设计间取舍。机械多文件改动（重命名、重新格式化、依赖升级、为既有行为补测试）豁免。
- **1 spec = 1 可交付变更**；一个 spec 内默认放多个 `[Sn]`，只有三条拆分判据同时成立才拆。可交付变更的操作定义：能单独合并、单独回滚、对应一个 PR，且一组 Claims 能完整表达其验收。尺寸上限保持隐式、不给数字——一个 PR 仍能端到端评审、合并后 `main` 仍可部署；`[Sn]` 必须分批合入就是该拆的信号。
- **延迟范围（deferred scope）成为一等出口**：实现中发现的新工作分三类——能被既有 Claim 吸收的实现细节；与 Claim 或 `Global Constraints` 冲突的错契约，走 abandon；两者都不是的相邻范围，记入 Decision Log 的 deferred-scope 条目，冻结 spec 原样发布，不改一个词、不加一节、不 abandon。PR 合并后由主 agent 决定这些条目变成一篇后续 spec、几篇，还是一篇都不办。延迟从不停跑；无人值守运行记录后继续，验收闸口连同证据上报清单。
- **研究层补齐**：`write-research-outline` 把开放研究问题转成活大纲并分类叶子（spec 叶子交 `write-spec` 冻结，investigation 叶子结论内联记回大纲）；新增 `write-research-report` 拥有三种报告形式与它们和 outline 的边界——outline 始终是活板与叶子状态的唯一权威，报告是一次性交付物、写完不改、解释而非复述 outline、不受 `manage-decision-records` 管治，报告里的建议只有变成经 `write-spec` 冻结的 spec 叶子才算工作项；死路叶子与已解决叶子享受同等的报告规格。
- **派发指引补上三个悬空定义**：task report 的最低内容（与 Claims 的偏差、发现的延迟范围、证据指针）、advisor 触发条件（同一目标连续失败 3 次）、reviewer 拒绝上限（同一 `[Sn]` 连续 3 次 `needs fixes`/`reject` 即停并升级）——上限的单位后来被 [workflow-v3] 推广到评审对象。
- **风格文档迁移**：Python 风格文档移到 `references/style/python.md`，`AGENTS.md` 的编码规则只留四条通用原则、语言 → 风格文档索引与回退规则（未列语言遵循项目自身约定，产品仓库的索引高于全局）；`structured-code-review` Layer 2 新增 `### Declared style conformance`，按索引解析风格文档并校验其总是适用的核心项。风格发现要带 `file:line`，排在正确性、生命周期、安全之后，单独不 veto 合并。

**为什么**

旧的触发判据"跨 2+ 文件或 2+ 步骤"几乎命中每一次小改动，每命中一次就产出一篇冻结 spec 加配套 Decision Log，这是 `docs/specs/` 增长的主因；"拿不准就保持一个 spec"又被读成"可以拆"的许可，而"可交付变更"从未定义。判据换成"是否需要仲裁一份契约"，不再看 diff 多大；无人值守这一条则给长时间自治运行一个契约兜底。

冻结 spec 原本只有一个出口——abandon，把**写错**的契约（Claim 不可行、需求实质变化）与**不完整**的契约（相邻工作没预见到、但每个 `[Sn]` 仍成立可验证）混为一谈。abandon 第二种等于杀掉一份只是不够周全的 spec，换来新 slug、新 spec、新 Decision Log，旧的一对还留在磁盘上；为减少 churn 而放大 spec 又让 abandon 更可能发生，两头都在推高文档数量。延迟范围不改变冻结语义：Decision Log 本来就未冻结、本来就收实现阶段条目，延迟范围只是给一条已有通道起名。

被否的方案包括：保留旧判据只加合并偏好（管得住 spec 多大，管不住生出多少）；给 `[Sn]` 数量设硬上限（数字会变成指标，作者填满配额再机械拆，正好制造上限想防的 spec）；分节冻结（与五条既有不变量冲突：一 spec 一分支一 PR、无人值守以"整个 spec 通过"为终止、合并闸要求 diff 不碰 `docs/specs/<slug>.md`、reviewer 按冻结 spec 枚举 Claims、已 accepted 的治理要求冻结语义不变）；按工作单元一 spec（与冻结语义直接冲突）；把报告塞进 `write-research-outline`（活板与一次性交付物两种生命周期混在一起）；造一个覆盖研究/任务/交付总结的 `write-report` skill（面太宽，伸进 trim-cot-leakage 的表面容忍度表、派发规则与 PR 描述约定）；出 implementer/reviewer 提示词模板（把 harness 特定的派发形状固化进一个自称 harness 无关的仓库）；把风格文档升成 skill（风格几乎对所有实现任务都适用，按需加载没有收益）；风格文档留在仓库根（只覆盖 Python 的文档放在顶层会被读成通用规范，且根目录没有第二个语言的位置）。

## [governance-v2] - 2026-09-05

**变了什么**

- 决策治理收敛到 `manage-decision-records` 一处：状态词表、迁移、取代（supersession）、留存与删除都归它；`manage-decision-records` 与 `simplification-audit` 两份互相冲突的 standalone DR 模板合并成一套。
- standalone Decision Record（`docs/specs/decisions/`）是唯一带生命周期状态机的工件：`proposed` → `accepted` 或 `rejected`，`superseded` 作为叠加标记；决策首次随实现落地时由主 agent 在 `main` 上把 proposed 迁到 accepted，部分实现把剩余缺口写进 `## Consequences`；唯一的物理删除窗口是审计时判定为 obsolete 的 rejected。审计由用户或主 agent 显式触发，不属于派发循环。
- spec 变成纯契约：只有 `[Sn]`、Claims、Global Constraints，不带 `## Decisions` 节；已冻结且带该节的旧 spec 保留它作为历史快照。
- 每特性决策只有一个家：`<slug>.decisions.md` 的 Decision Log，D1、D2… 从 brainstorm 连续编号到验收；条目 append-only，唯一允许的编辑是原地追加 supersession 或 Status 说明、以及把已实现的决策改写成现在时的既成事实；同文件的 `## Progress` 板由主 agent 原地更新。
- 决策与进度只有主 agent 一个写者；`write-spec` 在冻结时写 brainstorm 条目；coder 永不写 `docs/specs/*`，设计选择向上报告。
- 冻结制度原样保留：实现期不修改冻结 spec；需求实质变化走 abandon 并产出新 spec；偏差记入 task report，在验收闸口对账。
- reviewer Layer 2 增加反向检查：diff 里出现、却没有任何 Decision Record 或 Log 条目覆盖的设计选择要标出来，防止自治运行漏记决策。
- 本仓库没有产品 `docs/specs/` 树，治理决策按 standalone DR 记在 `docs/decisions/`（审查时读取）；产品仓库才走 `docs/specs/decisions/` 路径。

**为什么**

决策记录的词汇在多个 skill 里重复：两份 standalone DR 模板状态词表与节集不一致，同一个决策写两遍（每个 spec 的 `## Decisions` 节加 `.decisions.md` 里的镜像）。两份模板同源于 dsh（deepseek-harness）的 Agent Note 生命周期，移植时被拆成两半并压平：dsh 用目录路径承载 proposed / implemented / rejected 三态，移植版压成一行 `Status:`、只留 `accepted`，迁移规则丢了。这一版保留 `accepted` 词表，重新定义了状态机。`v2` 指决策治理的第二次设计迭代，不是文件修订，也不存在 v1 记录。

被否的路线：两份模板并存并声明从属（冲突只是从互斥降为潜伏，草稿记录仍然无家）；只留 accepted 模板、把提案降为日志条目或 TODO（跨特性的耐久提案再次无家，已发布现实的评审检查也失去它要核对的 proposed → shipped 迁移）；用一个 dsh 式工件装下所有决策（dsh 没有冻结的工作契约；冻结且带闸的 spec 要求一份单独的可追加历史，而按特性有界的历史无法与全局主题语料合流）；wave 级冻结（用版本记账与更弱的自治验收换来的灵活性，小 spec 加廉价 abandon 已经提供；等冻结摩擦真的出现再谈）。

## [init] - 2026-09-05

**变了什么**

- 仓库初始化：一份 harness 无关的 spec-loop 方法论（当时就是根 `AGENTS.md`，即现在的 `assets/AGENTS.md`）、六个 skill（`write-spec`、`prose-quality`、`structured-code-review`、`manage-decision-records`、`trim-cot-leakage`、`simplification-audit`）、一个只读 reviewer agent（`agents/reviewer.md`，三态 verdict）、一份改编自 Google Python 风格的风格文档（`Google_code_style.md`，后移为 `references/style/python.md`）、README 与 `.gitignore`。
- 同日补到八个 skill：`write-research-outline`（2026-09-05）与 `write-research-report`（见 [spec-granularity]）加入研究层。

**为什么**

方法论要能跨设备、跨 harness 复原，仓库就是那份唯一权威，安装只是镜像。设计前提是：任何能派发 subagent 的 harness 都能直接执行——主 agent 是控制器，按能力档位派发只读 advisor、可写 implementer、只读 reviewer。skill 按职责切开、一规则一家，避免同一规则在多处漂移；`prose-quality` 与 `trim-cot-leakage` 独立成 skill，是因为它们管所有 agent 生成的文本，而不只是代码。

## 语言政策

仓库按"文件是否会被拷到其他设备与 harness"分两个语言区。这条规则在 2026-09-18 的 [language-policy] 一节确立；下表按当前布局给路径。`README.en.md` 是与 `README.md` 并列的英文门面，根 `AGENTS.md` 是仅本机、不入 git 的英文部署与维护手册。

| Zone | Files | Language | Why |
|---|---|---|---|
| Porting corpus | `assets/AGENTS.md`, `assets/skills/**`, `assets/agents/**`, `assets/references/**`, `assets/adapters/**` | English | `assets/AGENTS.md` is the methodology that gets copied cross-device and cross-harness. A single source language avoids re-translating the corpus per harness (the Mimo adaptation already translates agent front-ends; English source bounds that work) and keeps cross-machine diffs stable. |
| Owner-facing surfaces | `README.md`, `.gitignore` comments | Chinese | Read only by the owner, whose working language is Chinese. These files are never copied to installs, so English buys nothing there. |

`docs/decisions/` 的 standalone DR 原属语料区（英文，供任何机器上的 agent 阅读），其内容已并入本文件。`assets/references/style/python.md` 里的中文（TODO 用中文的团队规则）与 `trim-cot-leakage` 检测模式里的中文是这些文档所教、所检的内容，不是语言违规，不得翻译。研究层报告正文的语言由 [report-language] 一节决定，不由这张表决定。
