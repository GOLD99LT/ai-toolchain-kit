# 面向真实任务的成熟项目候选目录

采样日期：2026-11-04（Asia/Shanghai）。本轮只读调研；没有安装、运行、连接 VPS 或读取用户业务代码。

## 阅读方式

每个项目按“解决的任务、已有能力、接入条件、真实局限、建议阶段”评价。Stars 是采样值，只代表关注度；不能据此认定某工具准确、兼容或适合公司使用。用户报告均未在本机复测。

建议分为：优先试点、满足条件后试点、当前暂缓。试点也需要用户批准方案后才执行，不等于现在安装。

## 1. 读懂代码与分析变更

| 项目 | 能直接解决哪一步 | 重要接入条件与边界 | 建议 |
| --- | --- | --- | --- |
| Understand-Anything | 生成可交互的结构图、导览、解释和影响视图 | 已核实 C/C++ 配置、Windows 安装器与 Codex；需要完整项目与构建，初次分析调用模型；原生 DSH 接入尚未证明已发布 | 优先评估一个小型 STM32 子项目，检查图关系与代码来源 |
| Repomix | 将选定源码和配置打包为适合模型阅读的材料 | Node >=22；打包本身不调用 LLM，阅读仍消耗当前模型额度；不是编译器语义分析。默认先用 CLI，MCP 上游仍标实验性 | 轻量试点；先看是否比现有直接读取省事 |
| Serena | 基于语言服务器查定义、引用与符号，供智能体调用 | C/C++ 默认 clangd；跨文件查询依赖正确编译参数，Keil 工程的 compile_commands 转换有成本；本轮核查的安装路线为 uv/Python | 编译数据库可用后优先验证；未来 GCC 项目更容易提供所需输入 |
| GitNexus | 调用图、路径追踪、影响查询与图浏览 | 当前许可证为 PolyForm Noncommercial 1.0.0，工作用途条件要单独确认；Windows 稳定版本有具体索引问题报告，C 函数指针仍有分析缺口 | 当前不放入默认公司工作组合，后续满足许可与稳定性条件再比较 |

这些不是完全可替代的工具：材料打包、语义查询、可视化导览处于不同层次。先选择一个任务样例比较，不默认同时常驻三个索引/服务进程。

### 使用规模与维护快照

| 项目 | 本次 Stars | 维护/发布线索 | 许可文本 |
| --- | ---: | --- | --- |
| Understand-Anything | 90,486 | 主分支最近提交 2026-10-26；本次读取插件 package.json 为 2.9.8 | MIT |
| Repomix | 29,154 | 主分支 2026-11-04；查得正式 release v1.18.1 | MIT |
| Serena | 31,088 | 主分支 2026-10-28；查得正式 release v2.1.0 | 应用 GPL-3.0-or-later，SolidLSP 为 MIT |
| GitNexus | 48,267 | 主分支 2026-11-04；本次查得稳定版 v1.6.12 | PolyForm Noncommercial 1.0.0 |

许可分类仅记录上游文本，不把这些不同许可统一称为可不限用途的开源组件。

### 对用户最重要的实际问题

- Repomix issue #1878 报告 v1.18.0 漏掉 GBK/Shift-JIS 文本。旧工程中文注释可能涉及该条件，试点须核对文件清单和编码；尚未验证后续版本是否完全解决。
- Serena issue #2191 报告 Windows 上 clangd 索引未完成时，引用查询暂时为空。不能把空结果直接解释为“没有调用者”。
- GitNexus issue #3818 报告 Windows 稳定版索引表面成功但函数节点不完整；主分支修复不能自动证明默认发布包已解决。
- Understand-Anything 的 DSH 接入与 worktree 源范围问题，见 [专项评估](2026-11-04-understand-anything-assessment.md)。

STM32 验收不能仅检查“支持 C/C++”：应核对宏、include、条件编译、同名 static 函数、中断入口、弱符号与 HAL 回调。图谱和符号工具都不替代构建与板上验证。

### 主要来源

- <https://github.com/Egonex-AI/Understand-Anything>
- <https://github.com/yamadashy/repomix>
- <https://repomix.com/guide/code-compress>
- <https://github.com/yamadashy/repomix/issues/1878>
- <https://github.com/oraios/serena>
- <https://github.com/oraios/serena/issues/2191>
- <https://github.com/oraios/serena/issues/2196>
- <https://github.com/oraios/serena/blob/main/LICENSE>
- <https://github.com/abhigyanpatwari/GitNexus>
- <https://github.com/abhigyanpatwari/GitNexus/issues/3818>
- <https://github.com/abhigyanpatwari/GitNexus/blob/main/LICENSE>

