// market.js

import { client } from './coinbase-library.js';
import { config, accounts, price_data, markets } from './config.js';

function plaggregate(marketsData){ // IN USD!
	config.report.profitLoss = 0; // Reset P/L down to 0
	for (let market in marketsData){
		if (marketsData.hasOwnProperty(market)){
            
            // If basename_USD not defined; define now 
			if( price_data[marketsData[market]['baseName_USD']] !== undefined ){
				markets[market].base_to_usd = price_data[marketsData[market]['baseName_USD']].bid;
			}else{
				console.log("This best_bid is undefined", marketsData[market]['baseName_USD'])
			}
			// Take profits as net amount and multiply all by price_data bid OR ask
			let profitLoss = Number.parseFloat(marketsData[market]["profitLoss"]);
			config.report.profitLoss += profitLoss * (profitLoss > 0 ? Number.parseFloat(config.price_data[marketsData[market]["baseName_USD"]].bid) : Number.parseFloat(config.price_data[marketsData[market]["baseName_USD"]].ask));
		}
	}
}

export class market {
    constructor(baseName, quoteName){

        this.name = baseName + "-" + quoteName;
        this.baseName = baseName;
        this.quoteName = quoteName;
        this.best_ask = {
            price_level : 0,
            new_quantity : 0,
        }
        this.best_bid = {
            price_level : 0,
            new_quantity : 0,
        }
        this.quoteName_USD = quoteName + "-USD";
        this.last_price = 0;
        this.spentBaseBalance = 0;
        this.spentQuoteBalance = 0;
        this.min_market_funds = null;
        this.min_sell_funds = null;
        this.min_buy_funds = null;
        this.base_increment = null;
        this.quote_increment = 0.00000001;
        this.lowestAsk = -Infinity;
        this.tempLowestAsk = Infinity;
        this.highestBid = Infinity;
        this.tempHighestBid = -Infinity;
        this.profitLoss = 0;
        this.USDpl = 0;
        this.volume = 0;
        this.enabled = true;

        this.disable = () => this.enabled = false;
	    this.enable = () => this.enabled = true;

        this.submitOrder = function (side, base_size, quote_size){

            // Halt market from double-trading
            this.disable();

            // Submit request to process order
            const generateClientOrderId = () => {
                return Math.floor(new Date().getTime() / 1000).toString();
            };

            let orderDetails = {};

            // Set data for a market order
            orderDetails = {
                "client_order_id": "cbnode"+generateClientOrderId(),
                "product_id": String(this.name),
                "side": String(side),
                "order_configuration": {
                    "market_market_ioc": {}
                }
            }
            if(side == "SELL"){
                orderDetails.order_configuration.market_market_ioc.base_size = base_size.toString(); // Base is the quantity for selling ETH in ETH-USD for USD
            }else{
                orderDetails.order_configuration.market_market_ioc.quote_size = quote_size.toString(); // Quote is the value for buying ETH in ETH-USD with USD
            }

            // Confirm details of event
            console.log( "Order details: 💱💲 ", orderDetails );
            if ( config.paperTrading == false ) {
                client.submitOrder(orderDetails)
                    .then((response) => {
                        console.timeLog(response);

                        // Update balances accordingly <---------------------- Must update!!!! Use response from platform to update accordingly
                        this.updateBalances(side, base_size, quote_size);

                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }else{
                
                console.log ( 'You are now Paper-trading!' );
                // Update balances accordingly <---------------------- Must update!!!! Use response from platform to update accordingly
                this.updateBalances(side, base_size, quote_size);
            }
            this.enable();
        }

        this.updateBalances = function(side, base_size, quote_size){
            
	      	// Register a loss and gain of each individual currency depending on if buy or sell...
	      	if(side == "SELL"){
	      		base_size = -base_size;
	      		quote_size = quote_size * (1 - config.exchangeFee);
                // Upper buy limit wont matter so no need to change lowestAsk
                //What matters is to store the tempHighestBid and lastSellBid as the same as the price has dropped
                this.tempHighestBid = this.best_bid.price_level;
                this.lastSellBid = this.tempHighestBid;
                // this.lowestAsk = this.best_ask.price_level; // Clear opposing side graph
                // Increase min_sell_quote
                this.min_sell_funds += quote_size;
                // Clear min_buy_quote
  		    }else{
  		    	base_size = base_size * (1 - config.exchangeFee);
  		    	quote_size = -quote_size;
                // Lower sell limit won't matter so no need to change highestBid
                // What matters is to store the tempLowestAsk and lastBuyAsk as the same as the price has dropped
                this.tempLowestAsk = this.best_ask.price_level;
                this.lastBuyAsk = this.tempLowestAsk;
                // this.highestBid = this.best_bid.price_level; // Clear opposing side graph
                // Increase min_buy_quote
                this.min_buy_funds -= quote_size; // Quote size here is in negative so let's increase the min_buy_funds
                // Clear min_sell_quote
  		    }

  		    // Update global balances;
  		    accounts[this.baseName].acquisition += base_size;
  		    accounts[this.quoteName].acquisition += quote_size;

  		    // Market data
	      	this.spentBaseBalance += base_size;
	      	this.spentQuoteBalance += quote_size;
        }

        this.clear = function(){
            this.lowestAsk = -Infinity;
            this.tempLowestAsk = Infinity;
            this.highestBid = Infinity;
            this.tempHighestBid = -Infinity;
            console.log(this.name, "has been cleared! ⛔⛔⛔")
        }

        this.report = function(){

            console.log( "Start report: ", this.name );
            /*
            
            This function updates to config.report from the local object attributes internally.
    
            */
            // Need to reference appropriate marketPair to obtain highest bid or ask for respective conversion to USD.
            
            let currentValue = this.spentBaseBalance * (this.spentBaseBalance >= 0 ? this.best_bid : this.best_ask) * (1-config.exchangeFee); // Account for fee, this is Base qty * best bid - fee, Note: If negative we need to * best_ask
            this.profitLoss = Number.parseFloat(currentValue) + Number.parseFloat(this.spentBaseBalance); // In quote value
    
            if ( this.best_bid === undefined ){
                this.quote_to_usd = undefined;
            } else if ( !Number.isNaN(this.best_bid )) {
                this.quote_to_usd = this.best_bid;
            } else {
                // Looks like the value is somehow invalid. ********
                this.quote_to_usd = NaN;
            };
    
            // Convert in real-time quote profits to USD
            this.USDpl = turnToUSD(this.quoteName, this.profitLoss);
    
            /*
    
            Return on Investment = Net gain/loss / Cost basis
    
            */
    
            let ROI = (this.spentQuoteBalance != 0 ? (this.profitLoss / Math.abs(this.spentQuoteBalance)) * 100 : 0); // Percent ; Watch for that +/- sign!!!
    
            // Populate report data initialized in Assembler.js
    
            // NOTE: This reporting is only an approximation given the best Ask/Bid prices and not taking into account the actual market value as a whole.
            config.report.markets[this.name] = {
                currentValue: currentValue + " " + this.baseName,
                profitLoss: this.profitLoss,
                Quote_to_usd: this.quote_to_usd, // Check
                USDpl: this.USDpl + " USD",
                spentBase: this.spentBaseBalance + " " + this.baseName,
                spentQuote: this.spentQuoteBalance + " " + this.quoteName,
                volume: this.volume + " " + this.quoteName,
                ROI: ROI.toFixed(3) + "%",
            }
    
            if (config.report.volume != 0) {plaggregate(markets);}
    
            // // Account P/L in USD for config.report
    
            // Perform config.report for P/L in USD
    
            // Now working on volumeDifferential
    
            // Calculation is made by taking the current 30-day volume estimate, we need to store the current 30-day volume, or simply estimate how much volume we will generate at the current rate in the next 30-days.
            // Example 1: we estimate that 100 days have passed and a total volume of 1200 is our current, then we need to get to the current and target 30-day volume averages.
            // Trading volume is equal to the CURRENT VOLUME / 30 days.
            /*
            
            $1200/(100/30) = VolumeTraded / ( TimeElapsed / TimeWindow ) = $360 / 30 Days;
    
            Target Volume is $1500 / 30 Days
    
            Volume Differential: So we're at a shortage of $360 / $1500 30-day trading volume, this needs to preferably equal to 1, let's call this number volumeDifferential.
            The real question is how do I break down all these variables and combine them into a solid strategy?
    
            Volume differential changes with time... We need the current total volumeTraded and elapsedTime (in milli).
            *******************************************************************************************************
            
            volumeDifferential is equal to = (targetVolume / targetWindow (milliseconds)) / (tradedVolume / elapsedTime (milliseconds))
            volumeDifferential is equal to = targetDifferential / tradingDifferential
    
            *******************************************************************************************************
            Remember that VolumeDifferential is inversely proportional to the desired outcome.
            Let's get the total volume first, then worry about making changes to hit the targetVolume.
    
            1. Obtain current volume and may as well obtain P/L in USD while we're at it.
                P/L is the 
            2. Obtain elapsed time in seconds or w/e.
            3. Get differential to incorporate into the total calculation.
    
            */
        }
    }
}