const contract = require('../src/coreContract');
const uuidv4 = require('uuid/v4');
const elasticsearch = require('elasticsearch');
const web3util = require('../src/web3Util');

let client = new elasticsearch.Client({
    host: 'localhost:9200'
});

let inc = parseInt(process.argv[3]);
let startBlock = parseInt(process.argv[2]);
let endBlock  = startBlock + inc;
let body = [];
let currentBlockNumber = 0;

web3util.getBlockNumber().then(blockNumber => {
    console.log("Intializing ... current block #" + blockNumber);

    currentBlockNumber = blockNumber;

    return queryBlockChain(startBlock, endBlock);
}).catch(err => {
    console.log(err);
})

function queryBlockChain(startBlock, endBlock) {
    console.log("Querying " + startBlock + " to " + endBlock);

    if (startBlock > currentBlockNumber) {
        return new Promise((resolve,reject) => {
            resolve();
        });
    }

    return contract.pastBirthEvents(startBlock, endBlock)
        .then((results) => {
            console.log("processing results for " + startBlock + ", " + endBlock);
            for (let i in results) {
                let result = results[i];

                let action = {
                    index: {
                        _index: 'cryptokitties',
                        _type: 'birth-events',
                        _id: uuidv4()
                    }
                };

                let doc = {
                    owner : result.returnValues.owner,
                    kittyId : result.returnValues.kittyId,
                    matronId : result.returnValues.matronId,
                    sireId : result.returnValues.sireId,
                    genes : result.returnValues.genes
                };

                body.push(action);
                body.push(doc);

                if (body.length === 50) {
                    client.bulk(body);
                    body = [];
                }
            }

            client.bulk(body);
            body = [];
        }).then(() => {
            return queryBlockChain(endBlock+1, endBlock+inc);
        })
}
