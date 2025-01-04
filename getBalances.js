//const { CBAdvancedTradeClient } = require('coinbase-api');

import { CBAdvancedTradeClient } from 'coinbase-api';
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

export async function getBalances() {
  // Example usage of the CBAdvancedTradeClient
  try {
    const accounts = await client.getAccounts();
    console.log('Get accounts result: ', accounts);
  } catch (e) {
    console.error('Exception: ', JSON.stringify(e));
  }
}