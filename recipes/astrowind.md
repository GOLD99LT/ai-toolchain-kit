# AstroWind：展示页与博客模板

source_id：`astrowind-upstream`；owner：`website-project-package-manager`；status：candidate。观察版本 v1.0.0-beta.65，仓库迁至 arthelokyo/astrowind，v1 处于维护模式。

来源：[上游](https://github.com/arthelokyo/astrowind)、[导航样式问题 #732](https://github.com/arthelokyo/astrowind/issues/732)、[研究记录](../docs/research/2026-11-04-task-project-catalog.md)。

依赖：Windows 上的 Node/npm、Git、浏览器；Node 精确要求以选定提交 package.json 为准，先检查 lockfile 与脚本。静态构建产物不要求部署端常驻 Node/Docker。需要账号/数据库/交易时先重新选型。

1. 在网站自己的目录选定官方 tag/完整提交，记录模板来源及起始提交；本工具链仓库不收整套模板。
2. 审阅 package.json 和锁文件，按其固定依赖安装及原生构建路线操作。开发端口以该项目配置为准，避免与已有服务冲突。
3. 让现有 Codex 或 DSH 修改普通项目文件，替换文案和资源，不声称安装了专用 agent 插件。
4. 构建后检查主页、博客、移动导航、链接、图片替代文字、中文字体及窄屏溢出；特别核对局部样式覆盖。
5. 根据实际构建产物选择托管方式，先本地验收，再决定部署。运行配置、凭据与域名不进模板示例。

更新由网站自己的 Git/包管理器执行，审阅模板差异和重新构建；Skills CLI、CC Switch 不维护网站依赖。
