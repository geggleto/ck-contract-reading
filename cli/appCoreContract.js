const contract = require('../src/coreContract');
const db = require('../src/db');
const web3util = require('../src/web3Util');

let inc = parseInt(process.argv[3]);
let startBlock = parseInt(process.argv[2]);
let endBlock  = startBlock + inc;
let currentBlockNumber = 0;

web3util.getBlockNumber().then(blockNumber => {
    console.log("Intializing ... current block #" + blockNumber);

    currentBlockNumber = blockNumber;

    return queryBlockChain(startBlock, endBlock);
}).catch(err => {
    console.log(err);
});

function queryBlockChain(startBlock, endBlock) {
    console.log("Querying " + startBlock + " to " + endBlock);

    if (startBlock > currentBlockNumber - 16) {
        return;
    }

    if (endBlock > currentBlockNumber - 16) {
        endBlock = currentBlockNumber - 16;
    }

    return contract.pastBirthEvents(startBlock, endBlock)
        .then((results) => {
            console.log("processing results for " + startBlock + ", " + endBlock);
            for (let i in results) {
                let result = results[i];

                let doc = {
                    original_owner : result.returnValues.owner,
                    kitty_id : result.returnValues.kittyId,
                    matron_id : result.returnValues.matronId,
                    sire_id : result.returnValues.sireId,
                    genes : web3util.web3.utils.toHex(result.returnValues.genes)
                };

                db.query(
                    "insert IGNORE into birth_events SET ?",
                    doc,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                    }
                );
            }
        }).then(() => {
            return queryBlockChain(endBlock+1, endBlock+inc);
        });
}
