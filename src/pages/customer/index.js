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
      'name' : 'Miller_' ,//.subStr(1, 4),
      'collector' : 'Collector_' + data.collectorDeliveryHash,//.subStr(1, 4),
      'time' : new Date(data.time * 1000)
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
      'farmer' : 'Farmer_' + collectorData.farmerDeliveryHash,//.subStr(1, 4),
      'latitude': farmerData.latitude,
      'longitude' : farmerData.longitude,
      'loadTime' : new Date(collectorData.time * 1000),
      'weight' : farmerData.weight,
      'quality' : farmerData.quality
    };

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
  $('#checkResult').text(transparencyData);
  var movies = [
	  { Name: "The Red Violin", ReleaseYear: "1998" },
	  { Name: "Eyes Wide Shut", ReleaseYear: "1999" },
	  { Name: "The Inheritance", ReleaseYear: "1976" }
	  ];

var markup ='<div class="row border border-dark"><div class=" col col-md-4">${Farmer}</div><div class="col col-md-4">${Name}</div><div class="col col-md-4">${Name}</div></div>';
	//var markup = "<li><b>${Name}</b> (${ReleaseYear})</li>";

	/* Compile the markup as a named template */
	$.template( "movieTemplate", markup );

	/* Render the template with the movies data and insert
	   the rendered HTML under the "movieList" element */
	$.tmpl( "movieTemplate", movies )
	  .appendTo( "#clearenceScreen" );

  $('#startScreen').fadeOut(0);
  $('#clearenceScreen').fadeIn(300);
}
