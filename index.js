let salesContractAPI = require('./salesContract');
let web3Util = require('./web3Util');
let Promise = require('bluebird');

let blockEnd = 4600000;
let blockChunk = 30000;

web3Util.getBlockNumber().then(blockNumber => {

    let end = blockNumber;
    let blockStart = blockNumber - blockChunk;

    let values = [];

    do {
        values.push({
            start : blockStart,
            end : end
        });

        end = blockStart -1;
        blockStart -= blockChunk;

    } while (blockStart > blockEnd);

    return Promise.all([
            Promise.reduce(values, (accumulator, currentValue) =>{
                return salesContractAPI.pastAuctioCreatedEvents(currentValue.start, currentValue.end).then(blockEvents => {
                    return accumulator +  blockEvents.length;
                });
            }, 0),

            Promise.reduce(values, (accumulator, currentValue, i )=>{
                return salesContractAPI.pastAuctionSuccessfulEvents(currentValue.start, currentValue.end).then(blockEvents => {
                    return  accumulator + blockEvents.length;
                });
            }, 0),

            Promise.reduce(values, (accumulator, currentValue, i )=>{
                return salesContractAPI.pastAuctionCancelledEvents(currentValue.start, currentValue.end).then(blockEvents => {
                    return accumulator +  blockEvents.length;
                });
            }, 0)
        ]);
}).then(([created,successful,cancelled] )=> {
    console.log("Created Events: " + created);
    console.log("Successful Events: " + successful);
    console.log("Cancelled Events: " + cancelled);
});

