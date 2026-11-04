#ifndef APP_UART_H
#define APP_UART_H

#include "mock_hal.h"

/* 句柄由 main.c 定义；此处只声明共享对象和应用入口。 */
extern UART_HandleTypeDef huart2;

void AppUart_Init(void);
void AppUart_OnByte(uint8_t byte);
uint32_t AppUart_RxCount(void);

#endif
