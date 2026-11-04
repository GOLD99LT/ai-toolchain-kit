# 按工作任务选择与恢复 AI 工具链

从任务出发，复用已有 CLI、应用、模板和服务；记录来源、安装归属与验收结果。首版面向 Windows + Codex + DeepSeek Harness（DSH）。当前目录包括 12 个任务型项目，以及 Skills CLI、CC Switch、本地 grilling、宿主办公 4 个基线实现。

**当前状态（2026-11-05）：首个可运行版本已落地。** 环境检查、计划、显式安装和验证入口已在 Windows PowerShell 5.1 与 PowerShell 7 检查；本机已安装项目内的 skills@1.7.6、repomix@1.18.1，合成代码试点保留了 14/14 文件和 28/28 源码核查内容。CC Switch 已通过官方 MSI 升级到 4.0.25，并核查版本和数据库完整性。详情与限制见 [验证记录](docs/validation/2026-11-05-foundation-and-pilot.md)。

双端 agent 任务、真实公司资料、Understand-Anything 和完整隔离换机演练仍未验证。固定来源、安装成功、CLI 可运行、agent 发现与任务通过分别记录。

## 入口 A：恢复自己的选择

在仓库根目录打开 PowerShell；需要 Node.js >=22.20.0、npm，Git 来源技能还需要 Git。先阅读输出，处理实际报告的缺失条件。

```powershell
powershell -NoProfile -File scripts/doctor.ps1
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json
```

setup 默认只生成计划。明确执行时增加 `-Apply`：

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Apply
powershell -NoProfile -File scripts/verify.ps1 -ProfilePath profiles/examples/code-context.json
```

只选择 Repomix 时：

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix -Apply
```

`-Only` 统一按 `implementation_id` 选择：`repomix` 或 `skills-cli`，不按 npm 包名 `skills`。筛选不会修改 profile；验证整个 profile 时，未选项仍可能未安装。

如果只核对工具安装和 CLI 版本，可明确使用：

```powershell
powershell -NoProfile -File scripts/verify.ps1 -ProfilePath profiles/examples/code-context.json -ToolsOnly
```

| 验证入口 | 条件与实际含义 | 退出码 |
| --- | --- | --- |
| 默认验证整个 profile | 工具检查通过，但尚未实测 agent 任务：`partial` | 2 |
| `-ToolsOnly` | 选中 npm 工具的安装/锁元数据和 CLI 版本通过，且无必需人工项：`tools-verified` | 0 |
| 工具检查失败或缺失 | `failed`，需按报告原因处理 | 1 |

`-ToolsOnly` 不验证 agent 任务，也不证明每个已安装文件均与原包逐字节相符。较宽 profile 仍有必需人工步骤时，即使用此参数也可能返回 `partial`/2。当前脚本不会因 CLI 成功将 `agent_tasks_verified` 置为 true；完整任务结果由主任务另行记录。不要为了让退出码为 0 而降低 `required_targets`。

最小 profile 只含 skills@1.7.6 和 repomix@1.18.1。它不安装整套技能或所有候选。Skills CLI 锁定与具体技能提交/文件清单是两层记录。普通技能、宿主插件、完整应用分别由原负责人维护。CC Switch 走原生 MSI/UI；私有 grilling 缺失及办公插件恢复来源未核实时明确保留人工步骤。

个人 profile、私有根映射、下载、备份、凭据和输出留在已忽略的 `.local/`；运行依赖由各自 runtime 目录管理，不提交 node_modules。不要重写 HOME/CODEX_HOME 模拟换机。完整恢复演练需要独立 Windows 用户、虚拟机或可用 Sandbox；当前真实用户中的安装不是隔离演练。

## 入口 B：第一次选自己的工具

把 [onboarding.md](prompts/onboarding.md) 交给正在使用的助手，说明工作、输入输出和约束。入口不要求先安装新 Skill。它会读取已有证据、补充目录外需求的研究，生成与恢复入口相同格式的个人 profile。

不要直接照搬作者的 STM32/PPT 组合。[manager-embedded.json](profiles/examples/manager-embedded.json) 仅供了解较宽选择的结构，含未完成的人工来源；[code-context.json](profiles/examples/code-context.json) 是独立的最小试点。访谈结果应说明必需与可选项、宿主要求、费用与验证任务。

## 按任务查阅

| 工作 | 候选或流程 |
| --- | --- |
| 接手 STM32/已有代码 | [嵌入式流程](playbooks/embedded-code-context.md)：Repomix、Understand-Anything、Serena；GitNexus 暂缓 |
| 资料、中文 PDF、公司 PPT、BOM | [办公流程](playbooks/reports-and-office.md)：宿主能力优先，按缺口比较 Docling、Presenton |
| 重复网页研究与小网站 | [资料与网站流程](playbooks/research-and-small-sites.md)：Crawl4AI/Firecrawl、AstroWind/bolt.diy、按需 Coolify/Dokploy |
| 全部来源与接入步骤 | [能力目录说明](catalog/README.md)、[来源记录](catalog/sources.lock.json)、[recipes](recipes/README.md) |

## 验收与维护

运行完整的合成代码材料试点：

```powershell
powershell -NoProfile -File scripts/pilot-repomix.ps1
```

该入口使用项目内已锁定的 Repomix，不要求全局 `repomix` 命令。输出位于 `.local/pilots/`，最近一次结构化报告为 `.local/reports/repomix-pilot-latest.json`。检查按各自的源码文件块进行，答案文件不能补齐缺失源码；通过表示材料完整，不表示模型理解、固件运行或硬件验证通过。

开发检查：

```powershell
npm test
npm run check
```

`verify.ps1` 能检查的范围以它的真实输出为准；运行 CLI help/version 不能证明 agent 发现或业务任务通过。每项报告应包含 verification_id、输入、源码/包版本、客户端、实际结果、证据、人工步骤、错误及时间/费用。Codex、DSH 分别验证；`required_targets` 保持用户原要求。

先核对计划与 JSON 引用，再做 [合成代码样例](examples/stm32-context/) 的已知答案比较；真实公司模板、真实 BOM、固件编译和板上验证另行记录。完整隔离不可用、账户未登录、私有来源未提供时，明确记录未执行。

研究来源和决策依据见 [批准设计](docs/design/2026-11-04-ai-toolchain-design-v3.md)、[执行计划](docs/plans/2026-11-05-foundation-and-first-pilot.md)、[任务项目调研](docs/research/2026-11-04-task-project-catalog.md)。本目录沿用 2026-11-04 的证据与用户指定固定值，不宣称版本是当前最新，也不重新抓取 Stars。

本仓库原创代码与文档采用 [MIT](LICENSE)。第三方项目、模型、模板、宿主插件保留各自许可；本仓库的 MIT 不重新许可它们。
