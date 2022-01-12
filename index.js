require('dotenv').config
const { Spot } = require('@binance/connector')

const apiKey = 'p7KiUy19KhoaeVwfi40qpmFiOppqdRcK0mqJfhjqDgheb66RJGAYQfexJ42cvyNk'
const apiSecret = 'Pl3FFVCZa0bFL6NKuJp2ustRfJeHyJ06a0OGUZBTaC8oDOvGlC0jm9ghMgKmzzs1'

const client = new Spot(apiKey, apiSecret)

// const candles = client.klines('BTCUSDT', '5m', {limit: 52}).then(response => client.logger.log(response.data))
async function getCandles() {
	const response = await client.klines('BTCUSDT', '5m', {limit: 52})
	const data = await response.data
	return data
}

// let candles = getCandles().then((candles) => {
// 	return candles
// })

function getConversionLine() {
	getCandles().then((candles) => {
		let index = 51;
		let hight = 0;
		let low = -1;
		for (let i = 0; i < 9; i++) {
			// console.log(candles[index][4])
			if (hight < candles[index][4])
				hight = candles[index][4]
			if (low == -1 || low > candles[index][4])
				low = candles[index][4]
			index--;
		}
		// console.log("Hight :", hight, " Low :", low)
		let conversionLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
		console.log("conversionLine :", conversionLine)
		return conversionLine
	})
}

function getBaseLine() {
	getCandles().then((candles) => {
		let index = 51;
		let hight = 0;
		let low = -1;
		for (let i = 0; i < 26; i++) {
			// console.log(candles[index][4])
			if (hight < candles[index][4])
				hight = candles[index][4]
			if (low == -1 || low > candles[index][4])
				low = candles[index][4]
			index--;
		}
		// console.log("Hight :", hight, " Low :", low)
		let baseLine = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
		console.log("baseLine :", baseLine)
		return baseLine
	})
}

function getLeadingSpanB() {
	getCandles().then((candles) => {
		let index = 51;
		let hight = 0;
		let low = -1;
		for (let i = 0; i < 52; i++) {
			// console.log(candles[index][4])
			if (hight < candles[index][4])
				hight = candles[index][4]
			if (low == -1 || low > candles[index][4])
				low = candles[index][4]
			index--;
		}
		// console.log("Hight :", hight, " Low :", low)
		let leadingSpanB = ((parseFloat(hight) + parseFloat(low)) / 2).toFixed(2);
		console.log("leadingSpanB :", leadingSpanB)
		return leadingSpanB
	})
}

function getLaggingSpan() {
	getCandles().then((candles) => {
		let laggingSpan = parseFloat(candles[52 - 26][4]).toFixed(2)
		console.log("laggingSpan :", laggingSpan)
		return laggingSpan
	})
}

function getLastPrice() {
	getCandles().then((candles) => {
		let lastPrice = parseFloat(candles[51][4]).toFixed(2)
		console.log("lastPrice :", lastPrice)
		return lastPrice
	})
}

function ichimokuCloud() {
	// conversionLine = (p9Hight + p9Low) / 2;
	const conversionLine = getConversionLine();

	// baseLine = (p26Hight + p26Low) / 2;
	const baseLine = getBaseLine();

	console.log("base and conv", baseLine, conversionLine)
	// leadingSpanA = (conversionLine + baseLine) / 2;
	const leadingSpanA = (parseFloat(conversionLine) + parseFloat(baseLine)) / 2;
	console.log("leadingSpanA :", leadingSpanA)

	// leadingSpanB = (p52Hight + p52Low) / 2;
	const leadingSpanB = getLeadingSpanB();

	// laggingSpan = lastClosePricePlotted26PeriodsPast;
	const laggingSpan = getLaggingSpan();

	const lastPrice = getLastPrice();

	// if (conversionLine > baseLine && leadingSpanA > leadingSpanB && lastPrice > leadingSpanA && laggingSpan > leadingSpanA)
	// 	console.log("Buy! Buy! Buy!")
	// else if (conversionLine < baseLine && leadingSpanA < leadingSpanB && lastPrice < leadingSpanB && laggingSpan < leadingSpanB)
	// 	console.log("Sell! Sell! Sell!")
	// else
	// 	console.log("Inside the cloud")
}

ichimokuCloud();