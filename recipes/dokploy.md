# Dokploy：Compose 与多服务运维候选

source_id：`dokploy-upstream`；owner：`dokploy-server-native`；status：candidate。观察版本 v0.30.10；本任务不连接 VPS、不部署面板。

来源：[上游](https://github.com/Dokploy/dokploy)、[官方安装说明](https://docs.dokploy.com/docs/core/installation)、[监控统计问题 #5863](https://github.com/Dokploy/dokploy/issues/5863)。

依赖：受支持 Linux、Docker/Swarm、服务器管理权限、SSH、域名和备份；精确资源/发行版要求从所选固定发布核对。Windows 仅作管理端，没有本机 Windows 服务端运行承诺。普通部分 Apache-2.0，如涉及 proprietary 部分需单独核对。

1. 先确认负载是否以 Compose 项目和长期服务为主，与 Coolify 选择其一。
2. 在真正部署前记录固定版本/镜像、目标主机、网络/端口、持久卷、数据库和既有服务冲突；审阅官方原生安装步骤，不运行浮动远端脚本。
3. 使用无业务数据的 Compose 样例验证部署、日志、域名/TLS、服务间通信与重启。
4. 逐容器核对资源和监控统计，不用面板总数代替每个容器状态；验证数据库备份、恢复与失败回滚。
5. 保存实际镜像摘要、脱敏部署记录、运维负责人和维护窗口，私钥/生产配置留私有环境。

Codex/DSH 的管理接入尚未验证，targets 为空；可读取部署说明不代表拥有或通过远端管理能力。生产迁移属于后续具体任务，不能由选择 profile 自动触发。
