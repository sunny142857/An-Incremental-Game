let game;
function reset() {
  game = {
    potatoes: ExpantaNum(0),
    carrots: ExpantaNum(0),
    beetroots: ExpantaNum(0),
    multi: [
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1),
      ExpantaNum(1)
    ],
	auto: 0,
	bulk: 0
  };
  
  showpotatoes();
  showcarrots();
  showbeetroots();
  showMultipier();
}
let multiplierReq = [
  ExpantaNum(10),
  ExpantaNum("1e8"),
  ExpantaNum("1e1000"),
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
  gameTemp['potatoes'] = game['potatoes'].toString();
  gameTemp['carrots'] = game['carrots'].toString();
  gameTemp['beetroots'] = game['beetroots'].toString();
  gameTemp['multi'] = game['multi'].toString();
  gameTemp['auto'] = game['auto'].toString();
  localStorage.setItem(savePath, JSON.stringify(gameTemp));
}
function loadgame(loadgameTemp) {
  game['potatoes'] = ExpantaNum(loadgameTemp['potatoes']);
  game['carrots'] = ExpantaNum(loadgameTemp['carrots']);
  game['beetroots'] = ExpantaNum(loadgameTemp['beetroots']);
  game['multi'] = (loadgameTemp['multi'].split(',')).map(ExpantaNum);
  game['auto'] = Number(loadgameTemp['auto']);
}
function load() {
  var loadgameTemp = JSON.parse(localStorage.getItem(savePath));
  //document.getElementById('newline').innerHTML = localStorage.getItem(savePath);
  if (loadgameTemp != null) {
    reset();
    loadgame(loadgameTemp);
    showpotatoes();
    showcarrots();
    showbeetroots();
    showMultipier();
  }
}
function squareRootSum(n) {
	let m = ExpantaNum.floor(n.pow(0.5));
	return m.times(n.sub((m.pow(2).times(2).add(m.times(3).sub(5))).div(6))).round();
}


function farmPotatoes() {
  game.potatoes = game.potatoes.add(game.multi[0]);
  showpotatoes();
}
function bulkBuyMultiplier(n) {
  var price = (game.multi[n - 1].pow(0.5).times(multiplierReq[n - 1])).round();
  if (game.potatoes.gte(price)) {
	game.multi[n - 1] = game.multi[n - 1].add(1)
	game.potatoes = game.potatoes.sub(price);
    showpotatoes();
    showMultipier();
  }
}
function multiplier2(n) {
  var price = (game.multi[n - 1].pow(0.5).times(multiplierReq[n - 1])).round();
  if (game.potatoes.gte(price)) {
	game.multi[n - 1] = game.multi[n - 1].add(1)
	game.potatoes = game.potatoes.sub(price);
    showpotatoes();
    showMultipier();
  }
}

function multiplier(n) {
  if (game.potatoes.gte(multiplierReq[n - 1])) {
	  
    //if (true){
      let bulk = ExpantaNum.floor(game.potatoes.div(multiplierReq[n - 1]));
      game.potatoes = game.potatoes.sub(multiplierReq[n - 1].mul(bulk));
      game.multi[n - 1] = game.multi[n - 1].add(game.multi[n].times(bulk));
	  if (game.potatoes.lt(ExpantaNum(0))) {
		game.potatoes = ExpantaNum(0);
	  }
    //}else{
    //  game.multi[n-1] = game.multi[n-1].add(game.potatoes.times(game.multi[n]).div(multiplierReq[n-1]).round())
    //  game.potatoes = ExpantaNum(0);
    //}
    //document.getElementById("newline").innerHTML += bulk + "<br>";
    showpotatoes();
    showMultipier();
    //not sure if >= is in expantanum
    // or do we have >= ?
    // currently you need at least 11 potatoes to buy this even though it costs 10s
    //dang
  }
}

function infinity() {
  if (game.potatoes.gt(ExpantaNum("1e308"))) {
    game.carrots = game.carrots.add(game.potatoes.log10()).round();
    game.potatoes = ExpantaNum(0);
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
function showpotatoes() {
  document.getElementById("potatoes").innerHTML = game.potatoes;
}
function showcarrots() {
  document.getElementById("carrots").innerHTML = game.carrots;
}

function showbeetroots() {
  document.getElementById("beetroots").innerHTML = game.beetroots;
}
function toggleAutoBuying() {
  game.auto = 1 - game.auto;
  if (game.auto == 1) {
	document.getElementById("autoBuyText").innerHTML = "ON";
  }else{
	document.getElementById("autoBuyText").innerHTML = "OFF";
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
  if (game.auto == 1) {
    x++;
    if (x >= 7) x = 0;
    if (x == 0) multiplier2(1);
    if (x == 1) multiplier2(2);
    if (x == 2) multiplier2(3);
    if (x == 3) multiplier2(4);
    if (x == 4) multiplier2(5);
    if (x == 5) infinity();
    if (x == 6) metainfinity();
    farmPotatoes();
  }
}, 50);
