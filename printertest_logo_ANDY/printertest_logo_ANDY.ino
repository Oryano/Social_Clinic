
#include "SoftwareSerial.h"
#include "Adafruit_Thermal.h"
#include "adalogo.h"//my logo
#include <avr/pgmspace.h>

int printer_RX_Pin = 5;  // This is the green wire
int printer_TX_Pin = 6;  // This is the yellow wire

Adafruit_Thermal printer(printer_RX_Pin, printer_TX_Pin);

void setup() {
  Serial.begin(9600);
  pinMode(7, OUTPUT); digitalWrite(7, LOW); // To also work w/IoTP printer
  printer.begin();

  //printReceipt(2,54,"andy","tired","ryan");




  // printer.printBitmap(adalogo_width, adalogo_height, adalogo_data);


  // Print the 135x135 pixel QR code in adaqrcode.h
  //  printer.printBitmap(adaqrcode_width, adaqrcode_height, adaqrcode_data);
  //  printer.println("Adafruit!");
  //  printer.feed(1);

  //  printer.sleep();      // Tell printer to sleep
  //  printer.wake();       // MUST call wake() before printing again, even if reset
  //  printer.setDefault(); // Restore printer to defaults
}

int currentAge;
int currentNumber;
String currentName;
String currentSymptom;
String currentDoctor;

void loop() {
  if (Serial.available() > 0) {
    
    currentName = "";
    currentSymptom = "";
    currentDoctor = "";
    
    int currentAge = Serial.parseInt(); // get the first number, until it hits a comma
    int currentNumber = Serial.parseInt(); // get the second number, until it hits a comma
    
    // a simple counter, so we know where we are when writting characters to a string
    // (which string are we using right now)
    byte currentString = -1;
    
    // whatever bytes are left over, we have to find the names inside them (separated by commas)
    while(true){
      
      if(Serial.available()>0){
        char thisLetter = Serial.read();
        
        // if it's a comma, we move on to the next word
        // so add 1 to the currentString counter
        if (thisLetter == ',') {
          //Serial.println("here!");
          currentString++;
        }
        // if it's a new line, the message is over
        else if (thisLetter == '\n') {
          currentString++;
          break;
        }
        // append this letter to the current string
        else {
          if(currentString==0){
            currentName += thisLetter;
          }
          else if(currentString==1){
            currentSymptom += thisLetter;
          }
          else if(currentString==2){
            currentDoctor += thisLetter;
          }
        }
      }
    }
//    
//    Serial.print(currentAge);
//    Serial.print(", ");
//    Serial.print(currentNumber);
//    Serial.print(", ");
//    Serial.print(currentName);
//    Serial.print(", ");
//    Serial.print(currentSymptom);
//    Serial.print(", ");
//    Serial.println(currentDoctor);
    
    printReceipt(currentNumber,currentAge,currentName,currentSymptom,currentDoctor);
  }
}


//-------egocentr-------//
void printReceipt(int patientNumber, int age, String name, String symptom, String doctor) {
  printer.wake();

  //logo
  printer.feed(1);
  printer.justify('C');
  printer.printBitmap(adalogo_width, adalogo_height, adalogo_data);
  printer.feed(1);

  //patient num
  //int num = random(0, 100);
  printer.justify('C');
  printer.setSize('M');
  printer.println(patientNumber);
  //printer.feed(1);

  //Name and Age info
  //String Pname = "Cici";
  //int age = random(18, 70);
  printer.justify('L');
  printer.setSize('S');
  printer.println("Name " + name + "          Age " + age);
  //  printer.justify('R');
  //  printer.setSize('S');
  //  printer.println("Age "+age);

  //Diagnose
  //String symptom =  "stubborn/OCD";
  printer.justify('L');
  printer.setSize('S');
  printer.println("You have been diagnosed with " + symptom +".");


  //doctor info
  //String doctor = "Cici" ;
  printer.justify('L');
  printer.setSize('S');
  printer.println("Please " + doctor + ".");

  //empty
  printer.justify('L');
  printer.setSize('S');
  printer.println("             ");

  //info
  printer.justify('C');
  printer.setSize('S');
  printer.println("Social Clinic");

  printer.justify('C');
  printer.setSize('S');
  printer.println("Presented by");

  printer.justify('C');
  printer.setSize('S');
  printer.println("Oryan Inbar&Chang Liu&Ava Huang");
  
    //empty
  printer.justify('L');
  printer.setSize('S');
  printer.println("             ");




  printer.sleep();

}
//-------egocentr-------//



