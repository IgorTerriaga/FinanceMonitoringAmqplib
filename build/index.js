"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const Period_1 = __importDefault(require("./enums/Period"));
const Candle_1 = __importDefault(require("./models/Candle"));
const Messagechannel_1 = require("./messages/Messagechannel");
(0, dotenv_1.config)();
(0, dotenv_1.config)();
const readMarketPrice = async () => {
    const result = await axios_1.default.get(process.env.PRICES_API ?? 'http://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const data = result.data;
    const price = data.bitcoin.usd;
    return price;
};
const generateCandles = async () => {
    const messageChannel = await (0, Messagechannel_1.createMessageChannel)();
    if (messageChannel) {
        while (true) {
            const looptimes = Period_1.default.ONE_MINUTE / Period_1.default.TEN_SECONDS;
            const candle = new Candle_1.default('BTC');
            console.log('------------------------------------');
            console.log('Generate new candle');
            for (let i = 0; i < looptimes; i++) {
                const price = await readMarketPrice();
                candle.addValue(price);
                await new Promise(r => setTimeout(r, Period_1.default.ONE_MINUTE));
            }
            candle.closeCandle();
            console.log('-----------------------------------------');
            console.log("candle close");
            const candleJson = JSON.stringify(candle.toSimpleObject());
            messageChannel.sendToQueue('candles', Buffer.from(candleJson));
            console.log('Candle sent do queue');
        }
    }
};
generateCandles().then(r => console.log(r));
