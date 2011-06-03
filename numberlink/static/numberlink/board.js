/**
 * @author piotrek
 * board
 */

/*->global*/
var defaultBoardWidth = 7;
var defaultBoardHeight = 7;
var defaultBoard = 
"0004000" +
"0300250" +
"0003100" +
"0005000" +
"0000000" +
"0010000" +
"2000400";

var boardName = "";
var currentBoard = "";
var currentWidth = 0;
var currentHeight = 0;
/*<-global*/

function redrawCell(cell){
	var pos = idToPos($(cell).attr('id').substr(4, 7));
	var direction = current[pos.y][pos.x].getDirection();
	var image = 0;
	if (direction.up) 		{ image += 1; }
	if (direction.right) 	{ image += 2; }
	if (direction.down) 	{ image += 4; }
	if (direction.left) 	{ image += 8; }
	
	$(cell).css('background-image', 'url("/static/numberlink/gfx/'+ image +'.png")');
	$(cell).css('background-color', '#aaaaaa');
	if (image === 0) $(cell).css('background-color', '#dddddd'); 	
}

function loadBoard(str){
	to_ret = {};
	$.getJSON('/board/' + str + '/?xhr',
		{}, 
		function(json, status, xhr) {
			if (status == "error") {
				var msg = "Wystąpił błąd podczas ładowania planszy: ";
				$(".bbq-item").html(msg + xhr.status + " " + xhr.statusText);
  			}
			if (status == "success") {
				boardName = json.name;
				to_ret= {
					'board': json.description,
					'boardWidth': json.width,
					'boardHeight': json.height,
				};
				boardLoaded(to_ret)
			}
    });
}

function drawBoard(board, width, height){
	function IsNumeric(input)
	{
	   return (input - 0) == input && input.length > 0;
	}
	function num(number) { 
		return (number == 0)?(""):(
			IsNumeric(number)?(number):(number.charCodeAt(0) - 'a'.charCodeAt(0) + 10)
		); 
	}
	currentBoard = board;
	currentWidth = width;
	currentHeight = height;
	var newBoard = $("<div onselectstart=\"return false\"></div>").attr('id','insideBoard')
						.css('width', width*42)
						.css('height', height*42)
						.css('margin-top', -height*42/2)
						.css('margin-left', -width*42/2);
	var i = 0;	var j = 0;	var c = "";
	for (i = 0; i < height; ++i) {
		c = $("<div>" + num(board[i * width]) + "</div>").attr('id', 'cell' + i * width).attr('class', 'cell').css('clear', 'left');
		newBoard.append(c);
		for (j = 1; j < width; ++j) {
			c = $("<div>" + num(board[i * width + j]) + "</div>").attr('id', 'cell' + (i * width + j)).attr('class', 'cell');
			newBoard.append(c);
		}
	}
	$(".board").css('width', width*42);
	$(".board").css('height', height*42);
	
	return newBoard;
}

function boardChanger(){
	$(".game").hide("slow");
	
	$("select option:selected").each(function () {
		boardName = $(this).text();
	});
	
	var loadedBoard = loadBoard(boardName);
}

function boardLoaded(loadedBoard){
	$(".board").html(drawBoard(loadedBoard.board, loadedBoard.boardWidth, loadedBoard.boardHeight));
	$(".boardName").text('Plansza: ' + boardName);
	
	operateMouse();
	
	$(".time").show("slow");
	$(".bestTime").show("slow");
	startGame();
	$(".game").show("slow");
}
