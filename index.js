const salesStream = require('./app');
const amqp = require('amqplib/callback_api');
const Promise = require('bluebird');

const RABBIT_HOST  = process.env.RABBIT_HOST;
const RABBIT_PORT  = process.env.RABBIT_PORT;
const RABBIT_USERNAME  = process.env.RABBIT_USERNAME;
const RABBIT_PASSWORD  = process.env.RABBIT_PASSWORD;
const RABBIT_VHOST  = process.env.RABBIT_VHOST;

const amqpPromise = Promise.promisifyAll(amqp);
Promise.all([
    salesStream.getSalesDataEmitter(), //return emitter
    amqpPromise.connect({
        host : RABBIT_HOST,
        port : RABBIT_PORT,
        login : RABBIT_USERNAME,
        password : RABBIT_PASSWORD,
        vhost : RABBIT_VHOST
    })
    .then((connection) => {
        return connection.createChannel();
    })                        //return channel
], ([emitter, channel]) => {

    channel.assertQueue('auction_created', {durable: true});
    channel.assertQueue('auction_successful', {durable: true});
    channel.assertQueue('auction_cancelled', {durable: true});

    emitter.on('AuctionSuccessful', (Events) => {
        for( let i in Events) {
            channel.sendToQueue('auction_successful', new Buffer(JSON.stringify(Events[i])));
        }
    });

    emitter.on('AuctionCreated', (Event) => {
        for( let i in Events) {
            channel.sendToQueue('auction_created', new Buffer(JSON.stringify(Events[i])));
        }
    });

    emitter.on('AuctionCancelled', (Event) => {
        for( let i in Events) {
            channel.sendToQueue('auction_cancelled', new Buffer(JSON.stringify(Events[i])));
        }
    });
});

