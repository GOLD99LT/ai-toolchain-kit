# Superpowers 适配 DeepSeek Harness：社区先例与选型评审

研究日期：2026-11-07（Asia/Shanghai）。本页记录选型依据；本机安装与模型任务结果应查本轮执行记录，不能从本页的源码检查推断为已经成功运行。

## 结论

社区已经有多套 DSH 原生移植。推荐复用 [codeAnqiang-ma/dsh-superpowers 的固定提交 `65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9`](https://github.com/codeAnqiang-ma/dsh-superpowers/tree/65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9)，通过 DSH 自己的插件入口安装，再对本机版本做实际会话验收。

该提交只依赖 Node 内置模块，随包携带技能、工具映射和会话 bootstrap，能同时覆盖“看得见技能”和“新会话主动调用技能”。无需自研同步管理器，也无需将 Codex 插件缓存里的文件复制到 DSH 或修改用户全局提示词。DSH 插件由 DSH 管理；Codex 原生 Superpowers 插件仍由 Codex 管理。

这里选择的是 **Git 固定提交**，不是 npm 上同名的 `dsh-superpowers@0.1.0`。两者的 `package.json` 版本号相同，内容与上游技能版本却不同，必须以安装来源、提交和实际产物区分。

## 研究范围与证据等级

实际检查了 GitHub 仓库、open/closed issue、上游 PR、review/comment，以及 npm registry manifest 和三个精确版本 tarball。下载的 tarball 在内存中按 registry 的 SHA-512 `integrity` 核对后读取，没有运行其生命周期脚本。

本轮未获得可核实的 Reddit、Hacker News 或中文论坛独立运行报告，因此不以“全社区共识”表述结论。Stars 仅能说明关注度，不能证明自动触发、Windows 兼容或本机成功。

证据需要分别理解：

- **源码与产物事实**：本轮直接读取的 manifest、入口、许可、技能目录和测试文件。
- **社区运行报告**：报告者描述的版本、模型和现象；没有在本机复现前不升级为本机结论。
- **本机任务验收**：安装后的真实 DSH 与真实模型会话，必须另存日期、版本、工具事件和结果。

## 三个主要候选

| 候选及检查版本 | 实际实现 | 许可与依赖 | 评审结论 |
| --- | --- | --- | --- |
| [`codeAnqiang-ma/dsh-superpowers`](https://github.com/codeAnqiang-ma/dsh-superpowers)，Git `65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9` | `dsh.bundle`；`ctx.skills.register()`；`ctx.systemPrompt.section()` 注入 `using-superpowers` 与映射；实际 15 技能 | 零第三方运行时依赖；有 MIT `LICENSE` 和保留 Jesse Vincent 署名的 `LICENSE.superpowers` | 推荐。2026-11-07 补齐 Windows、子代理和工具名差异，范围最小；仍须本机验收 |
| 同仓库 npm **`dsh-superpowers@0.1.0`**，发布于 2026-08-13 | 同样有 bootstrap，但技能实际来自上游 **6.3.0**，映射仍把 shell 写为 `bash`，缺少后来对子代理与 Windows 的修正 | 零第三方运行时依赖；tarball 包含两份 MIT 许可；Node `^22.19.0 || >=24.0.0` | 不作为本轮安装候选。不能把新 Git 提交的评审套用到旧 npm 包 |
| [`LayneChai/superpowers-dsh`](https://github.com/LayneChai/superpowers-dsh)，npm **`superpowers-dsh@0.4.0`**；仓库观察提交 `cc0c87f3a7a8627b175465f36a99e971e7eed507` | 15 技能，上游 v7.0.1；`registerProvider()`，rank 550；原生 bundle；提供真实 registry 兼容性检查脚本 | 零第三方运行时依赖；manifest/README 声明 MIT，但检查的 npm tarball **没有 LICENSE 文件**，仓库根目录也未见 LICENSE | 借鉴来源同步、同名优先级和 SDK 检查。入口仅 `inject=['skills']`，没有会话 bootstrap；不能仅凭可见技能认定自动触发通过 |
| [`Wenaixi/dsh-superpower`](https://github.com/Wenaixi/dsh-superpower)，npm **`@wenaixi/dsh-superpower@8.0.0`** | 15 技能；双语描述、每技能开关、Web UI；provider rank 10；入口只注入 `skills` | tarball 有 MIT 许可；依赖 `yaml` 及多个 DSH/UI peer；固定 npm 包与当前 Git manifest 的兼容范围也有差别 | 功能较多，作为后续 UI 管理备选。rank 10 会压过同层项目/用户同名技能，依赖面较大，本轮不引入 |

表中“仓库观察提交”只是研究时观察到的状态，不等于安装已经锁定。推荐提交的来源锁定、下载摘要与安装后回读需在执行记录中落实。

### npm 产物核查记录

以下值来自 2026-11-07 对 npm registry 的精确版本查询，并与下载 tarball 实际计算结果一致，仅供辨认已评审产物，不是安装 `latest` 的指令。

| 包 | 精确版本 | `dist.integrity` |
| --- | --- | --- |
| `dsh-superpowers` | `0.1.0` | `sha512-/BT4/Kb93rav1sgcw67Kz40BHyA6oL9t91JyL6Eubs3oSBYIN0BQpRXwmz1cMBY2HidTmee8XfPHEmRsd9xHjQ==` |
| `superpowers-dsh` | `0.4.0` | `sha512-1F8W6mc26ic9N5HjjoKJDO1LWWFJAqGEda2pNetmiqgkrjYC1lP9L4udFGBGGre7C6uC+feLokNsobepQnH15Q==` |
| `@wenaixi/dsh-superpower` | `8.0.0` | `sha512-hoG7SDKQxrNZR294HT11whzPiA2GhIwh7Wk8pm1vueFfyxVwMcW3L7qY0pN3CQmIgqhWNUio9P94R1I/p/H4sQ==` |

Registry 来源：[dsh-superpowers/0.1.0](https://registry.npmjs.org/dsh-superpowers/0.1.0)、[superpowers-dsh/0.4.0](https://registry.npmjs.org/superpowers-dsh/0.4.0)、[@wenaixi/dsh-superpower/8.0.0](https://registry.npmjs.org/@wenaixi%2Fdsh-superpower/8.0.0)。

## 上游 PR 与可借鉴的社区经验

### 原生插件路线已有上游评审

[obra/superpowers PR #2144：feat: add DeepSeek Harness (dsh) support](https://github.com/obra/superpowers/pull/2144)，2026-08-13 创建，2026-11-07 仍为 open、未合并。它与推荐独立仓库由同一作者维护，但两份产物及测试不能混同。

[上游 collaborator 的 review](https://github.com/obra/superpowers/pull/2144#pullrequestreview-4931289534)认可 `dsh plugin` 的原生安装方向，同时要求补齐两类真实差异：

- DSH 没有命名子代理类型，应把角色、任务和上下文写进 `subagent` 提示词；`todo_write` 每次替换整个列表；技能名使用裸名 `brainstorming`，不使用 `superpowers:` 前缀。
- `ctx.skills.register()` 是 runtime rank 250，`source: 'bundled'` 是显示元数据，不会把其注册优先级改为 600。不能承诺“所有用户目录同名技能都优先”。同层项目根 100/200 可以优先于它，用户根 400/500 可能被其覆盖，preset 分层还会影响结果。

维护者随后直接提供了工具映射与文档修正提交：[2026-08-13 跟进](https://github.com/obra/superpowers/pull/2144#issuecomment-5286073065)。这说明不是只有作者自述，但仍不等于上游已经合并或保证所有版本兼容。

### “能复述规则”不等于调用了技能

[2026-08-22 模型差异报告](https://github.com/obra/superpowers/pull/2144#issuecomment-5377012081)使用 DSH `0.1.0-rc.8`、`deepseek-v4-flash-vision-exp`：bootstrap、14 个技能均可见，模型也能复述规则，但面对自然需求只口头模拟 brainstorming，没有调用 `skill`。

[2026-09-04 Windows 用户报告](https://github.com/obra/superpowers/pull/2144#issuecomment-5544090457)在 DSH `0.1.1-rc.2` 的另一条兄弟分支上报告了真实 `skill("brainstorming")` 首调用。它支持该机制可行，但测试的是兄弟分支与当时版本，不能直接证明推荐提交在本机通过。

[2026-09-27 GLM-5.3 对照报告](https://github.com/obra/superpowers/pull/2144#issuecomment-5856009836)比较原上游与适配分支：原上游安装仅成为普通依赖并直接搭脚手架，适配后先调 brainstorming、未写代码。这解释了为什么不能用 `npm install` 成功代替原生 bundle 与行为验收。报告披露了由 agent 执行、human 审核的身份与环境，引用时保留该局限。

### Windows 和长任务的具体经验

[2026-10-02 Windows DSH `0.2.0-rc.2` 报告](https://github.com/obra/superpowers/pull/2144#issuecomment-5958934834)来自独立移植的两次长任务，其中一次 13 项任务、37 个子代理；报告者明确表示没有运行该 PR 分支。可借鉴的平台现象包括：

- Windows shell 是 `pwsh`；部分 sandbox 下 MSYS Bash 启动失败，需改用 PowerShell。sandbox 外运行 Git Bash 辅助脚本时使用 `Git\bin\bash.exe`，不能把 `Git\usr\bin\bash.exe` 当作同等入口。
- `node --test` 若遇 Windows sandbox 的子进程 `spawn EPERM`，可尝试当前 Node 支持的 `--test-isolation=none`，Node 22 对应实验参数另查该版本支持情况。
- 已结束子代理不能用 `send_message` 继续；需给新子代理传入任务、上次报告与待改项。默认 delegation depth 为 1，子代理不能继续派生。
- 每子代理的模型选择默认关闭，不能在技能中假设一定可用。

本机复核补充（DSH `0.2.1-rc.2`）：上述“已结束不能继续、深度固定 1”是当时报告的边界，不能泛化到新版。本机工具实现支持恢复本地 direct continuable child，one-shot/external child 另论；深度与 preset 选择受实际配置和权限约束。推荐固定插件的 bootstrap 仍含旧描述，使用时以当前工具 schema/运行时策略为准，真实子代理验收见 [本轮记录](../validation/2026-11-07-superpowers-dsh.md)。

这些差异已进入推荐提交的[内联映射](https://github.com/codeAnqiang-ma/dsh-superpowers/blob/65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9/index.js)和 [dsh-tools.md](https://github.com/codeAnqiang-ma/dsh-superpowers/blob/65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9/skills/using-superpowers/references/dsh-tools.md)。它们是故障处理线索，不应为了预防假想故障提前更改 sandbox 或用户设置。

### 安装后要重启并使用新会话

[LayneChai issue #5](https://github.com/LayneChai/superpowers-dsh/issues/5)记录 DSH Desktop 旧会话未显示新技能，作者建议重启，提问者随后确认。验收应使用重启后的新会话。

[issue #3](https://github.com/LayneChai/superpowers-dsh/issues/3)报告 renderer 超时，作者答复为 DSH 原因、升级可解；没有充分诊断或具体修复版本，不能据此归因本机问题，也不能把“关闭 issue”当作所有环境已解决。

## 推荐提交的逐项评审

固定来源：[commit `65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9`](https://github.com/codeAnqiang-ma/dsh-superpowers/commit/65c8ee8a5f87b0b16b44ceeca8bc10a48cec2ec9)。其 manifest 记录上游 v7.0.2、提交 `df2e996a174f49f05aa5d5777ca56fbb0aa972ec`。

| 评审点 | 直接观察 | 执行约束 |
| --- | --- | --- |
| 原生安装 | `package.json` 声明 `dsh.bundle.patch`，patch 插入 `id: superpowers`、`name: dsh-superpowers` | 使用 DSH 原生插件命令；安装后回读真实 profile 层 |
| 技能发现 | 扫描 `skills/*/SKILL.md`；校验 name/description/body、重复名；注册 `resourceBase` | 本机真实 registry 应能列出并取回全部技能及相对资源 |
| bootstrap | 通过 `ctx.systemPrompt.section` 注入完整 `using-superpowers` 正文和映射，默认 order 50 | 证明它进了真实模型请求，而非仅 mock 注册成功 |
| 修改范围 | 插件只导入 Node 内置模块；无 install/prepare 生命周期脚本；无任意外部命令执行 | 保存固定提交；不扩为自研部署层 |
| 许可 | 完整 MIT 许可及上游 Jesse Vincent 版权许可均存在 | 第三方源码、图片、下载留在忽略的本地目录，不自动复制进本仓库 |
| 文档漂移 | README 仍称 14 技能，但目录和测试要求 15；LICENSE 尾注仍称上游 6.3.0，manifest/commit 已更新至 7.0.2 | 记录差异，以实际产物与提交为准；不能悄悄改写第三方来源历史 |
| 测试边界 | 独立仓库 `test/index.test.js` 有 4 个测试，采用 mock context；上游 PR 另有 11 项与 pack 检查的报告 | 只报告实际运行的测试；mock 通过不替代真实 registry/模型验收 |

### bootstrap 的 system/user 差异

上游固定版本的[移植指南](https://github.com/obra/superpowers/blob/df2e996a174f49f05aa5d5777ca56fbb0aa972ec/docs/porting-to-a-new-harness.md)对 Shape B 明确建议以 **user message** 注入，附录提醒不要随意改为 system message。推荐适配器使用 DSH 原生 **system prompt section**，这是与通用指南的实质差异，不能写成“完全照搬上游规范”。

[PR 作者的方案说明](https://github.com/obra/superpowers/pull/2144)认为 DSH 合并为单条系统消息，静态 section 更符合其 API，也有利于缓存与上下文压缩后保留；order 50 在 persona 后、工具指导前。社区 review 没有否定机制，后续报告也提供了实际调用证据，但 PR 尚未合并。

本轮取舍是保留现成插件的这项设计，核对本机 DSH API，并以自然语言任务验证实际行为。不得由“注册了 section”推导所有模型、压缩后会话或全部技能均通过。若实际无法触发，先保留失败证据、定位注入或模型调用问题；不要用修改全局 AGENTS.md、反复提示“必须先用技能”或复制 skill 文件掩盖失败。

## 本机验收规则

按照上游 definition of done 和本项目状态分层，分别报告：

1. **来源锁定**：固定 Git commit 或精确 npm version + integrity；记录实际产物。`observed_commit` 本身不是安装锁。
2. **installed**：DSH 原生安装完成，真实目标 profile 包依赖和 bundle 声明可回读。
3. **CLI-checked**：真实 `--dump-config` 能合成目标层，没有配置解析错误；版本与启动入口明确。实际注册与运行时加载另验，不能仅凭 dump 判断。
4. **agent-discovered**：真实 registry/模型会话可见 15 技能，原生 `skill` 能取回正文，相对资源可定位；bootstrap 进真实上下文。
5. **task-passed**：新会话发送未点名 Superpowers 的普通功能请求，例如上游的 `Let's make a react todo list`；模型先实际调用 `skill` 加载 `brainstorming`，再澄清或设计，写代码前已有该调用。本轮采用已有合成博客项目的标签筛选请求作为等价自然任务，具体环境以验收记录为准。保存工具事件，口头复述不算通过。

在上述自动触发之外，可用简短合成调试任务或子代理任务验证相应流程；没有运行过的技能、压缩恢复、Windows Bash 辅助脚本或两端完整任务，都不标为通过。不需要为了工具选型分析真实业务工程。

## 暂不采用的扩展路线

- [EdouardRichard/dsh-superpowers-preset](https://github.com/EdouardRichard/dsh-superpowers-preset)：可选择的 Superpowers agent preset，适合只在部分会话启用；但复制标准 preset 会扩大与宿主版本的耦合，近期提交也记录了 DSH 移除 `toolFilter` 后的适配。当前优先小型原生插件。
- [daube-agent-bridge PR #21](https://github.com/daubesonntag-dotcom/daube-agent-bridge/pull/21)：同步 `.agents/skills`、来源和冲突保护值得借鉴，但额外桥接与 bootstrap 文件管理不是本轮必需。
- DeepSeek-TUI 的适配与官方 DeepSeek Harness 不是同一宿主；不能因名字都有 DeepSeek 就套用其工具 API。上游 [PR #1586](https://github.com/obra/superpowers/pull/1586) 的原生安装、目标分支和全局配置边界教训可参考，不能作为 DSH 本机成功案例。

本次公开交付只记录原创选型、中文使用经验和无密钥配置示例；账号、真实配置、日志、第三方下载及备份留在忽略的本地目录。是否在本机成功移植，以实际执行记录中的状态为准。
