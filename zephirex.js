// Zephirex.js

import { markets, report, accounts, config, matchDecimals, marketPairs, price_data } from './config.js';

// Function to count pairs that start with a specific currency
const countStartsWith = (pairs, currency) => {
    return pairs.filter(pair => pair.startsWith(`${currency}-`)).length;
};

// Function to count pairs that end with a specific currency
const countEndsWith = (pairs, currency) => {
    return pairs.filter(pair => pair.endsWith(`-${currency}`)).length;
};

function zephirex(a, b) {
    let numSegments = 9000;
    b = b * Math.PI;
    a = a * Math.PI;
    const dx = (b - a) / numSegments;
    let area = 0;
  
    for (let i = 0; i < numSegments; i++) {
      const x1 = a + i * dx;
      const x2 = x1 + dx;
  
      // Evaluate the curve function at the two endpoints
      const y1 = Math.abs(1 + Math.cos(x1));
      const y2 = Math.abs(1 + Math.cos(x2));
  
      // Calculate the area of the trapezoid and add it to the total area
      area += ((y1 + y2) * dx) / 2;
    }
  
    return area;
}

// Buy command:
function buy(pair, marketPair) {
    const best_ask = marketPair.best_ask.price_level;
    const best_quantity = marketPair.best_ask.new_quantity; // In BASE units
    marketPair.tempLowestAsk = best_ask;

    // Calculate, then ADD acquisition and must be in funds!!!
    const ratio = zephirex ( ( best_ask / marketPair.lowestAsk ), marketPair.lastBuyAsk / marketPair.lowestAsk ) * (1 - config.fee);

    // Count the number of markets buying with this quote currency to divide Available by.
    let marketsInUse = countEndsWith(marketPairs, marketPair.quoteName);

    let available = (parseFloat(accounts[marketPair.quoteName].available) + parseFloat(accounts[marketPair.quoteName].acquisition)) / marketsInUse;
    if ( available < 0 ) { available = 0 }; // Available cannot be < 0; Should not be < 0 ever.

    // Define Quote size for buying i.e. USD
    const quote_size = parseFloat(ratio * available * config.xFactor * config.volumeDifferential);

    // OMV > RV > MMV == Execute trade now
    const optimalMarketValue = best_ask * best_quantity;

    // Subtract spent units of balance stored globally -- (Add because the target value is in the negative if already bought);
    let readyValue = quote_size - marketPair.min_buy_funds; // In QUOTE units!!
    readyValue = matchDecimals(marketPair.quote_increment, readyValue)

    console.log("Buy: ", pair, "Price:", best_ask, "OMV: $", optimalMarketValue, "xFactor:", config.xFactor, "RV:", readyValue, "min:", marketPair.min_market_funds, "qte:", marketPair.quoteName, "prox:", ((readyValue / marketPair.min_market_funds) * 100).toFixed(8),"%"); // All in quote units!
    if (optimalMarketValue >= readyValue && readyValue >= marketPair.min_market_funds) {
        // console.log("Market trade conditions are met!");

        // Trade condition has been met, transact now
        marketPair.submitOrder("BUY", readyValue / best_ask, readyValue); // Side, Base, Quote
    }
}

// Sell command:
function sell(pair, marketPair) {
    const best_bid = marketPair.best_bid.price_level;
    const best_quantity = marketPair.best_bid.new_quantity; // In BASE units
    marketPair.tempHighestBid = best_bid;

    // Calculate, then ADD acquisition and must be in funds!!!
    const ratio = zephirex ( ( marketPair.highestBid / best_bid ), marketPair.highestBid / marketPair.lastSellBid ) * (1 - config.fee);
    
    // Count the number of markets selling with this base currency to divide Available by.
    let marketsInUse = countStartsWith( marketPairs, marketPair.baseName );

    let available = (parseFloat(accounts[marketPair.baseName].available) + parseFloat(accounts[marketPair.baseName].acquisition)) / marketsInUse;
    if( available < 0 ) { available = 0 }; // Available cannot be < 0; Should not be < 0 ever.

    // Define Base size for buying i.e. SHIB
    const base_size = parseFloat(ratio * available * config.xFactor * config.volumeDifferential);

    // OMV > RV > MMV == Execute trade now
    const optimalMarketValue = best_bid * best_quantity;

    // Subtract spent units of balance stored globally -- (Add because the target value is in the negative if already sold);
    let readyValue = (base_size * best_bid) - marketPair.min_sell_funds; // In QUOTE units!!
    readyValue = matchDecimals(marketPair.base_increment, readyValue); // Ready to proper decimal count

    console.log("Sell: ", pair, "Price:", best_bid, "OMV: $",optimalMarketValue, "xFactor:", config.xFactor, "RV:", readyValue, "min:", marketPair.min_market_funds, "qte:", marketPair.quoteName, "prox:", ((readyValue / marketPair.min_market_funds) * 100).toFixed(8),"%"); // All in quote units!
    if (optimalMarketValue >= readyValue && readyValue >= marketPair.min_market_funds) {
        // console.log("Market trade conditions are met!");

        // Trade condition has been met, transact now
        marketPair.submitOrder("SELL", (readyValue / best_bid), readyValue); // Side, Base, Quote
    }
}

export function tradeLogic(marketPair, best_ask, best_bid) {
    // Define market name
    const pair = marketPair.name;

    // Handle trade logic for enabled market pairs
    if (marketPair && marketPair.enabled) {
        // Initialize lowestAsk and highestBid if not set
        if (marketPair.lowestAsk === -Infinity) {
            console.log("New price set:", pair, best_ask);
            marketPair.lowestAsk = best_ask;
            marketPair.tempLowestAsk = best_ask;
            marketPair.lastBuyAsk = best_ask;
        }

        if (marketPair.highestBid === Infinity) {
            console.log("New price set:", pair, best_bid);
            marketPair.highestBid = best_bid;
            marketPair.tempHighestBid = best_bid;
            marketPair.lastSellBid = best_bid;
        }

        // Sell condition: Bidding price goes up
        if (best_bid > markets[pair].tempHighestBid) {
            // Initiate sell operation
            // console.log("SELL: ", marketPair);
            sell(pair, marketPair); // Potential SELL opportunity
        }

        // Sell condition changes: Bidding price goes down
        if (best_bid < markets[pair].highestBid) {
            if( marketPair.lastSellBid == marketPair.highestBid ) { marketPair.lastSellBid = best_bid; }
            markets[pair].highestBid = best_bid;
            // console.log("📉: ", pair);
        }



        // Buy condition changes: Asking price goes up [ Upper BUY Limit ]
        if (best_ask > markets[pair].lowestAsk) {
            if ( marketPair.lastBuyAsk == marketPair.lowestAsk ) { marketPair.lastBuyAsk = best_ask; } // Set b & c values
            markets[pair].lowestAsk = best_ask;
            // console.log("📈: ", pair);
        }

        // Buy condition: Asking price goes down [ Lower Buy Limit ]
        if (best_ask < markets[pair].tempLowestAsk) {
            // Initiate buy operation
            // console.log("BUY: ", marketPair);
            buy(pair, marketPair); // Potential BUY opportunity
        }

        // Update report for this market
        console.log(price_data);
        marketPair.report();
        report.accounts = accounts;

    } else {
        console.log(`${pair} is currently being worked on by transact() function.`);
    }
}
