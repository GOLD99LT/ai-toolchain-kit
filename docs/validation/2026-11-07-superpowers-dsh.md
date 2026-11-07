# Superpowers 接入 DSH：本机验收

日期：2026-11-07（Asia/Shanghai）。本页是本机证据摘要，不是所有 DSH/模型组合的兼容保证。

## 安装结果

采用社区 [dsh-superpowers](https://github.com/codeAnqiang-ma/dsh-superpowers/tree/65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9) 的固定 Git 提交 `65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9`。包版本仍为 `0.1.0`，内含上游 Superpowers `7.0.2` / `df2e996a174f49f05aa5d5777ca56fbb0aa972ec`，实际 15 个技能。与 npm 同名旧版包分开辨认。

本机 DSH CLI 为 `0.2.1-rc.2`、Node.js 为 `24.19.0`。终端默认入口和桌面快捷方式均启动 `web`，但数据根目录不同；分别由 DSH 原生 `dsh plugin` 安装。没有把 npm CLI 的 `desktop` 禁止管理规则绕过，也没有把快捷方式名称当成 Electron Desktop 证明。

| 状态 | 终端默认 web | 快捷方式实际 web | 证据与边界 |
| --- | --- | --- | --- |
| source-locked | 通过 | 通过 | manifest 和 pnpm lock 都含完整固定 Git 提交 |
| installed | 通过 | 通过 | bundle 已进入原生 profile 选择，实际包含 15 技能 |
| CLI-checked | 通过 | 通过 | 原生 dump-config 成功，配置可解析并包含插件 |
| 内容回读 | 通过 | 通过 | 入口、bundle patch、两份许可及技能支持文件共 85 个文本文件，UTF-8/LF 归一化后与评审源码 0 差异 |
| 原配置保留 | 通过 | 通过 | 安装前逐 profile 备份；用户 cordis.patch.yml 内容未改 |

安装验证中的两个检查器问题已修正：DSH dump 使用 `!!js` 扩展，检查器需把它当字符串读取，不能执行；Windows Git checkout 的 CRLF 与安装包 LF 不同，文本比较显式归一化，不能把它描述成逐字节相同。两者都是检查方式问题，未据此改写生产配置或第三方源码。

Codex 原生 Superpowers 保持独立管理。本次未更换供应商、MCP、全局规则或 CC Switch 数据库，也没有将第三方源码复制到公开仓库。

## 真实 agent 验收方式

通过本机 DSH 官方 SDK/JSON-RPC 跑真实模型，使用现有连接。演示 profile、会话、storage、附件和合成 workspace 位于私有 `.local/`；没有修改 HOME/CODEX_HOME 冒充隔离。模型路由与快捷方式实际入口一致；DSH_HOME 仅沿用该入口已有的数据根目录以使用原有认证，不用它伪装账户边界。

每个用例确认 initialize、session/prompt、session/wait、shutdown，并检查真实 `tool/call` 与成功 `tool/result`，不把最终文字或命令退出 0 当作技能加载证明。除已明确标注的后续轮次，使用新会话。原始模型输出、真实配置、下载、日志和备份只在本机 `.local/`，公开仅保留合成任务和状态摘要。

公开材料未列出个人路由、供应商端点或模型选择配置，因此不能凭本记录重现相同模型版本；结论只覆盖本机当次连接，不能外推所有 DeepSeek 或其他模型。使用 DSH 不等于已经证明测试使用了某个特定 DeepSeek 模型。

| 用例 | 观察结果 | 判定 |
| --- | --- | --- |
| 安装前现状基线 | 模型连接可用，未调用工具，也未发现 Superpowers 工作流技能 | 基线成立；这是现状检查，未声称严格同题统计对照 |
| 普通博客标签功能请求，未点名 Superpowers | 成功调用 `skill(name="brainstorming")`，读取合成项目后提出设计问题；workspace 无改动 | agent-discovered、自动首调用与设计先行通过 |
| 合成 sum 类型错误 | 成功加载 `systematic-debugging` 与 `verification-before-completion`，复现失败后最小修改；原有 3 条断言保持原样，外部复验通过 | 调试任务通过；首次误用不可用 bash 后自行转 pwsh，记录此局限 |
| 合成代码评审与子代理 | 成功加载 `requesting-code-review`；真实子代理完成初评，父代理用同一 child ID 的 send_message 发起下一轮并收到回复 | 子代理任务通过；初评与续聊两次生命周期，不算两个不同子代理 |
| 已安装 bundle 的 TDD | 新演示 profile 从实际已安装包的 manifest 加载原生 bundle；成功加载 `test-driven-development`、verification，先写并运行失败测试，再实现、转为通过；生成测试和额外 5 个边界断言分别外部复验 | installed-bundle、agent-discovered 与 TDD 任务通过 |
| 已安装 bundle 的第二轮 | 同一 SDK session 两次 user prompt，分别成功加载 review、verification；workspace 未改动 | 同会话后续调用通过；不等同于上下文压缩恢复 |

共 6 个合成用例（含基线）通过。主代理另行重跑原 sum 测试和生成的 5 项 clamp 测试，均通过；并独立检查调试原始事件：断言失败结果在 index 29、首次生产 edit 在 index 45，确认先复现后改动。

私有摘要分类器曾将调试用例误判失败：它只接受 `exit code: 1`，实际工具结果为 `exit: 1`。修正为同时接受两种格式后按原始事件重新判定，没有重跑模型或改写原始 transcript 来掩盖问题。事件顺序与原测试哈希均已回读确认。

## 注册与生命周期检查

独立 reviewer 用本机真实 Cordis、SkillRegistry、SystemPrompt 和固定插件做内存验证：注册 15 个技能及 1 个 bootstrap section；brainstorming 可加载、资源目录可定位、modelInvocable 为真；renderPrompt 包含 bootstrap 与映射。dispose 后技能与 section 均归零。

DSH agent-loop 每个 preStep 重新 assemble 系统提示，所以该机制持续注入。此项证明 API 与生命周期契约；不能代替真实上下文压缩测试。

## 仓库检查和评审

- 固定社区源码自带的 4 个测试全部通过；没有把上游 PR 里的测试数算成本机执行。
- `npm run check`：17 个 capability、20 个 source，生产校验器通过。
- `npm test`：37 项，36 通过、0 失败、1 因 Windows 无法创建测试 symlink 跳过；如实保留。
- 15 份公开 JSON 解析、2 个已有 profile 引用校验通过；未缩减 required_targets。变更 Markdown 的本地链接和 diff 空白检查通过。
- 独立实现评审未发现 P0/P1，指出旧版子代理限制过时；设计、研究与使用卡已更正说明，保留固定第三方源码。
- 公开交付经第二个独立 reviewer 复审，无未解决 P0/P1/P2；场景表述与模型复现限制已修正。见 [评审记录](../reviews/2026-11-07-superpowers-dsh.md)。

## 已知边界与恢复

- 固定插件采用 system prompt section，而上游移植指南倾向 user-message 注入；本轮接受这一 DSH 社区方案，不称为上游官方合并支持。
- 本机确认 local direct continuable child 完成后可继续；插件旧映射中的“全部完成后不可续聊、深度恒 1”不适用于所有新版配置。工具 schema 和运行时策略优先。
- 模型仍可能偶尔选错 shell；本次可恢复不等于所有任务零错误。独立 reviewer 和当前权限继续生效。
- 没有验收真实上下文压缩、长时多代理编排、视觉伴侣、Electron Desktop UI、所有模型或生产业务工程。原生 web UI 中的重启/新建会话仍需按使用卡操作；SDK 成功不冒充已点击 UI。
- 停用/卸载走实际 profile 的原生 Plugins 或 `dsh plugin --profile web remove dsh-superpowers`；安装前私有备份可供退回。没有自动升级 HEAD/latest。

日常入口、安装和更新命令见 [中文使用卡](../../recipes/superpowers.md)，取舍见 [社区评审](../research/2026-11-07-superpowers-dsh-community.md)。
