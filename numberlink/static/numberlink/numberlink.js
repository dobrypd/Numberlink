/**
 * @author piotrek
 * main
 */
/*-> global variables*/
var time = 0;
var bestTime = 0;
var gameStarted = false;
var current = Array();

/*<- global variables*/

cell = function (){
	var number	= 0;
	var up		= false;
	var right	= false;
	var down	= false;
	var left	= false;
	
	return {
		isNum: function(){
			return number === 0;
		},
		num: function(){
			return number;
		},
		setNum: function(n){
			number = n;
		},
		getDirection: function(){
			return {
				'up': up,
				'right': right,
				'down': down,
				'left': left
			};
		},
		linkDirection: function(d){
			switch(d){
				case 'up': 
					up=true;
					break;
				case 'right':
					right=true;
					break;
				case 'down':
					down=true;
					break;
				case 'left':
					left=true;
					break;
			}
		},
		unlinkDirection: function(d){
			switch(d){
				case 'up': 
					up=false;
					break;
				case 'right':
					right=false;
					break;
				case 'down':
					down=false;
					break;
				case 'left':
					left=false;
					break;
			}
		},
		next: function(from){
			switch(from){
				case 'up': 
					if (right) return "right";
					if (down) return "down";
					if (left) return "left";
					return (number===0)?(-1):(number);
				case 'right':
					if (up) return "up";
					if (down) return "down";
					if (left) return "left";
					return (number===0)?(-1):(number);
				case 'down':
					if (up) return "up";
					if (right) return "right";
					if (left) return "left";
					return (number===0)?(-1):(number);
				case 'left':
					if (up) return "up";
					if (right) return "right";
					if (down) return "down";
					return (number===0)?(-1):(number);
			}
		},
		filled: function(){
			var c = 0;
			c += up?1:0;
			c += right?1:0;
			c += down?1:0;
			c += left?1:0;
			if (c >= 2) return true;
			if ((number !== 0) && (c !== 0)) return true;
			return false;
		}
	}
};
function idToPos(id){
	return {
		'y': (Math.floor(id / currentWidth)),
		'x': (id -  Math.floor(id / currentWidth) * currentWidth)
	}
}

function changeLink(id1, id2){
	var pos1 = idToPos(id1);
	var pos2 = idToPos(id2);
	var difx = pos1.x - pos2.x;
	var dify = pos1.y - pos2.y;
	if ((Math.abs(difx) > 1) || (Math.abs(dify) > 1) ||
		((difx !== 0) && (dify !== 0)) ||
		((difx === 0) && (dify === 0))) return false;
	if ((difx < 0) || (dify < 0)){
		var tmp = pos2;
		pos2 = pos1;
		pos1 = tmp;
	}
	if (difx !== 0) {
		if (current[pos1.y][pos1.x].getDirection().left &&
			current[pos2.y][pos2.x].getDirection().right){
			current[pos1.y][pos1.x].unlinkDirection("left");
			current[pos2.y][pos2.x].unlinkDirection("right");
		} else {
			if ((current[pos1.y][pos1.x].filled()) || 
				(current[pos2.y][pos2.x].filled())) {
				return false;
			}
			current[pos1.y][pos1.x].linkDirection("left");
			current[pos2.y][pos2.x].linkDirection("right");
		}
	} else {
		if (current[pos1.y][pos1.x].getDirection().up &&
			current[pos2.y][pos2.x].getDirection().down){
			current[pos1.y][pos1.x].unlinkDirection("up");
			current[pos2.y][pos2.x].unlinkDirection("down");
		} else {
			if ((current[pos1.y][pos1.x].filled()) || 
				(current[pos2.y][pos2.x].filled())) {
					return false;
			}
			current[pos1.y][pos1.x].linkDirection("up");
			current[pos2.y][pos2.x].linkDirection("down");
		}
	}
	return true;
}

function swapDirection(d){
	switch(d){
		case 'up': return 'down';
		case 'left': return 'right';
		case 'down': return 'up';
		case 'right': return 'left';
	}
}
function shiftPos(direction, x, y){
	switch(direction){
		case 'up':
			y -= 1; break;
		case 'left':
			x -= 1; break;
		case 'down':
			y += 1; break;
		case 'right':
			x += 1; break;
	}
	return {'x':x,'y':y};
}

