# 历史 profile 示例：可选辅助材料

本目录保留旧方案的结构化选择示例，方便阅读历史脚本及恢复记录。它不是个人工具箱的入门必经步骤，也不代表当前机器的最终安装状态。

第一次使用从 [需求自选入口](../../prompts/onboarding.md) 或 [任务推荐目录](../../catalog/README.md) 开始，选定后直接看 [中文使用卡](../../recipes/README.md)。日常通过 CC Switch 和产品原生入口管理，不要求先运行 setup、verify 或学习 JSON。

| 历史文件 | 描述与适用范围 |
| --- | --- |
| [code-context.json](code-context.json) | 旧版最小示例选择 Skills CLI、Repomix，两项保留 Codex/DSH 要求；不意味着现在普通技能必须由 CLI 管理，也不代表双端任务已通过。 |
| [manager-embedded.json](manager-embedded.json) | 旧版较宽组合包含 CC Switch、本地 grilling、原生办公及可选 Understand-Anything。人工恢复和候选条件继续保留，不是全自动安装清单。 |

若明确需要使用这些辅助数据，沿用 UTF-8、schema_version=1，以及 capability_id、implementation_id、source_id 的引用关系。个人选择和真实配置放私有位置，公开示例不放密钥、私人路径或公司数据。

`required_targets` 必须保留用户实际要求。较宽示例中的办公/图谱仅选择 Codex，是该历史示例的范围；如果你要求 DSH，也应保留这一要求并写明缺口，不能为了通过校验删去。CLI 成功不代替对话任务成功。

`required=false` 只表示可选，不是安装授权，也不意味着失败可忽略；`verification_id` 是关联标识，不证明报告已存在或任务通过。来源观察、安装、CLI 检查、客户端发现与实际任务结果分开看。现状以 [本轮配置与验证记录](../../docs/validation/2026-11-05-toolbox-rollout.md) 为准。
