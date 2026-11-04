#include "app_config.h"
#include "app_led.h"
#include "app_uart.h"

#if APP_UART_ENABLED
static uint8_t rx_byte;
static uint32_t rx_count;

/* UART 的私有复位函数，与 app_led.c 的同名函数互不相干。 */
static void reset_state(void)
{
    rx_byte = 0U;
    rx_count = 0U;
}

void AppUart_Init(void)
{
    reset_state();
    (void)HAL_UART_Receive_IT(&huart2, &rx_byte, 1U);
}

void AppUart_OnByte(uint8_t byte)
{
    ++rx_count;
#if APP_LED_ENABLED
    if (byte == (uint8_t)APP_LED_TOGGLE_BYTE) {
        AppLed_Toggle();
    }
#else
    (void)byte;
#endif
}

/* 强回调：覆盖 mock HAL 的弱默认实现，只处理本应用的句柄。 */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if (huart != &huart2) {
        return;
    }
    AppUart_OnByte(rx_byte);
    (void)HAL_UART_Receive_IT(&huart2, &rx_byte, 1U);
}

uint32_t AppUart_RxCount(void)
{
    return rx_count;
}
#endif
