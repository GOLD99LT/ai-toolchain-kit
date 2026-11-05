# 现成工具箱配置与使用交付状态

日期：2026-11-05（Asia/Shanghai）。用户已批准个人工具箱方案及文档/配置目录调整。本记录只写实际完成的层次，未将配置成功当作全部客户端任务成功。

## 已完成

| 项目 | 实际操作与证据 | 尚不能据此推出 |
| --- | --- | --- |
| Playwright MCP 0.0.84 | 官方 npm 固定版本和 SHA-512 核对；项目内 npm ci 禁用生命周期脚本；CLI 版本通过 | 不代表可访问所有站点或自动取得已有登录 |
| Playwright 短演示 | MCP SDK 初始化，列出 25 项工具，打开 example.com，读到 Example Domain，截图生成并关闭浏览器 | 直接 MCP 调用不等于 Codex/DSH 模型已在对话中调用 |
| Context7 远程 MCP | 无密钥初始化、列出 2 项工具，实际检索 Express，并通过 query-docs 取得含 app.get 的路由示例和源链接 | 不保证所有功能、所有库、永久无密钥访问或无限额 |
| CC Switch MCP 管理 | 使用官方 ccswitch:// 原生导入，playwright/context7 对 Codex、DSH 均启用 | 没有直接写数据库；未更改已有供应商或路由 |
| Codex | 正常用户环境 codex mcp get 分别确认两项 enabled，stdio/streamable_http 类型正确 | 当前已经打开的对话可能尚未重新加载工具 |
| DSH | web/desktop 原生 profile 中存在对应 MCP 客户端与两个服务条目 | 未通过 headless 创建新配置来替代真实桌面对话验证 |
| grilling、grill-me | 原来已在 CC Switch 管理；通过原生 Skills 开关启用 DSH；DSH 与源文件哈希一致，Codex 保持启用 | 文件同步不等于所有宿主的技能调用语义完全等价 |
| PLC 技能与原生插件 | PLC 保持 Codex-only；Superpowers/办公插件保持原有方式 | 没有重复导入或新增专业工具 |

MCP 导入确认框在后续复核时已关闭；后续操作没有重复点击或导入。实际状态以管理器只读记录及客户端配置核对为准。

## 私有备份

变更前对 CC Switch SQLite 做一致性快照，完整性检查 ok；备份 Codex 配置、CC Switch 设置及存在的 DSH web profile。备份在 .local，不在公开 Git 中。未打印或导出密钥到公开报告。

变更后按解析后的配置比较：Codex 非 MCP 顶层配置保持一致，原 MCP 名称全部保留，只新增 playwright 和 context7。比较结果只输出布尔状态和新增名称，不输出原配置值。

## 已知环境区别

- 受限执行环境的 codex mcp get 曾报告未找到新增服务；正常用户环境重复检查能识别。不能据受限查询要求用户重装。
- dsh headless --help 会尝试创建不存在的 headless profile，沙箱拒绝该写入。本轮未为测试新建 profile；已有 web/desktop 注册照常保留。
- 浏览器演示使用本机 Chrome、--isolated --headless，不复用日常浏览器账号。截图及原始 MCP 结果仅保存在本机 .local/toolbox-rollout/。

## 已重整的交付内容

- 首页改为“从哪里打开、先试什么、如何换机”，旧脚本退为辅助。
- 配置参考集中到 configs/mcp，使用标准无密钥 mcpServers 格式；真实本机绝对路径只保存在私有导入配置。
- recipes 为中文使用卡，docs/guides 为 CC Switch、换机、排错和旧技术材料说明。
- 当前 AGENTS 与新方案一致：普通 Skills/MCP 现成管理器优先，避免两个管理器同时维护同名资源。

## 用户首次打开后的最短验收

1. 重新打开客户端或新建加载工具的对话。
2. 请求 Playwright 打开 example.com 并截图，确认实际工具调用。
3. 请求 Context7 查询 Express 路由，核对有工具返回资料。
4. 请求 grilling 帮你明确一个简单计划，观察是否按需追问。

两端分别记录结果。没有完成这四步前，客户端对话任务状态保留“待确认”，而服务直接调用和配置注册可以标记为已完成。

## 后续按需项

Understand-Anything、Serena、Presenton、Docling、网站模板和 VPS 面板仍按需要选择。本轮没有分析暂停的业务 ZIP，没有编辑固件/PCB，没有操作 VPS，也没有替用户创建付费账号。

原基础工程历史结果见 [此前记录](2026-11-05-foundation-and-pilot.md)，普通使用不再要求先运行那个自动化流程。

## 文档与辅助数据检查

配置目录新增标准 MCP 示例及个人记录模板，未移动或删除原有运行依赖。目录数据更新为 16 项能力、18 个来源；新增 Playwright 固定 npm 来源和 Context7 远程来源，并明确 Skills CLI 的辅助角色。

本轮已检查全部 15 个 JSON 与本地文档链接，无缺失；公开文本扫描未发现本机个人路径或凭据标记。保留的技术辅助测试结果为 36 通过、0 失败、1 因文件 symlink 权限跳过；这只用于确认配置调整未破坏既有辅助，不是使用工具箱的前提。

独立审阅提出的锁文件安装、Node 版本前提、旧隔离门槛三项问题已修正并完成实际文件复核，见 [交付审阅记录](../reviews/2026-11-05-toolbox-rollout-review.md)。
