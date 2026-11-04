# 第二版工具取舍：已有能力、流程框架与管理工具

日期：2026-11-04（Asia/Shanghai）。仅做文档/源码调研，未安装或运行候选工具。选择意见是针对当前工作画像的判断。

## 1. 先使用已有的办公能力

本会话已加载 documents、pdf、presentations、spreadsheets 技能入口。这证明有可调用能力入口，不证明公司模板、中文 PDF、实际 BOM 已完成验证。

第二版建议先使用这些能力完成代表性任务，再依据实际缺口决定是否安装独立运行时；不把底层库当作用户必须先管理的产品。

| 候选 | 调研事实 | 对本用户的取舍 |
| --- | --- | --- |
| Anthropic docx/pdf/pptx/xlsx skills | 官方将四项标为 source-available，而非开源；文档涉及 PptxGenJS、Python、OOXML、LibreOffice、渲染工具等依赖 | 参考其工作方式；不将目录直接复制进公共工程，不替换本机已有办公能力 |
| PptxGenJS | 是可编辑 PPT 的生成库；第一轮记录了具体图表兼容问题 | 公司模板任务若现有能力已能完成，就无需另外建立一套生成框架 |
| MarkItDown | 办公文件到 Markdown 的读取工具；第一轮记录了隐藏幻灯片问题 | 确实存在资料读取缺口时再引入 |
| Pandoc + Typst | 官方支持 Markdown 转 PDF 的该组合，可配置排版 | 作为需要独立于宿主的稳定导出流程时的候选；中文字体和真实样例需验证 |
| Marp | 主要面向 Markdown 幻灯片 | 当前有公司 PPT 格式，暂不新增一套幻灯片创作方式 |
| Quarto | 覆盖计算文档、报告、网站及多种出版目标 | 当前需求尚不需要这套出版体系；有计算报告或网站出版任务时再评估 |

许可证分类来源于上游自己的描述，仅用于界定本项目不应把公开源码自动当作可自由再分发内容；不构成法律结论。

## 2. 浏览器入口只选一个

| 对象 | 官方能力与边界 | 实际使用证据 | 建议 |
| --- | --- | --- | --- |
| Microsoft Playwright CLI | CLI + 可选 Skills，Node 与浏览器是运行依赖；可以通过帮助信息使用 | issue #365 有 Claude Code/Codex/OpenCode 用户报告，涉及 Node 切换导致命令失效和当时技能安装路径问题 | 出现动态网页、登录或交互缺口时，优先做单任务试用；安装路径以当前版本为准 |
| Vercel agent-browser | 当前 README 描述 Rust CLI，默认使用 Chrome for Testing；技能入口可动态取得核心指南 | issue #395 曾报告不同智能体截图行为差异；维护者于 2026-11-03 关闭，称新版无法复现 | 作为替代候选；不能把历史问题当作当前必现故障，也不能视为已验证 DSH |
| Playwright MCP | 在支持 MCP 的客户端提供浏览器操作 | 第一轮已核查官方定位与依赖；本次未做三者性能实验 | 需要持续 MCP 工具会话时再与 CLI 比较，默认不叠装 |

公开 issue 是具体用户报告，支持“有真实跨客户端使用”，并不等于稳定性认证。

## 3. 开发流程按复杂度选择

默认保留现有 Superpowers，使用项目说明与明确的验收命令；重型流程框架不成为全局基础依赖。

Matt Pocock 的 `grill-with-docs` 是更贴近当前需求的单项候选：2026-11-04 读取的上游入口明确要求调用 `grilling` 和 `domain-modeling`。可用于访谈与决策文档，但必须核查这两项依赖和宿主工具调用，不把复制一个入口文件当作完整安装。

