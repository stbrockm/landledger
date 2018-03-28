const IOTA = require('iota.lib.js');

//choose provider
var iota = new IOTA({'provider':'https://testnet140.tangle.works'});

//define seeds
var seed0 = 'WOD9OLEZEDJSHETLIFODQKCTOASDKFALRKQ9CQBLLXLWQFGBWJOTJLTBKDDFNFPRSOYQRULXLFJSXPVPW';
var seed1 = 'NLUMYMASERNT9XWOXLCWEBKGQAFQYSY9YQCAYBMPLFRYA9AKQWBZYW9R9BKSSJNGLDIYBBJFPKQARBLZO';

//addresses derived from seeds
var address0_0 = "BZGJTVFH9CGYAHMZFEFVMXOKHIWBLICIJBAXIQMJCTVLJMVUTSAMZXBJ9HXEWEAIHFZUAHKJCKRLLGFH9VYMISXYMY";
var address0_1 = "XFVURAHKBQM9ZAHIIDWMLQBPXUNXMWZADNXPMKVKGWFZMJPLUYMHEJLPKRZNVA9GOSMKBZYBJTKJQYASWHE9IHSHZW";
var address1_0 = "KBNYGFFGOPSIGDZNSWRRMXSESBURETMGGGXUJTHVEDQAIFDJWHXOAQDT9OKKCYUWIVLLEEAPFDLJZSEDXDFDJKQSP9";
var address1_1 = "DELLLHXNELCBXHXRFPEAPRNVJIGRZUZTQAIVZAPLPTYFBYFSKWFMTKWWQT9WSZNCCHTLGOEOAT9QBIMCYYPXSKAYBB";

//helper method to fix problems with odd tryte-length
function fixTrytes(input){
  return input.length % 2 ? input + '9' : input;
}




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
