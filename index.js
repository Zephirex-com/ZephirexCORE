// index.js

import { WebsocketClient } from 'coinbase-api';
import { marketPairs, markets, price_data, extras } from './config.js';
import { assembler } from './assembler.js';
import { advancedTradeCdpAPIKey } from './coinbase-library.js';
import { mapBalances } from './mapBalances.js';
import { getBalances } from './getBalances.js';
import { checkMarketStatus } from './checkMarkteStatus.js';
import { tradeLogic } from './zephirex.js';

const balances = await getBalances({limit:100});
console.log("Balances: ", balances);

// Map the balances to the Global accounts variable in ./config.js
mapBalances(balances.accounts);

// Assemble pairs
assembler();

const websocket = new WebsocketClient({
    // Either pass the full JSON object that can be downloaded when creating your API keys
    // cdpApiKey: advancedTradeCdpAPIKey,
  
    // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
    apiKey: advancedTradeCdpAPIKey.name,
    apiSecret: advancedTradeCdpAPIKey.privateKey,
  });

  // add event listeners for websocket clients

  websocket.on('open', (data) => {
    console.log('open: ', data?.wsKey);
  });
  
  // Data received
  websocket.on('update', (data) => {
    // console.log('update: ', JSON.stringify(data, null, 2));
    switch (data.channel) {
      case 'status':
                
        // Update market STATUS info about min market funds, and base and quote increments.
        checkMarketStatus(data.events[0].products[0]);
        break;
      
      case 'ticker':

        // Identify product ID first
        let ticker = data.events[0].tickers[0];
        let pair = ticker.product_id;
        let bestAsk = ticker.best_ask;
        let bestBid = ticker.best_bid;

        // Update best_bid and best_ask for the corresponding market
        markets[pair].best_bid.price_level = bestBid;
        markets[pair].best_ask.price_level = bestAsk;
        markets[pair].best_bid.new_quantity = ticker.best_bid_quantity;
        markets[pair].best_ask.new_quantity = ticker.best_ask_quantity;

        price_data[pair] = {
          bid: bestBid,
          ask: bestAsk,
        }

        // If market not ready...
        if (
          markets[pair] &&
          markets[pair].base_increment != null &&
          markets[pair].best_bid != null &&
          markets[pair].best_ask != null
        ) {
          tradeLogic(markets[pair], bestAsk, bestBid);
        } else {
          console.log(
            'Condition not met for pair:',
            pair,
            'Base Increment:',
            markets[pair].base_increment,
            'Best Bid:',
            bestBid,
            'Best Ask:',
            bestAsk
          );
        }
        break; 
    }
  });
  
  // Something happened, attempting to reconenct
  websocket.on('reconnect', (data) => {
    // console.log('reconnect: ', data);
  });
  
  // Reconnect successful
  websocket.on('reconnected', (data) => {
    // console.log('reconnected: ', data);
  });
  
  // Connection closed. If unexpected, expect reconnect -> reconnected.
  websocket.on('close', (data) => {
    console.error('close: ', data);
  });
  
  // Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
  websocket.on('response', (data) => {
    // console.info('response: ', JSON.stringify(data, null, 2));
    // throw new Error('res?');
    
  });
  
  websocket.on('exception', (data) => {
    console.error('exception: ', data);
  });
  
  /**
   * Use the client subscribe(topic, market) pattern to subscribe to any websocket topic.
   *
   * You can subscribe to topics one at a time or many in one request.
   *
   * Topics can be sent as simple strings, if no parameters are required:
   */
  
  // market data

  websocket.subscribe('heartbeats', 'advTradeMarketData');
  
  // This is the same as above, but using WS_KEY_MAP like an enum to reduce any uncertainty on what value to use:
  // client.subscribe('heartbeats', WS_KEY_MAP.advTradeMarketData);
  
  // user data
  // websocket.subscribe('futures_balance_summary', 'advTradeUserData');
  // websocket.subscribe('user', 'advTradeUserData');
  
  /**
   * Or send a more structured object with parameters, e.g. if parameters are required
   */
  let products = Array.from(new Set([...extras, ...marketPairs])); // Combine pairs and extras into a single list.
  const tickerSubscribeRequest = {
    topic: 'ticker',
    /**
     * Anything in the payload will be merged into the subscribe "request",
     * allowing you to send misc parameters supported by the exchange (such as `product_ids: string[]`)
     */
    payload: {
      product_ids: products,
    },
  };
  websocket.subscribe(tickerSubscribeRequest, 'advTradeMarketData');
  
  /**
   * Other adv trade public websocket topics:
   */
  websocket.subscribe(
    [
    //   {
    //     topic: 'candles',
    //     payload: {
    //       product_ids: ['ETH-USD'],
    //     },
    //   },
    //   {
    //     topic: 'market_trades',
    //     payload: {
    //       product_ids: ['ETH-USD', 'BTC-USD'],
    //     },
    //   },
    //   {
    //     topic: 'ticker',
    //     payload: {
    //       product_ids: ['ETH-USD', 'BTC-USD'],
    //     },
    //   },
    //   {
    //     topic: 'ticker_batch',
    //     payload: {
    //       product_ids: ['ETH-USD', 'BTC-USD'],
    //     },
    //   },
      {
        topic: 'level2',
        payload: {
          product_ids: marketPairs,
        },
        topic: 'status',
        payload: {
        product_ids: marketPairs,
        },
      },
    ],
    'advTradeMarketData',
  );


