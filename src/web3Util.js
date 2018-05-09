const Web3 = require('web3');
const utils = require('./utils');

// set the provider you want from Web3.providers
module.exports.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/metamask'));
module.exports.getBlockNumber = () => utils.promisify( callback =>  this.web3.eth.getBlockNumber(callback));

module.exports.getContract = (abi, address) => {
    return new this.web3.eth.Contract(abi, address);
};