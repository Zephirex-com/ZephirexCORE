//const { CBAdvancedTradeClient } = require('coinbase-api');

import { CBAdvancedTradeClient } from 'coinbase-api';
/**
 * Or, with import:
 * import { CBAdvancedTradeClient } from 'coinbase-api';
 */

// insert your API key details here from Coinbase API Key Management
const advancedTradeCdpAPIKey = {
  name: "organizations/876bc90b-c3ad-4058-baed-d90c941215e8/apiKeys/852e1603-9c23-45d1-aa85-e5443e321422",
  privateKey: "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEID1+lKqvfk4zBEX8XejPsR8tAw0Eim42WIHAa9H1jCEnoAoGCCqGSM49\nAwEHoUQDQgAEIP2I0XxcvPfdT5CX5qHFEJdIqdE1fWIKkTyxBoaj5SkHrIlAj8q7\nGefa5J5cyLAvKC85IRJjoKc06SgoGMT86g==\n-----END EC PRIVATE KEY-----\n"
};

const client = new CBAdvancedTradeClient({
  // Either pass the full JSON object that can be downloaded when creating your API keys
  // cdpApiKey: advancedTradeCdpAPIKey,

  // Or use the key name as "apiKey" and private key (WITH the "begin/end EC PRIVATE KEY" comment) as "apiSecret"
  apiKey: advancedTradeCdpAPIKey.name,
  apiSecret: advancedTradeCdpAPIKey.privateKey,
});

async function doAPICall() {
  // Example usage of the CBAdvancedTradeClient
  try {
    const accounts = await client.getAccounts();
    console.log('Get accounts result: ', accounts);
  } catch (e) {
    console.error('Exception: ', JSON.stringify(e));
  }
}

doAPICall();