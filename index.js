// index.js

const getBalances = require('getBalances');
// const mapBalances = require('mapBalances');
// const assembler = require('assembler');
// const websocket = require('websocket');

function director (){

  getBalances()
    .then((result) => {
      // This will map balances to config.accounts
      console.log(result);
      // mapBalances(result);
    })
    .then((result) => {
      // assembler();
    })
    .then((result) => {
      // websocket();
    });
}

director();