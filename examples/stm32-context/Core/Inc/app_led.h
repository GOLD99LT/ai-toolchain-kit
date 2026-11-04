#ifndef APP_LED_H
#define APP_LED_H

#include <stdint.h>

/* 应用状态可供阅读核对，未连接真实 GPIO。 */
void AppLed_Init(void);
void AppLed_Toggle(void);
uint8_t AppLed_IsOn(void);

#endif
