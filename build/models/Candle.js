"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CandleColor_1 = __importDefault(require("../enums/CandleColor"));
class Candle {
    low;
    high;
    open;
    close;
    color;
    finalDateTime;
    values;
    currency;
    constructor(currency) {
        this.currency = currency;
        this.low = Infinity;
        this.high = 0;
        this.close = 0;
        this.open = 0;
        this.values = [];
        this.color = CandleColor_1.default.UNDETERMINED;
    }
    addValue(value) {
        this.values.push(value);
        if (this.values.length == 1) {
            this.open = value;
        }
        if (this.low > value) {
            this.low = value;
        }
        if (this.high < value) {
            this.high = value;
        }
    }
    closeCandle() {
        if (this.values.length > 0) {
            this.close = this.values[this.values.length - 1];
            this.finalDateTime = new Date();
            if (this.open > this.close) {
                this.color = CandleColor_1.default.RED;
            }
            else if (this.close > this.open) {
                this.color = CandleColor_1.default.GREEN;
            }
        }
    }
    toSimpleObject() {
        const { values, ...obj } = this;
        return obj;
    }
}
exports.default = Candle;
