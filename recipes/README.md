# 接入步骤与责任边界

这些 recipe 基于 2026-11-04 已有研究和 2026-11-05 批准的固定来源。除两个 npm CLI 的固定安装入口外，其他项目均为原生/人工接入指南，未执行、未承诺可精确恢复。安装前查看对应官方版本说明，不执行动态 latest 或远端脚本一键管道。

| implementation_id | owner | recipe |
| --- | --- | --- |
| skills-cli | npm-project-runtime；其管理的普通技能由 Skills CLI 负责 | [Skills CLI](skills-cli.md) |
| repomix | npm-project-runtime | [Repomix](repomix.md) |
| cc-switch | cc-switch-native | [CC Switch](cc-switch.md) |
| local-grilling | user-private-skills | [本地 grilling](local-grilling.md) |
| host-office | codex-native-plugin-manager | [宿主办公](host-office.md) |
| understand-anything | understand-anything-native | [Understand-Anything](understand-anything.md) |
| serena | serena-native | [Serena](serena.md) |
| gitnexus | gitnexus-native | [GitNexus](gitnexus.md) |
| docling | docling-python-environment | [Docling](docling.md) |
| presenton | presenton-native | [Presenton](presenton.md) |
| astrowind | website-project-package-manager | [AstroWind](astrowind.md) |
| bolt-diy | bolt-diy-project-package-manager | [bolt.diy](bolt-diy.md) |
| crawl4ai | crawl4ai-python-environment | [Crawl4AI](crawl4ai.md) |
| firecrawl | firecrawl-native-service | [Firecrawl](firecrawl.md) |
| coolify | coolify-server-native | [Coolify](coolify.md) |
| dokploy | dokploy-server-native | [Dokploy](dokploy.md) |

执行前记录实际版本、目标目录、已有同名内容、依赖、数据离开本机的路径和更新负责人。未确定的路径、技能名、端口在候选指南中明确列为待核查，不能猜值执行。查看目录本身不安装包、不拉模型、不连接远端。

报告分开填写来源可核查、installed、CLI-checked、agent-discovered、task-passed、恢复演练，并列出未执行项。文件校验通过不等于业务能力通过。源码/许可/问题依据统一追溯至 [项目研究](../docs/research/2026-11-04-task-project-catalog.md) 或各 recipe 指定的专题记录。
