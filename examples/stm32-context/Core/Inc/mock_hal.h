#ifndef MOCK_HAL_H
#define MOCK_HAL_H

#include <stdint.h>

/* 仅模仿 HAL 命名与调用关系；数字标识不是真实外设地址。 */
#define MOCK_USART2_ID 2U

typedef enum {
    HAL_OK = 0,
    HAL_ERROR = 1
} HAL_StatusTypeDef;

typedef struct {
    uint32_t Instance;
    uint32_t BaudRate;
    uint8_t *rx_target;
} UART_HandleTypeDef;

void HAL_Init(void);
void HAL_UART_Init(UART_HandleTypeDef *huart);
HAL_StatusTypeDef HAL_UART_Receive_IT(UART_HandleTypeDef *huart,
                                    uint8_t *data, uint16_t size);
void HAL_UART_IRQHandler(UART_HandleTypeDef *huart);
/* 声明不能加 weak：应用文件中的定义必须保持强符号。 */
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart);
void HAL_GPIO_WritePin(uint16_t pin, uint8_t level);
uint8_t MockHAL_LedLevel(void);

#endif
