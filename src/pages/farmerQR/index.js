$( document ).ready(function() {

  var qrCodeHash = new QRCode("qrcode", {
      text: "http://www.bookofgenesis.com",
      width: 512,
      height: 512,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  });
  document.getElementById("displayHash").addEventListener("click", function(){
    var x = document.getElementById("frm1");
    payload.weight = x.elements[0].value;
    payload.quality = x.elements[1].value;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
    payload.date = new Date();

    storeObjectOnTangle(seed0, address0_0, payload, function(TxHash) {
        console.log(TxHash);
        qrCodeHash.clear(); // clear the code.
        qrCodeHash.makeCode(TxHash); // make code with latest TxHash.
        document.getElementById("qrcode").style.display = "block";
    });
  });
});

var TxHash = '';
var payload = {
  GPSlat: "",
  GPSlong: "",
  weight: "",
  quality: "",
  date: ""
};

function showPosition(pos) {
  var crd = pos.coords;

  payload.GPSlat = crd.latitude;
  payload.GPSlong = crd.longitude;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function attachToTangle() {
  var x = document.getElementById("frm1");
  payload.weight = x.elements[0].value;
  payload.quality = x.elements[1].value;

  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
  }
  payload.date = new Date();

  console.log(payload);

  var text = "";
  text += "GPS latitude: " + payload.GPSlat + "<br>";
  text += "GPS longitude: " + payload.GPSlong + "<br>";
  text += "Weight of fruit: " + payload.weight + "<br>";
  text += "Quality of fruit: " + payload.quality + "<br>";
  text += "Current Date: " + payload.date + "<br>";
  document.getElementById("demo").innerHTML = text;

}
