HOW TO IMPLEMENT BACKTEST STRATEGY:

- save candles from the past V
- create virtual wallet and configure orders V
- make a function to run candles DB V
- apply strategy function on the DB V
- add EMA200 V
- RSI 70/30 border


	Parameters :

	bankroll
	bet = bankroll / 100
	timeframe
	leverage
	takeProfit
	stopLoss
	fees

IDEAS :

	STOP LOSS ON BASELINE MAYBE CHANGE TO STARTPRICE IF CANDLE IS TOO BIG

	STOP LOSS SUR LE HIGH AND LOW DES 5 last candles ou baseLine la plus haute (long) ou plus basse (short)

	AJOUT DUN FILTRE SUR TIMEFRAME SUPERIEUR POUR CONFIRMER LA TREND
