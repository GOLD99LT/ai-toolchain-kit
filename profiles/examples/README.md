# 示例选择

`code-context.json` 是最小试点，只选择 Skills CLI 与 Repomix，两个条目都要求 Codex、DSH。安装器/CLI 自检不能把这些要求改成“已通过”；缺少双端任务记录时继续标为未验证。

`manager-embedded.json` 是管理工作与嵌入式阅读的较宽示例，另选 CC Switch、本地 grilling、宿主办公及可选 Understand-Anything。宿主办公和可选图谱仅选择 Codex，是此示例明确的客户端范围；双端办公或图谱需求必须把 DSH 写回 required_targets 并保留不支持/待验证结果。这个示例包含人工恢复与待采集来源，不是全自动安装承诺，也不用于验证最小试点安装成功。

个人实际选择放在 `.local/`。每项均保留 schema 要求的 `capability_id/implementation_id/source_id/required_targets/required/verification_id`，不要添加密钥、公司路径或真实输入。新增需求先从 [访谈入口](../../prompts/onboarding.md) 明确任务；目录外需求继续研究，不强塞进现有组合。

`required=false` 表示该项可选，并不授权安装，也不允许忽略失败。`verification_id` 是验收记录的关联标识，不是报告存在或任务通过的证明。
