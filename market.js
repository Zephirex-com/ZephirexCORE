// market.js

import { client } from './coinbase-library.js';

export class market {
    constructor(baseName, quoteName){

        this.name = baseName + "-" + quoteName;
        this.baseName = baseName;
        this.quoteName = quoteName;
        this.ask = Infinity;
        this.bid = -Infinity;
        this.quoteName_USD = quoteName + "-USD";
        this.last_price = 0;
        this.spentBaseBalance = 0;
        this.spentQuoteBalance = 0;
        this.min_market_funds = null;
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

            // Temporarily disable pair to avoid double-trading
            this.disable();

            // Submit request to process order
            const generateClientOrderId = () => {
                return Math.floor(new Date().getTime() / 1000).toString();
            };

            let orderDetails = {};

            // Set data for a market order
            if(side === "SELL"){
                orderDetails = {
                    "client_order_id": generateClientOrderId(),
                    "product_id": String(this.name),
                    "side": String(side),
                    "order_configuration": {
                    "market_market_ioc": {
                        "base_size": base_size.toString(), // Base is the quantity for selling ETH in ETH-USD for USD
                    }
                    }
                };
            }else{
                orderDetails = {
                    "client_order_id": generateClientOrderId(),
                    "product_id": String(this.name),
                    "side": String(side),
                    "order_configuration": {
                    "market_market_ioc": {
                        "quote_size": quote_size.toString(), // Quote is the value for buying ETH in ETH-USD with USD
                    }
                    }
                };
            }

            // Confirm details of event
            console.log( "Order details: ", orderDetails );
            client.submitOrder(orderDetails)
                .then((response) => {
                    console.log(response);
                })
                .catch((error) => {
                    console.error(error);
                });

            // Update balances accordingly <---------------------- Must update!!!!
            accounts[this.name].acquisition += 0; 

            // Re-enable pair
            this.enable();

        }

        this.clear = function(){
            this.lowestAsk = -Infinity;
            this.tempLowestAsk = Infinity;
            this.highestBid = Infinity;
            this.tempHighestBid = -Infinity;
        }
    }
}