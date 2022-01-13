require('dotenv').config
const { Spot } = require('@binance/connector')

const apiKey = 'p7KiUy19KhoaeVwfi40qpmFiOppqdRcK0mqJfhjqDgheb66RJGAYQfexJ42cvyNk'
const apiSecret = 'Pl3FFVCZa0bFL6NKuJp2ustRfJeHyJ06a0OGUZBTaC8oDOvGlC0jm9ghMgKmzzs1'
const client = new Spot(apiKey, apiSecret)

async function getCandles() {
	const response = await client.klines('BTCUSDT', '1m', {limit: 200})
	const data = response.data
	return data
}

// Highest and Lowest price since 9periods in past
async function getConversionLine(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 1; i <= 9; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let conversionLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return conversionLine
}

// Highest and Lowest price since 26periods in the past
async function getBaseLine(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 1; i <= 26; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let baseLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2)
	return baseLine
}

// Highest and Lowest price since 52periods in the past ploted 26periods in the future
async function getLeadingSpanB(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 1; i <= 52; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let leadingSpanB = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return leadingSpanB
}

// Closed price plotted 26 periods in the past
async function getLaggingSpan(candles) {
	let laggingSpan = parseFloat(candles[candles.length - 1][4]).toFixed(2)
	return laggingSpan
}

// Last price (not necessarily closed)
async function getLastPrice(candles) {
	let lastPrice = parseFloat(candles[candles.length - 1][4]).toFixed(2)
	return lastPrice
}

// --------------- New values needed ---------------

async function getConversionLine52(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 52; i <= 52 + 9; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let conversionLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return conversionLine
}

async function getBaseLine52(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 52; i <= 52 + 26; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let baseLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2)
	return baseLine
}

// Value of SpanB 52 periods in the past to compare with laggingSpan
async function getOld52SpanB(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 52; i <= 52 + 52; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let leadingSpanB = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return leadingSpanB
}

async function getConversionLine26(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 26; i <= 26 + 9; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let conversionLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return conversionLine
}

async function getBaseLine26(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 26; i <= 26 + 26; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let baseLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2)
	return baseLine
}

// Value of SpanB 26 periods in the past to compare with lastPrice
async function getOld26SpanB(candles) {
	let hight = 0;
	let low = -1;
	for (let i = 26; i <= 52 + 26; i++) {
		if (hight < candles[candles.length - i][2])
			hight = candles[candles.length - i][2]
		if (low == -1 || low > candles[candles.length - i][3])
			low = candles[candles.length - i][3]
	}
	let leadingSpanB = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
	return leadingSpanB
}

// --------------- Ichimoku Indicator ---------------

// All that we need for ichimoku strategy
async function ichimokuCloud() {
	let candles = await getCandles()

	let conversionLine = await getConversionLine(candles);
	let baseLine = await getBaseLine(candles);
	console.log("baseLine :" + "\x1b[33m", baseLine,'\x1b[0m', "conversionLine :" + "\x1b[34m", conversionLine, '\x1b[0m')

	let leadingSpanA = ((parseFloat(conversionLine) + parseFloat(baseLine)) / 2).toFixed(2);
	let leadingSpanB = await getLeadingSpanB(candles);
	console.log("leadingSpanA :" + "\x1b[32m", leadingSpanA,'\x1b[0m', "leadingSpanB :" + "\x1b[31m", leadingSpanB, '\x1b[0m')

	let conversionLine52 = await getConversionLine52(candles);
	let baseLine52 = await getBaseLine52(candles);
	let old52SpanA = ((parseFloat(conversionLine52) + parseFloat(baseLine52)) / 2).toFixed(2);
	let old52SpanB =  await getOld52SpanB(candles);
	let laggingSpan = await getLaggingSpan(candles);
	console.log("laggingSpan :" + "\x1b[35m", laggingSpan,'\x1b[0m', "old52SpanA :" + "\x1b[32m", old52SpanA, '\x1b[0m', "old52SpanB :" + "\x1b[31m", old52SpanB, '\x1b[0m')

	let conversionLine26 = await getConversionLine26(candles);
	let baseLine26 = await getBaseLine26(candles);
	let old26SpanA = ((parseFloat(conversionLine26) + parseFloat(baseLine26)) / 2).toFixed(2);
	let old26SpanB = await getOld26SpanB(candles);
	let lastPrice = await getLastPrice(candles);
	console.log("lastPrice :" + "\x1b[36m", lastPrice,'\x1b[0m', "old26SpanA :" + "\x1b[32m", old26SpanA, '\x1b[0m', "old26SpanB :" + "\x1b[31m", old26SpanB, '\x1b[0m')

	if (conversionLine > baseLine
		&& leadingSpanA > leadingSpanB
		&& lastPrice > old26SpanA && lastPrice > old26SpanB
		&& laggingSpan > old52SpanA && laggingSpan > old52SpanB)
		{
			console.log("\x1b[32m" + "Buy! Buy! Buy!", '\x1b[0m')
		}
	else if (conversionLine < baseLine
		&& leadingSpanA < leadingSpanB
		&& lastPrice < old26SpanB && lastPrice < old26SpanB
		&& laggingSpan < old52SpanB && lastPrice < old52SpanB)
		{
			console.log("\x1b[31m" + "Sell! Sell! Sell!", '\x1b[0m')
		}
	else
		console.log("DO NOTHING ! INDICATOR SIGNAL DISABLE !")
}

ichimokuCloud();

// --------------- Wallet and Order ---------------


