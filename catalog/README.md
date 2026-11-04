# 能力与来源目录

本目录沿用 2026-11-04 的研究证据，2026-11-05 整理为 schema_version=1。包含 12 个任务型项目和 4 个基线实现，不重新采集 Stars，也不以关注量排序。

- [capabilities.json](capabilities.json)：按任务组织 14 项能力、16 个实现。一个能力可有多个候选，例如网页采集、VPS 管理。
- [sources.lock.json](sources.lock.json)：来源与安装负责人。文件名含 lock 不代表其中每项都锁定。
- [原研究](../docs/research/2026-11-04-task-project-catalog.md)：版本、许可、用户报告及原始链接。日期表示研究时间，不是本机测试时间。

能力字段严格使用 `capability_id/title/description/implementations/evidence`；实现字段为 `implementation_id/source_id/targets/recipe/limitations`。profile 使用同一 capability/implementation/source 三元组，不能靠显示名称或 npm 包名匹配。所有 recipe 路径相对仓库根目录。

`targets` 是已有证据支持的接入路线，不是验收结果；空数组表示仅登记外部候选，没有声明原生 agent 集成。Skills CLI 与 Repomix 的双端路线仍需分别实测。用户的 `required_targets` 不得因实现缺口被缩减；外部产物能阅读也不能冒充已发现插件。

| 来源状态 | 含义 | 当前条目 |
| --- | --- | --- |
| locked | 固定 npm 版本及期望 integrity；安装内容仍需验证 | skills-cli-1.7.6、repomix-1.18.1 |
| candidate | 官方引导或原生安装候选，未证明精确恢复和任务通过 | 11 个其他项目、CC Switch |
| managed | 宿主管理；不代表已核实恢复来源或任务通过 | host-office |
| pending-capture | 私有源或校验未采集，不可直接安装 | private-grilling |

`observed_version/observed_commit` 只保存历史观察，不能冒充 `version/integrity` 锁。候选安装前需按实际选择复核官方说明；本目录没有通用可执行 command 字段。CC Switch 的 SHA-256 是用户提供的期望值，须对实际下载文件重新计算。未记录完整技能包文件清单前，不声称技能可精确恢复。
