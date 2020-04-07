let game;
function reset() {
  game = {
    FFCoin: ExpantaNum(0),
    multi: [
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1)
    ],
	auto: 0,
	autoMultiplier: [
	  0,
	  0,
	  0,
	  0,
	  0
	],
	bulk: 0
  };
  
  showFFCoin();
  showMultipier();
  showAutoBuyMulti();
}
let multiplierReq = [
  ExpantaNum(10),
  ExpantaNum("1e6"),
  ExpantaNum("1e11"),
  ExpantaNum("ee10"),
  ExpantaNum("ee1000"),
  ExpantaNum("eee10000")
];
let multiplierRatio = [
  ExpantaNum(1.01),
  ExpantaNum(1.0001),
  ExpantaNum(1.000001),
  ExpantaNum(1.00000001),
  ExpantaNum(1.0000000001),
  ExpantaNum("eee10000")
];
let bulkBuying = [
  ExpantaNum(1),
  ExpantaNum(10),
  ExpantaNum(100),
  ExpantaNum(Infinity),
];
reset();
var savePath = "AIGSave.txt"
function save() {
  let gameTemp = new Object();
  gameTemp['FFCoin'] = game['FFCoin'].toString();
  gameTemp['multi'] = game['multi'].toString();
  gameTemp['auto'] = game['auto'].toString();
  gameTemp['autoMultiplier'] = game['autoMultiplier'].toString();
  gameTemp['bulk'] = game['bulk'].toString();
  localStorage.setItem(savePath, JSON.stringify(gameTemp));
}
function loadgame(loadgameTemp) {
  game['FFCoin'] = ExpantaNum(loadgameTemp['FFCoin']);
  game['multi'] = (loadgameTemp['multi'].split(',')).map(ExpantaNum);
  game['auto'] = Number(loadgameTemp['auto']);
  game['autoMultiplier'] = (loadgameTemp['autoMultiplier'].split(',')).map(Number);;
  game['bulk'] = Number(loadgameTemp['bulk']);
}
function load() {
  var loadgameTemp = JSON.parse(localStorage.getItem(savePath));
  //document.getElementById('newline').innerHTML = localStorage.getItem(savePath);
  if (loadgameTemp != null) {
    reset();
    loadgame(loadgameTemp);
    showFFCoin();
    showMultipier();
    showAutoBuyMulti();
  }
}
function squareRootSum(n) {
	let m = ExpantaNum.floor(n.pow(0.5));
	return m.times(n.sub((m.pow(2).times(2).add(m.times(3).sub(5))).div(6))).round();
}


function gainFFCoin() {
  game.FFCoin = game.FFCoin.add(game.multi[0]);
  showFFCoin();
}
function bulkBuyMultiplier(n) {
  var price = (game.multi[n - 1].pow(0.5).times(multiplierReq[n - 1])).round();
  if (game.FFCoin.gte(price)) {
	game.multi[n - 1] = game.multi[n - 1].add(1)
	game.FFCoin = game.FFCoin.sub(price);
    showFFCoin();
    showMultipier();
  }
}
function multiplier2(n) {
  let price = (game.multi[n - 1].pow(0.5).times(multiplierReq[n - 1])).round();
  if (game.FFCoin.gte(price)) {
	game.multi[n - 1] = game.multi[n - 1].add(game.multi[n]);
	game.FFCoin = game.FFCoin.sub(price);
    showFFCoin();
    showMultipier();
  }
}

