# 手工核查问题与答案

以下答案以默认宏为准，均可直接阅读源文件验证。本目录是合成分析样例，不可直接烧录；这些预期不能代替链接、运行或硬件验证。

| 问题 | 答案及代码位置 |
| --- | --- |
| 启动入口在哪里？有 `Reset_Handler` 吗？ | C 入口是 `Core/Src/main.c` 的 `int main(void)`。没有 `Reset_Handler`、启动汇编或向量表，不应补写真实 MCU 的启动链。 |
| 初始化按什么顺序执行？ | `main.c` 依次调用 `HAL_Init`、`AppLed_Init`、`MX_USART2_UART_Init`、`AppUart_Init`，然后显式调用一次 `USART2_IRQHandler`，最后返回 `0`。 |
| 默认启用了什么宏？串口配置是什么？ | `Core/Inc/app_config.h` 的 `APP_UART_ENABLED=1`、`APP_LED_ENABLED=1`；`APP_UART_BAUDRATE=115200U`。`MX_USART2_UART_Init` 将波特率写入 `huart2.BaudRate`，外设用合成标识 `MOCK_USART2_ID=2U`，不是寄存器地址。 |
| 如何关闭模块？ | 在编译参数中用 `-DAPP_UART_ENABLED=0` 或 `-DAPP_LED_ENABLED=0`，头文件的 `#ifndef` 保留命令行设置。UART 关闭时其应用定义、主函数初始化和模拟 IRQ 调用被移除，IRQ 函数体为空，mock 弱回调仍存在。LED 关闭时其应用定义、初始化及 UART 到 LED 的调用被移除，UART 仍可计数与重新挂接接收。两者均关闭也可做语法检查。 |
| 共享串口句柄在哪里定义？ | `main.c` 定义 `UART_HandleTypeDef huart2`，`Core/Inc/app_uart.h` 通过 `extern` 声明，IRQ 与应用层引用同一对象。 |
| IRQ 怎样到达业务逻辑？ | `main.c:main` → `stm32xx_it.c:USART2_IRQHandler` → `mock_hal.c:HAL_UART_IRQHandler(&huart2)` → `app_uart.c:HAL_UART_RxCpltCallback` → `AppUart_OnByte` → `app_led.c:AppLed_Toggle` → `mock_hal.c:HAL_GPIO_WritePin`。必须区分 HAL handler 和应用回调所在文件。 |
| 接收数据从哪里来？是否访问串口？ | `mock_hal.c` 将 `APP_MOCK_RX_BYTE`（默认 `'T'`）写入 `rx_target` 指向的字节；不访问硬件。未挂接接收缓冲区或句柄为空时，HAL handler 直接返回。 |
| 哪个是弱回调，哪个是强回调？ | `mock_hal.c` 的 `MOCK_WEAK void HAL_UART_RxCpltCallback(...)` 是无业务行为的弱默认实现；`app_uart.c` 的同名定义不带 `MOCK_WEAK`，是应用强回调。`mock_hal.h` 的声明也不带弱属性。需要支持该弱符号规则的工具链进行链接；语法检查本身不能证明覆盖生效。 |
| 强回调是否处理任何句柄？ | 否。`app_uart.c` 首先检查 `huart != &huart2` 并返回，只接受本应用对象。 |
| 完成一次接收后，为什么还能接收？ | `AppUart_Init` 首次调用 `HAL_UART_Receive_IT`。HAL handler 写入后先将 `rx_target` 清空再调用回调；强回调处理字节后再次调用 `HAL_UART_Receive_IT(&huart2, &rx_byte, 1U)`，重新挂接同一持久缓冲区。重新挂接不会自行触发下一次 IRQ。 |
| 什么命令控制 LED？默认事件后的预期状态是什么？ | `AppUart_OnByte` 每次将 `rx_count` 加一；仅收到 `APP_LED_TOGGLE_BYTE`（默认 `'T'`）且 LED 启用时调用 `AppLed_Toggle`。默认单次事件后计数为 `1`，`AppLed_IsOn()` 与 `MockHAL_LedLevel()` 均为 `1`。 |
| 两个 `reset_state` 会冲突或互相调用吗？ | 不会。`app_uart.c` 的 `static void reset_state(void)` 清零 `rx_byte` 和 `rx_count`，只被该文件的 `AppUart_Init` 调用；`app_led.c` 的同名 `static` 函数清零 `led_on` 并写 mock GPIO，只被该文件的 `AppLed_Init` 调用。两者都是文件内的内部链接符号，必须按“文件 + 名称”区分。 |
| 如何确认中文注释与函数体没有被压缩丢弃？ | 按 `expected.json` 中每条 `file` 定位实际 bundle 的文件内容块，再逐项核对 `needle`，包括中文注释、函数体语句、宏和跨行片段；只找到函数名或目录树不算通过。 |

`expected.json` 的 `schema_version` 固定为 `1`。`files` 列出应进入 bundle 的所有 14 个文件，包括文档与配置；`facts` 只把代码文件中的字面片段作为证据。不要在其他文件或答案文档中找到片段后代替指定源文件的验证。

这些人工答案描述预期行为；真实 bundle 核查结果由主任务记录，不能用本地源文件的匹配结果代替。
