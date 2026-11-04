#include <stddef.h>

#include "app_config.h"
#include "mock_hal.h"

/* 使用 GCC/Clang 的弱符号语法；不把不支持的工具链伪装成兼容。 */
#if defined(__GNUC__) || defined(__clang__)
#define MOCK_WEAK __attribute__((weak))
#else
#error "This synthetic fixture requires GCC/Clang weak-symbol support."
#endif

static uint8_t mock_led_level;

void HAL_Init(void)
{
    mock_led_level = 0U;
}

void HAL_UART_Init(UART_HandleTypeDef *huart)
{
    huart->rx_target = NULL;
}

HAL_StatusTypeDef HAL_UART_Receive_IT(UART_HandleTypeDef *huart,
                                    uint8_t *data, uint16_t size)
{
    /* 只模拟单字节接收，调用者提供的缓冲区保持有效即可。 */
    if (huart == NULL || data == NULL || size != 1U) {
        return HAL_ERROR;
    }
    huart->rx_target = data;
    return HAL_OK;
}

void HAL_UART_IRQHandler(UART_HandleTypeDef *huart)
{
    if (huart == NULL || huart->rx_target == NULL) {
        return;
    }
    *huart->rx_target = (uint8_t)APP_MOCK_RX_BYTE;
    huart->rx_target = NULL;
    HAL_UART_RxCpltCallback(huart);
}

/* 弱默认回调不处理业务；UART 启用时由 app_uart.c 的强定义覆盖。 */
MOCK_WEAK void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    (void)huart;
}

void HAL_GPIO_WritePin(uint16_t pin, uint8_t level)
{
    if (pin == APP_LED_PIN) {
        mock_led_level = level;
    }
}

uint8_t MockHAL_LedLevel(void)
{
    return mock_led_level;
}
