# Serena：编译参数齐备后试点

source_id：`serena-upstream`；owner：`serena-native`；status：candidate。2026-11-04 观察到 v2.1.0，没有安装包校验或精确恢复锁。

来源：[上游](https://github.com/oraios/serena)、[Windows 索引期间空引用报告 #2191](https://github.com/oraios/serena/issues/2191)、[既有研究](../docs/research/2026-11-04-task-project-catalog.md)。

依赖：选定发布要求的 Python/uv、C/C++ 语言服务器 clangd、正确 include/宏/目标参数及 compile_commands.json。Python 的精确下限应从固定选定版本核对，本目录未验证。Windows 路径、clangd 可执行文件与编译参数必须能真实对应。

1. 先用工程已有编译参数确认 clangd 能读取预期文件；Keil 参数转换未解决时停止在此，不伪造 GCC 编译数据库。
2. 按选定固定版本官方指南建立独立环境，记录解析出的依赖锁、索引目录、服务启动方式和 MCP 传输。未登记这些内容前不生成安装命令。
3. 在客户端原生 MCP 入口接入，先查询索引状态，再查一个已知定义及跨文件引用。
4. 用同名 static、条件编译、中断调用作反例对照，记录索引等待和空结果。索引未完成不解释为无引用。

Codex/DSH 的实际 MCP 连接未验证，因此 targets 为空；未来接入逐端填写发现与任务结果。不要让多个管理器更新同一环境；缓存/索引留在项目私有位置。工具只辅助阅读，不能替代编译或板上验证。
