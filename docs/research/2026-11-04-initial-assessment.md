# AI 工具链工程：初步调研与需求访谈

日期：2026-11-04（Asia/Shanghai）

状态：调研草案；需求和实现方案尚未确认。本文不代表已安装、升级或完成兼容性验证。

后续进展：前三轮需求已记录于 [工作画像](../requirements/work-profile.md)，当前待审方案见 [首版设计](../design/2026-11-04-ai-toolchain-design.md)。本文保留第一轮发现，新增证据以链接文档为准。

## 1. 用户希望达到的结果

1. 从开源项目与社区中筛选有使用依据、适合实际工作的 Skills 和其他 AI 工具。
2. 先解释各工具的作用、适用场景、代价和区别，再指导安装或代为安装。
3. 通过访谈了解工作特点，形成个性化推荐。
4. 把需求、调研依据、选型决策、操作方法和验证结果沉淀为 Markdown。
5. 建设结构清楚、可上传 Git、可换机恢复、可供别人复用的工程。
6. 覆盖 Codex、DeepSeek Harness 等多个智能体，并评估 CC Switch 的集中管理能力。
7. 先沟通方案，再执行安装和工程实现。

“可复用的转载工具”暂理解为可分享、可迁移的部署工程；是否还需要网页介绍、内容转载或交互式推荐器，尚未确认。

## 2. 本机只读盘点

没有读取密钥、登录凭据、数据库内容或会话历史。

| 项目 | 已观察到的事实 | 尚不能推出的结论 |
| --- | --- | --- |
| 当前工作区 | 独立 Git 仓库，分支 main，无提交，无远端；调研前没有项目文件 | 未配置远端不等于没有 GitHub 账号 |
| Superpowers | 本次 Codex 会话已加载该插件的技能 | 不能据此认定其他智能体也能使用 |
| grill-me / grilling | 用户级技能文件存在；grill-me 是调用 grilling 的短入口 | 未证明本地文件与上游当前版本相同 |
| 专业技能线索 | 存在 xd3-program-modification | 可能涉及 PLC/工控，但职业、任务频率需用户确认 |
| CC Switch | Windows 卸载登记版本 4.0.18，用户数据目录存在 | 未验证运行中版本、供应商配置和同步效果 |
| DeepSeek Harness | 找到安装目录内的 dsh.cmd，默认数据目录存在 | 未启动、未验证版本、登录或 Skills 发现情况 |
| 开发基础 | 找到 git、gh、node、npm、codex 命令入口 | 未逐个运行验证版本或登录状态 |
| Python | PATH 首个入口是 WindowsApps 应用执行别名，抓取脚本未能运行；另发现 MSYS2 Python 文件 | 不能说整台电脑没有 Python；本次网页抓取已改用 PowerShell |
| 其他智能体 | 当前 PATH 未找到 claude、gemini、opencode | 不能据此认定全机未安装 |

盘点结果只反映本次进程可见的环境。个人绝对路径不应写入未来的通用部署模板。

## 3. 初步判断

建议项目的核心交付是：一份可审查的工具清单，加上一套可以在新电脑复现的配置与操作流程。

职责草案：

- Git 工程记录选择了什么、为什么选择、采用哪个版本、如何安装和验证。
- CC Switch 作为日常管理候选入口，承担其已验证支持的供应商、MCP、Skills 和提示词操作。
- 智能体适配层记录各客户端实际使用的目录、配置格式、启动方式和功能差异。
- 用户的账号凭据、会话、日志、本机数据库和备份保留在本机，公开仓库仅提供模板与说明。

统一管理需要拆成四个分别验证的目标：

1. 模型供应商与连接信息管理。
2. Skills、MCP 和提示词分发。
3. 版本记录、安装、更新与换机恢复。
4. 会话、记忆与执行状态的互通。

前三项适合作为首版的候选范围。第四项需要用户明确实际需求，不能因为配置能同步就认为会话和记忆也能通用。

## 4. 首批候选与取舍

