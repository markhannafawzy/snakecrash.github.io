function addScoresToLocalStorage(inputName, inputScore){

	let jsonArray;
	
	let newScore = new ScoreObject(inputName, inputScore);

	let jsonArrayString = window.localStorage.getItem("leaderboard");

	let receivedArray = JSON.parse(jsonArrayString);

	if (receivedArray != null) {
		receivedArray.push(newScore);
		window.localStorage.setItem("leaderboard", JSON.stringify(receivedArray));

	} else {
		jsonArray = [];
		jsonArray.push(newScore);
		window.localStorage.setItem("leaderboard", JSON.stringify(jsonArray));
	}

	function ScoreObject(name, score) {
		this.name = name;
		this.score = score;
	}
}
function addPlayer(inputName, inputScore){
	var newScore2=new ScoreObject2(inputName, inputScore);
	
		window.localStorage.setItem("player",JSON.stringify(newScore2));	
}

function getPlayer(inputName, inputScore){
	let storedJsonArrayString = window.localStorage.getItem("player");

	if (storedJsonArrayString != null) {
		let player = JSON.parse(storedJsonArrayString);
		let designString =
			'<div id="card_div">'+
	
			'<div class="inner_div">'+
			'<p id="user_name">' + player.name + '</p>'+
			'</div>'+
			''+
			'<div class="inner_div">'+
			'<p id="user_score">' + player.score + '</p>'+
			'</div>'+
			''+
			'<div class="inner_div" id="img_div">'+
			'<img src="images/coin.png">'+
			'</div>'+
			'</div>';

		let div = document.createElement("div");
		div.innerHTML = designString;

		document.getElementById("result_div").appendChild(div);	
	}
}

function ScoreObject2(name, score) {
		this.name = name;
		this.score = score;
	}
function displayScores() {

	let storedJsonArrayString = window.localStorage.getItem("leaderboard");
	let storedJsonArray = JSON.parse(storedJsonArrayString);
	let sortedScoresArray = [];

	let username;
	let userScore;

	let counter = 1;

	if (storedJsonArray != null) {
		for (let i=0; i<storedJsonArray.length; i++) {
			sortedScoresArray.push(storedJsonArray[i].score);
		}

		sortedScoresArray.sort(function (a, b) {
			return b - a;
		});

		for (let i = 0; i < storedJsonArray.length; i++) {
			userScore = sortedScoresArray[i];

			for (let j=0; j<storedJsonArray.length; j++) {
				if (userScore == storedJsonArray[j].score) {
					username = storedJsonArray[j].name;
				}
			}

			if (counter < 7) {
				createDiv(counter, username, userScore);
			counter++;
			}
		}

	} else {
		let div = document.createElement("div");
			div.style.width = "400px";
			div.style.height = "100px";
			div.style.color = "#FFFFFF";
			div.style.paddingTop = '50px';
			div.style.textAlign = 'center';
			div.style.fontSize = '30px';
			div.style.fontFamily = 'Calibri';
			div.innerHTML = "Leaderboard is empty!";

		document.getElementById("main_div").appendChild(div);
	}
}

function createDiv(order, currentUser, currentScore) {

		let designString =
			'<div id="card_div">'+
			'<div class="inner_div">'+
			'<p id="order_number">' + order + '</p>'+
			'</div>'+
			''+
			'<div class="inner_div">'+
			'<p id="user_name">' + currentUser + '</p>'+
			'</div>'+
			''+
			'<div class="inner_div">'+
			'<p id="user_score">' + currentScore + '</p>'+
			'</div>'+
			''+
			'<div class="inner_div" id="img_div">'+
			'<img src="images/coin.png">'+
			'</div>'+
			'</div>';

		let div = document.createElement("div");
		div.innerHTML = designString;

		document.getElementById("main_div").appendChild(div);
}

function setSound(sound){
		var newScore2=sound;
		window.localStorage.setItem("soundFlag",JSON.stringify(newScore2));
	
}
function getSound(){
		
		return JSON.parse(window.localStorage.getItem("soundFlag"));
	
}
