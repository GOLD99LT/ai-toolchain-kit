# 跨智能体兼容性核查

日期：2026-11-04（Asia/Shanghai）。本文件记录发布源码与官方文档核查，不能替代本机运行测试。

## 本机与发布版本

只读 Windows 安装登记：CC Switch 4.0.18，DeepSeek Harness 0.2.1-rc.5。

| 对象 | 已核实的事实 | 对方案的影响 |
| --- | --- | --- |
| CC Switch v4.0.18 | AppType、Skills 与 MCP 代码没有原生 DSH 分支 | 不能用该版本承诺管理 DeepSeek Harness |
| CC Switch v4.0.25 | 发布 tag 含 Dsh 类型、DSH Skills、MCP、供应商接入；发布于 2026-11-02 | 建议升级到这一已核验版本后做本机验证 |
| DeepSeek Harness | 本机登记为 0.2.1-rc.5 | 首轮保留现有版本并验证；不为追求最新而一并升级 |
| 嘉立创 EDA | 本机登记 2.2.39.2；官方新 CLI/MCP 要求客户端 V4.1.60+ | 首版不承诺直接接入编辑器；独立升级验证后再启用 |

CC Switch v4.0.18 的 tag 对应提交前缀 `cb90a2440d1a`，v4.0.25 为 `a3eafa408ae6`。主任务额外读取了两个 tag 的 `app_config.rs`：前者没有 `Dsh`，后者包含该枚举的使用。

发布版本依据：

- <https://github.com/farion1231/cc-switch/releases/tag/v4.0.25>
- <https://github.com/farion1231/cc-switch/blob/v4.0.18/src-tauri/src/app_config.rs>
- <https://github.com/farion1231/cc-switch/blob/v4.0.25/src-tauri/src/app_config.rs>
- <https://github.com/farion1231/cc-switch/blob/v4.0.25/src-tauri/src/services/skill.rs>
- <https://github.com/farion1231/cc-switch/blob/v4.0.25/src-tauri/src/mcp/dsh.rs>
- <https://prodocs.lceda.cn/cn/api/guide/cli.html>

DSH MCP 实现包含 stdio 和 Streamable HTTP；不支持将旧式 SSE 配置直接作为等价配置导入。当前未验证本机升级、登录、MCP 握手或供应商实际请求。

## 共享 Skills 的依据与边界

Codex 官方文档列出用户级 `~/.agents/skills`、仓库级 `.agents/skills` 与技能目录链接支持：

- <https://developers.openai.com/codex/skills/>

DeepSeek Harness 官方源码快照 `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159` 列出这些技能来源：

- 项目 `.dsh/skills`、项目 `.agents/skills`。
- 自定义来源目录。
- `$DSH_HOME/skills`，默认 `~/.dsh/skills`。
- `$DSH_AGENTS_HOME/skills`，默认 `~/.agents/skills`。

DSH 支持 `<技能目录>/SKILL.md` 和顶层 Markdown 文件，不递归扫描任意嵌套层级。技能元数据要求 name/description；名称遵循 kebab-case。允许用户显式调用的技能可通过 `/name` 调用；元数据可分别禁用用户调用与模型调用。

源码依据：

- <https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/skill-filesystem/README.md>
- <https://github.com/deepseek-ai/deepseek-harness/blob/fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159/packages/skill/tool-skill/src/index.ts>

这说明可以把普通、可移植技能的共享目录作为首版设计候选，但还要实测本机 DSH 0.2.1-rc.5 的行为。项目级同名技能可能覆盖全局版本；来源优先级和环境变量需要在检查报告中显示。

技能能被发现，不代表其引用的脚本、MCP、专属工具、子代理能力或运行时已存在。Codex 专用插件不作整包跨智能体兼容承诺。

## 避免多个管理器改同一份文件

CC Switch 默认技能源目录为 `~/.cc-switch/skills`，也能选择 `~/.agents/skills`。Vercel Skills CLI 同样管理技能目录及链接；它们的文件归属保护不等同于跨管理器协作协议。

因此，一份技能应只有一个负责安装和更新的管理器。两种可行分工如下：

| 分工 | 优点 | 代价 |
| --- | --- | --- |
| CC Switch 管供应商/MCP，工程脚本管共享 Skills，原生插件由各自插件管理器维护 | 易记录版本、检查差异和脚本恢复；适合本项目双入口 | 技能更新通过工程入口操作；需关闭同名技能的 CC Switch 同步 |
| CC Switch 负责包括 Skills 在内的部署目录，工程仅保存清单和指南 | 图形界面操作集中 | 未核实稳定的自动导入接口；恢复可能需要更多 UI 步骤 |

首版方案推荐第一种，待用户审阅确认。保留 CC Switch 默认技能源目录，工程不写入其内部数据库；已有技能和插件先盘点来源与名称冲突，再决定是否纳管。

共享目录采用普通目录/副本和内容哈希，优先避免把 Windows 管理员权限或链接权限作为必备条件。Codex 专用插件与 DSH 专用适配保持分开，避免全局安装重复技能。

安装器参考：<https://github.com/vercel-labs/skills/blob/9197d919034d19010ae303cf96bf19ad087dd4be/src/installer.ts>。

## 自动化边界

本次未核实 CC Switch 稳定的外部批量导入 CLI。方案只能承诺：在有官方接口时使用接口；其他操作生成配置和明确的原生 UI 操作步骤，并在实际生效后记录完成。不得以写内部数据库或显示“配置已生成”代替“集成已可用”。