以下是候选清单，不是安装清单。星标来自 2026-11-04 的 GitHub API 读取，只能反映关注度；未将其作为真实使用频率或用户满意度的证明。社区讨论、安装统计和实际工作样本评估尚待补充。

| 候选 | 类型与作用 | 适合本工程的理由 | 取舍与当前状态 |
| --- | --- | --- | --- |
| farion1231/cc-switch | 桌面配置管理工具；官方文档说明供应商、MCP、Skills、提示词等管理能力 | 用户已安装，可优先评估作为日常管理入口 | 各客户端功能不同；需按版本验证 DeepSeek Harness 的实际支持。151,773 stars；MIT |
| obra/superpowers | 编程工作流技能体系；覆盖设计、计划、调试、测试和审查等流程 | 可为软件开发任务建立明确执行步骤 | 本机已有插件；需按任务控制流程成本，避免与其他流程技能重复介入。312,211 stars；MIT |
| mattpocock/skills | 可组合的工程与生产力技能；包含 grill-me、grill-with-docs 等 | 需求访谈与决策文档很贴合本项目 | 本机只有已发现的同名入口，尚未确认安装了完整上游套件；插件与复制安装应选定一种来源。312,468 stars；MIT |
| vercel-labs/skills | 跨智能体的 Skills 命令行发现、安装、列举、更新工具 | 可评估为可脚本化部署的组成部分 | 与 CC Switch 的技能管理职责有重叠，应明确由谁负责同一份安装。当前 README 要求 Node.js 22.20+；锁文件恢复命令仍列为 experimental。38,059 stars；MIT |
| anthropics/skills | 官方公开技能仓库 | 可按文档、表格、演示等实际需求进一步筛选 | 本次只核查仓库元数据，未完成逐项许可和兼容审查；不能把整个仓库视为统一许可的可自由再分发内容。187,296 stars |
| upstash/context7 | 官方简介为面向智能体的最新文档平台 | 若工作经常依赖软件库/API，可进一步评估 | 本次只完成仓库元数据核查，使用方式、费用和具体适配待调研；暂不提出安装建议。64,179 stars；仓库标示 MIT |

对技能的最终评价应包含：任务匹配度、维护情况、可验证的使用数据、运行依赖、客户端兼容性、流程冲突、许可、验证结果，以及是否确实节省工作时间。Stars 不单独决定推荐顺序。

## 5. 已核实的兼容性边界

### Codex

官方技能文档说明：Codex 支持仓库与用户级 `.agents/skills` 发现规则，也支持技能目录链接；插件可用于分发多个技能及相关连接能力。同名技能不会自动合并。因此不能把插件安装、副本安装和链接安装混为一谈，也不能简单地将本机现有目录复制到所有智能体。

### CC Switch 与 DeepSeek Harness

- 本机登记版本是 4.0.18。
- GitHub 的 `releases/latest` 在本次调研返回 v4.0.25，发布日期为 2026-11-02。
- 主分支专门的 DeepSeek Harness 接入文档描述了 `dsh`、Skills、MCP、AGENTS.md、凭据与多个 profile 的管理方式。
- 同一主分支 README 功能表尚未完整列出 DeepSeek Harness，与专门接入文档存在列举差异。
- 第一轮尚未证明发布版本包含情况。后续已核对 tag 源码：v4.0.25 包含原生 DSH 接入，v4.0.18 没有；详见 [版本兼容核查](2026-11-04-agent-compatibility.md)。本机实际运行仍待验证。
- 官方 DeepSeek Harness README 将项目标为 developer preview，提示存在破坏性兼容变更，因此恢复工程需要记录已验证版本。

### Skills 分发

Vercel Skills CLI 的 README 提供按技能、按智能体及全局范围安装的方式；项目内安装是默认行为。不要在方案阶段直接使用 `latest` 作为可复现版本承诺。版本锁定及恢复能力需单独设计和验收。

Matt Pocock 上游 README 明确提示：同一智能体同时使用插件与复制安装会导致技能重复。本机现有 grill-me / grilling 的来源和维护方式，需要在安装新套件前厘清。

## 6. 工程目录草案

以下只是待讨论的结构。当前仅创建本调研文件，未搭建实现。

