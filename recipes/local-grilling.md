# 本地 grilling 的私有恢复

source_id：`private-grilling`；implementation_id：`local-grilling`；owner：`user-private-skills`。status/checksum_status 都是 pending-capture。它是用户修改的私有内容，不用上游同名技能或公开示例替代。

依赖：用户提供的私有根映射 `personal_skills`、其下相对路径 `grilling`、完整 SKILL.md 与引用的脚本/资料/其他技能。是否依赖 grill-me 包装入口、宿主专属问答或子代理工具，必须实际读包核对。

1. 在 `.local/` 保存私有根映射，公开 profile 只引用 source_id。缺根映射/目录时记录“需要提供私有来源”。
2. 解析相对路径并检查规范路径、junction/symlink 仍位于该根下；越界拒绝。不要因本机文件存在而跳过边界核查。
3. 从确认的私有原件采集包内文件清单、相对路径和 SHA-256，排除缓存/日志；确认哪些文件是本地修改。未采集前不生成安装动作。
4. 盘点两端现有同名内容、来源和依赖，冲突不覆盖。恢复方式应由主任务明确实现后使用，本 recipe 不假装已有通用私有复制安装器。
5. 用同一小需求分别运行 Codex、DSH 的访谈，核查是否能提出澄清、记录约束并返回可验收目标，结果关联 `interview-smoke-v1`。

Windows 需处理路径大小写、链接、长路径；DSH 发现共享目录不等于宿主工具调用兼容。涉及共享全局根的恢复演练应在完整账户隔离环境。更新由用户维护原件、重采清单，不让 CC Switch/Skills CLI 并发覆盖。依据：[批准设计的私有来源契约](../docs/design/2026-11-04-ai-toolchain-design-v3.md)。
