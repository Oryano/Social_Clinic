
//main sketch

var ctracker;
var emotionData;
var ec;
var videoInput;
var cnv;
var camStarted = false;

 
var mySocket;

function setup() {

  noStroke();
  fill(255,255,255);
  textSize(20);

  var myAddress = 'localhost:8000';
  mySocket = new WebSocket('ws://'+myAddress);

  mySocket.onopen = function(){
    console.log('yay, we opened a socket connection!');
    mySocket.isOpen = true;
  }
}

function draw() {
  if (camStarted == true) {
    clear();
    //location and size
    image(videoInput,0,0,480, 360);

    //face tracking
     var positions = ctracker.getCurrentPosition();
      if (positions) {
        ctracker.draw(canvas);
      }

    //EMOTION
    var cp = ctracker.getCurrentParameters();
    var er = ec.meanPredict(cp);
    
    for (var i=0; i<er.length; i++) {
      text(er[i].emotion+' '+nfc(er[i].value, 2), 20, (i+1)*30);
      // emoval=er[i].emotion+' '+nfc(er[i].value, 2), 20, (i+1)*30;

      //print happy score
      if (er.length == 4) {
        if (er[3].emotion == 'happy'){
          //console.log(er[3].emotion+' '+er[3].value);
        }
      }

    }
  }
}

function startCamera(){
  console.log('start camera');
    // setup camera capture
  videoInput = createCapture(VIDEO);
  videoInput.size(480,360);
  videoInput.position(50, 100);
  // videoInput.hide();

  //setup canvas
  cnv = createCanvas(480, 360);
  cnv.position(50,100);

  // setup tracker
  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(videoInput.elt);


  ec = new emotionClassifier();
  ec.init(emotionModel);
  emotionData = ec.getBlank();  
  
  camStarted = true;
}


//  Code to handle taking the snapshot and displaying it locally
//  Take_snapshot is our event, we call sendToServer function in this event
 function take_snapshot() {  // take snapshot and get image data

  var data_uri = cnv.elt.toDataURL();

}

function sendToServer(){
  // 1. get the values from the HTML input... name, awkwardness, selfie_syndrome, notification_OCD , social_media_disorder =0;
  // 2. create a data object with those values
  // 3. send data object to server via websocket
  

  var data = {
    'name': diagnosisInfo.name,
    'awkwardness' : awkwardness,
    'selfie_syndrome' : selfie_syndrome,
    'notification_OCD' : notification_OCD,
    'social_media_disorder' : social_media_disorder

  };

  console.log(data);

  if(mySocket.isOpen) {
    mySocket.send(JSON.stringify(data));
  }

  console.log('data is sent!');

  // on server-side... data.name, data.age

}


