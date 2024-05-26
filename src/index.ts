import {config} from 'dotenv';
import axios from "axios";
import Period from "./enums/Period";
import Candle from "./models/Candle";
import {createMessageChannel} from "./messages/Messagechannel";

config();


config()

const readMarketPrice = async (): Promise<number> => {
    const result = await axios.get(process.env.PRICES_API ?? 'http://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    const data = result.data
    const price = data.bitcoin.usd
    return price
}

const generateCandles = async () => {
    const messageChannel = await createMessageChannel();
    if (messageChannel) {
        while (true) {
            const looptimes = Period.ONE_MINUTE / Period.TEN_SECONDS;
            const candle = new Candle('BTC');
            console.log('------------------------------------');
            console.log('Generate new candle')
            for (let i = 0; i < looptimes; i++) {
                const price = await readMarketPrice()
                candle.addValue(price)
                await new Promise(r => setTimeout(r, Period.TEN_SECONDS));
            }
            candle.closeCandle();
            console.log('-----------------------------------------');
            console.log("candle close");
            const candleJson = JSON.stringify(candle.toSimpleObject());
            messageChannel.sendToQueue('candles', Buffer.from(candleJson));
            console.log('Candle sent do queue');
        }
    }
}

generateCandles().then(r => console.log(r))