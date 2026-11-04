# Firecrawl：托管 API 或自托管候选

source_id：`firecrawl-upstream`；owner：`firecrawl-native-service`；status：candidate。上游为 firecrawl/firecrawl；本次没有可锁定的选定发布版本，不补猜。

来源：[项目](https://github.com/firecrawl/firecrawl)、[自托管说明](https://docs.firecrawl.dev/contributing/self-host)、[云端与开源差异](https://docs.firecrawl.dev/contributing/open-source-or-cloud)、[长网页截断报告 #4653](https://github.com/firecrawl/firecrawl/issues/4653)。

依赖分两条：托管路线需要 API key、账户额度和网络；自托管需要选定版本的 Docker Compose 多服务、资源与配置，不能假定功能等于云端。Windows 可作为 API 客户端；自托管的具体 Windows/WSL2/Docker 条件未验证。

1. 根据任务选择托管或自托管，记录成本和数据发送范围；默认不为偶发查询部署多服务栈。
2. 托管路线在原生服务控制台取得私有配置，保留 API 版本/调用时间；自托管路线先固定仓库/镜像，审阅 Compose 的服务、端口、卷和凭据引用。
3. 对相同测试页面验证正文、字段、分页、长文尾部与来源 URL。用已知末尾字段检查截断，不能凭 HTTP 成功认定内容完整。
4. 记录额度、错误、速率限制和人工补录；缺功能如实列出，不自动切换付费方案。
5. 自托管更新和备份由服务负责人维护，密钥及业务响应不进 Git。

没有本目录验证的 Codex/DSH 原生集成；API 结果可作为外部资料，客户端连接需另验收。许可沿用研究快照：主体 AGPL-3.0、部分组件 MIT，部署前核对所选组件。
