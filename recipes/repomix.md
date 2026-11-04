# Repomix 1.18.1

source_id：`repomix-1.18.1`；owner：`npm-project-runtime`；独立运行目录：`runtime/repomix`。不额外安装常驻 MCP，不占用技能名。

依赖：Node.js >=22，仓库统一要求 >=22.20.0；npm。Windows 试点必须核对路径、选择规则及 GBK 等旧编码。依据：[项目调研](../docs/research/2026-11-04-task-project-catalog.md)、[v1.18.1](https://github.com/yamadashy/repomix/releases/tag/v1.18.1)、[编码遗漏报告 #1878](https://github.com/yamadashy/repomix/issues/1878)。

```powershell
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix
powershell -NoProfile -File scripts/setup.ps1 -ProfilePath profiles/examples/code-context.json -Only repomix -Apply
node runtime/repomix/node_modules/repomix/bin/repomix.cjs --version
node runtime/repomix/node_modules/repomix/bin/repomix.cjs --help
```

产物生成按 [合成样例](../examples/stm32-context/) 中的实际配置和说明进行，输出选在 `.local/`。先列出源文件预期集合，再核对真实包中的路径、内容、注释、条件编译及同名 static 的上下文。不得把验收答案混进代码输入后宣称模型推导正确。默认试点保留实现和注释，不因压缩而丢失关键依据。

打包本身不调用 LLM；将包交给配置的模型后，内容会按该宿主/供应商设置处理并消耗额度。Codex/DSH 的 CLI 调用路线各自验证；没有插件可发现时明确记录“不适用（CLI 路线）”，不能伪造 agent-discovered=true。任务通过必须有相应客户端实际完成的问答与代码依据。

`code-context-pilot-v1` 记录实际输入范围、输出字节数、用时、漏文件与已知答案；合成样例通过不等于旧编码、真实固件或编译/硬件验证通过。失败先检查选择配置、编码和版本；更新另建固定来源与完整性记录。
