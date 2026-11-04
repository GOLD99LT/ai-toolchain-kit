# 基础工程实现独立评审

日期：2026-11-05（Asia/Shanghai）。范围：规划与校验核心、PowerShell 入口、来源数据、示例 profile、合成代码试点和用户文档。

独立审阅者只读代码并运行了隔离在 `.local/tests` 的测试，没有安装工具、修改真实客户端配置或参与实现。

## 初轮发现与处理

| 编号 | 程度 | 发现 | 修正与回归 |
| --- | --- | --- | --- |
| R1 | Important | npm-shrinkwrap.json 可覆盖已检查的 package-lock.json | 拒绝额外 shrinkwrap；冲突样例先失败，再通过 |
| R2 | Important | 根 manifest/lock 可以加入额外 dev/optional/workspace 等入口 | 根字段白名单及唯一 dependencies 检查；覆盖额外依赖入口 |
| R3 | Important | `.local/reports` junction 可指向仓库公开目录 | 拒绝 `.local` 自身链接，实际目标必须在真实 `.local` 内；新增不存在子目录场景 |
| R4 | Important | pilot 未要求来源 npm + locked | 统一执行前来源检查，候选状态不能运行已安装包 |
| R5 | Minor | 文档仅给裸 repomix 命令，不适合项目内安装 | README 增加完整 pilot-repomix.ps1 入口与输出解释 |

主任务另修复 PowerShell 5.1 保存报告的模块入口误判，新增 UTF-8 stdin 回归；运行时控制文件的路径也增加了真实路径边界检查。

## 限定复审结论

原四项 Important 全部闭合，复审范围内未发现新增回归。独立复跑结果：37 项测试，36 通过、0 失败、1 跳过。

跳过的是本机无法创建文件 symlink 的场景；目录 junction 的跨边界测试已真实执行。不能将这个跳过项标作运行通过。

主任务额外实际执行了 Windows PowerShell 5.1/PowerShell 7、固定 CLI 版本验证、重复安装跳过与 Repomix 14 文件/28 条源码内容试点。独立复审没有重复安装这些工具；其审阅结论不冒充这部分运行结果的第三方复测。

CC Switch 升级和备份验证由主任务另行记录在 [验证报告](../validation/2026-11-05-foundation-and-pilot.md)。双端 agent 任务与完整隔离恢复仍未验证。
