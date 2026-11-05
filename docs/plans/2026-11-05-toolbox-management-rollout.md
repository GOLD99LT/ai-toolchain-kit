# 现成工具箱配置与教学实施记录

依据：[个人 AI 工具箱方案](../design/2026-11-05-personal-ai-toolbox-plan.md)，用户已明确批准全面推进文档、目录和运行配置。

## 本轮交付

1. 根 README 改为个人工具箱总览，入口为 CC Switch 与使用卡；旧脚本/测试退为辅助。
2. 配置示例集中到 configs/；它们用于现成管理器导入，不是新的配置引擎。保留旧 catalog/profile 格式以免现有辅助工具失效。
3. 读取现有 MCP/Skills 的名称、归属与启用状态，保留可用供应商和全局规则；不输出密钥，不直接写管理器数据库。
4. 通过官方发布核查并安装 Playwright MCP，使用本机现有浏览器做短演示；Context7 先核查无密钥/已有账号接入，实际不具备条件则明确保留。
5. 使用 CC Switch 官方导入链接或原生 UI 添加所选 MCP，并检查 Codex/DSH 配置与连通性。界面必须使用已提供的官方入口，不修改内部数据库。
6. 将已有普通技能通过管理器的原生导入方式纳管；原生插件不重复复制，来源冲突则保留并记录准确操作。
7. 每项交付用途、入口、两例、输出、费用、更新/停用、常见问题的中文使用卡；独立审阅后核对链接和相关 JSON，再完成授权的 Git 同步。

## 文件边界

- 主任务：AGENTS.md、README.md、docs/README.md、configs/、catalog JSON、新 MCP 运行依赖、实际配置/验证与状态报告。
- 文档 worker：recipes/、playbooks/、prompts/onboarding.md、profiles/examples/README.md、catalog/README.md。
- 指南 worker：docs/guides/cc-switch.md、docs/guides/migration.md、docs/guides/troubleshooting.md、docs/guides/legacy-automation.md。

## 验证方式

- 文档与配置：本地链接、JSON 引用、无实际密钥/个人路径；现有行为测试只在涉及相应代码或配置时执行。
- MCP：先直接初始化和列工具，再调用一个无业务数据的工具；连接已验证与客户端对话内调用分别记录。
- Playwright：临时独立浏览器配置，不接管日常登录浏览器；打开公开示例页面并读取标题，必要时留本机截图。
- Context7：仅检索公开软件库；若需账号或额度不具备，不伪造成功或替用户注册付费。
- 管理器：通过官方 UI/链接写配置，备份变更前内容，验证选定客户端条目实际存在；不改现有供应商、路由或全局提示词。

## 授权和限制

本轮不分析已暂停的业务 ZIP、不改真实固件/PCB、不部署 VPS、不装所有专业候选。只在确有提效缺口时推荐下一项独立产品。

沙箱外安装与本机管理器操作按当前工具的审批机制执行；被拒绝时先尝试安全替代，仍无法完成则记录准确剩余项和拒绝理由。

## 执行进度

- 已完成入口重整、AGENTS 管理归属更新、configs 目录与中文使用卡。
- Playwright 0.0.84 已核查完整性并安装；Context7 采用官方远程服务，无需另装本地包。
- 两 MCP 的直接服务调用完成；经 CC Switch 原生导入同步到 Codex/DSH，配置已核对。
- 已由原生 Skills 开关将 grilling/grill-me 同步到 DSH，源文件一致；原生插件和 PLC 原范围保留。
- 已完成 JSON、链接、公开内容和既有辅助测试检查；独立审阅的三项文档/配置问题已修正，限定复审通过；Git 同步在完成发布检查后执行。
- 客户端新对话实际调用仍待刷新后确认。完整专业项目、业务工程、硬件和 VPS 不属于本轮自动执行范围。
