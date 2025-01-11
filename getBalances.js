// getBalances.js

import { client } from './coinbase-library.js';

export async function getBalances(params) {
  // Example usage of the CBAdvancedTradeClient
  try {
    const loaded_accounts = await client.getAccounts(params);

    /* Sample output:

    accounts: [  
      {
        uuid: 'b6dccedc-6245-50c0-bba1-207bb3e3ffa3',
        name: 'My Wallet',
        currency: 'BTC',
        available_balance: [Object],
        default: true,
        active: true,
        created_at: '2014-02-08T09:11:39.008Z',
        updated_at: '2024-12-14T01:17:07.979Z',
        deleted_at: null,
        type: 'ACCOUNT_TYPE_CRYPTO',
        ready: true,
        hold: [Object],
        retail_portfolio_id: '2dd48c3d-c3e3-57f3-9614-3e97da15fb58',
        platform: 'ACCOUNT_PLATFORM_CONSUMER'
      }
    ],
    has_next: false,
    cursor: '',
    size: 53

    */

    return loaded_accounts;

  } catch (e) {
    console.error('Exception: ', JSON.stringify(e));
  }
}