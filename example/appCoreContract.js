const contract = require('../src/coreContract');
const uuidv4 = require('uuid/v4');
const elasticsearch = require('elasticsearch');

let client = new elasticsearch.Client({
    host: 'localhost:9200'
});

let startBlock = parseInt(process.argv[2]);
let endBlock  = startBlock + parseInt(process.argv[3]);
let body = [];

console.log("Starting");

contract.pastBirthEvents(startBlock, endBlock)
    .then((results) => {
        console.log("processing");
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