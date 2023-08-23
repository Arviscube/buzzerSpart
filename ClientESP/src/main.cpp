#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <string>
#include "ledSpi.h"

#define BUZZERNUMBER 4
const char *ssid = "BuzzerSpart";
const char *password = "robotronik";
const uint16_t port = 8088;
const char * host = "192.168.8.2";

WiFiServer server(8088);

#define PINBUTTON GPIO_NUM_17
#define PINLED GPIO_NUM_19

char buffer[128];
bool boutonpresse = false;
String messageButtonPress = ((String)"!boutonBuzzer" + BUZZERNUMBER + ":0");

void RequestTraitement(void);

void setup() {

  //----------------------------------------------------GPIO
  pinMode(PINLED,OUTPUT);
  pinMode(PINBUTTON,INPUT);
  digitalWrite(PINLED,1);
  delay(1000);
  digitalWrite(PINLED,0);
  delay(1000);


  //----------------------------------------------------Serial
  Serial.begin(115200);
  Serial.println("ESP Strating\n");
  Serial.println(ssid);

  //----------------------------------------------------WIFI
  WiFi.begin(ssid, password);

	Serial.print("Tentative de connexion...");
	
	while(WiFi.status() != WL_CONNECTED)
	{
		Serial.print(".");
		delay(100);
	}
	
	Serial.println("\n");
	Serial.println("Connexion etablie!");
	Serial.print("Adresse IP: ");
	Serial.println(WiFi.localIP());

  //----------------------------------------------------LED
  ledSpiSetup();
  //ledTest();

}

void loop() {
  /* listen for client */
  WiFiClient client;

  Serial.print("connection to the serveur...");
  while (!client.connect(host, port)){
    Serial.print(".");
    delay(100);
  }
  Serial.println("");
  Serial.println("Connected to server successful!");

  while (client.connected()){
    client.print((String)"!buzzer" + BUZZERNUMBER + ":ok");
    delay(100);

    if (client.available()) {
      int i = 0;
      char c;
      while ((c = client.read()) != ';' && i < sizeof(buffer) - 1) {
          buffer[i++] = c;
      }
      buffer[i] = '\0';  // Ajouter le caractère nul à la fin du buffer
      Serial.println(buffer);
      RequestTraitement();
    }
    
    if(boutonpresse != digitalRead(GPIO_NUM_17)){
      boutonpresse = !boutonpresse;
      messageButtonPress[15] = boutonpresse + '0';
      client.print(messageButtonPress);
      delay(50);
    }
  }
  
  Serial.println("disconnect!");
  client.stop();
}




void RequestTraitement(void){
  char commande[20];
  int BuzzerNumber;
  char action[100];
  if(sscanf(buffer, "%[^0-9]%d:%s", commande, &BuzzerNumber, action) == 3){
    Serial.print("Commande : ");
    Serial.print(commande);
    Serial.print(", BuzzerNumber : ");
    Serial.print(BuzzerNumber);
    Serial.print(", action : ");
    Serial.println(action);
    if(BuzzerNumber==BUZZERNUMBER){
      if((String)commande == "lightBuzzer"){
        Serial.println(((String)action).toInt());
        digitalWrite(PINLED,((String)action).toInt());
      }
      else if((String)commande == "ledBuzzer"){
        splitString(action,100);
      }
    }
  }
}