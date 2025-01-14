// config.js

export const marketPairs = [
    "SHIB-USD",
    "BTC-USD",
    "ETH-USD",
    "ETH-BTC"
];

export const extras = [];

export const markets = {}; // This holds all the market objects

export const accounts = {};

export const price_data = {};

export const config = {
    paperTrading: true,
    xFactor: 450, // Risk factor 0 to 0.85 = less risk
    fee: 0.007,
    volumeDifferential: 1, // This is for use with TTVE
    exchangeFee: .001,
}

export const report = {
    "accounts": {},
};

export function turnToUSD(quoteName, quantity){
  let market_name = quoteName + "-USD";
  // console.log ( market_name );
  return quantity * config.price_data[market_name].bid;
}

export function matchDecimals(format, value){

	const str1 = format.toString();

	const decimalPlaces1 = str1.includes('.') ? str1.split('.')[1].length : 0;

	//convert
	const adjustedVariable2 = Number(value.toFixed(decimalPlaces1));

	// console.log("Match decimals: ", format, value, adjustedVariable2)

	return adjustedVariable2;

}