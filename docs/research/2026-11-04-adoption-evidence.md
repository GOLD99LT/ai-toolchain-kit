# 开源 AI 工作工具候选：使用证据快照

采样日期：2026-11-04（Asia/Shanghai）。仓库元数据与 npm 下载 API 响应的服务器时间：2026-11-04 14:47:44 UTC，即北京时间 22:47:44。README 与 issue 在同次调研中读取。下表 last pushed 保留 GitHub API 的 UTC 时间；它是仓库推送时间，不等于发布或维护质量。

结论（针对用户工作场景的判断）：保留已存在的 Superpowers 与 grill-me/grilling；新增优先小规模验证 PptxGenJS，供固定模板的工作汇报使用。网页交互需要出现时优先考虑 Playwright CLI；其他工具按需或暂缓。

## 采样数据

8 个仓库均未归档（archived=false）。Stars 代表收藏关注，npm 下载量代表下载次数，不能解释成活跃人数、企业采用数或满意度。各 npm 包通过 registry 的 repository 字段核对了所属仓库。

| 候选 | Stars | archived | last pushed（UTC） | License | npm 2026-10-01—2026-10-31 下载次数 | 建议 |
|---|---:|---|---|---|---|---|
| obra/superpowers [G1] | 312,227 | false | 2026-11-03 23:24:58 | MIT | — 未核验独立对应 npm 包 | 首版保留；已安装，开发流程支持 |
| mattpocock/skills [G2] | 312,536 | false | 2026-11-04 11:45:30 | MIT | — 未核验独立对应 npm 包 | 首版保留现有 grilling；暂缓整包叠加 |
| vercel-labs/skills [G3] | 38,062 | false | 2026-11-03 23:42:47 | MIT | skills：17,479,907 [N1] | 按需；技能发现、安装和更新工具 |
| microsoft/playwright-cli [G4] | 14,946 | false | 2026-11-03 17:14:05 | Apache-2.0 | @playwright/cli：4,670,899 [N2] | 按需优先；网页交互与资料获取 |
| microsoft/playwright-mcp [G5] | 39,170 | false | 2026-11-03 17:08:26 | Apache-2.0 | @playwright/mcp：26,123,808 [N3] | 暂缓与 CLI 双装；有明确 MCP 接入需要再选 |
| microsoft/markitdown [G6] | 193,846 | false | 2026-10-28 15:33:14 | MIT | — 上游为 Python/PyPI 工具，不套用 npm 同名包 | 按需；PDF/PPT/Office → Markdown |
| gitbrent/PptxGenJS [G7] | 6,349 | false | 2025-11-28 20:17:14 | MIT | pptxgenjs：15,912,782 [N4] | 首版试点；模板化生成 PPTX，需验收兼容性 |
| upstash/context7 [G8] | 64,179 | false | 2026-11-04 13:40:28 | MIT | @upstash/context7-mcp：2,643,669 [N5] | 按需；软件库/API 文档检索，先验证目标覆盖 |

5 个 npm 下载 API 均返回 HTTP 200，start/end 与指定月份一致。空项不是零下载，也不是 API 失败；本次没有核验其独立对应 npm 包，或工具通过 Python 生态分发。尤其不能把 vercel-labs/skills 的下载量分配给 obra/superpowers 或 mattpocock/skills。

## 适配判断及证据边界

- Superpowers 的开发方法、mattpocock 的技能用途来自作者 README [R1、R2]。用户已装两者相关功能，因此首版保留即可；本次未验证本地 grilling 与上游 grill-me 的文件或版本一致性。“作者每天使用”“最热门”等自述不算独立使用反馈。
- vercel-labs/skills 是技能分发管理 CLI，不是直接生成汇报或操作硬件的软件 [R3]。
- Playwright CLI/MCP 都提供浏览器自动化。上游 README 推荐 coding agent 考虑 CLI，并宣传其 token 效率；本次没有做独立 token 对照测量 [R4、R5]。据此结合按需网页任务，建议先选一个入口。
- MarkItDown 将资料转成 Markdown，README 明确其偏向文本分析，并非高保真排版转换 [R6]。不能用它补齐 MD → PDF/PPT 输出。
- PptxGenJS 是生成 PPTX 的 JavaScript 库，可用于图表、表格、母版；它不是现成的 Markdown 一键汇报工具，仍需解析和模板步骤 [R7]。其推送时间较早，应结合下面的具体 issue 小规模验证。
- Context7 README 介绍版本相关的软件库文档检索；本次未核验 Keil、CubeMX、指定 STM32 HAL 版本或嘉立创 EDA 的覆盖 [R8]。README 还明确：仓库开放 MCP server 源码，API backend、解析引擎与爬取引擎是私有组件。因此不将其描述成整个服务栈均可自托管的开源方案。
- 对用户现有工作，MD → PDF 输出，以及 Keil/CubeMX 编译烧录、嘉立创 EDA 手工 BOM 的直接自动化，均未在本轮找到足够的原生集成证据。暂不扩展这 8 项之外的候选。

