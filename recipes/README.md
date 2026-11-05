# 中文使用卡

从 [任务推荐目录](../catalog/README.md) 选择一项，再打开对应卡片。每张卡都有用途、使用时机、入口、输入、两个可复制例子、输出检查、管理方式、费用和常见问题；不需要先学习 JSON 或运行自研脚本。

状态快照日期：2026-11-05。完整证据由主任务写入 [本轮配置与验证记录](../docs/validation/2026-11-05-toolbox-rollout.md)。本目录中的提示词是教学请求，不代表已经执行了相应业务。

## 按任务打开

| 我想做什么 | 使用卡 |
| --- | --- |
| 查看、开关普通 Skills/MCP/提示词 | [CC Switch](cc-switch.md) |
| 把想法问清楚；组织复杂开发 | [本地 grilling](local-grilling.md)、[Superpowers](superpowers.md) |
| 做报告、PDF、PPT、表格 | [Codex 原生办公](host-office.md)；按需比较 [Docling](docling.md)、[Presenton](presenton.md) |
| 在对话里看网页；查软件库文档 | [Playwright MCP](playwright-mcp.md)、[Context7](context7.md) |
| 把源码交给模型；看结构与引用 | [Repomix](repomix.md)；候选 [Understand-Anything](understand-anything.md)、[Serena](serena.md)；暂缓 [GitNexus](gitnexus.md) |
| 反复整理同类网页 | 候选 [Crawl4AI](crawl4ai.md)、[Firecrawl](firecrawl.md) |
| 做个人网站 | 候选 [AstroWind](astrowind.md)、[bolt.diy](bolt-diy.md) |
| 了解多服务运维 | 候选 [Coolify](coolify.md)、[Dokploy](dokploy.md) |
| 额外查看技能 CLI 信息 | 可选辅助 [Skills CLI](skills-cli.md) |

## 怎样理解状态

- **已有/已安装**：文件、应用或入口已有，不自动等于任务可用。
- **已登记/已启用**：管理器或客户端配置有条目，不自动等于对话中实际调用。
- **direct server 成功**：绕过 agent 对话，直接调用服务完成指定短任务。
- **agent 待确认**：还需在对应客户端的新会话中调用并检查结果；Codex 和 DSH 分开记录。
- **候选/暂缓**：供以后选择，未安装，不应照卡片假设入口已经存在。

当前 Playwright 已有直接浏览器任务结果；Context7 remote 无密钥已有直接检索结果。两者通过 CC Switch 官方深链登记，Codex/DSH 配置存在且 enabled；正常用户环境的 Codex 已识别这两个服务。对话内调用仍由主任务补验。

在现有 Codex 或 DSH web/desktop 客户端重开或新建会话后尝试卡片短例。受限沙箱查询可能产生假阴性；DSH headless 初始化被沙箱拒绝不说明已有 web/desktop 配置失效。无需为这类现象重装或另建 headless profile。

## 固定管理入口

普通独立 Skills、MCP、全局提示词优先 CC Switch；grilling / grill-me 已通过原生入口开启 DSH 且文件 hash 与管理器源一致。PLC 保持 Codex-only。Skills CLI 只作辅助，不与 CC Switch 同时写同名技能。

Superpowers、办公原生插件由客户端原生管理器负责；完整产品和网站项目由自己的官方方式维护。每份内容只有一个更新负责人，配置备份和真实输出放私有位置。

先用公开页面、合成资料或短代码例子即可判断普通工具是否能用；只有明确的全局恢复任务才讨论完整账户隔离。候选产品的观察版本不等于锁定来源，CLI 退出成功也不等于业务通过。
