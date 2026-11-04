# STM32 风格的合成代码分析样例

这是原创、很小的**合成分析样例，不可直接烧录**。它用于核查代码上下文工具是否保留入口、配置宏、跨文件调用、回调、中文注释和 `static` 作用域。未使用真实工程、厂商 HAL 源码、板级资料或私有数据，也不表示用户授权使用任何真实工程。

这里只模仿 `Core/Inc`、`Core/Src` 的组织方式与部分 HAL 名称。`mock_hal` 用内存变量模拟串口和 LED；接口经过缩减，不是厂商 HAL 的替代实现。没有启动汇编、向量表、链接脚本、时钟树、寄存器访问或硬件中断配置。

## 阅读顺序

1. `Core/Inc/app_config.h`：UART、LED 的启用开关，以及波特率、命令字符等配置。
2. `Core/Src/main.c`：本样例的 C 入口、初始化顺序以及一次显式调用的模拟 IRQ。
3. `Core/Src/stm32xx_it.c` 与 `Core/Src/mock_hal.c`：IRQ 转发、单字节接收和弱默认回调。
4. `Core/Src/app_uart.c`：强回调、接收计数、命令分派、重新挂接接收缓冲区。
5. `Core/Src/app_led.c`：LED 私有状态；其 `reset_state` 与 UART 模块同名但作用域独立。
6. `EXPECTED.md` 与 `expected.json`：人工问题/答案，以及逐文件的字面片段核查契约。

默认路径如下，所有步骤都能在源码中找到：

```text
main
  -> HAL_Init -> AppLed_Init -> MX_USART2_UART_Init -> AppUart_Init
  -> USART2_IRQHandler
     -> HAL_UART_IRQHandler(&huart2)
        -> 模拟写入 'T'，清除当前接收缓冲区指针
        -> HAL_UART_RxCpltCallback          [app_uart.c 的强定义]
           -> AppUart_OnByte -> AppLed_Toggle -> HAL_GPIO_WritePin
           -> HAL_UART_Receive_IT          [重新挂接下一次接收]
```

`main` 只模拟一次事件，随后返回 `0`。按默认代码推导，此时接收计数为 `1`、应用 LED 状态与 mock GPIO 状态均为 `1`。这是手工可核查的预期，不是已验证的固件行为。模拟事件不会自动产生第二次 IRQ，也不模拟真实异步接收、时序、并发或错误恢复。

## 编译边界与语法检查

本样例使用 C11，以及 GCC/Clang 的 `__attribute__((weak))`，用于明确展示弱默认回调和应用强定义。头文件中的回调声明不带弱属性。UART 或 LED 开关设为 `0` 时，对应应用定义与调用被条件编译移除；IRQ 入口仍保留。

如果本机已有支持这些语法的 GCC，可在本目录执行下面的 PowerShell 命令；它只做语法检查，不生成固件或可执行文件，也不安装工具：

```powershell
$sources = @(Get-ChildItem -LiteralPath Core/Src -Filter *.c | ForEach-Object { $_.FullName })
gcc -std=c11 -Wall -Wextra -Werror -pedantic -finput-charset=UTF-8 -fsyntax-only -I Core/Inc @sources
if ($LASTEXITCODE -ne 0) { throw 'C syntax check failed' }
```

也可在编译参数中加入 `-DAPP_UART_ENABLED=0` 或 `-DAPP_LED_ENABLED=0` 检查关闭分支。没有编译器时，只报告文件与片段检查结果。语法检查不验证链接时的弱/强符号选择，更不证明硬件正确性。

## Repomix 调用约定

`repomix.config.json` 采用官方常规字段：顶层 `include` 选择 `Core/**` 和本目录的四个文档/配置文件，`input.maxFileSize` 限制单文件大小。输出采用 XML 风格，保留注释与空行，不压缩，不添加行号，不转义代码片段，不附加 Git diff 或日志。忽略 `.local`、构建产物及常见的 Repomix 输出文件。

配置**不设置 `output.filePath`**。调用者必须显式提供仓库根目录下的 `.local/...` 输出路径，避免落入公开输入目录。由主任务用已经批准安装的 Repomix 入口从仓库根目录调用，形如：

```powershell
repomix examples/stm32-context --config examples/stm32-context/repomix.config.json --output .local/stm32-context.xml
```

此命令只是接口示例，要求调用者已有对应可执行入口和输出目录；本样例不提供下载安装步骤。

`expected.json` 的所有 `files` 与 `facts[].file` 都相对于本样例根目录。每个 `needle` 都是该源文件中的字面片段（JSON 中的 `\n` 表示换行）。核查实际 bundle 时，应先定位该路径的文件内容块，再匹配对应片段；不能仅在整个 bundle 中搜索，因为 `expected.json` 本身也包含这些答案。文件清单必须逐项对应到实际内容块，不能仅以目录树出现路径为准。

保留 XML 风格的默认原文输出，便于直接匹配含 `&`、`<` 等字符的 C 代码；不要把它当作已经转义的严格 XML。比较换行时可统一 CRLF/LF，不能跳过文件归属或缺失内容。文件和片段齐全只证明上下文保留情况，不自动证明模型答题正确。

样例自身不执行 Repomix。实际 bundle 的生成与逐项保留验证由主任务负责，并应单独报告结果。
