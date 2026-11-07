# 按任务选择个人工具

先找到想做的事，再点使用卡。推荐依据是已批准的 [个人工具箱方案](../docs/design/2026-11-05-personal-ai-toolbox-plan.md) 和 2026-11-04 的 [任务项目研究](../docs/research/2026-11-04-task-project-catalog.md)，不按 Stars 排名，也不把候选当成必装清单。

下表为 2026-11-05 已知状态；最终实际结果看 [本轮配置与验证记录](../docs/validation/2026-11-05-toolbox-rollout.md)。作者已有的工具不代表其他读者也已安装，新人可以从 [需求自选入口](../prompts/onboarding.md) 开始。

| 任务 | 推荐与采用条件 | 当前状态 | 使用卡 |
| --- | --- | --- | --- |
| 管普通 Skills、MCP、提示词 | 日常优先 CC Switch，分客户端开关 | 4.0.25 已安装；两 MCP 已登记；调用按端核验 | [CC Switch](../recipes/cc-switch.md) |
| 把模糊想法问清楚 | 沿用本地修改的 grilling / grill-me | 已纳管，DSH enabled、源 hash 匹配；agent 待确认 | [grilling](../recipes/local-grilling.md) |
| 复杂需求、调试与评审 | 各宿主原生 Superpowers，按任务规模选方法 | Codex 插件已有；DSH 于 11-07 安装社区固定提交；[验收](../docs/validation/2026-11-07-superpowers-dsh.md) | [Superpowers](../recipes/superpowers.md) |
| 报告、中文 PDF、PPT、BOM | 先用现有办公能力 | Codex 原生入口已有；任务与恢复结果另记 | [原生办公](../recipes/host-office.md) |
| 动态网页阅读、页面检查 | Playwright MCP | 项目内 0.0.84 已装；双端 enabled；direct server 成功、agent 待确认 | [Playwright](../recipes/playwright-mcp.md) |
| 软件库版本文档 | Context7 remote | 无密钥直接检索成功；双端 enabled；agent 待确认；npm 4.5.0 仅核查 | [Context7](../recipes/context7.md) |
| 给模型整理源码材料 | 需要打包时用 Repomix，否则直接读文件 | 项目内 1.18.1 已装；合成材料保留通过，双端问答另验 | [Repomix](../recipes/repomix.md) |
| 技能 CLI 检查 | Skills CLI 可选辅助，不与管理器重复写入 | 项目内 1.7.6 已装；CLI 检查通过，不代表技能迁移完成 | [Skills CLI](../recipes/skills-cli.md) |
| 看陌生项目结构和导览 | 确有图形阅读需要时选 Understand-Anything | 候选，未安装；Codex 有官方路线、DSH 未确认 | [Understand-Anything](../recipes/understand-anything.md) |
| 频繁查 C/C++ 定义与引用 | 编译参数与语言服务器条件齐备再选 Serena | 候选，未安装 | [Serena](../recipes/serena.md) |
| 比较另一套调用图查询 | GitNexus 先解决用途许可与 Windows 条件 | 暂缓，未安装 | [GitNexus](../recipes/gitnexus.md) |
| 扫描件、复杂表格读不准 | 再加 Docling 处理输入 | 候选，未安装 | [Docling](../recipes/docling.md) |
| 希望在独立界面制作 PPT | 比较 Presenton 的编辑和导出体验 | 候选，未安装；模板效果待验 | [Presenton](../recipes/presenton.md) |
| 反复提取同类公开网页字段 | 接受 Python/浏览器维护时选 Crawl4AI | 候选，未安装 | [Crawl4AI](../recipes/crawl4ai.md) |
| 希望采集由服务提供 | 比较 Firecrawl 的托管额度或自托管成本 | 候选，未接入 | [Firecrawl](../recipes/firecrawl.md) |
| 个人介绍页、博客 | AstroWind 等成熟模板 | 候选，尚未创建网站 | [AstroWind](../recipes/astrowind.md) |
| 浏览器内聊天搭站 | 需要专门工作台时比较 bolt.diy | 候选，未安装 | [bolt.diy](../recipes/bolt-diy.md) |
| 以后长期管理多个服务 | Coolify；先判断是否需要面板 | 候选，未部署 | [Coolify](../recipes/coolify.md) |
| 以后管理 Compose 项目 | Dokploy，与 Coolify 二选一比较 | 候选，未部署 | [Dokploy](../recipes/dokploy.md) |

正常用户环境的 Codex 已识别两个 enabled MCP；DSH web/desktop 配置文件也已有条目。direct server 验证走 MCP SDK，不冒充两个 agent 对话通过。后续短例在当前客户端重开或新会话中进行，受限沙箱读不到条目不作为重装依据。

普通技能/MCP/提示词优先 CC Switch；PLC 保持 Codex-only。Superpowers 和办公插件走原生插件管理；完整产品自己管理。不要让 Skills CLI 与 CC Switch 同时更新同名技能。

## 选好以后怎么用

打开卡片，准备它要求的最小输入，复制一个例子到对应入口，再对照“输出与判断”检查。组合示例见 [办公](../playbooks/reports-and-office.md)、[代码阅读](../playbooks/embedded-code-context.md)、[研究与网站](../playbooks/research-and-small-sites.md)。本项目不因此继续执行真实固件、公司资料处理或 VPS 部署。

## 技术材料留给需要的人

[capabilities.json](capabilities.json) 与 [sources.lock.json](sources.lock.json) 是保留的结构化辅助资料，不是入门前置条件。文件名含 lock 不表示每个来源都已锁定；历史观察版本/提交不等于安装锁或本机结果。

沿用 UTF-8、schema_version=1 和 capability_id / implementation_id / source_id 的引用关系。`targets` 表示有依据的接入路线，`required_targets` 表示用户要求，不能为了得到通过而删去尚未支持的客户端。

来源锁定、installed、CLI-checked、agent-discovered、task-passed 分开记录。对 CLI 或独立应用，“能被 agent 当成插件发现”可能不适用；产物可阅读不代表原生集成。研究中的历史问题未在本机复测，费用与许可保留各工具卡中的条件和采样限制。
