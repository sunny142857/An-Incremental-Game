let EN = ExpantaNum;
let game;
function reset() {
  game = {
    FFCoin: EN(0),
	Rabbot: EN(0),
    multi: [
      EN(1),
      EN(1),
      EN(1),
      EN(1),
      EN(1),
      EN(1)
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
  
  showAll();
}
function showAll() {
  showFFCoin();
  showMultipier();
  showAutoBuy();
  showRabbot();
}
const multiplierReq = [
  EN(10),
  EN("1e5"),
  EN("1e9"),
  EN("1e13"),
  EN("1e17"),
  EN("eee10000")
];
const multiplierRatio = [
  EN(1.01),
  EN(1.0001),
  EN(1.000001),
  EN(1.00000001),
  EN(1.0000000001),
  EN("eee10000")
];
let bulkBuying = [
  EN(1),
  EN(10),
  EN(100),
  EN(Infinity),
];
reset();
function squareRootSum(n) {
	let m = EN.floor(n.pow(0.5));
	return m.times(n.sub((m.pow(2).times(2).add(m.times(3).sub(5))).div(6))).round();
}
function ENify(x) {
  if (typeof x == "number") {
    return EN(x)
  } else {
    let newEN = new EN(0)
    newEN.array = x.array
    newEN.sign = x.sign
    newEN.layer = x.layer
    return newEN
  }
}
var savePath = "AIGSave.txt"
function save() {
  localStorage.setItem(savePath, JSON.stringify(game));
}
function exportGame() {
  copyStringToClipboard(btoa(JSON.stringify(game)))
}
function importGame() {
  let loadgameTemp=""
  loadgameTemp = JSON.parse(atob(prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")))
  if (loadgameTemp!="") {
    loadingGame(loadgameTemp)
  }
  showAll();
}
function loadingGame(loadgameTemp) {
  game['FFCoin'] = ENify(loadgameTemp['FFCoin']);
  game['Rabbot'] = ENify(loadgameTemp['Rabbot']);
  game['multi'] = (loadgameTemp['multi']).map(ENify);
  game['auto'] = Number(loadgameTemp['auto']);
  game['autoMultiplier'] = (loadgameTemp['autoMultiplier']).map(Number);;
  game['bulk'] = Number(loadgameTemp['bulk']);
}
function loadGame() {
  var loadgameTemp = JSON.parse(localStorage.getItem(savePath));
  //document.getElementById('newline').innerHTML = localStorage.getItem(savePath);
  if (loadgameTemp != null) {
    reset();
    loadingGame(loadgameTemp);
	showAll();
  }
}


function gainFFCoin() {
  game.FFCoin = game.FFCoin.add(game.multi[0]);
  showFFCoin();
}
function buyRabbot() {
	let price = EN("1e21")
    if (game.FFCoin.gte(price)) {
		game.Rabbot = game.Rabbot.add(1);
		game.FFCoin = game.FFCoin.sub(price);
		showFFCoin();
		showRabbot();
    }
}
function multiplierPrice(n) {
	return (game.multi[n - 1].pow(0.5).times(multiplierReq[n - 1])).round();
}
function rabmultiplier(n) {
  
}
function multiplier2(n) {
  let price = multiplierPrice(n);
  if (game.FFCoin.gte(price)) {
	game.multi[n - 1] = game.multi[n - 1].add(game.multi[n]);
	game.FFCoin = game.FFCoin.sub(price);
    showFFCoin();
    showMultipier();
  }
}

function showMultipier(){
  for (var n = 1; n < 6; n++) {
    document.getElementById("multi" + n).innerHTML = game.multi[n - 1];
    document.getElementById("multi" + n + "cost").innerHTML = multiplierPrice(n);
  }  
}
function showFFCoin() {
  document.getElementById("FFCoin").innerHTML = game.FFCoin;
}
function showRabbot() {
  document.getElementById("Rabbot").innerHTML = game.Rabbot;
}
function toggleAutoGainCoin() {
  game.auto = 1 - game.auto;
  showAutoBuy();
}
function toggleAutoBuyMulti(n) {
  game.autoMultiplier[n-1] = 1 - game.autoMultiplier[n-1];
  showAutoBuy();
}
function showAutoBuy() {
  for (var n = 1; n < 6; n++){
    if (game.autoMultiplier[n-1] == 1) {
	  document.getElementById("autoBuyMulti"+n).innerHTML = "ON";
	  document.getElementById("toggleAutoBuyMultiButton"+n).className = ("onButton");
    }else{
	  document.getElementById("autoBuyMulti"+n).innerHTML = "OFF";
	  document.getElementById("toggleAutoBuyMultiButton"+n).className = ("offButton");
    }
  }
  if (game.auto == 1) {
	document.getElementById("autoGainText").innerHTML = "ON";
	  document.getElementById("toggleAutoGainCoinButton").className = ("onButton");
  }else{
	document.getElementById("autoGainText").innerHTML = "OFF";
	  document.getElementById("toggleAutoGainCoinButton").className = ("offButton");
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
window.setInterval(function() {
  if (game.auto == 1) gainFFCoin();
  if (game.autoMultiplier[0] == 1) multiplier2(1);
  if (game.autoMultiplier[1] == 1) multiplier2(2);
  if (game.autoMultiplier[2] == 1) multiplier2(3);
  if (game.autoMultiplier[3] == 1) multiplier2(4);
  if (game.autoMultiplier[4] == 1) multiplier2(5);
}, 50);

function copyStringToClipboard(str) {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = {
    position: "absolute",
    left: "-9999px"
  };
  document.body.appendChild(el);
  copyToClipboard(el)
  document.body.removeChild(el);
  alert("Copied to clipboard")
}

function copyToClipboard(el) {
    el = (typeof el === "string") ? document.querySelector(el) : el;
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        var editable = el.contentEditable;
        var readOnly = el.readOnly;
        el.contentEditable = true;
        el.readOnly = true;
        var range = document.createRange();
        range.selectNodeContents(el);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);
        el.contentEditable = editable;
        el.readOnly = readOnly;
    }
    else {
        el.select();
    }
    document.execCommand("copy");
}
