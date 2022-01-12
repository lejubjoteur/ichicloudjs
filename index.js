require('dotenv').config
const { Spot } = require('@binance/connector')

const apiKey = 'p7KiUy19KhoaeVwfi40qpmFiOppqdRcK0mqJfhjqDgheb66RJGAYQfexJ42cvyNk'
const apiSecret = 'Pl3FFVCZa0bFL6NKuJp2ustRfJeHyJ06a0OGUZBTaC8oDOvGlC0jm9ghMgKmzzs1'

const client = new Spot(apiKey, apiSecret)

client.klines('BTCUSDT', '5m', {limit: 52}).then(response => client.logger.log(response.data))

let candles = response.data;
let index = 51;
for (let i = 0; i < 9; i++) {
	console.log(candles[index][4]);
	index--;
}

let p26Hight;
let p26Low;

let p9Hight;
let p9Low;

let p52Hight;
let p52Low;

let baseLine = (p26Hight + p26Low) / 2;
let conversionLine = (p9Hight + p9Low) / 2;
// let laggingSpan = lastClosePricePlotted26PeriodsPast;
let leadingSpanA = (conversionLine + baseLine) / 2;
let leadingSpanB = (p52Hight + p52Low) / 2;