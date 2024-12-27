import { coinbaseLibrary } from './coinbase-library';

async function doAPICall() {
  // Example usage of the CBAdvancedTradeClient
  try {
    const accounts = await coinbaseLibrary.getAccounts();
    console.log('Get accounts result: ', accounts);
  } catch (e) {
    console.error('Exception: ', JSON.stringify(e));
  }
}

doAPICall();