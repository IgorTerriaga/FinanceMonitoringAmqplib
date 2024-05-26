import {config} from 'dotenv';
import {Channel, connect} from 'amqplib'

config()

export const createMessageChannel = async (): Promise<Channel | null> => {
    config()
    try {
        const connection = await connect(process.env.AMQP_SERVER ?? 'amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME ?? 'candles');
        console.log('Connected to RabbitMQ')
        return channel;
    } catch (err) {
        console.log('Error while trying to connect to the RabbitMQ');
        console.log(err);
        return null;
    }
}