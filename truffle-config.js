require('babel-register');
require('babel-polyfill');

const path = require("path");
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = process.env.REACT_APP_SEED12;
const ropstenProvider = "https://ropsten.infura.io/v3/" + process.env.REACT_APP_ROPSTEN;

console.log(mnemonic)
console.log(ropstenProvider)

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }, ropsten: {
      provider: () => {
        return new HDWalletProvider(mnemonic, ropstenProvider)
      },
      network_id: "3",
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