## 2. 测试资料、公司 PPT 与网页信息

| 项目 | 对当前任务的新增价值 | 实际接入与模型边界 | 建议 |
| --- | --- | --- | --- |
| Docling | 从扫描件、复杂 PDF 与表格提取阅读顺序、正文及结构，减少手工复制 | 官方支持 Windows Python；可本地处理，需要模型和运行环境，不强制购买 LLM API。输出 MD/HTML/JSON 等，主要解决资料读取 | 扫描测试报告或复杂表格确实耗时时试点；清晰文本优先现有能力 |
| Presenton | 有模板库、生成、可视化编辑与导出界面的完整制稿产品 | 提供 Windows 桌面版，Docker 可选；云模型或 Ollama/LM Studio 可选，图片服务需另配。支持从有内容的 PPTX 重建模板 | 值得与现有公司 PPT 流程比较；不是公司母版无损导入的保证 |
| Crawl4AI | 批量读取同类网页并抽取字段，适合参数/型号等资料整理 | Python + Playwright，本地部署或 Docker；正文和 CSS/XPath 抽取可不使用 LLM，语义抽取可接模型 | 反复采集同类网页时优先评估；偶尔搜索几页不必常驻 |
| Firecrawl | 通过 API 获取搜索、整站抓取和结构化结果，减少自建采集服务 | 上游已迁到 firecrawl/firecrawl；云端使用 API key 与额度，自托管为 Docker Compose 多服务，能力不等同于云端 | 作为服务型替代；不为按需搜索默认部署服务栈或新增付费账号 |

这四项没有直接解决手工 BOM 的料号归一、数量、单位和版本规则。它们可补充输入资料，BOM 主流程仍先使用已有表格能力与清楚的业务规则。

### 规模与实际限制

| 项目 | 本次 Stars | 版本/许可线索 | 具体问题 |
| --- | ---: | --- | --- |
| Docling | 70,101 | 采样查得 v2.147.0；代码 MIT，模型许可需分别看 | #5171 报告表格单元格换行信息丢失，测试参数和料号仍须核对 |
| Presenton | 11,697 | 查得 v0.9.12-beta；Apache-2.0 | #992 报告 Windows Store 0.9.11-beta 导出失败；不能据此确认当前版本必现，也不能略过导出验收 |
| Crawl4AI | 86,894 | 查得 v0.9.5；LICENSE 主体 Apache-2.0 并有额外署名条款 | #2450 报告特定深度抓取配置被服务端拒绝 |
| Firecrawl | 198,547 | 主体 AGPL-3.0，部分组件 MIT | #4653 报告本地模型处理长网页时截断导致抽取错误 |

### 主要来源

- <https://github.com/docling-project/docling>
- <https://github.com/docling-project/docling/issues/5171>
- <https://github.com/presenton/presenton>
- <https://presenton.ai/download>
- <https://docs.presenton.ai/user-guide/template-creation>
- <https://github.com/presenton/presenton/issues/992>
- <https://github.com/unclecode/crawl4ai>
- <https://github.com/unclecode/crawl4ai/blob/main/LICENSE>
- <https://github.com/unclecode/crawl4ai/issues/2450>
- <https://github.com/firecrawl/firecrawl>
- <https://docs.firecrawl.dev/contributing/self-host>
- <https://docs.firecrawl.dev/contributing/open-source-or-cloud>
- <https://github.com/firecrawl/firecrawl/issues/4653>

## 3. 小网站、AI 搭站与 VPS 部署

| 项目 | 它完成的任务 | 对 Windows + 现有 Codex 的适配 | 建议 |
| --- | --- | --- | --- |
| AstroWind | 已有首页区块、博客、导航、SEO 的网站模板 | Node/npm 本地项目，Codex 修改普通文件；静态构建不要求网站运行时常驻 Node 或 Docker | 将来做个人主页、产品介绍、博客时优先评估。需要登录、数据库或交易功能时重新选型 |
| bolt.diy | 浏览器内聊天生成、编辑、预览和导出网站代码的完整工作台 | Node/pnpm，本地运行可选 Docker；需模型 API key 或本地模型端点，不能把现有聊天订阅直接当作 API 额度 | 想使用可视化 AI 搭站界面时再评估，避免只为已有 Codex 的同类能力再维护一套环境 |
| Coolify | 管理应用部署、数据库、域名、日志与更新 | 在 Linux 服务器部署，依赖 Docker 和管理权限；Windows 是浏览器/SSH 操作端 | 有多个持续运行服务时优先比较；一个静态站不默认需要面板 |
| Dokploy | 管理应用、数据库、Compose 和多服务器部署 | Linux 服务器，Docker/Swarm；需要独立核查服务器资源、SSH、域名与备份 | 偏现成 Compose 项目时与 Coolify 二选一，不默认同时部署 |

