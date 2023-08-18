#include <Arduino.h>
#include <ESPAsyncWebServer.h>


const char *ssid = "wifiGui";
const char *password = "azertyui";
const uint16_t port = 8088;
const char * host = "192.168.43.156";

WiFiServer server(8088);

#define PINBUTTON GPIO_NUM_17
#define PINLED GPIO_NUM_19

void setup() {
  //----------------------------------------------------GPIO
  pinMode(PINLED,OUTPUT);
  pinMode(PINBUTTON,INPUT);

  digitalWrite(PINLED,1);
  delay(1000);
  digitalWrite(PINLED,0);
  delay(1000);
  digitalWrite(PINLED,1);
  delay(500);
  digitalWrite(PINLED,0);
  delay(500);

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

}

void loop() {
  /* listen for client */
  WiFiClient client;

  Serial.println("connection to the serveur");
  while (!client.connect(host, port)){
    delay(100);
  }
  Serial.println("");
  Serial.println("Connected to server successful!");

  while (client.connected()){
    client.print("!buzzer2:ok");
    delay(10);
    // client.print("!buzzer2:Salut");
    if(digitalRead(GPIO_NUM_17)){
      client.print("!buzzer2:Salut");
      while (digitalRead(GPIO_NUM_17)){
        client.print("!buzzer2:ok");
        delay(10);
      }   
    }
  }
  
  Serial.println("disconnect!");
  client.stop();
}