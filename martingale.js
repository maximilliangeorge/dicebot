var satoshi = require('./api.js');
var config = require('./config.js');

var usr = config.API_KEY;
var myRoll = 5;
var initialBet = 100;
var currentBet = initialBet;
var result;
var resultSet = false;
var betPercantage = 49.049;
var betCount = 100;
var betQueue = betCount;
var exchangeRate = 1;
var losing = false;

satoshi.newRound(usr, function(data) {
  firstRound(data);
});

function firstRound(data) {
  betCount = betCount - 1;

  console.log("");
  console.log("Bet " + betCount + "/" + betQueue);
  satoshi.placeBet({
    userHash: usr,
    bet: currentBet,
    gameId: data.id,
    serverHash: data.hash,
    clientRoll: myRoll,
    belowRollToWin: Math.floor((65536/100*betPercantage)-1)
  }, anotherRound);
}

var anotherRound = function(data) {
    if (resultSet === false) {
      result = data.userBalanceInSatoshis;
      resultSet = true;
    }
    if (data.bet.result == 'win') {
      console.log("Bet " + betCount + "/" + betQueue);
      console.log("Current Balance:" + data.userBalanceInSatoshis * exchangeRate);
      console.log("Current Result:" + (data.userBalanceInSatoshis - result) * exchangeRate);
      losing = false;
      currentBet = initialBet;
    } else if (data.bet.result == 'loss') {
      console.log("Bet " + betCount + "/" + betQueue + "  💥");
      console.log("Current Balance:" + data.userBalanceInSatoshis * exchangeRate);
      console.log("Current Result:" + (data.userBalanceInSatoshis - result) * exchangeRate);
      losing = true;
      currentBet = currentBet * 2;
    } else {
      console.log("Bug Next.");
    }

    console.log("Next bet: " + currentBet * exchangeRate);

    if (betCount > 0) {
      betCount = betCount - 1;
      console.log("");
      satoshi.placeBet({
        userHash: usr,
        bet: currentBet,
        gameId: data.nextRound.id,
        serverHash: data.nextRound.hash,
        clientRoll: myRoll,
        belowRollToWin: Math.floor((65536/100*betPercantage)-1)
      }, anotherRound);
    } else if (losing === true) {
      console.log("Bet cycle is over, winning back remaining…");
      console.log("");
      satoshi.placeBet({
        userHash: usr,
        bet: currentBet,
        gameId: data.nextRound.id,
        serverHash: data.nextRound.hash,
        clientRoll: myRoll,
        belowRollToWin: Math.floor((65536/100*betPercantage)-1)
      }, anotherRound);
    } else {
      console.log("");
      console.log("Bet cycle finished.");
      console.log("Final Balance: " + data.userBalanceInSatoshis * exchangeRate);
      console.log("Result: " + (data.userBalanceInSatoshis - result) * exchangeRate);
      return;
    }
};
