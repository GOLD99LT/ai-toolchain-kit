# GitNexus：当前暂缓

source_id：`gitnexus-upstream`；owner：`gitnexus-native`；status：candidate。2026-11-04 调研观察到 v1.6.12，许可记录为 PolyForm Noncommercial 1.0.0；工作用途条件未解决前不纳入公司默认组合。

来源：[上游与运行要求](https://github.com/abhigyanpatwari/GitNexus)、[Windows 节点遗漏报告 #3818](https://github.com/abhigyanpatwari/GitNexus/issues/3818)、[研究记录](../docs/research/2026-11-04-task-project-catalog.md)。

依赖待核查：选定发布的 Node/包管理器要求、Windows 平台依赖、索引后端及工作用途条件。没有足够证据给出精确运行时下限，不补猜版本，不提供浮动 npx 命令。

具备条件后按顺序执行：核对选定版本许可和安装要求；选择官方支持的固定发布并记录完整性/依赖；在独立合成目录建立索引；逐个比对函数节点、调用路径与函数指针案例；验证删除/重建索引的行为。出现“命令成功但缺节点”时判定任务失败，不能凭索引摘要报通过。

Windows 稳定版问题是否修复需对应发布实测，主分支变化不作保证。未声明 Codex/DSH 原生接入；CLI、MCP、图浏览器的选用路径、目录与端口须先登记再接入。更新和生成索引仅由该工具负责人处理。