| 候选 | 已核实的官方边界 | 何时有价值 | 当前处理 |
| --- | --- | --- | --- |
| OpenSpec | 官方提供 Windows 入口；Codex 集成是 skills-only，项目写入 `.agents/skills/openspec-*`；与 Claude 的调用拼写不同 | 在已有项目中管理较长的需求变更，例如 Keil → GCC 分阶段迁移 | 仅作为未来单项目试点；不与另一套需求框架同时主导同一变更 |
| GitHub spec-kit | README 明确支持 Windows，依赖 Python/uv；不同 integration、extension、hook、workflow 是不同机制 | 多人协作、需要统一规范与交付记录的项目 | 当前借用验收与任务拆分方式，不默认安装整套 |
| GSD Core | 官方安装器转换客户端格式，不能直接复制原始命令；Codex 的 hook/状态能力与 Claude 有差异 | 工作持续数周、经常中断并确实需要恢复阶段状态 | 暂不安装；先用简短状态记录验证是否存在缺口 |
| ECC | 官方当前文档包含 Codex 原生插件和 Windows 支持边界；旧同步脚本与原生插件不可重复叠加；部分持续学习/记忆功能存在原生 Windows 限制 | 有明确需求需要其某个模块时 | 按模块评估，不默认启用整包 hooks、自动记忆或持续学习 |

本轮没有核实四个框架的完整 DSH 专用适配。可以共享规范与验收文件，不据此承诺命令和 hooks 可原样运行。

上述推荐不来自框架作者的市场宣传，也不依据单一 Stars 排名；依据是用户任务匹配度与明确的客户端依赖。社区关于流程强度的实际分歧见 [实践调研](2026-11-04-community-workflows.md)。

## 4. 管理与恢复工具：成熟能力优先

### 明确推荐的分工

共享的独立 Skills 使用 Vercel Skills CLI；原生插件仍由各自插件管理器管理；CC Switch 管供应商/MCP。仓库保存来源、选择、步骤与验收，不另写一套技能文件安装器。

这一建议不是认为现成工具没有问题，而是已有源码能够覆盖核心功能，其限制可以在恢复流程中检查。

### 固定来源与 Windows 边界

- 已读取 `skills@1.7.6` 的 npm 元数据，确认包存在、要求 Node.js >=22.20.0。本机前轮实际运行 Node 为 v24.15.0，满足此项要求。
- 该版本源码支持 GitHub/GitLab.com 完整 40 位 commit SHA，来源解析器支持 GitHub tree URL。工程应固定 CLI 版本和技能提交，而不是仅固定技能名称。
- `skills@1.7.2` 的 Windows 用户曾在 issue #2526 报告 `owner/repo@tag` 实际安装 HEAD。这个历史报告提示必须检查恢复后的内容，不能仅相信命令成功；不据此断言 1.7.6 仍有该问题。
- Windows 安装源码有 junction 和复制路径，提供显式 `--copy`。不把生成的绝对路径 junction 放进 Git 作为恢复资产。issue #2613 的长路径报告提示还要验证当前选定仓库在 Windows 上的实际安装。
- `skills-lock.json` 与 `experimental_install --frozen-lockfile` 不是全局工具、原生插件和 MCP 的完整恢复协议。第二版不依赖实验性恢复命令作为核心能力，先使用固定版本 CLI 和固定来源逐项安装并验证。

### DSH 兼容性不是凭命令名称猜测

`skills@1.7.6` 的 agent 表没有 DSH 专用目标，因此方案不使用 `--agent dsh`。它的 Codex 目标使用共享的 `.agents/skills`。

本机 DSH 对应的官方 tag `dsh-v0.2.1-rc.5`（提交 `b830ec950faba0a46dda564be3e2d854afed94f1`）明确读取 `.agents/skills`。成立条件是 filesystem Skill 插件已挂载、共享来源未关闭、`DSH_AGENTS_HOME` 未指向其他位置，并且没有更高优先级的同名技能覆盖。

这提供目录发现兼容的源码证据，尚不是本机任务兼容的证明。部署后的验证要分别测试目录发现和技能实际调用。

### CC Switch 的范围

本机 4.0.18 的技能下载实现按分支下载，不能把其 branch 字段填入 SHA 当作固定提交安装。其批量技能导入是 Tauri 内部接口，未核实稳定的外部自动化 CLI。