## 两条有信息量的使用局限

1. **PptxGenJS：特定柱线组合图可能生成无法打开的 PowerPoint。**
   外部用户 ReveleerPurchases 在 issue #1546 报告：pptxgenjs 4.0.1 的柱线组合图设置 `dataLabelPosition: "inEnd"` 后，线图也被写入不适用的标签位置，PowerPoint 报内容损坏。报告附最小复现代码、XML 定位以及避开该选项的 workaround；采样时为 open。本次未亲自运行复现。它提示“计划与实际”这类汇报图应实际打开验收，不能仅检查生成了文件。
   来源：https://github.com/gitbrent/PptxGenJS/issues/1546
   API：https://api.github.com/repos/gitbrent/PptxGenJS/issues/1546

2. **MarkItDown：PPTX 隐藏页转换后未标记隐藏状态。**
   外部用户 JonRC 在 issue #2817 报告：隐藏幻灯片与可见页一起输出为 Markdown，没有隐藏标记，LLM 因而可能把内部草稿当作正式汇报内容。报告附 3 页 PPTX 的最小复现与实际输出；采样时为 open。本次未亲自运行复现。用于旧汇报整理时应核对原稿的隐藏页。
   来源：https://github.com/microsoft/markitdown/issues/2817
   API：https://api.github.com/repos/microsoft/markitdown/issues/2817

两条 issue 的 GitHub author_association 均为 NONE：可作为非维护者提交的具体使用报告，与作者宣传区分；这个字段不能单独证明作者没有商业关联，也不能把个案当作总体质量评价。本次没有“全网一致好评”或“广泛满意”的证据。

## 引用来源 URL

以下来源均在 2026-11-04（Asia/Shanghai）采样；G/N 精确时间见文首。API 为动态端点，后续打开可能得到变化后的数据，本文保留本次读数。

### GitHub 仓库元数据

- [G1] https://api.github.com/repos/obra/superpowers
- [G2] https://api.github.com/repos/mattpocock/skills
- [G3] https://api.github.com/repos/vercel-labs/skills
- [G4] https://api.github.com/repos/microsoft/playwright-cli
- [G5] https://api.github.com/repos/microsoft/playwright-mcp
- [G6] https://api.github.com/repos/microsoft/markitdown
- [G7] https://api.github.com/repos/gitbrent/PptxGenJS
- [G8] https://api.github.com/repos/upstash/context7

### npm 指定月份下载 API

- [N1] https://api.npmjs.org/downloads/point/2026-10-01:2026-10-31/skills
- [N2] https://api.npmjs.org/downloads/point/2026-10-01:2026-10-31/%40playwright%2Fcli
- [N3] https://api.npmjs.org/downloads/point/2026-10-01:2026-10-31/%40playwright%2Fmcp
- [N4] https://api.npmjs.org/downloads/point/2026-10-01:2026-10-31/pptxgenjs
- [N5] https://api.npmjs.org/downloads/point/2026-10-01:2026-10-31/%40upstash%2Fcontext7-mcp

### npm 包与仓库对应关系

- https://registry.npmjs.org/skills/latest
- https://registry.npmjs.org/%40playwright%2Fcli/latest
- https://registry.npmjs.org/%40playwright%2Fmcp/latest
- https://registry.npmjs.org/pptxgenjs/latest
- https://registry.npmjs.org/%40upstash%2Fcontext7-mcp/latest

### 上游 README（作者功能说明）

- [R1] https://raw.githubusercontent.com/obra/superpowers/main/README.md
- [R2] https://raw.githubusercontent.com/mattpocock/skills/main/README.md
- [R3] https://raw.githubusercontent.com/vercel-labs/skills/main/README.md
- [R4] https://raw.githubusercontent.com/microsoft/playwright-cli/main/README.md
- [R5] https://raw.githubusercontent.com/microsoft/playwright-mcp/main/README.md
- [R6] https://raw.githubusercontent.com/microsoft/markitdown/main/README.md
- [R7] https://raw.githubusercontent.com/gitbrent/PptxGenJS/master/README.md
- [R8] https://raw.githubusercontent.com/upstash/context7/master/README.md

本次仅请求并读取上游元数据、README 与 issue，没有执行远端代码或安装候选工具。本文件作为调研快照归档；最终取舍以首版设计方案及后续实际验证为准。
