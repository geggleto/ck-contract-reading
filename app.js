let salesContractAPI = require('./salesContract');
let web3Util = require('./web3Util');

let events = require('events');

let eventEmitter = new events.EventEmitter();

module.exports.getSalesDataEmitter = (blockEnd, blockChunk) => {

    return web3Util.getBlockNumber().then(blockNumber => {

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


        for (let i in values) {
            let currentValue = values[i];

            salesContractAPI.pastAuctionCreatedEvents(currentValue.start, currentValue.end).then(blockEvents => {
                eventEmitter.emit('AuctionsCreated', blockEvents);
            });

            salesContractAPI.pastAuctionSuccessfulEvents(currentValue.start, currentValue.end).then(blockEvents => {
                eventEmitter.emit('AuctionSuccesses', blockEvents);
            });

            salesContractAPI.pastAuctionCancelledEvents(currentValue.start, currentValue.end).then(blockEvents => {
                eventEmitter.emit('AuctionsCancelled', blockEvents);
            });
        }

        return eventEmitter;
    });
};



