# Skills CLI 1.7.6

source_id：`skills-cli-1.7.6`；owner：`npm-project-runtime`。CLI 位于 `runtime/skills-cli`；安装后的普通独立技能由 Skills CLI 管理，CC Switch 不同步同名项。宿主插件与 Understand-Anything 不归它管理。

依赖：Node.js >=22.20.0、npm；获取 Git 来源时需要 Git。Windows 路线应核对长路径、junction/复制行为；可选复制模式不意味着可把机器绝对路径提交。依据：[既有源码研究](../docs/research/2026-11-04-tooling-comparison-v2.md)，[固定包元数据](https://registry.npmjs.org/skills/1.7.6)。

先计划，再显式执行固定 CLI 安装：

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only skills-cli
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only skills-cli -Apply
node runtime/skills-cli/node_modules/skills/bin/cli.mjs --help
```

版本和 integrity 以 sources.lock.json 中记录为准，主程序检查安装版本与锁元数据；这不等于对已安装包逐文件重新做内容哈希。本任务没有运行安装。具体技能尚未选定完整 commit、子路径、依赖和预期文件清单，因此此处不提供可误装 HEAD 的技能 add 命令。选定后依据固定版本的帮助生成明确命令，安装后校验 SKILL.md 以及 scripts/references/assets 等整个包，不能仅哈希本机副本声称与上游一致。

该版本不存在 `--agent dsh`。Codex 目标写共享 `.agents/skills`，DSH 在 filesystem 插件启用、共享来源开启、DSH_AGENTS_HOME 未重定向且无同名覆盖时有发现路径。发现与调用分别在 Codex、DSH 验证。CLI help 成功不能将 `skill-management-smoke-v1` 的 agent 结果置为通过。

全局技能安装/恢复演练需要独立 Windows 用户或虚拟机等完整边界。只改变工作目录或 HOME 无效；当前环境不具备时保留未执行。更新应新增明确来源记录并检查差异，不就地改锁或退回浮动版本。
