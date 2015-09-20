//your name
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


function hideQ1() { 
    document.getElementById("Q1").style.display = 'none';
    document.getElementById("Q2").style.display = 'block';
}


function hideQ2() {
    document.getElementById("Q2").style.display = 'none';
    document.getElementById("Q3").style.display = 'block';
}

function hideQ3() { //hide and ger slider result
	var sliderResult = document.getElementById("timeOnPhone").value;
	document.getElementById("Q3").style.display = 'none';
    document.getElementById("Q4").style.display = 'block';
    }

function hideQ4() {
	var sliderResult = document.getElementById("postFreq").value;
    document.getElementById("Q4").style.display = 'none';
    document.getElementById("Q5").style.display = 'block';
}

function hideQ5() {
	var sliderResult = document.getElementById("notific").value;
    document.getElementById("Q5").style.display = 'none';
    document.getElementById("Q6").style.display = 'block';
}

function hideQ6() {
    document.getElementById("Q6").style.display = 'none';
    document.getElementById("Q7").style.display = 'block';
    startCamera();
}

function hideQ7() {
    document.getElementById("Q7").style.display = 'none';
    document.getElementById("seeResults").style.display = 'block';
    grabData();
    calcScore();
    writeResaults()
    givePrompt();
    camStarted = false;
    sentToServer();
}

var diagnosisInfo = {};
function grabData() { 
    // get the values
    diagnosisInfo = {
        name : $('#yourname').val(),
        appsUse : $( "input:checked" ).length,
        timeOnPhone : $('#timeOnPhone').val(),
        postFreq : $('#postFreq').val(),
        notific : $('#notific').val(),    
     }
    
    // log it to console for sanity check
    console.log(diagnosisInfo);

}

function writeResaults() {
    $('#diagnoResults').text('Here is your diagnosis ' + diagnosisInfo.name + ',');
    $('#awkResault').text('You scored     ' + awkwardness + ' in Awkwardness');
    $('#selfResault').text('You scored     ' + selfie_syndrome + ' in Selfie syndrome');
    $('#SocilResault').text('You scored     ' + notification_OCD + ' in Notification OCD');
    $('#notiOCDResault').text('You scored     ' + social_media_disorder + ' in Social media disorder');
   
}



function givePrompt() {

var cureRandom = Math.random();
    if(cureRandom > .33){
        $('#cure').text('Give a compliment to the person next to you');
    } else if (cureRandom > .67){
        $('#cure').text('Turn off your cellphone for 10 mins');
    } else {
        $('#cure').text('Initiate a conversation with stranger in this space');
    }
 }


//4 different diagnose/issues (global) starts from zero
var awkwardness = 0;
var selfie_syndrome = 0;
var notification_OCD =0;
var social_media_disorder =0;

var map = function(n, start1, stop1, start2, stop2) {
 return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};


function calcScore() {  //calculate the influance of inputs on the score

//analise results from appUse:
  if (diagnosisInfo.appsUse <= 3) {
   awkwardness += Math.ceil(map(diagnosisInfo.appsUse, 0, 11, 0, 100));
} else if (diagnosisInfo.appsUse >= 7) {
   social_media_disorder += Math.ceil(map(diagnosisInfo.appsUse, 0, 11, 0, 100));
}

//analise results from postFreq:
 if (diagnosisInfo.postFreq < 20){
  awkwardness += diagnosisInfo.postFreq;
} else if (diagnosisInfo.postFreq > 60) {
   selfie_syndrome =+ diagnosisInfo.postFreq;
}
//analise results from timeOnPhone:
if (diagnosisInfo.timeOnPhone < 20) {
 awkwardness += Math.ceil(diagnosisInfo.timeOnPhone);  //no map this time?
} else if (diagnosisInfo.timeOnPhone > 50) {
   social_media_disorder =+ Math.ceil(diagnosisInfo.timeOnPhone);
}
//analise results from notific:
if (diagnosisInfo.notific > 10) {
   notification_OCD =+ diagnosisInfo.notific;
}
//analise results from facedetection:Attach face expresssion here!!!!!!!!!!!!!!!!!!!
// if(happy)
// if(sad)
// if(Surprised)
// if(angry)

//if face expression is HAPPY >> add a mapped value to the selfie_syndrome value
//if face expression is ANGRY >> add a mapped value to the Notification_OCD value
//if face expression is SAD >> add a mapped value to the social_media_disorder value
//if face expression is SURPRISED >> add a mapped value to the awkwardness value


//// show it on the page >> this should show valused with one matching result: 

 //    $('#result_name').html(diagnosisInfo.name+ 'you have been diagnosed with ' + diagnosis);


 //    if (diagnosisInfo.timeOnPhone > 50 && diagnosisInfo.timeOnPhone < 80){
 //    $('#result_time').html("You are spending many hours on your phonr ");
 // }
}



// send it through the websocket to printer
function sendToServer(){
 // 1. get the values from the HTML input... name and age
 // 2. create a data object with those values
 // 3. send data object to server via websocket
 
var userName = diagnosisInfo.name;
 
 var data = {
   'name': userName,
   'awkwardness': awkwardness,
   'selfie_syndrome' : selfie_syndrome,
   'notication_OCD' : notification_OCD, //2,
   'social_media_disorder' : social_media_disorder//'tired'
 };

 console.log(data);

 if(mySocket.isOpen) {
   mySocket.send(JSON.stringify(data));
 }
}
    



