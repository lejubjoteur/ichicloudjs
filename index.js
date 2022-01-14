require('dotenv').config
const { Spot } = require('@binance/connector')

const apiKey = 'p7KiUy19KhoaeVwfi40qpmFiOppqdRcK0mqJfhjqDgheb66RJGAYQfexJ42cvyNk'
const apiSecret = 'Pl3FFVCZa0bFL6NKuJp2ustRfJeHyJ06a0OGUZBTaC8oDOvGlC0jm9ghMgKmzzs1'
const client = new Spot(apiKey, apiSecret)

// --------------- Request API to get Candles ---------------

async function getCandles() {
	const response = await client.klines('BTCUSDT', '5m', {limit: 200})
	const data = response.data
	return data
}

// --------------- BacktestDB ---------------

async function getBacktestDB() {
	let db = [];
	let timestamp = Date.parse('01 nov 2021');
	for (let i = 0; i < 20; i++) {
		let response = await client.klines('BTCUSDT', '5m', {startTime: timestamp, limit: 1000})
		db.push(...response.data)
		timestamp = response.data[response.data.length - 1][0] + 5 * 60 * 1000;
	}
	return db
}

// --------------- Functions for Ichimoku ---------------

async function getAverageInterval(candles, index, interval) {
	let hight = 0;
	let low = -1;
	for (let i = index; i <= interval; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let average = ((parseFloat(hight) + parseFloat(low)) / 2);
	return average;
}

// Last price (not necessarily closed)
async function getLastPrice(candles) {
	let lastPrice = parseFloat(candles[candles.length - 1][4])
	return lastPrice
}

// --------------- new Order ---------------

let orders = [];

async function newOrder(candles, lastPrice, stopLoss, typePosition) {
	let takeProfit = (lastPrice - stopLoss) * 100 / lastPrice * 1.5 * lastPrice / 100 + lastPrice
	let order = new Order(candles[candles.length - 1][0], lastPrice, stopLoss, takeProfit, typePosition);
	orders.push(order);
	console.log(new Date(orders.slice(-1)[0].date).toString());
	console.log("Price Order :", orders.slice(-1)[0].priceOrder);
	console.log("Take profit :", orders.slice(-1)[0].takeProfit);
	console.log("Stop loss :", orders.slice(-1)[0].stopLoss);
	return true
}

// --------------- Ichimoku Indicator ---------------

// All that we need for ichimoku strategy
async function ichimokuCloud(candles) {
	let conversionLine = await getAverageInterval(candles, 1, 9);
	let baseLine = await getAverageInterval(candles, 1, 26);
	// console.log("baseLine :" + "\x1b[33m", baseLine,'\x1b[0m', "conversionLine :" + "\x1b[34m", conversionLine, '\x1b[0m')

	let leadingSpanA = ((parseFloat(conversionLine) + parseFloat(baseLine)) / 2);
	let leadingSpanB = await getAverageInterval(candles, 1, 52);
	// console.log("leadingSpanA :" + "\x1b[32m", leadingSpanA,'\x1b[0m', "leadingSpanB :" + "\x1b[31m", leadingSpanB, '\x1b[0m')

	let conversionLine52 = await getAverageInterval(candles, 52, 52 + 9);
	let baseLine52 = await getAverageInterval(candles, 52, 52 + 26);
	let old52SpanA = ((parseFloat(conversionLine52) + parseFloat(baseLine52)) / 2);
	let old52SpanB =  await getAverageInterval(candles, 52, 52 + 52);
	let laggingSpan = await getLastPrice(candles);
	// console.log("laggingSpan :" + "\x1b[35m", laggingSpan,'\x1b[0m', "old52SpanA :" + "\x1b[32m", old52SpanA, '\x1b[0m', "old52SpanB :" + "\x1b[31m", old52SpanB, '\x1b[0m')

	let conversionLine26 = await getAverageInterval(candles, 26, 26 + 9);
	let baseLine26 = await getAverageInterval(candles, 26, 26 + 26);
	let old26SpanA = ((parseFloat(conversionLine26) + parseFloat(baseLine26)) / 2);
	let old26SpanB = await getAverageInterval(candles, 26, 52 + 26);
	let lastPrice = await getLastPrice(candles);
	// console.log("lastPrice :" + "\x1b[36m", lastPrice,'\x1b[0m', "old26SpanA :" + "\x1b[32m", old26SpanA, '\x1b[0m', "old26SpanB :" + "\x1b[31m", old26SpanB, '\x1b[0m')

	let lastOrder = orders.slice(-1)[0];

	if (conversionLine > baseLine
		&& leadingSpanA > leadingSpanB
		&& lastPrice > old26SpanA && lastPrice > old26SpanB
		&& laggingSpan > old52SpanA && laggingSpan > old52SpanB
		&& (!lastOrder || lastOrder.long == false)
		&& lastPrice > parseFloat(candles[candles.length - 2][4])
	) {
			console.log("\x1b[32m" + "Buy! Buy! Buy!", '\x1b[0m')
			let stopLoss = old26SpanB;
			return newOrder(candles, lastPrice, stopLoss, true);
		}
	else if (conversionLine < baseLine
		&& leadingSpanA < leadingSpanB
		&& lastPrice < old26SpanA && lastPrice < old26SpanB
		&& laggingSpan < old52SpanA && laggingSpan < old52SpanB
		&& (!lastOrder || lastOrder.long == true)
		&& lastPrice < parseFloat(candles[candles.length - 2][4])
	) {
			console.log("\x1b[31m" + "Sell! Sell! Sell!", '\x1b[0m')
			let stopLoss = old26SpanA;
			return newOrder(candles, lastPrice, stopLoss, false);
		}
	else
		return false;
}

class Order {
	profit = 0
	leverage = 1

	constructor(date, priceOrder, stopLoss, takeProfit, long) {
		this.date = date;
		this.priceOrder = priceOrder;
		this.stopLoss = stopLoss;
		this.takeProfit = takeProfit;
		this.long = long;
	}

	badTrade() {
		this.profit = (this.priceOrder - this.stopLoss) * 100 / this.priceOrder;
		if (this.long)
			this.profit = -this.profit
		this.profit = this.profit * this.leverage
		console.log("bad")
	}

	goodTrade() {
		this.profit = (this.priceOrder - this.takeProfit) * 100 / this.priceOrder;
		if (this.long)
			this.profit = -this.profit
		this.profit = this.profit * this.leverage
		console.log("good")
	}
}

async function main() {
	// let candles = await getCandles()
	let db = await getBacktestDB();
	let candles = [];

	let position = false;

	while (db.length > 200) {
		candles = db.slice(0, 200)
		if (!position)
			position = await ichimokuCloud(candles);
		else {
			let lastOrder = orders.slice(-1)[0]
			let lastCandle = candles.slice(-1)[0]
			position = false;
			if (lastOrder.long && lastCandle[2] >= lastOrder.takeProfit)
				lastOrder.goodTrade();
			else if (lastOrder.long && lastCandle[3] <= lastOrder.stopLoss)
				lastOrder.badTrade();
			else if (!lastOrder.long && lastCandle[3] <= lastOrder.takeProfit)
				lastOrder.goodTrade();
			else if (!lastOrder.long && lastCandle[2] >= lastOrder.stopLoss)
				lastOrder.badTrade();
			else
				position = true;
		}
		db.shift()
	}
		console.log("Trades Win : " + orders.reduce((a, b) => {
			if (b.profit > 0)
				return a + 1
			else
				return a
		}, 0))
		console.log("Orders : " + orders.length)
		let profits = 0;
		for (let order of orders) {
			profits = parseFloat(profits) + parseFloat(order.profit)
		}
		console.log("Profits : " + profits.toFixed(2) + "%")
}

main();
