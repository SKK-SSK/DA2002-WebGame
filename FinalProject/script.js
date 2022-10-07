/*-------------------Preparation---------------------*/
// Get elements needed from HTML file
var paper = new Raphael(document.getElementById("mySVGCanvas"));
var dimX = paper.width;
var dimY = paper.height;
var btnStart = document.getElementById("start");
var btnRestart = document.getElementById("restart");
var btnBGM = document.getElementById("bgm");
var scoreBoard = document.getElementById("score");
var bestScoreBoard = document.getElementById("bestScore");
var timer = document.getElementById("time");
var firstPlace = document.getElementById("FirstPlace");
var secondPlace = document.getElementById("SecondPlace");
var thirdPlace = document.getElementById("ThirdPlace");


// Get image and music sources
var imgBasket = "https://lh3.googleusercontent.com/proxy/RlD4PZuHAGFIBYhhxA72lfgmpHWZuktHnicu9IjdZS7Q7ctUavmaVJLNLQDSiK_X3RQyoFQu_tMWHY3p0Re2oWI2qXDmg27oKPCk6YECCUnaxtcE=s0-d";
var coinMusic = new Audio("CoinCollection.wav");
var rubbishMusic = new Audio("RubbishCollection.wav");
var bombMusic = new Audio("Bomb.wav");
var BGM = new Audio("background.wav");

// Create background & basket object & sample objects for coin, rubbish and bomb
var bg = paper.rect(0,0,dimX,dimY).attr({"fill": "white", "opacity": 0.1});
var basket = paper.image(imgBasket, dimX/2, dimY-80, 100, 80);
var coin = paper.circle(0, -30, 30).attr({"fill": "yellow"});
var rubbish = paper.rect(0, -60, 35, 60, 10).attr({"fill": "blue"});
var bomb = paper.circle(0, -40, 40).attr({"fill": "black"});

// Create arrays to hold cloned coins/rubbish/bomb
var coins;
var rubbishs;
var bombs;
var coinNum;
var rubbishNum;
var bombNum;

// Create controlling variables (for difficulties)
var coinRate;
var rubbishRate;
var bombRate;
var coinSpeed;
var rubbishSpeed;
var bombSpeed;

// Create variables for time intervals
var timerGo;
var coinGo;
var rubbishGo;
var bombGo;
var frameLength = 10; // For animations in generate functions (fall)

// For scores
var points = 0;
var bestScore = 0;

// For timer:
var startTime;
var timeLeft;

// Get username
var uname = prompt("Please enter your username(It is highly recommended because your name may appear in the leaderboard!!): ")
uname = uname || "anon";

// Leaderboard (store initial names and scores on the leaderboard)
if (localStorage.getItem("initialized") == null) {
	localStorage.setItem("initialized", "Yes");
	localStorage.setItem("thirdPlaceName", "Hans");
	localStorage.setItem("secondPlaceName", "Ciel");
	localStorage.setItem("firstPlaceName", "Lily");
	localStorage.setItem("thirdPlaceScore", 5);
	localStorage.setItem("secondPlaceScore", 7);
	localStorage.setItem("firstPlaceScore", 8);
}

/*---------------------Functions------------------------*/
// Automatically generate falling items
let generateCoin = function(){
	coinNum++;
	coins[coinNum] = coin.clone();
	coins[coinNum].xpos = randInt(30,dimX-30);
	coins[coinNum].attr({"cx": coins[coinNum].xpos});
	coins[coinNum].ypos = -30;
	// function that does the animation, called at the framerate 
	let fall = function(){
   		coins[coinNum].ypos += coinSpeed;
   		coins[coinNum].attr({
      		"cy": coins[coinNum].ypos
   		});
   		if (checkCollision(coins[coinNum].xpos, coins[coinNum].ypos, 30, basket.getBBox(true).x+50, basket.getBBox(true).y)) {
			coins[coinNum].remove();
			clearInterval(animation1);
			points++;
			scoreBoard.innerHTML = points;
			coinMusic.pause()
			coinMusic.currentTime = 0;
			rubbishMusic.pause();
			rubbishMusic.currentTime = 0;
			coinMusic.play();
		}
		if (coins[coinNum].ypos >= dimY+30) {
			coins[coinNum].remove();
			clearInterval(animation1);
		}
 	}
 	// start the animation
	let animation1 = setInterval(fall, frameLength)
}

