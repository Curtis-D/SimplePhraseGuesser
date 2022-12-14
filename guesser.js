const algosdk = require('algosdk');
const fs = require('fs');

// Algonode public API: https://algonode.io/api/
const algodToken = '';
const algodServer = 'https://mainnet-api.algonode.cloud';
const algodPort = 443;

let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const phrases = fs.readFileSync('phrase.txt').toString().split(', ');
const wordlist = fs.readFileSync('wordlist.txt').toString().split('\n');

const insert = (arr, index, newItem) => [
  ...arr.slice(0, index),
  newItem,
  ...arr.slice(index)
]

for (let phraseIndex = 0; phraseIndex < 25; phraseIndex++) {
  wordlist.forEach((word) => {
    // Insert every word from wordlist into partial mnemonic
    const fullPhrase = insert(phrases, phraseIndex, word).join(' ');

    try {
      const account = algosdk.mnemonicToSecretKey(fullPhrase)

      // Get information about the account from the public address
      algodClient.accountInformation(account.addr).do().then((result) => {
        // Check for used addresses with an actual balance
        if (result.amount > 0) {
          console.log(`${result.address}: ${algosdk.microalgosToAlgos(result.amount)}A`);
          console.log(fullPhrase);
        }
      });
    } catch (e) {
      // Do nothing
    }
  })
}
