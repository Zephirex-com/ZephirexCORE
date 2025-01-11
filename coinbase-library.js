//const { CBAdvancedTradeClient } = require('coinbase-api');

import { CBAdvancedTradeClient } from 'coinbase-api';

// insert your API key details here from Coinbase API Key Management
export const advancedTradeCdpAPIKey = {
  name: "organizations/876bc90b-c3ad-4058-baed-d90c941215e8/apiKeys/02cc536f-3bf5-411c-94b6-f5df6ea7277f",
  privateKey: "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIIsvKk999pF7/MmhYjEp9cJVY4DzHWEOjURzJbdCU9a6oAoGCCqGSM49\nAwEHoUQDQgAEmW94HIATamedFE3B2WAgu55nsAFz8RV8igKVT1cqhYUwCBtqYKNr\nyPK3XIzrdVh50hIYC+zm/eVHABjqyq9wSw==\n-----END EC PRIVATE KEY-----\n"
};

export const client = new CBAdvancedTradeClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});