# bolt.diy：可选浏览器搭站工作台

source_id：`bolt-diy-upstream`；owner：`bolt-diy-project-package-manager`；status：candidate。观察版本 v1.0.1；README 当时以修复和依赖更新为主。

来源：[上游](https://github.com/stackblitz-labs/bolt.diy)、[Docker 启动报告 #2293](https://github.com/stackblitz-labs/bolt.diy/issues/2293)、[发布产物报告 #2302](https://github.com/stackblitz-labs/bolt.diy/issues/2302)。

依赖：选定版本规定的 Node/pnpm、支持的浏览器/WebContainers，以及模型 API key 或本地模型端点；Docker 可选。精确版本、浏览器条件和开发端口从选定发布核对。项目 MIT 不代表 WebContainers 条款相同，现有聊天订阅也不代表已有 API 额度。

1. 先确认用户确实需要浏览器内聊天、预览与编辑界面。
2. 在独立项目目录选择固定版本，审阅锁文件和启动脚本；若选择 Docker，先确认该版本资产确实存在且 Windows 路线可运行，不猜镜像 tag。
3. 通过项目正式配置接入模型，密钥放私有环境；登记端点、费用与代码发送范围。
4. 用一个小型原创展示页验收生成、预览、手动编辑、导出代码及导出后的独立构建。
5. 记录启动失败、模型用量和人工修正；不只看聊天成功。

Codex/DSH 可阅读导出的代码，但本目录没有其原生集成声明。工作台自己的项目、端口、数据由它管理，不接管现有宿主设置。
