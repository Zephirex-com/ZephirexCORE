// checkMarketStatus.js - Updates market status variables like base and quote increments and min market funds

import { markets } from './config.js';

export function checkMarketStatus(data){
    
    // console.log("Channel: ", parsedData.channel)
    //console.log("+status: ", data);
    let pair = data.id;
    // console.log("Status: (Is there a Base minimun?)", pair, data);
    // If market pair object exists, then assign min_market_funds to it.
    //console.log("Increments: " , pair, data)
    markets[pair] && ( markets[pair].min_market_funds = data.min_market_funds );
    markets[pair] && ( markets[pair].min_buy_funds = data.min_market_funds );
    markets[pair] && ( markets[pair].min_sell_funds = data.min_market_funds );
    markets[pair] && ( markets[pair].base_increment = data.base_increment );
    markets[pair] && ( markets[pair].quote_increment = data.quote_increment );
}