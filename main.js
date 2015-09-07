// TODO
// Simpler curve for these guys for testing
// Delta calculation for offline idling

var myInterval = setInterval(tick,0);


var lastUpdate = Date.now();
var delta = 0;
var rock = 0;
var rgolem = 0;
var rwizard = 0;

function redisplay() {
    document.getElementById("rock").innerHTML = rock;
    document.getElementById("rgolem").innerHTML = rgolem;
    document.getElementById("rwizard").innerHTML = rwizard;
    
    var rgolemCTxt = "Rock Golem Cost: ";
    document.getElementById('rgolemCost').innerHTML = rgolemCTxt.concat(getGolemCost(), " rocks.");
    
    var rwizardCTxt = "Rock Wizard Cost: ";
    var wizardCost = getWizardCost();
    document.getElementById('rwizardCost').innerHTML = rwizardCTxt.concat(wizardCost[0]," golems, ",wizardCost[1]," rocks.");
}

function rockGet(number){
    rock = rock + number;
    redisplay();
}

function golemGet(number)
{
    rgolem = rgolem + number;
    redisplay();
}

function getGolemCost() {
    return Math.floor(10 * Math.pow(1.1,rgolem));
}

function getWizardCost() {
    return [Math.floor(Math.log(Math.exp(1)*(1+rwizard))),Math.floor(10 * Math.pow(3,Math.exp(1+rwizard)))];
}

function rgolemBuyAll() {
    var golemCost = getGolemCost();
    while (rock >= golemCost) {
        rgolem = rgolem + 1;
        rock = rock - golemCost;
        golemCost = getGolemCost();
    }
    redisplay();
}

function rgolemBuy(){
    var golemCost = getGolemCost();
    if(rock >= golemCost){
        rgolem = rgolem + 1;
        rock = rock - golemCost;
    }
    redisplay();
};

function rwizardBuy(){
    var wizardCost = getWizardCost();
    if(rock >= wizardCost[1] && rgolem >= wizardCost[0]){
        rwizard = rwizard + 1;
        rock = rock - wizardCost[1];
        rgolem = rgolem - wizardCost[0];
    }
    redisplay();
};


function save() {
    var save = {
        rock: rock,
        rgolem: rgolem,
        rwizard: rwizard,
        lastUpdate: lastUpdate
    }
    localStorage.setItem("caranhaIncSaveGame",JSON.stringify(save));
}

function load() {
    var savegame = JSON.parse(localStorage.getItem("caranhaIncSaveGame"));
    if (savegame !== null) {
        if (typeof savegame.rock !== "undefined")
            rock = savegame.rock;
        else
            rock = 0;
        
        if (typeof savegame.rgolem !== "undefined")
            rgolem = savegame.rgolem;
        else
            rgolem = 0;
        
        if (typeof savegame.rwizard !== "undefined")
            rwizard = savegame.rwizard;
        else
            rwizard = 0;
        
        if (typeof savegame.lastUpdate !== "undefined")
            lastUpdate = savegame.lastUpdate;
        else
            lastUpdate = Date.now();

        console.log(savegame);
    }
    else
        console.log("No savegame to load");
    redisplay();
}

function reset() {
    localStorage.removeItem("caranhaIncSaveGame");
    rock=0;
    rgolem=0;
    rwizard=0;
    lastUpdate=Date.now()
    redisplay();
}

function tick() {
  var now = Date.now()
  var dt = now - lastUpdate;
  lastUpdate = now;
  
  update(dt);
}

function update(dt) {
  delta = delta + dt;
  while (delta > 1000)
  {
    rockGet(rgolem);
    golemGet(rwizard);
    delta = delta - 1000;
  }
  redisplay();
}


window.onload = function() {
    // Error, not loading on load
    load();
    console.log("onLoad");
};