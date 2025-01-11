// mapBalances.js

import { marketPairs, accounts } from './config.js';

/**
 * Maps balances from raw data into the format:
 * [
 *   ETH: { available: 0, acquisition: 0 },
 *   USD: { available: 0, acquisition: 0 },
 *   DASH: { available: 0, acquisition: 0 },
 *   ZRX: { available: 0, acquisition: 0 },
 *   BTC: { available: 0, acquisition: 0 }
 * ]
 *
 * @param {Array} data - Raw data containing wallet information.
 */
export const mapBalances = (data) => {

  const cleanData = data.map(item => ({
    currency: item.currency,
    available: item.available_balance.value,
  }));

  // Update `accounts` with balances for each currency pair
  marketPairs.forEach(pair => {
    const [base, quote] = pair.split("-");
    const baseBalance = cleanData.find(x => x.currency === base) || { available: 0 };
    const quoteBalance = cleanData.find(x => x.currency === quote) || { available: 0 };

    if (!accounts[base]) {
      accounts[base] = {
        available: baseBalance.available,
        acquisition: 0,
      };
    }
    if (!accounts[quote]) {
      accounts[quote] = {
        available: quoteBalance.available,
        acquisition: 0,
      };
    }
  });

  console.log("Updated accounts:", accounts);
};
