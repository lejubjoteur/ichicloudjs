HOW TO IMPLEMENT BACKTEST STRATEGY:

- save candles from the past					V
- create virtual wallet and configure orders	V
- make a function to run candles DB				V
- apply strategy function on the DB				V
- add EMA200 									V Bad idea : price found are not the same

	Parameters :

	bankroll
	bet = bankroll / 100
	timeframe
	leverage
	takeProfit
	stopLoss
	fees
	timeframe h1 : best winrate and ROI for less fees

IDEAS :

	STOP LOSS SUR LE HIGH AND LOW DES 5 last candles ou baseLine la plus haute (long) ou plus basse (short)

	AJOUT DUN FILTRE SUR TIMEFRAME SUPERIEUR POUR CONFIRMER LA TREND

	Tracer des trends en timeframe superieur ou avec les higths/lows sur une periode

	RSI 70/30 border same or time frame 4h/daily