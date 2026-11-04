# 面向实际工作场景的候选工具

调研日期：2026-11-04（Asia/Shanghai）

状态：初筛。功能描述来自下列上游文档；适用性属于方案建议，尚未完成本机安装和实际任务验证。

工作画像见 [需求记录](../requirements/work-profile.md)。

## 办公资料读取与汇报输出

### Pandoc 与 PDF 引擎

- 新增依据：用户已确认现有测试汇总以 Markdown 为中间文件，再输出 PDF。
- 定位：Pandoc 可把 Markdown 转为多种文档格式；生成 PDF 需要相应引擎，官方支持 Typst 等选择。
- 适用建议：评估以 Markdown 为可审查源文件，配置固定的 PDF 样式和输出命令；PDF 引擎与字体需要在 Windows 实测后确定。
- PPT 补充能力：官方支持通过 `--reference-doc` 选择 PPTX 样式参考文件，但要求包含可识别的布局。公司模板需检查实际布局，不能承诺任意模板都可直接套用。
- 取舍：与 PptxGenJS 用同一份代表性汇报内容比较，再确定是否需要其中一种或两种输出方式；尚未决定安装。
- 官方依据：<https://pandoc.org/MANUAL.html>，见 Creating a PDF、`--pdf-engine`、`--reference-doc` 和 PowerPoint layout choice。

### Microsoft MarkItDown

- 定位：将文件内容转换成 Markdown，便于后续提取和分析。
- 官方列出的输入包含 Excel、PowerPoint、Word、PDF、HTML、CSV 等。
- 适用建议：读取已有测试报告、历史汇报和项目材料，作为汇总流程的输入。
- 边界：上游明确说明其重点是供文本分析使用，不适合承诺精确保留原始版式。不得把转换后的文本视为原有公式和版式的完整副本；涉及数值口径应再核对源文件。
- 依赖：Python 及相应格式的可选依赖；部署时只选择实际需要的格式。
- 上游：<https://github.com/microsoft/markitdown>。

### PptxGenJS

- 定位：通过 JavaScript 生成 PowerPoint 文件，可在 Node.js 等环境运行。
- 官方说明支持文字、表格、图形、图片、图表和自定义母版。
- 适用建议：如果固定汇报版式能用代码表达，可评估“结构化数据 → 固定模板 → 可编辑 PPT”的可迁移实现。
- 边界：是否能复用用户现有 PPT 模板、字体及复杂版式，需要实际样例验证。不能因能生成文件就声称已满足公司模板。
- 上游：<https://github.com/gitbrent/PptxGenJS>。

本次会话已有办公类技能入口，可以作为后续实验候选。但跨智能体迁移需要同时确认脚本、运行环境与工具依赖，不能把复制 SKILL.md 视为已迁移完整能力。

## 网页搜集与网站验证

### Microsoft Playwright CLI + Skills

- 定位：通过命令行让智能体操作浏览器；项目同时提供技能指导。
- 上游将其定位为适合编码智能体的浏览器操作方式，可执行页面交互与截图。
- 适用建议：为个人小网站验证页面流程，或在需要交互的网页上按需收集资料。
- 取舍：需要浏览器运行环境和实际站点验证。X 是否能稳定访问、是否需要登录，不在本次调研中作出保证。
- 上游：<https://github.com/microsoft/playwright-cli>。

### Microsoft Playwright MCP

- 定位：使用 MCP 工具接口控制浏览器，通过页面可访问性结构定位和操作元素。
- 上游同时说明 CLI 与 MCP 的不同侧重点；CLI 适合编码任务，MCP 可用于持续浏览器上下文和探索式操作。
- 适用建议：当多个智能体均支持 MCP、且实际流程需要持续浏览器状态时，作为 CLI 方案的比较对象。
- 取舍：应通过同一任务比较接入难度、稳定性和上下文开销，首版不预设两种方式都安装。
- 上游：<https://github.com/microsoft/playwright-mcp>。

浏览器自动化与定期信息订阅是两类不同需求。仅安装浏览器工具不会自动得到可靠的定时监控和推送系统。

## 开发资料查询

### Context7（CLI + Skills 或 MCP）

- 定位：为智能体查询软件库的版本相关文档与代码示例；官方提供 CLI + Skills 和 MCP 两种接入方式。
- 适用建议：在个人网站开发、软件依赖配置或 API 接入时，按需查找对应库的文档。
- 边界：尚未核实用户所用 STM32 工具链、芯片资料、EDA 软件文档是否被完整覆盖，不能承诺其替代厂商资料。
- 服务依赖：官方 README 说明 MCP 服务端源码公开，但 API 后端、解析与抓取引擎不包含在该开源发布中；不能把安装本地 MCP 进程等同于全套服务可离线运行。
- 上游：<https://github.com/upstash/context7>。

## 嵌入式与 PCB：优先核查原生接口

已确认用户主用 Keil + STM32CubeMX，GCC + VS Code 环境仍在搭建；PCB 使用嘉立创 EDA，BOM 手工维护。

- STM32：Keil 官方提供 UV4 命令行构建、目标选择、日志和返回码。可先接入已有工具链，具体工程和编译器路径在实施时定位；编译成功与板上验证分别记录。
- PCB：嘉立创 EDA 官方现有 lceda-pro CLI 和 MCP，但文档明确要求专业版客户端 V4.1.60 及以上，不适用于浏览器版。本机登记版本为 2.2.39.2，不能直接承诺该接口可用；建议首版先处理导出文件，升级与实时编辑器接入作为单独可选项。
- BOM：先确认数据来源、列定义和比较规则，再选择文件处理与检查方法。

官方来源：

- Keil 命令行：<https://www.keil.com/support/man/docs/uv4/uv4_commandline.asp>。
- 嘉立创 EDA 命令行客户端及版本要求：<https://prodocs.lceda.cn/cn/api/guide/cli.html>。
- 嘉立创 EDA 扩展 API：<https://prodocs.lceda.cn/cn/api/guide/>。

本轮不依据项目名称或 Stars 宣称任何第三方 STM32/PCB MCP 能直接控制现有工具。专业插件必须通过实际项目样例验证后进入安装清单。

## 后续评价与验收

后续已补充 [仓库维护、npm 月下载量与具体用户问题快照](2026-11-04-adoption-evidence.md)。这些证据仍不能把官方功能说明等同于“广受好评”。工具取舍见 [首版设计](../design/2026-11-04-ai-toolchain-design.md)，实施时继续核查：

1. 近期维护、已知问题、许可证与发布版本。
2. 社区可核查的实际用例和使用数据。
3. Windows、Codex、DeepSeek Harness 的适配方式。
4. 必需运行时、外部服务、账号和费用。
5. 用用户的代表性任务比较实际效果。

以上均属于调研和方案记录，尚未执行安装。
