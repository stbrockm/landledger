//const IOTA = require('iota.lib.js');

//choose provider
var iota = new IOTA({'provider':'https://nodes.testnet.iota.org:443'});

//define seeds
//farmer1
var seed0 = 'WOD9OLEZEDJSHETLIFODQKCTOASDKFALRKQ9CQBLLXLWQFGBWJOTJLTBKDDFNFPRSOYQRULXLFJSXPVPW';
//collector
var seed1 = 'NLUMYMASERNT9XWOXLCWEBKGQAFQYSY9YQCAYBMPLFRYA9AKQWBZYW9R9BKSSJNGLDIYBBJFPKQARBLZO';
//miller
var seed2 = 'RYNVUCHFGVDSHGIJFJBUEXLIUZULUSY9DEFGLAYBAODPDMHFBWUJNPUQWNZUMFURGERPMFZATQQDOAXAJ';
//farmer2
var seed3 = 'O9QJSHIAH9CAVALVTWWJPJNELXDWTDJEQTRS9KPPBRWSJGMGSQHYGQUFGRSOYIXAWMZTHBRAU9IAAVZO9';
//free seeds
var seed4 = 'FYPJKHKUGASRPQWCDRSETZCRZYZJKNSTSJRAK9TTZAKKRKIEUCNOFKDTEHSIQKARDWUXELNATRIMIMHJZ';
var seed5 = 'QMC9FZAWSDONDAODEDFKDKLJQEKGGEEEJNLOLDUQMUHZFNVBUSCCN9VZYYITHBJXECXWMAB99OFNHBDQY';

//addresses derived from seeds
//farmer1
var address0_0 = "BZGJTVFH9CGYAHMZFEFVMXOKHIWBLICIJBAXIQMJCTVLJMVUTSAMZXBJ9HXEWEAIHFZUAHKJCKRLLGFH9VYMISXYMY";
//collector
var address1_0 = "KBNYGFFGOPSIGDZNSWRRMXSESBURETMGGGXUJTHVEDQAIFDJWHXOAQDT9OKKCYUWIVLLEEAPFDLJZSEDXDFDJKQSP9";
//miller
var address2_0 = "FTABDEKMDYKQRFRMGLJGNGPRYJYUPYZLJHAZCSQKIJPBSLUMKKILOO99U9QROCBNQMWAPYYBQSJRRZLR9JAHUUZSNA";
//farmer2
var address3_0 = "LEEGLSNHRUVZCLWKMBOCZRUDUWCEYDBRPJNLIK9KYIAYYTGYURJDEUSHKCFXULTJTSHFKYNYXRLIWDTMXFAFE9BVZC";
//free addresses (from free seeds)
var address4_0 = "MVYTGXQKFNQGXLJCF9IMXUVHOAYSQDJMTDLFQRPWVCWXKYWCWVCJOOSTPKAFVCBFIPVRCUQWF9HHKU9EDVRCMOHNW9";
var address5_0 = "YXMLVFCIUDCLWTPYCWENLFGNBSUUIV9S9GGOBQLO9EYTRTBQFXKUURQ9NIS9DZSDVPOOJCENUIJN9VBVAVUOQKZJYD";

//helper method to fix problems with odd tryte-length
function fixTrytes(input){
  return input.length % 2 ? input + '9' : input;
}

//store a message (plain text on the tangle)
function storeMessageOnTangle(seed, sourceAddress, message, callback){

  var msgAsTrytes = fixTrytes(iota.utils.toTrytes(message));

  var transfer = [{
    address: sourceAddress,
    value: 0,
    message: msgAsTrytes,
    tag: ''
  }]

  //depth for the tip selection
  var depth = 4;

  //if we're on the mainnet, minWeightMagnitude is 18
  var minWeightMagnitude = 9;

  //sendTransfer to the tangle
  //call the sendTransfer API wrapper function. It takes care of prepareTransfers, attachToTangle, broadcast and storeTransactions
  iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfer, function(error, success) {
    if (error) {
      console.error(error);
    } else {
      //console.log("Successfully attached your transaction to the tangle!", success);
      callback(success[0].hash);
    }
  });
}

//store a JavaScript object on the tangle
function storeObjectOnTangle(seed, sourceAddress, data, callback){
  var message = JSON.stringify(data);
  storeMessageOnTangle(seed, sourceAddress, message, callback);
}

//read a message from the tangle
function readMessageFromTangle(txHash, callback){

  var hashes = [txHash];
  iota.api.getTransactionsObjects(hashes, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      //console.log("Found tx-obj: ", result);
      // console.log("signatureMessageFragment: ", result[0].signatureMessageFragment);
      var msgDecoded = iota.utils.fromTrytes(fixTrytes(result[0].signatureMessageFragment));
      //console.log("message: ", msgDecoded);
      callback(msgDecoded);
    }
  });
}

//read a JavaScript object from the tangle
function readObjectFromTangle(txHash, callback){
  readMessageFromTangle(txHash, function(msg){
    var re = /\0/g;
    var str = msg.toString().replace(re, "");
    var dataFromTangle = JSON.parse(str);
    callback(dataFromTangle);
  });
}

function formatDate(date){
  var options = { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};

  return date.toLocaleDateString('de-DE', options) + " (UTC)";
}
