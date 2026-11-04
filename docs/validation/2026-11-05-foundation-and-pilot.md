# 基础工程与首个试点验证

日期：2026-11-05（Asia/Shanghai）。用户已批准第三版方案。本记录区分实际执行与尚未验证的能力；机器私有报告保存在 `.local/`，JSON 中的时间戳为 UTC。

## 工程交付

- 14 项能力、16 个实现/来源，包含 12 个已调研项目及基础管理能力。
- 恢复入口：doctor、setup（默认只计划，显式 Apply 执行）、verify。
- 首次使用入口：onboarding 文档，支持根据新工作需求继续研究并生成独立 profile。
- Node 原生行为测试，PowerShell 5.1/7 真实入口检查。
- 独立 runtime 的 package-lock，普通文件、应用和插件分别管理。

## 已实际完成

| 项目 | 结果 | 证明范围 |
| --- | --- | --- |
| Catalog 与示例 profiles | JSON 与引用检查通过 | 选择、来源与客户端字段一致 |
| Skills CLI | 1.7.6，项目内 npm 安装，锁元数据与 CLI 版本通过 | 尚未执行全局技能迁移或双端任务 |
| Repomix | 1.18.1，项目内 npm 安装，锁元数据与 CLI 版本通过 | 未增加常驻 MCP |
| 安装重复执行 | 两个匹配的工具均跳过 | 没有重复安装当前满足条件的 runtime |
| 合成代码试点 | 14/14 文件、28/28 指定源码内容保留 | 包含中文注释；仅验证材料完整性 |
| 样例 C 语法 | 已用本机 GCC 14.2.0，对 UART/LED 四种配置完成严格 C11 语法检查 | 不是 ARM 固件编译、链接或板上验证 |
| CC Switch | 4.0.18 → 4.0.25，MSI 退出 0，无需重启系统 | 注册表和二进制版本一致；应用恢复启动 |
| CC 数据备份与复核 | 一致性 SQLite 备份、6 个顶层 JSON 配置备份；数据库 integrity=ok，既有表记录数不变 | 只检查计数与完整性；没有输出或比较供应商凭据值，也未代替实际 API/MCP 请求 |

首个 Repomix 记录：输出 23,593 字节，初次样例执行约 1.6 秒，复测约 0.9 秒。它不是与用户原流程的时间对照，也不能推出生产效率提升比例。

CC Switch 安装包来自官方 v4.0.25 release，SHA-256 与发布元数据匹配：

```text
f9e64fb97c4887b13b03e29b0a4d39fcd77deceeb2767174b0a1ccaed5991a00
```

该 MSI 的 Authenticode 状态为 NotSigned；本次来源校验依据是官方发布资产与匹配的 SHA-256，未修改系统签名或执行策略。安装日志及原始配置备份不进入公共仓库。

## 自动化测试与独立评审

已补充来源引用、目标保留、版本与 integrity、路径/junction、私有源缺失、计划不写文件、候选阻断、真实 CLI 结果和试点内容检查等行为测试。

独立审阅发现并修复了：npm-shrinkwrap 优先级、额外根依赖入口、报告被 junction 导向公开目录、pilot 未检查来源锁定状态。相关回归测试先失败，再修复通过。另修复 Windows PowerShell 报告写入时的模块入口误判。

最近完整测试与独立复审结果：37 项中 36 通过、0 失败、1 跳过。跳过项是本机没有权限创建文件 symlink 的场景；目录 junction 的跨边界测试已实际运行通过。原四项重要发现已修复，限定复审未发现新回归，见 [代码评审记录](../reviews/2026-11-05-foundation-code-review.md)。

## 未完成与下一步条件

- Codex 与 DSH 对话内的技能发现/业务任务验证；CLI 退出 0 不替代这一项。
- Understand-Anything 的完整隔离试点。本机尚未确认可用的独立 Windows 用户/虚拟机/Sandbox；没有把工作目录变化当作隔离。
- 私有 grilling 源采集和迁移；原有内容保持原管理方式。
- 办公插件：本机查得 documents/pdf/presentations/spreadsheets 的包名与版本均为 26.1030.10813，但新电脑的获得途径和实际业务样例仍需核对。
- 真实公司模板、真实 BOM、Keil 工程、网站/VPS 部署。
- 完整隔离恢复和另一台电脑实测。
- GitHub 发布目标已由用户明确批准为 `GOLD99LT/ai-toolchain-kit`，公开仓库；发布不会使上述未验证能力自动变为已通过。

## 可复现命令

在仓库根目录运行：

```powershell
npm test
npm run check
powershell -NoProfile -File scripts/doctor.ps1 -OutputPath .local/reports/doctor.json
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Apply
powershell -NoProfile -File scripts/verify.ps1 -ToolsOnly
powershell -NoProfile -File scripts/pilot-repomix.ps1
```

默认 verify 不带 ToolsOnly 时会保留 `partial`/退出 2，因为尚未完成 agent 任务。较宽 profile 中缺少私有源或有必需手工项时，应读取具体状态，不删掉用户要求以制造通过。
