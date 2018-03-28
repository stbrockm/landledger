const IOTA = require('iota.lib.js');

//choose provider
var iota = new IOTA({'provider':'https://testnet140.tangle.works'});

//define seed
var seed = 'WOD9OLEZEDJSHETLIFODQKCTOASDKFALRKQ9CQBLLXLWQFGBWJOTJLTBKDDFNFPRSOYQRULXLFJSXPVPW';

// iota.api.getNodeInfo(function(error, success) {
//     if (error) {
//         console.error(error);
//     } else {
//         console.log(success);
//     }
// });

function fixTrytes(input){
  return input.length % 2 ? input + '9' : input;
}


var privateKey = iota.multisig.getKey(seed, 42, 2);
//console.log('privateKey: '+ privateKey);

iota.api.getNewAddress(
  seed, {
      index: 42,
      security: 2, //medium, default
      total: 1,
      checksum: true
  },

  function(error, addresses) {
    if (error) {
      console.error(error);
    } else {
      console.log(addresses);
    }
  }
);

var message = 'my tangle-stored value';
var msgAsTrytes = iota.utils.toTrytes(message);
//console.log('msgAsTrytes: ' + msgAsTrytes);

var address0 = "TBAIMBIO9CGOALYCZHRAVWOOQAVZFTGJEKGDDQRMIKBQIS9OBHDMFQVDWGAMVNLPIBDDQSZYLVKSISORDCKKBJCOQY";

var transfers = [{
  address: address0,
  value: 0,
  message: msgAsTrytes,
  tag: ''
}]



// Depth for the tip selection
var depth = 4;

// If we're on the mainnet, minWeightMagnitude is 18
var minWeightMagnitude = 9;

iota.api.prepareTransfers(seed, transfers, {},
    function(e, s) {
      //console.log(e,s);
      //console.log(iota.utils.fromTrytes(s + '9'));
      var payloadRaw = s + '9';
      var payload = iota.utils.transactionObject(payloadRaw);
      //console.log(payload);

      var msgEncoded = fixTrytes(payload.signatureMessageFragment);
      console.log("message (fromTrytes): ", iota.utils.fromTrytes(msgEncoded));

      iota.multisig.addSignature([payload], address0, privateKey, function(error, success) {
        if (error) {
          console.error(error);
        } else {
          console.log('success: '+success);
          success.signatureMessageFragment = fixTrytes(success.signatureMessageFragment);
          var myBundle = [success];
          //console.log('len' +myBundle.length);
          var result = iota.utils.validateSignatures(myBundle, address0);
          console.log('sigValid: '+result);
        }
      });






      // Call the sendTransfer API wrapper function. It takes care prepareTransfers, attachToTangle, broadcast and storeTransactions
      // iota.api.sendTrytes(s, depth, minWeightMagnitude, function(error, attached ) {
      //   if (error) {
      //     console.error(error);
      //   } else {
      //     console.log("Successfully attached your transaction to the Tangle with transaction", attached);
      //   }
      // });
    }
);

// iota.api.sendTransfer(seed, depth, minWeightMagnitude, transfers, function(error, attached ) {
//         if (error) {
//           console.error(error);
//         } else {
//           console.log("Successfully attached your transaction to the Tangle with transaction", attached);
//         }
//       });