function checkPath(from, number){
	var x = from.x;
	var y = from.y;
	var fromDir = null;
	var afterShift = null;
	if(current[y][x].getDirection().up)		{fromDir='up';}
	if(current[y][x].getDirection().left)	{fromDir='left';}
	if(current[y][x].getDirection().down)	{fromDir='down';}
	if(current[y][x].getDirection().right)	{fromDir='right';}
	if (fromDir === null) return false;
	var currnum = 0;
	while(currnum === 0){
		afterShift = shiftPos(fromDir, x, y);
		x = afterShift.x;	y = afterShift.y;
		fromDir = current[y][x].next(swapDirection(fromDir));
		currnum = current[y][x].num();
		if (fromDir === -1) currnum = -1;
	}
	
	if (currnum !== number)
		return false;
	
	return true;
}

function check(){
	/*sprawdzanie czy rozwiązanie jest porawne*/
	var i = 0;	var j = 0;
	
	for(i; i < currentHeight; ++i){
		for(j = 0; j < currentWidth; ++j){
			if(current[i][j].num() === 0){
				/*sprawdzenie czy wszystkie pola są nasycone*/
				if (!current[i][j].filled()) return false;
			} else {
				/*ścieżka na pewno nie ma pętli*/
				if (!checkPath({'x':j,'y':i}, current[i][j].num())){
					return false;
				}
			}
		}
	}
	return true;
}

function boardSetter(i, j, num){
	current[i][j].setNum(num);
}

function startGame(){
	current = Array();
	var i;	var j;
	for (i = 0; i < currentHeight; ++i) {
		current[i] = Array();
		for (j = 0; j < currentWidth; ++j) {
			current[i][j] = cell();
			if (currentBoard[currentWidth*i + j] != 0){
				boardSetter(i, j, currentBoard[currentWidth*i + j]);
			}
			redrawCell($("#cell" + (j + currentWidth*i)));
		}
	}
	bestTime = 0;
	getBestTime();
	writeBestTime();
	getGameTime(true);
}

function timeToStr(time){
	if (time === 0) return "brak";
	var s = Math.floor(time / 1000);
	var m = Math.floor(s / 60);
	var h = Math.floor(m / 60);
	var str = "";
	if (h > 0) str += h%60 + "h: ";
	if (m > 0) str += m%60 + "m: ";
	str+= s%60 + "s";
	return str; 
}

function getGameTime(newGame){
	if (newGame || (time === 0)) {
		time = new Date();
	}
	var now = new Date();
	var diff = now - time;
	return timeToStr(diff);	
}
function getBestTime(){
	name = "bestTime" + boardName;
    if (document.cookie && document.cookie != '') {
	    var cookies = document.cookie.split(';');
	    for (var i = 0; i < cookies.length; i++) {
	        var cookie = jQuery.trim(cookies[i]);
	        if (cookie.substring(0, name.length + 1) == (name + '=')) {
	            bestTime = decodeURIComponent(cookie.substring(name.length + 1));
	            break;
	        }
	    }
	}
}

function newGlobalBest(time){
	$.post('highscores/' + contest + '/',
	{'boardname': boardName, 'time': time},
	function(json) {
		ret = eval(json);
		if (ret) {
			alert("Jesteś nowym mistrzem!")
		}
		else {
			alert("Niestety Twój wynik nie jest najlepszy.")
		} 
	});	
}

function newBestTime(){
	var now = new Date();
	var diff = now - time;
	
	if((bestTime > diff) || (bestTime === 0)){
		bestTime = diff;
		var date = new Date();
		date.setTime(date.getTime()+(7*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
		document.cookie = ["bestTime" + boardName, '=', encodeURIComponent(bestTime), expires].join('');
		
		newGlobalBest(parseInt(bestTime / 1000));
	}
	
}

function writeBestTime(){
	$(".bestTime").html(timeToStr(bestTime));
}
window.setInterval(function(){
	$(".time").html(getGameTime(false));
}, 1000);

function init_numberlink(){
	$(".game").hide();
	
	//findBoards();		//szukanie plansz
	getGameTime(true);	//inicjowanie zegara
	$(".time").hide("");//chowaj czas
	//boardChanger();		//załaduj podstawową planszę
	
	/*->obsługa interfejsu*/
	$("select").change(boardChanger);
	$(".reset").click(startGame);
	$(".check").click(function(event){
		if(check()){
			newBestTime();
			writeBestTime();
			alert("SUPER! Udało Ci się!");
		} else {
			alert("Chyba coś nie tak :/");
		}
	});
	/*obsługa myszy po narysowaniu (w board changer)*/
	/*<-obsługa interfejsu*/
}
/*$(document).ready(function(){
	init_numberlink();
});*/