let generateRubbish = function(){
	rubbishNum++;
	rubbishs[rubbishNum] = rubbish.clone();
	rubbishs[rubbishNum].xpos = randInt(0,dimX-35);
	rubbishs[rubbishNum].attr({"x": rubbishs[rubbishNum].xpos})
	rubbishs[rubbishNum].ypos = -60;
	// function that does the animation, called at the framerate 
	let fall = function(){
   		rubbishs[rubbishNum].ypos += rubbishSpeed;
   		rubbishs[rubbishNum].attr({
      		"y": rubbishs[rubbishNum].ypos
   		});
   		if (checkCollision(rubbishs[rubbishNum].xpos+17.5, rubbishs[rubbishNum].ypos+30, 30, basket.getBBox(true).x+50, basket.getBBox(true).y)) {
			rubbishs[rubbishNum].remove();
			clearInterval(animation2);
			points--;
			scoreBoard.innerHTML = points;
			coinMusic.pause()
			coinMusic.currentTime = 0;
			rubbishMusic.play();
		}
		if (rubbishs[rubbishNum].ypos >= dimY) {
			rubbishs[rubbishNum].remove();
			clearInterval(animation2);
		}
 	}
 	// start the animation
	let animation2 = setInterval(fall, frameLength)
}

let generateBomb = function(){
	bombNum++;
	bombs[bombNum] = bomb.clone();
	bombs[bombNum].xpos = randInt(40,dimX-40);
	bombs[bombNum].attr({"cx": bombs[bombNum].xpos});
	bombs[bombNum].ypos = -40;
	// function that does the animation, called at the framerate 
	let fall = function(){
   		bombs[bombNum].ypos += bombSpeed;
   		bombs[bombNum].attr({
    	  	"cy": bombs[bombNum].ypos
   		});
   		if (checkCollision(bombs[bombNum].xpos, bombs[bombNum].ypos, 40, basket.getBBox(true).x+50, basket.getBBox(true).y)) {
			bombs[bombNum].remove();
			clearInterval(animation3);
			coinMusic.pause();
			coinMusic.currentTime = 0;
			rubbishMusic.pause();
			rubbishMusic.currentTime = 0;
			bombMusic.play();
			dead();
		}
		if (bombs[bombNum].ypos >= dimY+40) {
			bombs[bombNum].remove();
			clearInterval(animation3)
		}
 	}
 	// start the animation
	let animation3 = setInterval(fall, frameLength)
}

// Collision detection
let checkCollision = function(x1,y1,r,x2,y2) {
	var ds = (x1-x2) * (x1-x2) + (y1-y2) * (y1-y2);
	if (y1 < y2 && ds <= r*r) {
		console.log("collided");
		return true;
	} else {
		return false;
	}
}

// Timer
let counting = function() {
	timeLeft = 60 - Math.round((Date.now() - startTime)/1000);
	timer.innerHTML = timeLeft;
	if(timeLeft == 0) {
		endGame();
	}
}

// Random function: Return a random integer between m and n inclusive
 let randInt = function(m, n) {
    let range = n-m+1;
    let frand = Math.random()*range;
    return m+Math.floor(frand);
}

// Start/End game functions
let startGame = function() {
	// Initialization
	gameOn = true;
	points = 0;
	scoreBoard.innerHTML = "0";
	timeLeft = 60;
	timer.innerHTML = timeLeft;
	startTime = Date.now();
	coins = [];
	rubbishs = [];
	bombs = [];
	coinNum = 0;
	rubbishNum = 0;
	bombNum = 0;

	// Get difficulty level
	if (document.getElementById("level1").checked == true){
        coinRate = 2000;
        rubbishRate = 4000;
        bombRate = 6000;
        coinSpeed = 5;
        rubbishSpeed = 4;
        bombSpeed = 3;
    } else if (document.getElementById("level2").checked == true) {
        coinRate = 1500;
        rubbishRate = 3000;
        bombRate = 5000;
        coinSpeed = 7;
        rubbishSpeed = 5;
        bombSpeed = 3;
    } else {
    		coinRate = 1000;
         rubbishRate = 2000;
         bombRate = 4000;
         coinSpeed = 7;
         rubbishSpeed = 5;
         bombSpeed = 3;
    }

	// Start intervals
	timerGo = setInterval(counting,1000);
	coinGo = setInterval(generateCoin,coinRate)
	rubbishGo = setInterval(generateRubbish,rubbishRate)
	bombGo = setInterval(generateBomb,bombRate)
}

