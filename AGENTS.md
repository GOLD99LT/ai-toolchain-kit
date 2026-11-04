# 项目协作约定

- 默认用简体中文沟通。解释用中文，代码、命令、文件名和 API 名称保留原文。
- 修改前简要说明计划、写入范围和验证方式；遵守当前用户授权及并行 worker 的文件边界。
- 本项目以 docs/design/2026-11-04-ai-toolchain-design-v3.md 与已批准的执行计划为依据。未经用户要求，不扩大安装、分支、提交或发布范围。
- 遇到报错先解释原因，再给可复制的修复命令；命令需要与已核查环境和实际失败相符。
- JSON 使用 UTF-8、schema_version=1；标识统一用 capability_id、implementation_id、source_id，保持引用一致。
- 改目录/profile 后实际解析全部相关 JSON，并在生产校验器可用时校验引用。低影响文档不新增镜像实现的形式测试；行为变更运行相关测试和真实入口检查。
- npm 只允许已记录的精确版本与 integrity；不静默回退到 HEAD/latest。不从 JSON 执行任意命令，不使用 Invoke-Expression。
- 每份安装内容只有一个负责人。普通独立技能由 Skills CLI 管，原生插件与完整产品由各自原生管理器管；不直接写 CC Switch 数据库。
- 保留 required_targets。来源锁定、installed、CLI-checked、agent-discovered、task-passed 分开报告，不能以命令退出 0 代替业务验收。
- 私有路径、账号、API key、令牌、真实公司资料、数据库、日志、备份与下载不进入 Git；使用已忽略的 .local/ 并在提交前审查实际 diff。不得把私人文件内容打印到公共报告。
- 不改 HOME/CODEX_HOME 冒充隔离；全局恢复测试需要完整账户边界。隔离或依赖不足时报告未执行。
- 引用研究须保留日期与局限；observed_commit 不等于锁定，不伪造哈希、来源、插件 ID、测试结果或生产成功案例。
- 原创内容使用根 LICENSE；第三方素材、代码和模型保持上游许可，不自动复制进本仓库。
