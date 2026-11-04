# Understand-Anything：完整项目候选

source_id：`understand-anything-upstream`；owner：`understand-anything-native`；status：candidate。只使用该项目受支持的完整安装/构建路线，Skills CLI 与 CC Switch 不接管它的技能或插件目录。

依据：[专项研究](../docs/research/2026-11-04-understand-anything-assessment.md)、[固定观察提交的 Windows 安装器](https://github.com/Egonex-AI/Understand-Anything/blob/4e6d3299017a7432da15957874992837a315c5b4/install.ps1)。观察到的提交是 `4e6d3299017a7432da15957874992837a315c5b4`、插件 package.json 为 2.9.8；官方安装器默认克隆/拉取，尚未验证按此提交精确恢复。

依赖：初次分析 Node.js >=22、pnpm >=10、core 构建、插件代理/模型配置；Windows install.ps1 可用路线有文档证据，内部 Bash 片段仍需实测。已有图文件的只读 viewer 文档要求 Node >=18 且不调用模型，这些条件不能用于初次分析。

1. 使用独立 Windows 用户/虚拟机等完整隔离环境；不可用就保留安装待执行。
2. 本地审阅选定安装器，列出专属插件根、全部技能名、共享 .agents/skills 链接、构建输出、viewer 端口与更新行为。具体名称/端口尚未完整登记，执行前从所选版本核对。
3. 盘点冲突后按官方原生路线安装，记录实际提交、依赖及模型设置；固定恢复做不到时仍保留 upstream-guided。
4. 用普通 checkout 的合成小样例做初次分析，记录真实源范围与提交。若使用 worktree，用分支独有文件检查 #739 所述漏扫条件。
5. 用入口、初始化、IRQ/回调、同名 static、宏配置等已知答案核对图关系，保留源文件依据、错误和模型成本。

Codex 有上游接入路线；DSH 原生接入尚未证明发布。Codex 安装也会进入共享技能目录，可能同时被 DSH 发现；不可承诺仅向 Codex 暴露。分别记录入口可见与流水线成功。首次分析可能把源码交给配置模型，图文件只读本地查看的边界不能套用到分析阶段。
