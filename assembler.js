// Assembler.js

import { marketPairs, price_data, extras } from './config.js';
import { market } from './market.js';

export function assembler(){
    // Iterate through markets
    for (let pair in marketPairs){
        let name = pair;
        let base = pair.split("-")[0];
        let quote = pair.split("-")[1]; // Need quote to account for USD pairs

        // Initialize global price data
        price_data[ name ] = {
            ask: Infinity,
            bid: -Infinity
        }
        // Include non-existing xxx-USD pair in extras for Ticker info value in USD ** Required for -USD
        /* Why is it that I have a global... ohhhh for the report in USD values... ok*/

        let base2usd = base+"-USD";
        let condition1 = !name.endsWith("-USD"); // Pair NOT end in "USD"
        let condition2 = !marketPairs.includes(base2usd); // Pair base-USD NOT included in config.pairs

        if(condition1 && condition2){
            // If pair NOT end in US, and pair not included in config.pairs:
            // console.log( "Extra New Pair: ", q2usd );
            extras.push( q2usd );

            // Need Price data for USD prices that are not listed in pairs!!!
            price_data[ base2usd ] = {
                ask: Infinity,
                bid: -Infinity,
            }

            // console.log(q2usd + " this q2usd Market added to ws subscription");
        }

        // Initialize market
        markets[name] = new market(name);
    }
}