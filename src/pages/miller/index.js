var hash = '';
var transparencyData = [];
var scanner;

$( document ).ready(function() {
  $( "#newDischarge" ).click(function() {
    showScan();
  });

  $( "#scanok" ).click(function() {
    //TODO: remove test data hash and use scanned data from QR code instead
    hash = 'FKIIGI9MEUXLYCCDOCKEDAAGCHUFNBADSYQ9CUOMVPDUMXXNWMLDVZHHHXZLCNHV9H9UXUKNPLDGTY999';

    readData(hash);
  });

  $( "#checkok" ).click(function() {
    writeToTangle(hash);
  });

  $( "#checkcancel" ).click(function() {
    showStart();
  });

  $( "#nextDischarge" ).click(function() {
    showStart();
  });

  $( "#scancancel" ).click(function() {
    if(scanner){
      scanner.stop();
    }
    showStart();
  });
});

//-----------------Start of Recursive Read----------------------
function readData(collectorDeliveryHash){
  transparencyData = [];
  readObjectFromTangle(collectorDeliveryHash, readTangleDataRecursive);
}

function readTangleDataRecursive(collectorData){
  /*
    1. Read collector's tx (done here)
    2. Read farmer's tx
    3. Join data
    4. Check if previous hash exists --> start recursive read
  */

  //(2) Read the tx made by the farmer
  readObjectFromTangle(collectorData.farmerDeliveryHash, function(farmerData){

    //(3)
    var farmerData = {
      'deliveryHash' : collectorData.farmerDeliveryHash.substr(0, 5) + '...',
      'latitude': farmerData.latitude,
      'longitude' : farmerData.longitude,
      'loadTime' : new Date(collectorData.time * 1000),
      'weight' : farmerData.weight,
      'quality' : farmerData.quality
    };

    //push data in array
    transparencyData.push(farmerData);

    //(4)check if a previous delivery is linked. If yes, recursive loading, else show the results
    if (collectorData.previousDeliveryHash && collectorData.previousDeliveryHash !=  ''){
        readObjectFromTangle(collectorData.previousDeliveryHash, readTangleDataRecursive);
    } else {
      $('#checkResult').html(renderTable(transparencyData));
      showCheck();
    }
  });
}
//-----------------End of Recursive Read------------------------

function renderTable(data){
  var result = '<table border="1" style="margin: 0 auto;">';
  result += "<tr>";
  result += '<td>Delivery Hash</td>';
  result += '<td>Longitude</td>';
  result += '<td>Latitude</td>';
  result += '<td>Load Time</td>';
  result += '<td>Weight</td>';
  result += '<td>Quality</td>';
  result += "</tr>";
  for (var i=0; i < data.length; i++){
    result += "<tr>";
    result += '<td>' + data[i].deliveryHash + '</td>';
    result += '<td>' + data[i].longitude + '</td>';
    result += '<td>' + data[i].latitude + '</td>';
    result += '<td>' + data[i].loadTime + '</td>';
    result += '<td>' + data[i].weight + '</td>';
    result += '<td>' + data[i].quality + '</td>';
    result += "</tr>";
  }
  result += '</table>';
  return result;
}

function writeToTangle(collectorDeliveryHash) {
  var data = {
    'collectorDeliveryHash': collectorDeliveryHash,
    'time' : new Date().getTime()
  };

  //storeObjectOnTangle(seed2, address2_0, data, function(hash){
    //console.log("Transaction Hash:" + hash);
    showResult();
  //});
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

      //TODO: remove test data hash and use scanned data from QR code instead
      hash = 'FKIIGI9MEUXLYCCDOCKEDAAGCHUFNBADSYQ9CUOMVPDUMXXNWMLDVZHHHXZLCNHV9H9UXUKNPLDGTY999';

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
