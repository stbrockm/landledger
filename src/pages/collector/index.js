$( document ).ready(function() {

  $( "#newrun" ).click(function() {
    showScan();
  });

  $( "#scanok" ).click(function() {
    readMessageFromTangle(hash, function(message){
      $('#checkResult').text(message);
      showCheck();
    })

  });

  $( "#checkok" ).click(function() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(writeToTangle);
    } else {
        alert('Nope');
    }
    showResult();
  });

  $( "#checkcancel" ).click(function() {
    showStart();
  });

  $( "#scancancel" ).click(function() {
    scanComplete('FTBFVLLSCEQPERNMJUOQQGZE9GBNMYUYAJTBK9QTXULVIBHXNRIFOCHAPLKPUSTZHNVZICHAUUDYYC999');
    //showStart();
    if(scanner){
      scanner.stop();
    }
  });
});

var hash = '';
var scanner;

function writeToTangle(position) {

  var data = {
    'deliverHash': hash,
    'latitude' : position.coords.latitude,
    'longitude' : position.coords.longitude,
    'time' : new Date().getTime()
  };

  storeObjectOnTangle(seed0, address0_1, data, function(hash){
    console.log("Transaction Hash:" + hash);
    showResult();
  });
}

function scan(){
  scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
  scanner.addListener('scan', scanComplete);

  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      scanner.start(cameras[0]);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function scanComplete(content){

  if(content && content != ''){
      $("#scanResult").text('Found Hash: ' + content);
      $('#scanok').prop("disabled", false);
      hash = content;
      scanner.stop();
  }else{
      $("#scanResult").text('No Hash found');
      scanner.stop();
  }
}

function showStart(){
  $('#startScreen').fadeIn(300);
  $('#scanScreen').fadeOut(0);
  $('#checkScreen').fadeOut(0);
  $('#resultScreen').fadeOut(0);
}

function showScan(){
  //$('#scanok').prop("disabled", true);
  $("#startScreen").fadeOut(0, function(){
    $('#scanScreen').fadeIn(100, function(){
      scan();
    });
    $('#checkScreen').fadeOut(0);
    $('#resultScreen').fadeOut(0);
  });
}

function showCheck(){
  $('#startScreen').fadeOut(0);
  $('#scanScreen').fadeOut(0);
  $('#checkScreen').fadeIn(300);
  $('#resultScreen').fadeOut(0);
}

function showResult(){
  $('#startScreen').fadeOut(0);
  $('#scanScreen').fadeOut(0);
  $('#checkScreen').fadeOut(0);
  $('#resultScreen').fadeIn(300);
}