function multiplier(n) {
  if (game.FFCoin.gte(multiplierReq[n - 1])) {
	  
    //if (true){
      let bulk = ExpantaNum.floor(game.FFCoin.div(multiplierReq[n - 1]));
      game.FFCoin = game.FFCoin.sub(multiplierReq[n - 1].mul(bulk));
      game.multi[n - 1] = game.multi[n - 1].add(game.multi[n].times(bulk));
	  if (game.FFCoin.lt(ExpantaNum(0))) {
		game.FFCoin = ExpantaNum(0);
	  }
    //}else{
    //  game.multi[n-1] = game.multi[n-1].add(game.FFCoin.times(game.multi[n]).div(multiplierReq[n-1]).round())
    //  game.FFCoin = ExpantaNum(0);
    //}
    //document.getElementById("newline").innerHTML += bulk + "<br>";
    showFFCoin();
    showMultipier();
    //not sure if >= is in expantanum
    // or do we have >= ?
    // currently you need at least 11 FFCoin to buy this even though it costs 10s
    //dang
  }
}
/*
function infinity() {
  if (game.FFCoin.gt(ExpantaNum("1e308"))) {
    game.carrots = game.carrots.add(game.FFCoin.log10()).round();
    game.FFCoin = ExpantaNum(0);
    showpotatoes();
    showcarrots();
  }
}

function metainfinity() {
  if (game.carrots.gt(ExpantaNum("ee10"))) {
    game.beetroots = game.beetroots
      .add(
        game.carrots
          .log10()
          .log10()
          .log10()
      )
      .round();
    game.potatoes = ExpantaNum(0);
    game.carrots = ExpantaNum(0);
    showpotatoes();
    showcarrots();
    showbeetroots();
  }
}
*/
//I'm going to set up for meta2infinity --moooosey
/*function meta2infinity() {
  if (game.beetroots.gt(ExpantaNum("(10^)^50 1"))) {
    game.potatoStorageFacilities = game.potatoStorageFacilities.add(game.beetroots.slog()).round()
    game.beetroots = ExpantaNum(0)
    game.potatoes = ExpantaNum(0)
    game.carrots = ExpantaNum(0)
    document.getElementById('newline').innerHTML += "communismception" + '<br>';
    showpotatoes()
    showcarrots()
    showbeetroots()
    showPSFs()
  }
}*/
function showMultipier(){
  for (var i = 1; i < 6; i++) {
    document.getElementById("multi" + i).innerHTML = game.multi[i - 1];
    document.getElementById("multi" + i + "cost").innerHTML =
      (game.multi[i - 1].pow(0.5).times(multiplierReq[i - 1])).round();
  }  
}
function showFFCoin() {
  document.getElementById("FFCoin").innerHTML = game.FFCoin;
}
function toggleAutoGainCoin() {
  game.auto = 1 - game.auto;
  if (game.auto == 1) {
	document.getElementById("autoGainText").innerHTML = "ON";
  }else{
	document.getElementById("autoGainText").innerHTML = "OFF";
  }
}
function toggleAutoBuyMulti(n) {
  game.autoMultiplier[n-1] = 1 - game.autoMultiplier[n-1];
  showAutoBuyMulti();
}
function showAutoBuyMulti() {
  for (var n = 1; n < 6; n++){
    if (game.autoMultiplier[n-1] == 1) {
	  document.getElementById("autoBuyMulti"+n).innerHTML = "ON";
    }else{
	  document.getElementById("autoBuyMulti"+n).innerHTML = "OFF";
    }
  }
}
function toggleBulkBuying() {
  game.bulk = (game.bulk + 1) % bulkBuying.length;
  switch(game.bulk) {
	case 0:
	  document.getElementById("bulkBuyText").innerHTML = "1x";
	  break;
	case 1:
	  document.getElementById("bulkBuyText").innerHTML = "10x";
	  break;
	case 2:
	  document.getElementById("bulkBuyText").innerHTML = "100x";
	  break;
	case 3:
	  document.getElementById("bulkBuyText").innerHTML = "Max";
	  break;
	default:
	  document.getElementById("bulkBuyText").innerHTML = "1x";
  }
  showMultipier();
}
let x = 0;
window.setInterval(function() {
  if (game.auto == 1) gainFFCoin();
  if (game.autoMultiplier[0] == 1) multiplier2(1);
  if (game.autoMultiplier[1] == 1) multiplier2(2);
  if (game.autoMultiplier[2] == 1) multiplier2(3);
  if (game.autoMultiplier[3] == 1) multiplier2(4);
  if (game.autoMultiplier[4] == 1) multiplier2(5);
}, 50);
