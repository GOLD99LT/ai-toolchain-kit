# CC Switch v4.0.25：原生安装与原生 UI

source_id：`cc-switch-4.0.25`；owner：`cc-switch-native`；status：candidate。只使用官方 Windows MSI 与原生 UI，不调用内部 Tauri 函数、不写数据库、不将它视为稳定外部 CLI。

来源：[官方固定发布页](https://github.com/farion1231/cc-switch/releases/tag/v4.0.25)。用户指定 MSI 的期望 SHA-256：

```text
f9e64fb97c4887b13b03e29b0a4d39fcd77deceeb2767174b0a1ccaed5991a00
```

该值不是本 worker 已下载并验证的证明。需从固定发布页确认匹配的 Windows MSI 资产与系统架构，下载至 `.local/`，对实际文件计算 SHA-256；不匹配即停止，不选择别的文件沿用这个摘要。安装前检查原生安装器的运行依赖与 Windows 条件，缺失组件按该发布官方说明处理，不擅自安装。

1. 记录现有应用版本、进程和安装位置。用原生界面确认未完成操作并正常退出。
2. 在私有位置备份应用数据与原配置，确认备份可读；备份和数据库内容不进入 Git 或公共日志。备份位置与状态随主任务记录。
3. 通过 Windows 原生 MSI 安装流程安装已核对资产；记录安装器返回情况和完成后的实际版本。失败保留原配置与备份，不手工修改数据库补救。
4. 在原生 UI 分别核对 Codex、DSH 的供应商和 MCP。按客户端正常方式登录，配置只在其原生入口操作；密钥不放 profile。
5. 分别发起最小供应商请求和 MCP 握手，记录实际结果、时间及脱敏元数据。应用能打开不能代替连接成功。

2026-11-04 的发布源码核查已确认 v4.0.25 有 DSH 接入；当前机器运行结果待主任务核验。DSH 路线需区分 stdio/Streamable HTTP 和旧 SSE，不能直接等同转换。CC Switch 不管理 Skills CLI 或完整插件负责的同名技能。

依赖与占用：Windows 原生应用、实际安装器要求的运行组件、现有 Codex/DSH 客户端、所选供应商账户/MCP 服务；应用数据和进程由原生安装器/应用负责。实际路径、服务端点和端口从 UI 读取并脱敏记录，不猜值。依据：[兼容性核查](../docs/research/2026-11-04-agent-compatibility.md)。