```text
README.md                    项目目的、适用对象、最快开始方式
AGENTS.md                    参与本仓库工作的智能体约定
docs/
  research/                  调研记录、来源、采集日期、候选评价
  requirements/              已确认需求、使用场景、验收标准
  decisions/                 关键选型与不采纳原因
  guides/                    初装、日常使用、更新、迁移、故障处理
catalog/                     工具元数据与来源清单
profiles/                    根据工作类型组织的可选工具组合
adapters/                    各智能体配置差异与转换逻辑（如需要）
scripts/                     环境检查、预览、安装、验证、恢复
templates/                   不含密钥和个人路径的配置模板
tests/                       对部署、恢复和配置保留的必要验证
```

是否需要这些目录，取决于最终确认的交付范围。首版不预设开发独立 GUI 或服务端。

可讨论的交付形式：

1. 文档与工具清单：制作成本低，迁移仍需手动操作。
2. 文档、可选配置组合与部署脚本：可同时服务本人换机和他人复用，暂为推荐方向。
3. 独立的交互式推荐与管理应用：可提升新手体验，但会显著增加维护工作，应在需求成立后再考虑。

## 7. 需求访谈待确认项

第一轮已确认三类工作：项目管理与测试汇报、STM32/PCB/BOM 开发、网站信息搜集与个人技术实践。具体记录见 [工作画像与需求确认](../requirements/work-profile.md)，新增工具方向见 [工作场景候选工具](2026-11-04-workflow-candidates.md)。各任务耗时、具体软件和自动化范围仍在访谈中。

后续根据答案推进：

- 本人换机恢复和陌生用户个性化推荐，哪项是首版重点。
- Windows 是否是首版唯一目标，其他系统是否需要真实验证。
- 实际常用智能体，以及集中管理必须覆盖的具体能力。
- 可接受的工具数量、操作复杂度、付费服务与账号依赖。
- 工业软件、办公文档、编程、网页操作等场景各自的任务比例。
- 安装与更新方式、私有配置处理、Git 托管位置及公开范围。
- 什么样的一次新机验证才算成功，允许哪些必须人工完成的登录步骤。

这份文档记录可核查的依据、结论和待决事项。后续每轮确认应更新相应记录，避免只依赖聊天历史。

## 8. 来源

来源读取日期：2026-11-04。网页检索接口未稳定返回可用内容，本次主要通过 PowerShell 直接读取官方文档、GitHub API 与上游仓库文件。主分支内容可能变化；进入实现前应记录具体版本或提交。

- Codex 官方技能文档：<https://developers.openai.com/codex/skills/>
- CC Switch 仓库元数据：<https://api.github.com/repos/farion1231/cc-switch>
- CC Switch 中文说明：<https://github.com/farion1231/cc-switch/blob/main/README_ZH.md>
- CC Switch 最新稳定发布接口：<https://api.github.com/repos/farion1231/cc-switch/releases/latest>
- CC Switch DeepSeek Harness 接入说明：<https://github.com/farion1231/cc-switch/blob/main/docs/deepseek-harness-integration-zh.md>
- Superpowers 仓库与元数据：<https://github.com/obra/superpowers>；<https://api.github.com/repos/obra/superpowers>
- Matt Pocock Skills 说明：<https://github.com/mattpocock/skills/blob/main/README.md>
- Matt Pocock Skills 元数据：<https://api.github.com/repos/mattpocock/skills>
- Vercel Skills 说明：<https://github.com/vercel-labs/skills/blob/main/README.md>
- Vercel Skills 元数据：<https://api.github.com/repos/vercel-labs/skills>
- Anthropic Skills 元数据：<https://api.github.com/repos/anthropics/skills>
- Context7 元数据：<https://api.github.com/repos/upstash/context7>
- DeepSeek Harness 官方 README 接口：<https://api.github.com/repos/deepseek-ai/deepseek-harness/readme>

本机事实依据：只读 Git 命令、Get-Command、目录元信息、Windows 应用卸载登记，以及本会话可用的技能文件。没有执行安装脚本或修改全局配置。
