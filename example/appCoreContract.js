const contract = require('../src/coreContract');
const uuidv4 = require('uuid/v4');
const elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
    host: 'localhost:9200'
});


let startBlock = 5470943;
let endBlock  = startBlock+100; //10000 blocks
let body = [];

contract.pastBirthEvents(startBlock, endBlock)
    .then((results) => {
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
                owner : result.returnValues.result.owner,
                kittyId : result.returnValues.result.kittyId,
                matronId : result.returnValues.result.matronId,
                sireId : result.returnValues.result.sireId,
                genes : result.returnValues.result.genes
            }

            body.push(action);
            body.push(doc);

            if (body.length === 50) {
                client.bulk(body);
                body = [];
            }
        }

        client.bulk(body);
        body = [];
    });