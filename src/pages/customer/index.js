var transparencyData = [];
var millerData;

$( document ).ready(function() {

  $( "#showclearence" ).click(function() {

var value = $('#txtHash').val();
    if(value && value != '')
    readData(value);
  });

});

//-----------------Start Recursive Read----------------------
function readData(millerHash){
  readObjectFromTangle(millerHash, function(data){

    millerData = {
      'name' : 'Miller_' + millerHash.substr(0, 5) + '...',
      'collector' : 'Collector_' + data.collectorDeliveryHash.substr(0, 5) + '...',
      'time' : formatDate(new Date(data.time * 1000)),
      'totalAmount' : 0
    };
    readObjectFromTangle(data.collectorDeliveryHash, readTangleDataRecursive);
  });
}

function readTangleDataRecursive(collectorData){
/*
  1. Read collector Transaction (here done)
  2. Read farmer Transaction
  3. Join data
  4. Check if previsouhash exists --> recursive
*/

//(2)Read the Transaction made by the farmer 4 weight Data, etc.
readObjectFromTangle(collectorData.farmerDeliveryHash, function(farmerData){

    //(3)
    var farmerData = {
      'farmer' : '' + collectorData.farmerDeliveryHash.substr(0, 5) + '...',
      'altitude': farmerData.latitude,
      'longitude' : farmerData.longitude,
      'loadTime' : formatDate(new Date(collectorData.time * 1000)),
      'weight' : farmerData.weight,
      'quality' : farmerData.quality
    };

    millerData.totalAmount += farmerData.weight;

    //push data in array
    transparencyData.push(farmerData);

    //(4)check if a previous delivery is linked. If yes, recursive loading, else show the results
    if(collectorData.previousDeliveryHash && collectorData.previousDeliveryHash !=  ''){
        readObjectFromTangle(collectorData.previousDeliveryHash, readTangleDataRecursive);
    }else{
      showClearenceBoard();
    }
  });
}

function showTransparencyMap(altitude, longitude){
    var gps = {
      'altitude' : altitude,
      'longitude' : longitude
    }
    $('#transparencyMap').remove();
    $('#mapsTemplate').tmpl(gps).appendTo('#clearenceScreen');
}
//-----------------End Recursive Read------------------------

function showClearenceBoard(){
  console.log(transparencyData);

  $('#transparencyTemplate').tmpl(transparencyData).appendTo('#transparencyTable  tbody');
  $('#transparencyAddTemplate').tmpl(millerData).appendTo('#clearenceScreen');


  $('#startScreen').fadeOut(0);
  $('#clearenceScreen').fadeIn(300);
}
