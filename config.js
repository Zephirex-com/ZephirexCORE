// config.js

export const marketPairs = [
    "SHIB-USD",
    "BTC-USD",
    "ETH-USD",
    "ETH-BTC",
    "DASH-USD",
    "LTC-USD",
    "LTC-BTC",
    "UNI-USD"
];

export const extras = [];

export const markets = {}; // This holds all the market objects

export const accounts = {};

export const price_data = { // Initialize price data
    "USD-USD": {
        bid: 1,
        ask: 1
    }
};

export const config = {
    paperTrading: true,
    xFactor: process.env.XFACTOR || 1, // Risk factor 0 to 0.85 = less risk
    fee: 0.008,
    volumeDifferential: 1, // This is for use with TTVE
    exchangeFee: .0015,
}

export const report = {
    "accounts": {},
};

export function matchDecimals(format, value){

	const str1 = format.toString();

	const decimalPlaces1 = str1.includes('.') ? str1.split('.')[1].length : 0;

	//convert
	const adjustedVariable2 = Number(value.toFixed(decimalPlaces1));

	// console.log("Match decimals: ", format, value, adjustedVariable2)

	return adjustedVariable2;

}