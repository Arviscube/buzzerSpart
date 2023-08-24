#include "ledSpi.h"

//SPIClass SPILed(HSPI);
unsigned long timePreAnimation;
bool etatFlashAnimation;
int splitString_NumLed;
color ledColor5[5];
animation_t animation;
unsigned long animationTime = 0;
bool toggleAnimation = false;

void splitString_rec(char *input);
void detectStandarColor(const char *input,color* colorLed);
void ledupdate(void);
void splitString(const char *input,int lenght);

void ledSpiSetup(void){
    SPI.begin(PINSPICLK,12,PINSPIMOSI,15);
    for(int i =0; i<5;i++){
        ledColor5[i].brightness = 255;
        ledColor5[i].red = 0;
        ledColor5[i].green = 0;
        ledColor5[i].blue = 0;
        ledColor5[i].aniamation = NONE;
    }
    ledSpiOff();
}

void ledSpiLoop(void){
    if(animation==FLASH){
        if(animationTime < millis()){
            animationTime = millis() + 50;
            if(toggleAnimation){
                toggleAnimation = !toggleAnimation;
                splitString("spart,spart,spart,spart,spart",80);
            }
            else {
                toggleAnimation = !toggleAnimation;
                splitString("off,off,off,off,off",80);
            }
            
        }
    }
}



void ledSpiOff(void){
    ledSpiCommand("off,off,off,off,off",80);
}




void ledTest(void){
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    for(int i=0;i<8;i++){
        SPI.transfer((uint8_t)255);
        SPI.transfer((uint8_t)COULEURB);
        SPI.transfer((uint8_t)COULEURG);
        SPI.transfer((uint8_t)COULEURR);
    }
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
}

void ledSpiCommand(const char *input,int lenght){
    if(strcmp(input, "animation_Flash") == 0){
        animation = FLASH;
    }
    else{
        animation = NONE;
        splitString(input,lenght);
    }    
}


void splitString(const char *input,int lenght){
    splitString_NumLed = -1;
    char nonConstCopy[lenght];
    strcpy(nonConstCopy, input);
    splitString_rec(nonConstCopy);
    printColor();
    ledupdate(); 
}


void splitString_rec(char *input) {
    splitString_NumLed++;
    if(input[0]=='\n' || input[0]=='\0' || splitString_NumLed >=5);
    else if(input[0]==','){
        splitString_rec(input+1);
    }
    else if(input[0]=='('){
        int colorR,colorG,colorB;
        int paramreturn;
        paramreturn = sscanf(input, "(%d,%d,%d),%s", &colorR, &colorG, &colorB, input);
        if(paramreturn>=3){
            ledColor5[splitString_NumLed].red = colorR;
            ledColor5[splitString_NumLed].green = colorG;
            ledColor5[splitString_NumLed].blue = colorB;
        }
        
        if(paramreturn==4){
            splitString_rec(input);
            return;
        }
    }
    else{
        char colorStandar[20];
        if(sscanf(input, "%[^,],%s", colorStandar, input)==2){
            detectStandarColor(colorStandar,&(ledColor5[splitString_NumLed]));
            splitString_rec(input);
            return;
        }
        detectStandarColor(colorStandar,&(ledColor5[splitString_NumLed]));
    }
    return;
}

void printColor(void){
    for(int i = 0; i<5; i++){
        Serial.print("{");
        Serial.print(ledColor5[i].brightness);
        Serial.print(",");
        Serial.print(ledColor5[i].red);
        Serial.print(",");
        Serial.print(ledColor5[i].green);
        Serial.print(",");
        Serial.print(ledColor5[i].blue);
        Serial.print("},");
    }
    Serial.println("");     
}

void detectStandarColor(const char *input,color* colorLed){
    if (strcmp(input, "none") == 0) {
        //no change
    } else if (strcmp(input, "red") == 0) {
        colorLed->red = 255;
        colorLed->green = 0;
        colorLed->blue = 0;
    } else if (strcmp(input, "green") == 0) {
        colorLed->red = 0;
        colorLed->green = 255;
        colorLed->blue = 0;
    } else if (strcmp(input, "blue") == 0) {
        colorLed->red = 0;
        colorLed->green = 0;
        colorLed->blue = 255;
    } else if (strcmp(input, "white") == 0) {
        colorLed->red = 255;
        colorLed->green = 255;
        colorLed->blue = 255;
    } else if (strcmp(input, "yellow") == 0) {
        colorLed->red = 255;
        colorLed->green = 255;
        colorLed->blue = 0;
    } else if (strcmp(input, "orange") == 0) {
        colorLed->red = 255;
        colorLed->green = 165;
        colorLed->blue = 0;
    } else if (strcmp(input, "brown") == 0) {
        colorLed->red = 139;
        colorLed->green = 69;
        colorLed->blue = 19;
    }
    else if (strcmp(input, "spart") == 0) {
        colorLed->red = 127;
        colorLed->green = 127;
        colorLed->blue = 255;
    }
    else if (strcmp(input, "lightGreen") == 0) {
        colorLed->red = 144;
        colorLed->green = 238;
        colorLed->blue = 144;
    } else if (strcmp(input, "lightBlue") == 0) {
        colorLed->red = 173;
        colorLed->green = 216;
        colorLed->blue = 230;
    } else if (strcmp(input, "purple") == 0) {
        colorLed->red = 128;
        colorLed->green = 0;
        colorLed->blue = 128;
    } else if (strcmp(input, "pink") == 0) {
        colorLed->red = 255;
        colorLed->green = 192;
        colorLed->blue = 203;
    } else if (strcmp(input, "off") == 0) {
        colorLed->red = 0;
        colorLed->green = 0;
        colorLed->blue = 0;
    } else if (strcmp(input, "black") == 0) {
        colorLed->red = 0;
        colorLed->green = 0;
        colorLed->blue = 0;
    }
}

void ledupdate(void){
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    SPI.transfer((uint8_t)0);
    for(int i=0;i<3;i++){
        SPI.transfer((uint8_t)255);
        SPI.transfer((uint8_t)0);
        SPI.transfer((uint8_t)0);
        SPI.transfer((uint8_t)0);
    }
    for(int i=4;i>=0;i--){
        SPI.transfer(ledColor5[i].brightness);
        SPI.transfer(ledColor5[i].blue);
        SPI.transfer(ledColor5[i].green);
        SPI.transfer(ledColor5[i].red);
    }
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
    SPI.transfer((uint8_t)255);
}

