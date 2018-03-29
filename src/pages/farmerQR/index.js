$( document ).ready(function() {

  var qrCodeHash = new QRCode("qrcode", {
      text: "http://www.bookofgenesis.com",
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });
  document.getElementById("attachToTangle").addEventListener("click", function(){
    var x = document.getElementById("frm1");
    payload.weight = x.elements[0].value;

    var e = document.getElementById("selQuality");
    var quality = e.options[e.selectedIndex].text;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    payload.time = new Date().getTime();

    storeObjectOnTangle(seed0, address0_0, payload, function(TxHash) {
        console.log(TxHash);
        qrCodeHash.clear(); // clear the code.
        qrCodeHash.makeCode(TxHash); // make code with latest TxHash.
        document.getElementById("qrcode").style.display = "block";
        document.getElementById("startScreen").style.display = "none";
        document.getElementById("redo").style.display = "block";
    });
  });
});

var TxHash = '';
var payload = {
  latitude: "",
  longitude: "",
  weight: "",
  quality: "",
  time: ""
};

function showPosition(pos) {
  var crd = pos.coords;

  payload.latitude = crd.latitude;
  payload.longitude = crd.longitude;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function showPositionDebug(pos) {
  var crd = pos.coords;

  payload.latitude = crd.latitude;
  payload.longitude = crd.longitude;

  var text = "";
  text += "GPS latitude: " + payload.latitude + "<br>";
  text += "GPS longitude: " + payload.longitude + "<br>";
  text += "Weight of fruit: " + payload.weight + "<br>";
  text += "Quality of fruit: " + payload.quality + "<br>";
  text += "Current Date: " + payload.time + "<br>";
  document.getElementById("demo").innerHTML = text;
}

function displayDebugData() {
  var x = document.getElementById("frm1");
  payload.weight = x.elements[0].value;
  payload.quality = x.elements[1].value;
  payload.time = new Date().getTime();

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPositionDebug, errorDebug);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
  console.log(payload);
}

function errorDebug(err) {
  //document.getElementById("demo").innerHTML = err;
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function resetForm() {
  document.getElementById("qrcode").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("redo").style.display = "none";
}
