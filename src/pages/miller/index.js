$( document ).ready(function() {

  $( "#newDischarge" ).click(function() {
    showScan();
  });

  $( "#scanok" ).click(function() {
    //TODO: remove fake hash
    hash = 'FTBFVLLSCEQPERNMJUOQQGZE9GBNMYUYAJTBK9QTXULVIBHXNRIFOCHAPLKPUSTZHNVZICHAUUDYYC999';

    readObjectFromTangle(hash, function(data){
      //var resultFormatted = data.deliverHash + " +++" + data.latitude + " +++" + data.longitude;

      var data = [
        {
          'longitude': 53.8,
          'latitude': 8.45,
          'time': 1522265138,
          'weight': 121,
          'quality': 'A',
          'deliveryHash' : 'AAAFVLLSCEQPERNMJUOQQGZE9GBNMYUYAJTBK9QTXULVIBHXNRIFOCHAPLKPUSTZHNVZICHAUUDYYC999'
        },
        {
          'longitude': 53.3,
          'latitude': 8.41,
          'time': 1522265142,
          'weight': 123,
          'quality': 'B',
          'deliveryHash' : 'BBBFVLLSCEQPERNMJUOQQGZE9GBNMYUYAJTBK9QTXULVIBHXNRIFOCHAPLKPUSTZHNVZICHAUUDYYC999'
        }
      ];

      //$('#checkResult').text(resultFormatted);
      $('#checkResult').html(renderTable(data));
      showCheck();
    })
  });

  var renderTable = function(data){
    var result = '<table border="1" style="margin: 0 auto;">';
    result += "<tr>";
    result += '<td>Delivery Hash</td>';
    result += '<td>Longitude</td>';
    result += '<td>Latitude</td>';
    result += '<td>Time</td>';
    result += '<td>Weight</td>';
    result += '<td>Quality</td>';
    result += "</tr>";
    for (var i=0; i < data.length; i++){
      result += "<tr>";
      result += '<td>' + data[i].deliveryHash + '</td>';
      result += '<td>' + data[i].longitude + '</td>';
      result += '<td>' + data[i].latitude + '</td>';
      result += '<td>' + data[i].time + '</td>';
      result += '<td>' + data[i].weight + '</td>';
      result += '<td>' + data[i].quality + '</td>';
      result += "</tr>";
    }
    result += '</table>';
    return result;
  }

  // $( "#checkok" ).click(function() {
  //
  //   if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(writeToTangle);
  //   } else {
  //       alert('Nope');
  //   }
  //   showResult();
  // });

  $( "#checkcancel" ).click(function() {
    showStart();
  });

  // $( "#millcodeshow" ).click(function() {
  //   showQR();
  // });

  $( "#scancancel" ).click(function() {
    if(scanner){
      scanner.stop();
    }
    showStart();
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

      //TODO: remove fake hash
      hash = 'FTBFVLLSCEQPERNMJUOQQGZE9GBNMYUYAJTBK9QTXULVIBHXNRIFOCHAPLKPUSTZHNVZICHAUUDYYC999';

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
