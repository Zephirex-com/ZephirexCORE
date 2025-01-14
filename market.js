// market.js

import { client } from './coinbase-library.js';
import { config, accounts } from './config.js';

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
                
                console.log ('Console Info');
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
                this.highestBid = this.best_bid.price_level; // Clear opposing side graph
                this.tempHighestBid = this.best_bid.price_level;
                // Increase min_sell_quote
                this.min_sell_funds += quote_size;
                // Clear min_buy_quote
                this.min_buy_funds = this.min_market_funds;
  		    }else{
  		    	base_size = base_size * (1 - config.exchangeFee);
  		    	quote_size = -quote_size;
                this.lowestAsk = this.best_bid.price_level; // Clear opposing side graph
                this.tempLowestAsk = this.best_bid.price_level;
                // Increase min_buy_quote
                this.min_buy_funds -= quote_size; // Quote size here is in negative so let's increase the min_buy_funds
                // Clear min_sell_quote
                this.min_sell_funds = this.min_market_funds;
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
            //console.log ("Report generated for... ", this.name);
        }
    }
}