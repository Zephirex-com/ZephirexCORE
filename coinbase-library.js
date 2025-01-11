// coinbase-library.js - This is basically the connect client for authed requests.

import dotenv from 'dotenv';
import { CBAdvancedTradeClient } from 'coinbase-api';

dotenv.config();

// insert your API key details here from Coinbase API Key Management
export const advancedTradeCdpAPIKey = {
  name: process.env.ADVANCED_TRADE_CDP_KEY_NAME,
  privateKey: process.env.ADVANCED_TRADE_CDP_KEY_PRIVATE.replace(/\\n/g, '\n')
};

export const client = new CBAdvancedTradeClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});