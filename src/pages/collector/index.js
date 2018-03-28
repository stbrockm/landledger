$( document ).ready(function() {

  var data = {
    'time': "the timestamp",
    'gps': "Call me Roland the dickhead"
  };

  storeObjectOnTangle(seed0, address0_0, data, function(txHash){
    console.log(txHash);
    readObjectFromTangle(txHash, function(tangleData){
      console.log('data from tangle:');
      console.log(tangleData);
    });
  });

  $( "#newrun" ).click(function() {
    showScan();
  });

  $( "#scanok" ).click(function() {
    //TODO Query data
    showCheck();
  });

  $( "#checkok" ).click(function() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Nope');
    }
    showResult();
  });

  $( "#checkcancel" ).click(function() {
    showStart();
  });

  $( "#scancancel" ).click(function() {
    scanComplete('sdf');
  });

//readObjectFromTangle('NCMMTLAABMSI9NWSHQNWYBDIOUDAOZ9DJKCZYSC9XZMKTXNRCTGKJQXSKXGZRNHGBPOAMGMJYWWMST999', function(what){alert(what);});

});

var hash = '';
var scanner;

function showPosition(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
    alert(latitude + " ::: " + longitude);
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
