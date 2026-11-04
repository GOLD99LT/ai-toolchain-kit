# Docling：扫描资料读取

source_id：`docling-upstream`；owner：`docling-python-environment`；status：candidate。观察版本 v2.147.0，不是已校验锁。

来源：[上游与安装要求](https://github.com/docling-project/docling)、[表格换行问题 #5171](https://github.com/docling-project/docling/issues/5171)、[研究记录](../docs/research/2026-11-04-task-project-catalog.md)。

依赖：独立 Python 环境、对应模型与 OCR/解析组件、足够内存和磁盘；精确 Python 下限、模型下载大小/许可从选定发布核对。官方有 Windows Python 路线，但本机未运行。可本地处理，不强制 LLM API；启用远端服务时需另记数据流。

1. 先用宿主现有能力读取同一小样本，确认瓶颈是扫描/表格而非排版输出。
2. 从固定选定版本官方说明建立环境，记录依赖锁、模型版本、模型缓存位置与下载来源，不把模型自动下载视为无安装动作。
3. 用原创或授权的扫描页输出 Markdown/JSON，保存页码和表格来源；将数字、单位、料号、合并单元格与换行逐项对照。
4. 记录处理时间、资源占用、漏项和返工；若成本高于现有路线则保留现有流程。

产物可交给 Codex/DSH 阅读，但没有原生 agent 集成声明。生成的中间件与私有资料放 .local/ 或业务项目私有目录，避免公开模型缓存。更新由该 Python 环境负责人执行，宿主办公运行时不因此被替换。
