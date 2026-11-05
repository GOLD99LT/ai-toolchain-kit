# 我的 AI 工具箱

根据工作需求选择成熟工具，装好、配好、讲清楚怎么用。日常配置优先使用 **CC Switch**，原生插件和独立软件保留自己的入口。这个仓库提供选型依据、中文使用卡、配置参考和换机说明。

## 现在从哪里开始

| 你要做什么 | 打开哪里 |
| --- | --- |
| 查看与开关模型配置、MCP、普通 Skills | **CC Switch** → 对应页面；[管理指南](docs/guides/cc-switch.md) |
| 让 AI 先帮你问清楚需求 | Codex / DeepSeek Harness；[grilling 使用卡](recipes/local-grilling.md) |
| 复杂开发、调试、代码评审 | Codex 的现有 Superpowers；[使用卡](recipes/superpowers.md) |
| 读取网页、操作页面、检查小网站 | 对话中请求使用 Playwright；[浏览器使用卡](recipes/playwright-mcp.md) |
| 查软件库/API 的文档 | 对话中请求使用 Context7；[文档查询使用卡](recipes/context7.md) |
| 测试汇总、PDF、PPT、BOM | Codex 现有办公能力；[办公使用卡](recipes/host-office.md) |
| 需要代码图谱、PPT 制稿应用等专业工具 | [按任务选工具](catalog/README.md)，了解后按需选择 |

## 本机已完成的配置（2026-11-05）

- **CC Switch 4.0.25** 已作为日常主入口，原供应商、路由和全局提示词保留。
- **Playwright MCP 0.0.84** 已安装，通过 CC Switch 同时登记到 Codex 和 DSH；独立 MCP 短演示已打开公开网页并截图。
- **Context7** 官方远程 MCP 已通过 CC Switch 同步到两端；本次无密钥连接、公开软件库查询和路由文档读取成功。访问条件及限额由服务方决定。
- **grill-me / grilling** 已由 CC Switch 同步到两端；本机 DSH 文件与管理器源一致。
- **Superpowers、Codex 办公插件** 保持原生管理；PLC 技能保持原来 Codex 启用状态。
- 原有 **Repomix / Skills CLI** 保留，前者按需整理代码材料，后者只作辅助，不与 CC Switch 重复管理技能。

这是一台电脑的执行记录，克隆仓库不会自动得到相同配置。MCP 直接调用、配置同步和客户端对话内调用分别记录。详细证据和未完成项见 [本轮状态](docs/validation/2026-11-05-toolbox-rollout.md)。

## 先试这两个例子

重新打开 Codex / DSH 或新建能重新加载工具的对话，然后复制：

> 使用 Playwright 打开 https://example.com，告诉我页面标题和主要内容，并截图。不要登录任何账号，也不要修改网页或本地代码。

> 使用 Context7 查 Express 的基础路由示例，说明资料来源；只给一个最小例子，不创建项目。

成功应能看到对应工具调用和可核对的结果。若工具没有出现，先按 [排错指南](docs/guides/troubleshooting.md) 核对启用与客户端刷新，不要仅凭 AI 的口头回答认定工具已运行。

## 两个复用入口

**第一次选择自己的工具**：把 [需求访谈入口](prompts/onboarding.md) 交给你的 AI，说明工作、系统和预算。AI 解释推荐和限制，你选择后用现成方式安装，并获得相应使用卡。当前目录没有覆盖的任务应继续研究，不必照搬作者全部组合。

**本人换电脑**：按 [换机指南](docs/guides/migration.md) 携带个人私有备份和工具清单，使用 CC Switch/各产品官方方式恢复，再正常登录。公开仓库没有密钥、公司模板和会话记录。

```powershell
git clone https://github.com/GOLD99LT/ai-toolchain-kit.git
cd ai-toolchain-kit
```

阅读和使用手册不要求运行 npm、JSON profile 或测试。安装个别 CLI/MCP 时，按对应使用卡准备它自己的依赖。

## 文件在哪里

- [recipes/](recipes/README.md)：每项工具的用途、入口、例子、费用、更新和停用。
- [configs/](configs/README.md)：无密钥的管理器导入示例与个人清单模板。
- [catalog/](catalog/README.md)：按工作问题组织的推荐和取舍。
- [playbooks/](playbooks/)：管理汇报、嵌入式、网站研究的组合用法。
- [docs/](docs/README.md)：指南、调研来源、设计演变和实际状态。
- `.local/`：本机私有配置、备份和输出，已忽略，不上传。

## 已有技术辅助

旧 scripts、runtime、tests 和 profiles 保留，使用说明集中在 [技术辅助说明](docs/guides/legacy-automation.md)。它们不是普通 Skills 的主管理入口，不是新用户开始使用工具箱的前置步骤。

项目以 [个人工具箱方案](docs/design/2026-11-05-personal-ai-toolbox-plan.md) 为当前方向。Understand-Anything 等完整项目仍是按需候选；不会因配置工具箱自动分析业务工程、修改固件/PCB 或部署 VPS。

原创文档与代码采用 [MIT](LICENSE)。第三方工具、模型和模板保留各自许可，具体来源见使用卡与研究记录。
