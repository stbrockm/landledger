const IOTA = require('iota.lib.js');

//choose provider
var iota = new IOTA({'provider':'https://nodes.testnet.iota.org:443'});

//define seeds
var seed0 = 'WOD9OLEZEDJSHETLIFODQKCTOASDKFALRKQ9CQBLLXLWQFGBWJOTJLTBKDDFNFPRSOYQRULXLFJSXPVPW';
var seed1 = 'NLUMYMASERNT9XWOXLCWEBKGQAFQYSY9YQCAYBMPLFRYA9AKQWBZYW9R9BKSSJNGLDIYBBJFPKQARBLZO';

//initially used for address generation
// iota.api.getNewAddress(
//   seed0, {
//       index: 0,
//       security: 2, //medium, default
//       total: 2,
//       checksum: true
//   },
//
//   function(error, addresses) {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log(addresses);
//     }
//   }
// );

//addresses derived from seeds
var address0_0 = "BZGJTVFH9CGYAHMZFEFVMXOKHIWBLICIJBAXIQMJCTVLJMVUTSAMZXBJ9HXEWEAIHFZUAHKJCKRLLGFH9VYMISXYMY";
var address0_1 = "XFVURAHKBQM9ZAHIIDWMLQBPXUNXMWZADNXPMKVKGWFZMJPLUYMHEJLPKRZNVA9GOSMKBZYBJTKJQYASWHE9IHSHZW";
var address1_0 = "KBNYGFFGOPSIGDZNSWRRMXSESBURETMGGGXUJTHVEDQAIFDJWHXOAQDT9OKKCYUWIVLLEEAPFDLJZSEDXDFDJKQSP9";
var address1_1 = "DELLLHXNELCBXHXRFPEAPRNVJIGRZUZTQAIVZAPLPTYFBYFSKWFMTKWWQT9WSZNCCHTLGOEOAT9QBIMCYYPXSKAYBB";

//helper method to fix problems with odd tryte-length
function fixTrytes(input){
  return input.length % 2 ? input + '9' : input;
}

//store a message (plain text on the tangle)
function storeMessageonTangle(seed, sourceAddress, message){

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
      console.log("Successfully attached your transaction to the tangle!", success);
    }
  });
}

//read a message from the tangle
function readMessageFromTangle(txHash){
  //var searchValues = {'addresses': ['TPEKZO9JSKWFBR9DNOCXFWWVKYNSYM9ZYCLRSDZKSCARRVALEZ9BVQA9KFEAMRZAEMIDYSKETZGDHLVQD']};

  var hashes = [txHash];

  iota.api.getTransactionsObjects(hashes, function(error, result) {
    if (error) {
      console.error(error);
    } else {
      console.log("Found tx-obj: ", result);
      // console.log("signatureMessageFragment: ", result[0].signatureMessageFragment);
      var msgDecoded = iota.utils.fromTrytes(fixTrytes(result[0].signatureMessageFragment));
      console.log("message: ", msgDecoded);
    }
  });
}

//storeMessageonTangle(seed0, address0_0, 'hello world');
//return value from callback:
//
// [ { hash: 'CANCQNEPUQDBWYYRIXVQJLEIYIJRQYZWGQIXFIZH9VKBPKGSRIKDYAHKBDDHOXGBGCOZKYRWYSYJQF999',
//     signatureMessageFragment: 'WCTC9D9DCDEAKDCDFD9DSC99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
//     address: 'BZGJTVFH9CGYAHMZFEFVMXOKHIWBLICIJBAXIQMJCTVLJMVUTSAMZXBJ9HXEWEAIHFZUAHKJCKRLLGFH9',
//     value: 0,
//     obsoleteTag: 'F99999999999999999999999999',
//     timestamp: 1522241593,
//     currentIndex: 0,
//     lastIndex: 0,
//     bundle: 'QGEYOWPYGZREDESTHFEQWHYKZZLBHOJ9BHRPY99JWINZKBWVQWJKRVYDIXKUSPHGLZNILIFDL9PGPC9WW',
//     trunkTransaction: 'FRPZJLASLWUOLLFLZLTVAOY9ZLVYFE9FCKXGWEXPXRE9KUQLFQZVWHPICZHGLDFWJVTCMATFKLJIOX999',
//     branchTransaction: 'ZYORTMFIAOFFLBAGZZFQNZFAJCZNSHFQVGSCHOH9MUWHCQGIHKWUBTDMTYDQGENOBPXUYDZQWUJGFE999',
//     tag: 'F99999999999999999999999999',
//     attachmentTimestamp: 1522241722778,
//     attachmentTimestampLowerBound: 0,
//     attachmentTimestampUpperBound: 12,
//     nonce: 'Q9GZNXSPIF9RMFOFUBFKA9MODPS' } ]

readMessageFromTangle('CANCQNEPUQDBWYYRIXVQJLEIYIJRQYZWGQIXFIZH9VKBPKGSRIKDYAHKBDDHOXGBGCOZKYRWYSYJQF999');
