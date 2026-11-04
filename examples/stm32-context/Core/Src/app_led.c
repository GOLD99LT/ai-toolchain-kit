#include "app_config.h"
#include "app_led.h"
#include "mock_hal.h"

#if APP_LED_ENABLED
static uint8_t led_on;

/* LED 的私有复位函数，只在本翻译单元中可见。 */
static void reset_state(void)
{
    led_on = 0U;
    HAL_GPIO_WritePin(APP_LED_PIN, led_on);
}

void AppLed_Init(void)
{
    reset_state();
}

void AppLed_Toggle(void)
{
    led_on ^= 1U;
    HAL_GPIO_WritePin(APP_LED_PIN, led_on);
}

uint8_t AppLed_IsOn(void)
{
    return led_on;
}
#endif
