// index.js

import { CBAdvancedTradeClient, WebsocketClient } from 'coinbase-api';
import { marketPairs } from 'marketPairs';
/**
 * Or, with import:
 * import { CBAdvancedTradeClient } from 'coinbase-api';
 */

// insert your API key details here from Coinbase API Key Management
const advancedTradeCdpAPIKey = {
    name: "organizations/876bc90b-c3ad-4058-baed-d90c941215e8/apiKeys/2a6952de-150a-4ccb-b0c4-ea4ab89ddcdd",
    privateKey: "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIGC7o33tEPYzYlEL237VYd3mYh55Wa9ju69+FriXaBzooAoGCCqGSM49\nAwEHoUQDQgAEpvMF/zo3VcgmXWCH62npEmqzsVh6FnN8PoUkC6tL68mF85ibt9es\n+DSD782ca6nmO4j+NDlwRy4B4EXhcAviWA==\n-----END EC PRIVATE KEY-----\n"
 };

const client = new CBAdvancedTradeClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});

async function getBalances() {
  // Example usage of the CBAdvancedTradeClient
  try {
    const accounts = await client.getAccounts();

    // Balances loaded here <<<---------------------------------------------------------
    console.log('Get accounts result: ', accounts);

  } catch (e) {
    console.error('Exception: ', JSON.stringify(e));
  }
}

getBalances();

// Assemble pairs
for (marketPairs) as market (){
  
}

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

    const jsondata = JSON.stringify(data);

    // Data handler here <<<--------------------------------------------------------
    console.info(new Date(), 'data received: ', jsondata);

    // Ticker handler:
    if(jsondata.channel == "ticker"){

    }


  });
  
  // Something happened, attempting to reconenct
  websocket.on('reconnect', (data) => {
    console.log('reconnect: ', data);
  });
  
  // Reconnect successful
  websocket.on('reconnected', (data) => {
    console.log('reconnected: ', data);
  });
  
  // Connection closed. If unexpected, expect reconnect -> reconnected.
  websocket.on('close', (data) => {
    console.error('close: ', data);
  });
  
  // Reply to a request, e.g. "subscribe"/"unsubscribe"/"authenticate"
  websocket.on('response', (data) => {
    console.info('response: ', JSON.stringify(data, null, 2));
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

  //websocket.subscribe('heartbeats', 'advTradeMarketData');
  
  // This is the same as above, but using WS_KEY_MAP like an enum to reduce any uncertainty on what value to use:
  // client.subscribe('heartbeats', WS_KEY_MAP.advTradeMarketData);
  
  // user data
  websocket.subscribe('futures_balance_summary', 'advTradeUserData');
  // websocket.subscribe('user', 'advTradeUserData');
  
  /**
   * Or send a more structured object with parameters, e.g. if parameters are required
   */
  const tickerSubscribeRequest = {
    topic: 'ticker',
    /**
     * Anything in the payload will be merged into the subscribe "request",
     * allowing you to send misc parameters supported by the exchange (such as `product_ids: string[]`)
     */
    payload: {
      product_ids: [/*'ETH-USD', 'BTC-USD',*/ 'SHIB-USD'],
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
          product_ids: ['SHIB-USD'],
        },
        topic: 'status',
        payload: {
        product_ids: ['SHIB-USD'],
        },
      },
    ],
    'advTradeMarketData',
  );


