// config.js

export const marketPairs = [
    "SHIB-USD",
    "BTC-USD",
    "ETH-USD",
    "DASH-USD",
    "LTC-USD",
    "UNI-USD",
    "LTC-BTC",
    "ETH-BTC",
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
    paperTrading: true, // Basically stops real orders from being submitted into Coinbase while keeping approximate records of balances.
    xFactor: process.env.XFACTOR || 900, // Risk factor 0 to 0.85 = less risk
    fee: process.env.FEE || .003, // Imaginary fee to have as padding.
    volumeDifferential: 1, // This is for use with TTVE (depricated)
    exchangeFee: .0015,
}

export const report = {
    "accounts": {},
    "overview": {},
};

export function matchDecimals(format, value){

	const str1 = format.toString();

	const decimalPlaces1 = str1.includes('.') ? str1.split('.')[1].length : 0;

	//convert
	const adjustedVariable2 = Number(value.toFixed(decimalPlaces1));

	// console.log("Match decimals: ", format, value, adjustedVariable2)

	return adjustedVariable2;

}