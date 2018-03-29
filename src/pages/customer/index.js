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
      'name' : 'Miller_' + millerHash.substr(1, 4),
      'collector' : 'Collector_' + data.collectorDeliveryHash.substr(1, 4),
      'time' : new Date(data.time * 1000).toISOString().substring(0, 10),
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
      'farmer' : 'Farmer_' + collectorData.farmerDeliveryHash.substr(1, 4),
      'altitude': farmerData.latitude,
      'longitude' : farmerData.longitude,
      'loadTime' : new Date(collectorData.time * 1000).toISOString().substring(0, 10),
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
//-----------------End Recursive Read------------------------

function showClearenceBoard(){
  console.log(transparencyData);

  $('#transparencyTemplate').tmpl(transparencyData).appendTo('#transparencyTable  tbody');
  $('#transparencyAddTemplate').tmpl(millerData).appendTo('#clearenceScreen');
  $('#mapsTemplate').tmpl(transparencyData[0]).appendTo('#clearenceScreen');

  $('#startScreen').fadeOut(0);
  $('#clearenceScreen').fadeIn(300);
}
