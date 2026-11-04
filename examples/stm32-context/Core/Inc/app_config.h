#ifndef APP_CONFIG_H
#define APP_CONFIG_H

/* 合成配置：允许用 -D 覆盖开关，以核查条件编译路径。 */
#ifndef APP_UART_ENABLED
#define APP_UART_ENABLED 1
#endif

#ifndef APP_LED_ENABLED
#define APP_LED_ENABLED 1
#endif

#define APP_UART_BAUDRATE 115200U
#define APP_LED_PIN 1U
#define APP_LED_TOGGLE_BYTE 'T'
#define APP_MOCK_RX_BYTE 'T'

#endif
