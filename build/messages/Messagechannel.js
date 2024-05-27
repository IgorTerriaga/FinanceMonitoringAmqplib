"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessageChannel = void 0;
const dotenv_1 = require("dotenv");
const amqplib_1 = require("amqplib");
(0, dotenv_1.config)();
const createMessageChannel = async () => {
    (0, dotenv_1.config)();
    try {
        const connection = await (0, amqplib_1.connect)(process.env.AMQP_SERVER ?? 'amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME ?? 'candles');
        console.log('Connected to RabbitMQ');
        return channel;
    }
    catch (err) {
        console.log('Error while trying to connect to the RabbitMQ');
        console.log(err);
        return null;
    }
};
exports.createMessageChannel = createMessageChannel;
