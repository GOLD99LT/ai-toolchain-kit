# Superpowers：复杂开发的需求、调试与评审方法

在复杂开发中组织需求澄清、计划、调试、实现和评审，让每一步都有可检查的结果。

**更新（2026-11-07）**：Codex 保留原生 Superpowers 插件；DSH 已采用社区原生 `dsh-superpowers` 固定 Git 提交，包含 15 个技能及自动引导。具体任务与未测项见 [DSH 验收记录](../docs/validation/2026-11-07-superpowers-dsh.md)，选型见 [社区评审](../docs/research/2026-11-07-superpowers-dsh-community.md)。

## 何时用

需求有多个取舍、问题原因不明、改动跨多个模块或需要认真评审时使用。轻量文案、小修改和普通工具演示按任务规模处理，不为使用工具箱强制走完整开发流程。

## 入口与输入

在 Codex 对话中点名 Superpowers 或需要的方法，例如 brainstorming、systematic-debugging、requesting-code-review。具体入口取决于当前插件提供的技能，插件从原生管理器管理。

在 DSH 中**重新启动入口并新建会话**，直接描述功能、调试或评审任务；自动引导会让模型选择相关技能。想明确指定时，输入“请用 brainstorming 技能……”即可。底层应调用 `skill`，参数例如 `{ "name": "brainstorming" }`；使用普通名称，不照搬 Codex 的 `$superpowers:brainstorming`。技能列表可搜 `brainstorming`、`systematic-debugging`、`test-driven-development`。

本机同时覆盖终端默认 `web` profile 和桌面快捷方式实际使用的 `web` profile；它们的数据目录不同。快捷方式名称不能证明它使用 Electron 的 `desktop` profile。换机时先核查实际启动入口，不要只在另一个目录安装后以为已经生效。

提供当前目标、相关项目范围、允许改动的文件、已知现象和完成条件。已经批准的计划直接沿用，不重复访谈或重新索要同一授权。

## 两个可复制例子

以下是使用请求，示例本身不表示已经执行。尖括号内容请换成自己的实际输入；候选工具需先完成选用与配置。

**例一：澄清一个小功能**

```text
使用 Superpowers 的需求澄清方法，帮我设计个人博客的标签筛选。只有文章列表，没有账号和后端。先提出最关键的取舍和简单验收例子，输出一页方案，暂不修改代码。
```

**例二：定位页面问题**

```text
使用 Superpowers 的 systematic-debugging 方法分析这个问题：<复现步骤和错误现象>。只读取 <项目中的相关目录>，先说明证据、根因假设和最小验证方法；遵守我已给定的文件边界，不扩展到部署。
```

## 输出与判断

随任务得到需求说明、原因分析、改动或评审意见。对话结果可按需保存到该项目的文档目录；是否生成代码和测试由实际授权决定。

调试结果应有可复现现象、证据与验证结果；计划应能说明如何判断完成。仅调用了技能、生成了计划或命令退出 0 都不等于功能已完成。

## 管理、更新与停用

由 Codex 原生插件管理器安装、更新、停用或卸载。不要把插件内的单个 SKILL.md 再交给 CC Switch/Skills CLI 重复安装。更新后用一个小的需求或调试任务检查实际行为；卸载不删除自己的项目成果。

DSH 完整插件由 **DSH 原生 Plugins 页面或 `dsh plugin`** 管理，CC Switch 继续管理模型、MCP 和普通独立技能。不要再导入一份同名 Superpowers 技能。

本轮已评审的可复制安装命令（Node.js 22.19+/24+、Git、DSH 及其原生包管理器可用）：

```powershell
dsh plugin --profile web add 'github:codeAnqiang-ma/dsh-superpowers#65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9' --save-exact
```

这条命令用于当前 DSH 数据目录中的 `web`。若自己的快捷方式设置了 `DSH_HOME`，在相同启动环境执行；不要通过修改 HOME/CODEX_HOME 创建假隔离。原生 Electron Desktop 要使用它自带的命令或 Plugins 页面，本机 npm CLI 不管理该 profile。

包版本仍写 `0.1.0`，但本轮 Git 提交带的是上游技能 `7.0.2`；npm 同名 `0.1.0` 实际为旧技能 `6.3.0`。**不要换成不带提交的 npm 安装或 `#master`。** 更新时先评审新提交、备份目标 profile，再用固定提交原生升级并重做短例；本轮没有自动追踪更新。

停用：在当前 profile 的 Plugins 页面关闭 `dsh-superpowers` bundle。卸载：在同一启动环境执行：

```powershell
dsh plugin --profile web remove dsh-superpowers
```

然后重启。目标 profile 的安装前 manifest、lock 和用户 patch 已私有备份；需要退回时先原生卸载，再按备份恢复。不要覆盖其他工具之后产生的配置改动。

## 费用与数据

工作流可能增加阅读、模型轮次和工具调用，费用取决于当前宿主/模型。项目内容按所调用模型与工具的数据路径处理；插件本身不提供独立模型额度。

DSH 适配代码与上游技能保留各自 MIT 通知。本仓库只保存来源与原创教学，没有重新分发第三方技能。可选 brainstorming 视觉伴侣会访问上游 logo；可设置 `SUPERPOWERS_DISABLE_TELEMETRY=1` 关闭该请求，本轮未启用视觉伴侣。

## 常见问题

- **流程过重或重复提问？** 明确已批准内容、具体输出和停止条件，并要求按任务复杂度处理。
- **DSH 看见了技能就能完整运行吗？** 不能据此判断；子代理、问答和运行时依赖需要逐项验证，原生插件仍由原生入口管理。
- **装完仍找不到？** 先确认装的是实际启动入口的 profile，再重启并新建会话。成功信号是 `skill(name="brainstorming")` 的成功工具结果，随后读取项目、提出设计问题；模型口头说“我会使用技能”不足以证明成功。
- **Windows 或子代理描述对不上？** 适配包的部分映射来自较旧 DSH：当前本地可继续的直接子代理完成后仍可能支持 `send_message`，深度也由配置控制；优先遵循当前工具 schema。Windows 用 `pwsh`。不要为了符合旧文案关闭权限或降低安全设置。
- **是否等同于 Codex 插件？** 工作方法可复用，宿主工具、权限与版本分别管理；DSH 采用社区适配，不是上游官方 DSH 发布。

依据：[社区来源评审](../docs/research/2026-11-07-superpowers-dsh-community.md)、[接入方案](../docs/design/2026-11-07-superpowers-dsh.md)、[验收记录](../docs/validation/2026-11-07-superpowers-dsh.md)。研究快照、安装与实际任务通过分别记录。
