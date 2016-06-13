var https = require('https');

// Create New User and Be Assigned a User Secret
exports.newUser = function() {
  var req = https.request({
    hostname: 'session.satoshidice.com',
    port: 443,
    path: '/userapi/adduser/',
    method: 'GET'
  }, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// Get user alias…
exports.getUserAlias = function(userHash) {
  var req = https.request({
    hostname: 'session.satoshidice.com',
    port: 443,
    path: '/userapi/getUserAlias/?hash=' + userHash,
    method: 'GET'
  }, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// Retreive your deposit address…
exports.getAddress = function(userHash) {
  var req = https.request({
    hostname: 'session.satoshidice.com',
    port: 443,
    path: '/userapi/useraddress/?secret=' + userHash,
    method: 'GET'
  }, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// Retreive Your Balance
exports.getBalance = function(userHash) {
  var req = https.request({
    hostname: 'session.satoshidice.com',
    port: 443,
    path: '/userapi/userbalance/?secret=' + userHash,
    method: 'GET'
  }, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);

    res.on('data', function(d) {
      process.stdout.write(d);
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// Initiate Game Round
exports.newRound = function(userHash, callback) {
  var req = https.request({
    hostname: 'session.satoshidice.com',
    port: 443,
    path: '/userapi/startround.php?secret=' + userHash,
    method: 'GET'
  }, function(res) {

    res.on('data', function(d) {
      callback(JSON.parse(d));
    });
  });

  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
};

// Initiate Game Round
exports.placeBet = function(obj, callback) {
  setTimeout(function () {
    var req = https.request({
      hostname: 'session.satoshidice.com',
      port: 443,
      path: '/userapi/placebet.php?secret=' + obj.userHash + '&betInSatoshis=' + obj.bet + '&id=' + obj.gameId + '&serverHash=' + obj.serverHash + '&clientRoll=' + obj.clientRoll + '&belowRollToWin=' + obj.belowRollToWin,
      method: 'GET'
    }, function(res) {
      res.setEncoding('utf8');
      var body = "";

      res.on('data', function(d) {
        body += d;
      });

      res.on('end', function() {
        var json = JSON.parse(body);
        callback(json);
      });

    });

    req.end();

    req.on('error', function(e) {
      console.error(e);
    });
  }, 10);
};
