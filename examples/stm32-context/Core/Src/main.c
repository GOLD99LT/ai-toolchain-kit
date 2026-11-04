#include "app_config.h"
#include "app_led.h"
#include "app_uart.h"
#include "stm32xx_it.h"

/* 合成分析样例：不可直接烧录，不包含真实 STM32 启动代码。 */
UART_HandleTypeDef huart2;

#if APP_UART_ENABLED
static void MX_USART2_UART_Init(void)
{
    huart2.Instance = MOCK_USART2_ID;
    huart2.BaudRate = APP_UART_BAUDRATE;
    HAL_UART_Init(&huart2);
}
#endif

int main(void)
{
    HAL_Init();
#if APP_LED_ENABLED
    AppLed_Init();
#endif
#if APP_UART_ENABLED
    MX_USART2_UART_Init();
    AppUart_Init();

    /* 显式模拟一次接收事件；不会等待硬件或进入固件主循环。 */
    USART2_IRQHandler();
#endif
    return 0;
}
