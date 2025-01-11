// Zephirex.js

import { markets, report, accounts, config, matchDecimals, turnToUSD } from './config.js';

function zephirex(a) {
    let numSegments = 9000;
    let b = Math.PI;
    a = a * Math.PI;
    const dx = (b - a) / numSegments; // Width of each segment
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
    markets[pair].tempLowestAsk = best_ask;

    // Calculate, then ADD acquisition and must be in funds!!!
    const ratio = zephirex((best_ask / marketPair.lowestAsk)) * (1 - config.fee);
    const available = Number.parseFloat(accounts[marketPair.quoteName].available) + parseFloat(accounts[marketPair.baseName].acquisition);

    // Define Quote size for buying i.e. USD
    const quote_size = matchDecimals(marketPair.quote_increment, Number.parseFloat(ratio * available * config.xFactor * config.volumeDifferential));

    // OMV > RV > MMV == Execute trade now
    const optimalMarketValue = best_ask * best_quantity;

    // Subtract spent units of balance stored globally -- (Subtract because we want the ready value to be less than the base_size);
    const readyValue = quote_size - accounts[marketPair.quoteName].acquisition; // In QUOTE units!!

    console.log("🔵", pair, "OMV:", optimalMarketValue, "RV:", readyValue, "min:", marketPair.min_market_funds, "qte:", marketPair.quoteName, "prox:", (readyValue / marketPair.min_market_funds) * 100); // All in quote units!
    if (optimalMarketValue >= readyValue && readyValue >= marketPair.min_market_funds) {
        console.log("Market trade conditions are met!");
        marketPair.disable();
        // Trade condition has been met, transact now
        marketPair.submitOrder("BUY", readyValue / best_ask, readyValue); // Side, Base, Quote
    }
}

// Sell command:
function sell(pair, marketPair) {
    const best_bid = marketPair.best_bid.price_level;
    const best_quantity = marketPair.best_bid.new_quantity; // In BASE units
    markets[pair].tempHighestBid = best_bid;

    // Calculate, then ADD acquisition and must be in funds!!!
    const ratio = zephirex((marketPair.highestBid / best_bid)) * (1 - config.fee);
    const available = parseFloat(accounts[marketPair.baseName].available) + parseFloat(accounts[marketPair.baseName].acquisition);

    // Define Base size for buying i.e. SHIB
    const base_size = matchDecimals(marketPair.base_increment, Number.parseFloat(ratio * available * config.xFactor * config.volumeDifferential));

    // OMV > RV > MMV == Execute trade now
    const optimalMarketValue = best_bid * best_quantity;

    // Subtract spent units of balance stored globally -- (Subtract because we want the ready value to be less than the base_size);
    const readyValue = (base_size - accounts[marketPair.baseName].acquisition) * best_bid; // In QUOTE units!!

    console.log("🔴", pair, "OMV: $",optimalMarketValue, "RV:", readyValue, "min:", marketPair.min_market_funds, "qte:", marketPair.quoteName, "prox:", (readyValue / marketPair.min_market_funds) * 100); // All in quote units!
    if (optimalMarketValue >= readyValue && readyValue >= marketPair.min_market_funds) {
        console.log("Market trade conditions are met!");
        marketPair.disable();
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
            markets[pair].lowestAsk = best_ask;
            markets[pair].tempLowestAsk = best_ask;
        }

        if (marketPair.highestBid === Infinity) {
            console.log("New price set:", pair, best_bid);
            markets[pair].highestBid = best_bid;
            markets[pair].tempHighestBid = best_bid;
        }

        // Sell condition: Bidding price goes up
        if (best_bid > markets[pair].tempHighestBid) {
            // Initiate sell operation
            // console.log("SELL: ", marketPair);
            sell(pair, marketPair); // Potential SELL opportunity
        }

        // Sell condition changes: Bidding price goes down
        if (best_bid < markets[pair].highestBid) {
            markets[pair].highestBid = best_bid;
            console.log("📈: ", pair);
        }

        // Buy condition changes: Asking price goes up
        if (best_ask > markets[pair].lowestAsk) {
            markets[pair].lowestAsk = best_ask;
            console.log("📉: ", pair);
        }

        // Buy condition: Asking price goes down
        if (best_ask < markets[pair].tempLowestAsk) {
            // Initiate buy operation
            // console.log("BUY: ", marketPair);
            buy(pair, marketPair); // Potential BUY opportunity
        }

        // Update report for this market
        markets[pair].report();
        report.accounts = accounts;

    } else {
        console.log(`${pair} is currently being worked on by transact() function.`);
    }
}
