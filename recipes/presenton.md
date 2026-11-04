# Presenton：公司 PPT 比较试点

source_id：`presenton-upstream`；owner：`presenton-native`；status：candidate。观察版本 v0.9.12-beta；公司模板效果和 Windows 导出待验证。

来源：[项目](https://github.com/presenton/presenton)、[官方下载入口](https://presenton.ai/download)、[模板重建说明](https://docs.presenton.ai/user-guide/template-creation)、[导出问题 #992](https://github.com/presenton/presenton/issues/992)。

依赖：选定 Windows 桌面发布及其运行组件、中文字体、模型 API 或 Ollama/LM Studio 端点；图片服务单独配置。Docker 是替代路线，不因试用桌面版默认安装 Docker。下载页可能变化，实际试点需明确发布文件、版本和校验，不能把页面入口当锁。

1. 先用宿主办公完成同一份 5–8 页合成报告作为参照。
2. 通过官方原生安装方式获取选定版本，登记应用数据目录、模型/图片端点、更新策略；私有 API key 只保留在原生设置。
3. 用一份有内容且允许使用的 PPTX 重建模板，对比字体、颜色、页眉页脚、图表和母版行为。
4. 导出 PPTX 并用目标办公软件打开，检查文本/图表可编辑、元素未错位；再看逐页渲染/PDF。记录一次修改所需时间与返工次数。
5. 导出失败保存脱敏日志和原输入，判失败，不因预览界面正常而报通过。

Windows 0.9.11-beta 曾有导出问题报告，不能直接推断其他版本结果。Codex/DSH 均无本目录确认的原生接入，产品在外部 UI 使用。模板、生成内容和模型请求的数据边界需按实际端点确认。
