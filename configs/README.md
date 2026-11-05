# 配置参考：交给现成管理器使用

这里保存无密钥、无个人绝对路径的配置示例。日常入口是 **CC Switch → MCP / Skills / 提示词**，不需要先运行本仓库旧安装脚本。

- [浏览器工具](mcp/playwright.json)：使用按锁文件安装的 `@playwright/mcp@0.0.84`，本机 Chrome、临时独立浏览器配置和无头模式；必须先替换其中的绝对仓库路径。
- [软件文档查询](mcp/context7.json)：Context7 官方 Streamable HTTP 地址，无密钥示例；可用性与额度按实际连接确认。
- [个人记录模板](personal.example.md)：只记录工具选择和用法，不放账户令牌。

JSON 使用标准 `mcpServers` 格式。Playwright 示例包含明确的路径占位符，完成下面的安装和替换后，才可粘贴到支持该格式的 CC Switch 原生添加/导入入口。不要把整段 JSON 直接覆盖客户端现有配置；让管理器转换并同步到选定的 Codex/DSH。

## 换机时安装 Playwright 依赖

要求 Node.js **>=22.20.0**、随附 npm，以及本机 Google Chrome。这个版本要求覆盖当前锁文件的运行依赖；仅有 Node 18 不满足本指南。

在仓库根目录运行官方 npm 命令，不需要使用自研安装器：

```powershell
node --version
npm ci --prefix runtime/playwright-mcp --ignore-scripts --no-audit --no-fund
(Get-Command node).Source
(Resolve-Path runtime/playwright-mcp/node_modules/@playwright/mcp/cli.js).Path
```

`npm ci` 按已提交的 package-lock.json 安装并验证完整性；失败时排查原因，不改成动态 latest 或绕过锁文件。最后两行给出本机命令和入口路径：在 CC Switch 的命令字段填 node.exe 路径，用实际 cli.js 路径替换 JSON 第一个参数中的整个占位路径，其余参数保留。真实路径配置只放私有位置，不回填到公开示例。

本机本轮已经完成了这些步骤，不需要重复安装。Context7 远程配置不需要安装本地 npm 包。

CC Switch v4.0.25 的深链接源码支持 `apps=codex,dsh`；部分文档枚举未列 DSH，以对应版本源码和实际导入结果为准。技能的深链接只添加仓库，随后仍需在 Skills 页面选择具体技能。

操作说明：[CC Switch 管理](../docs/guides/cc-switch.md)；实际结果：[本轮状态](../docs/validation/2026-11-05-toolbox-rollout.md)。

真实备份、含密钥的配置、账号和公司模板均放个人私有位置，不复制到此目录。
