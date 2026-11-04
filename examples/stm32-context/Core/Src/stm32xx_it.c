#include "app_config.h"
#include "app_uart.h"
#include "stm32xx_it.h"

/* IRQ 层只转交句柄，业务处理交给 HAL 完成回调。 */
void USART2_IRQHandler(void)
{
#if APP_UART_ENABLED
    HAL_UART_IRQHandler(&huart2);
#endif
}
