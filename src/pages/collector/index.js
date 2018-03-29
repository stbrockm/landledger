var hash = '';
var scanner;
var deliveryHash = '';
var previousFarmerDeliveryHash = '';
var qrCode;

$( document ).ready(function() {

  $( "#newrun" ).click(function() {
    showScan();
  });

  $( "#scanok" ).click(function() {
    readObjectFromTangle(hash, function(data){

      console.log(data);
        var transparencyData = {
          'farmer' : 'Farmer_' + hash.substr(1, 4),
          'altitude': data.latitude,
          'longitude' : data.longitude,
          'loadTime' : new Date(data.time * 1000).toISOString().substring(0, 10),
          'weight' : data.weight,
          'quality' : data.quality
        };

        $('#transparencyTemplate').tmpl(transparencyData).appendTo('#transparencyTable  tbody');
      showCheck();
    });

  });

  $( "#checkok" ).click(function() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(writeToTangle);
    } else {
        alert('Nope');
    }
  });

  $( "#checkcancel" ).click(function() {
    showStart();
  });

  $( "#millcodeshow" ).click(function() {
    showQR();
  });

  $( "#nextfarmer" ).click(function() {
    $("#scanResult").text('Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro.');
    showScan();
  });

  $( "#scancancel" ).click(function() {

    scanComplete(hash ? hash : 'BHMBWTUMWCUCAUYOKECYDXVD9UVTYPYVDWIAFNVGN9RSOWVVIUUGAJDXESKDNWOJJWZEICQGQDEZFX999');
    //TODO Fake entfernen
    //showStart();
    if(scanner){
      scanner.stop();
    }
  });
});

function showQR(){
  qrcode = new QRCode("qrcode", {
      text: deliveryHash,
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });

  qrcode.clear();
  qrcode.makeCode(deliveryHash);

  $('#tangleResult').fadeOut(0);
  $('#checkResultQRCode').fadeIn();
  $('#millcodeshow').prop("disabled", true);
}

function writeToTangle(position) {

var time = new Date();
  var data = {
    'farmerDeliveryHash': hash,
    'previousDeliveryHash': deliveryHash,
    'latitude' : position.coords.latitude,
    'longitude' : position.coords.longitude,
    'time' : time.getTime()
  };

  storeObjectOnTangle(seed0, address1_0, data, function(newHash){
    console.log("Transaction Hash:" + newHash);
    deliveryHash = newHash;
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
