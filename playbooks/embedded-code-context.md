# 嵌入式代码阅读与可控上下文

适用任务：接手 STM32/Keil 风格的小模块、梳理初始化/IRQ/回调、分析一处代码改动。输出是带源文件依据的阅读记录和可选材料包，不替代构建、链接或板上验证。

## 输入与基线

1. 优先使用 [原创合成样例](../examples/stm32-context/README.md)，真实工程需先确认允许处理范围。记录源目录、提交、文件编码、include 与宏配置。
2. 在不使用候选工具时直接阅读，回答：C 入口在哪里、初始化按什么顺序、IRQ 如何到回调、弱/强符号怎样区分、两个同名 static 是否独立、关闭宏后哪些路径消失。
3. 记录每个答案的文件与符号、用时、不能确定的部分。把已知答案留给验收者；本轮合成样例的 EXPECTED.md/expected.json 是核查依据。
4. 读取 code-context profile 并生成计划；只在明确授权安装后执行 -Apply，固定运行时的安装由主任务完成。

## Repomix 材料保留试点

按样例配置选择输入，使用已固定安装的本地入口，从仓库根目录执行。输出目录应已存在或由调用者在授权范围建立：

```powershell
node runtime/repomix/node_modules/repomix/bin/repomix.cjs examples/stm32-context --config examples/stm32-context/repomix.config.json --output .local/stm32-context.xml
```

此命令只说明已安装工具的使用，本流程不自动安装任何东西。配置采用 XML 风格原文，不能当成已经转义的严格 XML。检查真实输出里每个文件的内容块，并在对应文件块中检查 expected.json 的片段；不要只搜索全文或目录树。样例配置含说明和答案文件，因此它适合材料保留检查，不直接作为盲测模型答题输入。

如比较模型理解效果，为两个客户端提供相同的代码/配置子集，去掉已知答案及含答案的说明文件，单独记录输入清单。源码中的必要注释继续保留。检查中文注释、宏、函数体和同名 static 的上下文，记录输出大小、耗时、遗漏与人工修正。旧 GBK 工程需额外样例，UTF-8 合成样例不能证明其可用。

## 分别验证宿主任务

在 Codex、DSH 中分别让助手读取同一输入并回答基线问题，每个结论附路径/符号和无法推断的边界。CLI 不提供技能入口时，“agent 发现”记录为不适用/未验证，不能伪造发现成功；实际读取和答题仍须单独完成。

记录 `code-context-pilot-v1`、包/输入版本、客户端、问题、答案、来源、遗漏、错误、人工步骤、模型费用。两个客户端结果分别存在，不能把一次 CLI 打包结果当作双端成功。Skills CLI 的验证另记 `skill-management-smoke-v1`，不因 Repomix 成功而通过。

## 何时再加工具

需要图形导览再按 [Understand-Anything recipe](../recipes/understand-anything.md) 在完整隔离环境试点；记录实际分析目录并检查 worktree 源范围。需要符号引用且编译参数齐全再试 [Serena](../recipes/serena.md)，等待索引完成后才解释空结果。[GitNexus](../recipes/gitnexus.md) 的工作用途及 Windows 条件未解决前保持暂缓。

最终报告分别给出材料完整性、每个客户端问答、真实工程编译、硬件验证和恢复演练状态。未进行的项写未执行，不计算没有数据支持的提效百分比。
