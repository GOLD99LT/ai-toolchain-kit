# Coolify：有明确 VPS 需求后选择

source_id：`coolify-upstream`；owner：`coolify-server-native`；status：candidate。2026-11-04 观察版本 v4.6.0；本任务不连接服务器。

来源：[上游](https://github.com/coollabsio/coolify)、[原生部署说明](https://coolify.io/docs/get-started/installation)、[部署密钥问题 #12461](https://github.com/coollabsio/coolify/issues/12461)。

依赖：受支持 Linux 服务器、Docker、管理权限、可用资源、SSH、DNS/域名和备份存储。Windows 仅是浏览器/SSH 管理端，不把面板安装成本算成本地 CLI 安装。具体发行版、资源下限和开放端口从选定发布官方要求核对。

1. 有多服务持续运维需求后，先与 Dokploy 比较；一个静态站优先评估静态托管。
2. 选定版本/镜像和目标服务器，审阅官方安装步骤的权限、端口、持久卷及更新行为，确认现有服务和备份。
3. 使用原生部署流程；不要执行目录中的动态远程脚本一键管道。记录实际镜像摘要与配置，但私钥/token 仅存私有环境。
4. 先部署一个无真实数据的测试应用，验证 Git/SSH 权限、域名/TLS、日志、重启后恢复。
5. 执行一次备份与恢复及失败回滚演练，记录资源消耗，再决定是否迁移长期服务。

Codex/DSH 无本目录声明的原生集成；面板可用不等于 agent 能管理生产服务。更新只由服务器原生部署负责人执行，与 Dokploy 二选一，不在同一主机盲目叠装。
