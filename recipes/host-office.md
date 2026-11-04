# 宿主办公能力

source_id：`host-office`；owner：`codex-native-plugin-manager`；status：managed，恢复获取方式 pending-verification。已观察到 documents、pdf、presentations、spreadsheets 入口，但尚未核实完整插件来源、插件 ID 和恢复版本，不虚构这些字段。

依赖：当前宿主支持的原生插件获取方式、对应运行环境、中文字体及任务所需渲染/转换组件。由宿主提供的库先复用，不为目录完整而额外安装 Python、LibreOffice 或 Office。Windows 是否需要本地程序/云端运行时由该宿主真实操作路径核实。

1. 在宿主原生管理入口查看已启用能力、来源与实际版本，记录可重复的获取方式；没有入口就标为需要人工恢复。
2. 通过原生方式恢复并检查其引用资源可访问；不把缓存中的 SKILL.md 整包复制进公共仓库。
3. 运行 [办公验收流程](../playbooks/reports-and-office.md)：中文 PDF、可编辑 PPT、BOM 数量/单位/差异各自验收，保留渲染预览与源数据依据。
4. 将结果关联 `office-artifacts-v1`；只有入口可见时仅记录发现，不能标为任务通过或换机恢复成功。

目前仅声明 Codex 路线；DSH 原生插件/运行时未核实。若用户要求双端，profile 应保留 DSH 并记录缺口，不复制 source-available 办公技能冒充兼容。现有 Superpowers 等宿主插件继续由原生管理器负责，不加入重复安装项。

数据边界：真实公司模板和资料放私有目录，使用前确定模型/宿主处理位置；公开样例仅用原创合成数据。第三方技能/库保持各自许可。依据：[办公与工具比较](../docs/research/2026-11-04-tooling-comparison-v2.md)。
