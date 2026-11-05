# 旧自动化：保留的辅助命令

日期：2026-11-05。`runtime/`、`scripts/`、`tests/` 保留为历史工程及可选辅助；日常入口已改为 [CC Switch](cc-switch.md)与[使用卡](../../recipes/README.md)。首次使用和换机不以运行这些命令为前提，也不继续把它们扩建为主管理产品。

以下参数已对照当前脚本源码和 `package.json` 核对。此前运行结果见[历史验证记录](../validation/2026-11-05-foundation-and-pilot.md)，不代表本次文档编写重新执行过所有命令。本轮实际配置以[配置验收记录](../validation/2026-11-05-toolbox-rollout.md)为准。

本轮 Playwright、Context7 已经通过 CC Switch 官方 deep link 纳管到 Codex、DSH，`grilling`、`grill-me` 已通过 Skills 原生开关启用到 DSH，PLC 保持 Codex-only。这些操作无需再用旧 setup 重做。已有服务端 SDK 演示、配置识别和技能哈希结果不等于两个客户端对话任务通过，剩余验证按[管理指南](cc-switch.md)刷新客户端并执行短例。

普通配置不要求先做复杂隔离、建立独立账户或运行完整恢复演练；采用必要备份与现成管理入口即可。只有明确安排全局恢复演练时，才单独考虑完整账户边界。

## 这些目录还负责什么

| 内容 | 保留用途 | 不代表什么 |
| --- | --- | --- |
| `runtime/skills-cli/` | 项目内 Skills CLI 1.7.6，供明确选择该管理方式时辅助使用 | 不再自动拥有已由 CC Switch 接管的普通技能 |
| `runtime/repomix/` | 项目内 Repomix 1.18.1；整理代码上下文的可选 CLI | 不要求安装全局命令或常驻 MCP |
| `scripts/setup.ps1` | 根据旧 profile 生成计划；显式 `-Apply` 才执行支持的本地 npm 安装 | 不安装完整工具箱，不操作 CC Switch GUI，也不部署全部原生插件 |
| `scripts/verify.ps1` | 检查旧 profile 对应本地包、锁元数据和 CLI 版本 | 不验证智能体实际任务或新机恢复 |
| `scripts/doctor.ps1` | 可选本机盘点：命令位置、应用登记及技能目录名 | 不读取凭据来验证登录；输出含私人路径，不能原样公开 |
| `scripts/pilot-repomix.ps1` | 对仓库自带合成样例检查打包内容完整性 | 不代表代码语义理解、固件编译、硬件测试或生产收益 |
| `tests/`、catalog/profile JSON | 已有行为检查与结构化材料 | 不要求普通用户学习 schema 才能用工具箱 |

## 可以复制的命令

在仓库根目录打开 PowerShell。旧工程声明 Node.js `>=22.20.0`；涉及安装的命令还需要 npm。下面按需选择，不是必须整组执行的安装流程。

查看已安装 CLI 的版本或帮助，不改变技能归属：

```powershell
node runtime/repomix/node_modules/repomix/bin/repomix.cjs --version
node runtime/repomix/node_modules/repomix/bin/repomix.cjs --help
node runtime/skills-cli/node_modules/skills/bin/cli.mjs --help
```

查看旧计划，默认不安装；`-Only` 填 `implementation_id`，例如 `repomix` 或 `skills-cli`，不是 npm 包名 `skills`：

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix
```

仅当确实要恢复项目内 Repomix 运行依赖时，才使用以下**会安装依赖**的命令。脚本先校验已记录版本和锁文件，遇到冲突会停止，不回退到 HEAD 或 `latest`：

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix -Apply
```

核对旧 profile 的本地 CLI；省略 `-ToolsOnly` 时仍保留完整 profile 的未验证状态：

```powershell
powershell -NoProfile -File scripts/verify.ps1 -ProfilePath profiles/examples/code-context.json -ToolsOnly
```

可选本机盘点会输出命令位置、应用登记和技能目录名，并写私有报告；它仍会向终端输出报告，因此不要把终端内容粘贴到公开问题单：

```powershell
powershell -NoProfile -File scripts/doctor.ps1 -OutputPath .local/reports/doctor.json
```

运行 Repomix 合成演示会在 `.local/pilots/` 写入打包结果和日志，并更新 `.local/reports/repomix-pilot-latest.json`；输入固定为仓库自带的 `examples/stm32-context/`：

```powershell
powershell -NoProfile -File scripts/pilot-repomix.ps1
```

仅在维护旧自动化代码时，按需运行原有检查与测试；它们不是日常使用门槛：

```powershell
npm.cmd run check
npm.cmd test
```

## 输出怎么理解

`setup.ps1` 的 `ready` 是可执行显式安装，`satisfied` 是已装包与锁元数据匹配，`manual` 是仍需原生操作，`blocked`/`conflict` 要先处理原因。默认计划不会替你安装；即便 `-Apply` 结束，也不能据此声称客户端演示完成。

`verify.ps1` 退出 1 表示验证失败；默认的 `partial`/退出 2 表示证明范围不完整。只有所选本地 CLI 通过且没有必需手工项时，`-ToolsOnly` 才可能给出 `tools-verified`/退出 0；它明确不证明 agent 任务。来源锁定、`installed`、`CLI-checked`、`agent-discovered`、`task-passed` 继续分开报告。

旧 profile 的 `required_targets` 保留原要求；不要因为 DSH 或另一端没有通过就删掉目标。普通技能已经交由 CC Switch 的，同名内容不再通过旧脚本或 Skills CLI 更新；原生插件和完整产品始终走各自原生管理方式。

发生缺失源、锁文件冲突或路径错误时，先读准确错误与[故障处理](troubleshooting.md)，保留现有可用配置。个人 profile、真实路径、报告、日志和备份只放 `.local/`，公开仓库只保留脱敏说明。这里没有 CC Switch 的自造 CLI，也不通过 JSON 执行任意命令。