let endGame = function() {
	gameOn = false;
	btnStart.innerHTML = "Start Game";

	// Update best score
	if (points > bestScore) {
		bestScore = points;
		bestScoreBoard.innerHTML = bestScore;
	}
	if (bestScore >= localStorage.getItem("firstPlaceScore")) {
		localStorage.setItem("thirdPlaceName", localStorage.getItem("secondPlaceName"));
		localStorage.setItem("secondPlaceName", localStorage.getItem("firstPlaceName"));
		localStorage.setItem("firstPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", localStorage.getItem("secondPlaceScore"));
		localStorage.setItem("secondPlaceScore", localStorage.getItem("firstPlaceScore"));
		localStorage.setItem("firstPlaceScore", bestScore);
		updateLeaderboard();
	} else if (bestScore >= localStorage.getItem("secondPlaceScore")) {
		localStorage.setItem("thirdPlaceName", localStorage.getItem("secondPlaceName"));
		localStorage.setItem("secondPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", localStorage.getItem("secondPlaceScore"));
		localStorage.setItem("secondPlaceScore", bestScore);
		updateLeaderboard();
	} else if (bestScore >= localStorage.getItem("thirdPlaceScore")) {
		localStorage.setItem("thirdPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", bestScore);
		updateLeaderboard();
	}

	// Stop counting down the time
	clearInterval(timerGo);
	timeLeft = 0;
	timer.innerHTML = timeLeft;

	// Stop intervals
	clearInterval(coinGo);
	clearInterval(rubbishGo);
	clearInterval(bombGo);

	confirm("Time is up! \nYour score: "+ points + "\nBest Score: "+ bestScore);
}

let dead = function() {
	// Same as endGame function
	gameOn = false;
	btnStart.innerHTML = "Start Game";
	if (points > bestScore) {
		bestScore = points;
		bestScoreBoard.innerHTML = bestScore;
	}
	if (bestScore >= localStorage.getItem("firstPlaceScore")) {
		localStorage.setItem("thirdPlaceName", localStorage.getItem("secondPlaceName"));
		localStorage.setItem("secondPlaceName", localStorage.getItem("firstPlaceName"));
		localStorage.setItem("firstPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", localStorage.getItem("secondPlaceScore"));
		localStorage.setItem("secondPlaceScore", localStorage.getItem("firstPlaceScore"));
		localStorage.setItem("firstPlaceScore", bestScore);
		updateLeaderboard();
	} else if (bestScore >= localStorage.getItem("secondPlaceScore")) {
		localStorage.setItem("thirdPlaceName", localStorage.getItem("secondPlaceName"));
		localStorage.setItem("secondPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", localStorage.getItem("secondPlaceScore"));
		localStorage.setItem("secondPlaceScore", bestScore);
		updateLeaderboard();
	} else if (bestScore >= localStorage.getItem("thirdPlaceScore")) {
		localStorage.setItem("thirdPlaceName", uname);
		localStorage.setItem("thirdPlaceScore", bestScore);
		updateLeaderboard();
	}

	clearInterval(timerGo);
	timeLeft = 0;
	timer.innerHTML = timeLeft;
	clearInterval(coinGo);
	clearInterval(rubbishGo);
	clearInterval(bombGo);

	confirm("You died! \nYour score: "+ points + "\nBest Score: "+ bestScore);
}

// Leaderboard
let updateLeaderboard = function() {
	console.log(localStorage.getItem("firstPlaceName") + " " + localStorage.getItem("firstPlaceScore"))
	firstPlace.innerHTML = localStorage.getItem("firstPlaceName") + " " + localStorage.getItem("firstPlaceScore");
	secondPlace.innerHTML = localStorage.getItem("secondPlaceName") + " " + localStorage.getItem("secondPlaceScore");
	thirdPlace.innerHTML = localStorage.getItem("thirdPlaceName") + " " + localStorage.getItem("thirdPlaceScore");
}
updateLeaderboard();

/*--------------------------User Interaction---------------------*/
// Make basket draggable
var dragging = "no";
basket.node.addEventListener("mousedown", function(ev) {
	console.log("mousedown")
	dragging = "yes";
})
basket.node.addEventListener("mouseup", function(ev) {
	console.log("mouseup")
	dragging = "no";
})
bg.node.addEventListener("mousemove", function(ev) {
	if (dragging == "yes") {
		basket.attr({
			"x": ev.offsetX-50,
			"y": ev.offsetY-40
		})
	}
})

// Events for buttons
var gameOn = false;
btnStart.addEventListener("click",function(){
	if(gameOn) {
		gameOn  = false;
		btnStart.innerHTML = "Start Game"
		endGame();
	} else {
		gameOn = true;
		btnStart.innerHTML = "End Game"
		startGame();
	}
});

btnRestart.addEventListener("click", function() {
	if (timeLeft > 0) {
		confirm("Your score will not be saved.");
	}
	clearInterval(timerGo);
	timeLeft = 0;
	timer.innerHTML = timeLeft;
	clearInterval(coinGo);
	clearInterval(rubbishGo);
	clearInterval(bombGo);
	startGame();
})

// Background music
var playBGM = false;
BGM.loop = "true";
btnBGM.addEventListener("click", function() {
	if(playBGM) {
		playBGM = false;
		btnBGM.innerHTML = "BGM is off";
		BGM.pause();
	} else {
		playBGM = true;
		btnBGM.innerHTML = "BGM is on";
		BGM.play();
	}
})