import { price_data } from "./config.js";

export function turnToUSD(quoteName, quantity){
  let market_name = quoteName + "-USD";
  // console.log ( market_name );
  return quantity * price_data[market_name].bid;
}