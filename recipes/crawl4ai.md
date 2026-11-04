# Crawl4AI：重复网页字段提取

source_id：`crawl4ai-upstream`；owner：`crawl4ai-python-environment`；status：candidate。观察版本 v0.9.5，许可主体 Apache-2.0 并含额外署名条款。

来源：[上游](https://github.com/unclecode/crawl4ai)、[深度抓取配置问题 #2450](https://github.com/unclecode/crawl4ai/issues/2450)、[研究记录](../docs/research/2026-11-04-task-project-catalog.md)。

依赖：独立 Python 环境、Playwright 及匹配浏览器；Docker 为可选路线。精确 Python 下限和浏览器安装步骤要按选定发布核对。Windows 上需真实验证浏览器启动、下载目录、编码和访问条件；不把 pip 安装视为浏览器已就绪。

1. 先定义 3–5 个可访问页面与固定字段、单位、来源格式，确认确实是重复任务。
2. 选定发布并登记环境锁、浏览器版本、缓存/输出目录；先审阅后按官方方式安装。
3. 优先正文及 CSS/XPath 规则提取；需要语义抽取时再配置模型并记录数据传输/费用。
4. 对每条记录保存 URL、采集时间、页面定位与原值；检查分页、动态加载、失败重试和字段缺失，空值不补猜。
5. 扩大采集前核查服务限制，保留拒绝访问/截断结果，不自动绕过控制。

无已验证的 Codex/DSH 原生集成，先将结构化产物作为输入。模型可选，批量采集仍需按站点访问条件执行。它可补充料号资料，不能承担 BOM 的归一、数量和版本规则。