另一方面，上一轮已经核实 v4.0.25 发布源码有 DSH 供应商、MCP 与技能支持。因此第二版仍建议在备份和原配置检查后升级 CC Switch，再验证双端连接；不能因为只检查旧版就把新版 DSH 支持重新标为未知。

CC Switch 不再同步由 Skills CLI 管理的同名技能，不直接改写它的内部数据库。issue #7698 的实际目录/数据库漂移报告是进一步做一致性检查的理由，不是对所有版本的总体质量判定。

### 其他成熟工具为何暂缓

| 工具 | 可解决的问题 | 当前取舍 |
| --- | --- | --- |
| chezmoi | 多电脑的 dotfiles 管理、模板化与本机差异 | 值得了解；当前几个 AI 配置尚不足以证明需要再引入一套状态管理。私有配置显著增加时再选 |
| mise | 开发工具版本、环境与任务管理 | 以后多项目运行时冲突时有价值；目前 Node 已满足选定 CLI，不为一个版本需求默认添加管理层 |
| rulesync | 跨智能体规则与配置生成，已查到 DSH 适配文件 | 多种宿主格式需要持续同步时再评估；当前共享目录已覆盖普通技能的主要需要 |

不把“已有成熟工具”直接等同于“首版应全部安装”。这些是后续扩展候选。

## 5. 来源

### 办公能力与许可

- <https://github.com/anthropics/skills>
- <https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md>
- <https://raw.githubusercontent.com/anthropics/skills/main/skills/xlsx/SKILL.md>
- <https://raw.githubusercontent.com/anthropics/skills/main/skills/pdf/SKILL.md>
- <https://raw.githubusercontent.com/anthropics/skills/main/skills/docx/SKILL.md>
- <https://pandoc.org/MANUAL.html>
- <https://marp.app/>
- <https://quarto.org/>

### 浏览器工具与用户报告

- <https://github.com/microsoft/playwright-cli>
- <https://github.com/microsoft/playwright-cli/issues/365>
- <https://github.com/vercel-labs/agent-browser>
- <https://github.com/vercel-labs/agent-browser/issues/395>
- <https://github.com/microsoft/playwright-mcp>

### 流程框架

- <https://github.com/Fission-AI/OpenSpec>
- <https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md>
- <https://github.com/github/spec-kit>
- <https://github.github.io/spec-kit/integrations/cli.html>
- <https://github.com/open-gsd/gsd-core/blob/main/docs/how-to/install-on-your-runtime.md>
- <https://github.com/affaan-m/ECC>
- <https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md>

### Skills、共享目录与管理工具

- <https://registry.npmjs.org/skills/1.7.6>
- <https://github.com/vercel-labs/skills/blob/v1.7.6/src/git.ts>
- <https://github.com/vercel-labs/skills/blob/v1.7.6/src/source-parser.ts>
- <https://github.com/vercel-labs/skills/blob/v1.7.6/src/agents.ts>
- <https://github.com/vercel-labs/skills/blob/v1.7.6/src/installer.ts>
- <https://github.com/vercel-labs/skills/blob/v1.7.6/docs/commands.md>
- <https://github.com/vercel-labs/skills/issues/2526>
- <https://github.com/vercel-labs/skills/issues/2613>
- <https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.5/packages/skill/skill-filesystem/README.md>
- <https://github.com/farion1231/cc-switch/blob/v4.0.18/src-tauri/src/services/skill.rs>
- <https://github.com/farion1231/cc-switch/blob/v4.0.18/src-tauri/src/commands/skill.rs>
- <https://github.com/farion1231/cc-switch/issues/7698>
- <https://github.com/twpayne/chezmoi>
- <https://github.com/jdx/mise>
- <https://github.com/dyoshikawa/rulesync/blob/v43.6.0/src/constants/dsh-paths.ts>

页面和分支可能变化。本文件记录本次采样时的结论，进入实际安装前仍需选定发布版本并重新检查对应版本的说明。
