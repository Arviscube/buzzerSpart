#ifndef LEDSPI_H
#define LEDSPI_H

#include <Arduino.h>
#include <SPI.h>


#define PINSPICLK GPIO_NUM_18
#define PINSPIMOSI GPIO_NUM_23

#define COULEURR 127
#define COULEURG 127
#define COULEURB 255

typedef struct{
    uint8_t brightness;
    uint8_t red;
    uint8_t green;
    uint8_t blue;
}color;

void ledSpiSetup(void);
void splitString(const char *input,int lenght);
void ledSpiOff(void);


//DEBUG FUNCTION
void ledTest(void);
void printColor(void);


#endif