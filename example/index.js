const contract = require('./../salesContract');

let startBlock = 5470943;
let endBlock  = startBlock+10000; //10000 blocks

contract.pastAuctionSuccessfulEvents(startBlock, endBlock)
    .then((results) => {
        console.log(results.length);
    });