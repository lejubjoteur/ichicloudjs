HOW TO IMPLEMENT BACKTEST STRATEGY:

- save candles from the past V
- create virtual wallet and configure orders
- make a function to run candles DB
- apply strategy function on the DB


	Parameters :

	bankroll
	bet = bankroll / 100
	timeframe
	leverage
	takeProfit
	stopLoss
	fees

<!-- memories loosing candles due to maintenance -->
<!-- let last = Date.parse('13 jan 2021');
	for (let i in db){
		if (db[i][0] - last !== 300000)
			console.log(i,db[i][0] - last,new Date(last).toString(), new Date(db[i][0]).toString())
		last = db[i][0]
	} -->