当前只是发现与规划，没有创建网站、安装 Docker 或连接 VPS。

### 维护与使用边界

| 项目 | 本次 Stars | 上游/发布与许可 | 使用反馈 |
| --- | ---: | --- | --- |
| AstroWind | 6,119 | 原 onwidget/astrowind 已跳转 arthelokyo/astrowind；MIT；查得 v1.0.0-beta.65，v1 进入维护模式 | #732 报告导航栏局部样式覆盖问题；模板仍需实际页面检查 |
| bolt.diy | 20,030 | MIT；WebContainers 另有条款；查得 v1.0.1，README 表示以修复和依赖更新为主 | #2293 的 Docker 镜像启动问题、#2302 的发布二进制缺失，提示安装方式需按选定发布验证 |
| Coolify | 65,620 | Apache-2.0；查得 v4.6.0，采样日有推送 | #12461 报告部署密钥克隆权限问题，面板不能消除 Git/SSH 运维 |
| Dokploy | 38,228 | 普通部分 Apache-2.0，若存在 proprietary 部分则适用独立许可；查得 v0.30.10 | #5863 报告多容器监控统计范围问题 |

本轮未完成这四项独立生产成功案例的交叉核验；官方演示用于了解产品，不冒充第三方采用。许可证与发布状态均按当前上游记录，历史知名度不代替当前核查。

### 主要来源

- <https://github.com/arthelokyo/astrowind>
- <https://github.com/onwidget/astrowind>
- <https://github.com/arthelokyo/astrowind/issues/732>
- <https://github.com/stackblitz-labs/bolt.diy>
- <https://github.com/stackblitz-labs/bolt.diy/issues/2293>
- <https://github.com/stackblitz-labs/bolt.diy/issues/2302>
- <https://github.com/coollabsio/coolify>
- <https://coolify.io/docs/get-started/installation>
- <https://github.com/coollabsio/coolify/issues/12461>
- <https://github.com/Dokploy/dokploy>
- <https://docs.dokploy.com/docs/core/installation>
- <https://github.com/Dokploy/dokploy/issues/5863>

## 4. 发现与评价规则

每项进入正式安装方案前，应能回答：

1. 替代当前哪一步人工操作，输出是否能直接用于工作。
2. 是完整工具/产品、项目模板，还是需要再开发的底层库。
3. 对本机 Windows、Codex、DSH、现有工程格式，哪些已被上游明确支持，哪些需要实测。
4. 哪些计算在本机完成，哪些需要模型、额外 API、账号、Docker 或服务器。
5. 维护、发布、实际用户报告和许可证是否符合预期。
6. 用哪个样例比较时间、遗漏、错误、返工和维护成本。

候选目录要同时保存采纳和暂缓理由。没有合适成熟项目的环节，允许继续使用现有能力；不为凑清单引入不匹配工具。

## 5. 补充：实际使用与正反反馈

除问题单外，本轮补读了以下社区第一人称报告。它们能证明具体使用方式和个人体验，不能推出总体满意度、性能排名或当前版本保证。

- **Repomix，Hacker News，2025-04-22**：在如何把较大代码库交给模型评审的讨论中，用户明确推荐其直接、易用的材料打包方式。相同讨论也有手工拼接材料的做法，说明需要比较它相对现有流程的实际节省。
- **Docling，Hacker News，2025-05-13**：一位对自己文档样例进行比较的用户报告，其结构/格式保留较好，但处理更慢、资源消耗更高；另有用户表示在较简单布局上效果良好。这个样本边界与本项目“复杂扫描资料才优先试点”的判断相符。
- **Coolify / Dokploy，Reddit，2026-09-08**：有用户自报内部/低风险生产部署、长期使用及较好的维护体验，也有人报告小 VPS 资源开销不合适。不同偏好与负载条件并存，不能按票数选统一赢家。

来源：

- <https://news.ycombinator.com/item?id=43758384>
- <https://news.ycombinator.com/item?id=43973721>
- <https://www.reddit.com/r/selfhosted/comments/1wapo2r/dokploy_vs_coolify_in_production/>

这些社区报告与上游功能、发布及 issue 交叉使用；历史发表日期与本次采样日期不同，不用历史评论证明最新版本功能。
