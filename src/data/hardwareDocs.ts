export const ESP32_HARDWARE_PINOUT = {
  mcu: 'ESP32 DevKit V1 (30-Pin)',
  i2cBus: {
    sdaPin: 'GPIO 21',
    sclPin: 'GPIO 22',
    frequency: '400 kHz (Fast Mode)',
  },
  sensors: [
    {
      name: 'MAX30102 Optical Pulse Oximeter',
      interface: 'I2C (0x57)',
      connections: [
        'VIN -> ESP32 3V3',
        'GND -> ESP32 GND',
        'SDA -> ESP32 GPIO21',
        'SCL -> ESP32 GPIO22',
        'INT -> ESP32 GPIO19 (Interrupt)',
      ],
    },
    {
      name: 'MLX90614 Contactless IR Thermal Sensor',
      interface: 'I2C (0x5A)',
      connections: [
        'VIN -> ESP32 3V3',
        'GND -> ESP32 GND',
        'SDA -> ESP32 GPIO21',
        'SCL -> ESP32 GPIO22',
      ],
    },
    {
      name: '0.96" SSD1306 OLED Display (128x64)',
      interface: 'I2C (0x3C)',
      connections: [
        'VCC -> ESP32 3V3',
        'GND -> ESP32 GND',
        'SDA -> ESP32 GPIO21',
        'SCL -> ESP32 GPIO22',
      ],
    },
    {
      name: 'Active Buzzer & RGB LED Alerts',
      interface: 'GPIO Digital Output',
      connections: [
        'Buzzer -> GPIO 18',
        'RGB Red -> GPIO 25',
        'RGB Green -> GPIO 26',
        'RGB Blue -> GPIO 27',
      ],
    },
    {
      name: 'Tactile Push Button',
      interface: 'GPIO Digital Input',
      connections: [
        'Button Pin A -> GPIO 4 (PULLUP)',
        'Button Pin B -> GND',
      ],
    },
  ],
};

export const SAMPLE_ESP32_ARDUINO_CODE = `/*
 * Aura Health - ESP32 Firmware Code for IoT Health Screening Assistant
 * Components: ESP32 + MAX30102 + MLX90614 + SSD1306 OLED + Buzzer + RGB LED
 * Ready to compile in Arduino IDE with Adafruit_MLX90614, MAX30105, and Adafruit_SSD1306 libraries.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_MLX90614.h>
#include "MAX30105.h"
#include "heartRate.h"

// Wi-Fi Credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server API Endpoint (Cloud Run or local server)
const char* serverUrl = "http://YOUR_SERVER_IP:3000/api/sensor-data";

// Hardware Pins
#define BUZZER_PIN 18
#define LED_RED_PIN 25
#define LED_GREEN_PIN 26
#define LED_BLUE_PIN 27
#define BUTTON_PIN 4

// Devices
Adafruit_SSD1306 display(128, 64, &Wire, -1);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();
MAX30105 particleSensor;

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22); // SDA=GPIO21, SCL=GPIO22

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  // Initialize OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("OLED Allocation Failed"));
  }
  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0,10);
  display.println("Aura Health Boot...");
  display.display();

  // Connect WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected! IP: ");
  Serial.println(WiFi.localIP());

  // Initialize Sensors
  if (!mlx.begin()) { Serial.println("MLX90614 Error"); }
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) { Serial.println("MAX30102 Error"); }
  
  particleSensor.setup(); // Default MAX30102 settings
  particleSensor.setPulseAmplitudeRed(0x0A);
  particleSensor.setPulseAmplitudeGreen(0);
}

void loop() {
  // Read Sensors
  float bodyTempC = mlx.readObjectIndexC();
  float bodyTempF = (bodyTempC * 9.0 / 5.0) + 32.0;

  long irValue = particleSensor.getIR();
  int heartRate = 75; // Calculate using heartRate.h peak detection
  int spO2 = 98;      // Calculate using IR and Red AC/DC ratios

  // OLED Display Update
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Aura Health IoT");
  display.print("Temp: "); display.print(bodyTempC, 1); display.println(" C");
  display.print("HR:   "); display.print(heartRate); display.println(" BPM");
  display.print("SpO2: "); display.print(spO2); display.println(" %");
  display.display();

  // Check Abnormal & Trigger Alerts
  if (bodyTempC > 38.0 || spO2 < 92) {
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, LOW);
    tone(BUZZER_PIN, 1000, 200); // Alert beep
  } else {
    digitalWrite(LED_RED_PIN, LOW);
    digitalWrite(LED_GREEN_PIN, HIGH);
    noTone(BUZZER_PIN);
  }

  // Send JSON Payload to Express Backend REST API
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{\\"bodyTempC\\":" + String(bodyTempC, 2) +
                  ",\\"bodyTempF\\":" + String(bodyTempF, 2) +
                  ",\\"heartRate\\":" + String(heartRate) +
                  ",\\"spO2\\":" + String(spO2) +
                  ",\\"deviceStatus\\":\\"Online\\"" +
                  ",\\"wifiSignal\\":" + String(WiFi.RSSI()) + "}";

    int httpCode = http.POST(json);
    http.end();
  }

  delay(2000); // 2 second telemetry cycle
}
`;
