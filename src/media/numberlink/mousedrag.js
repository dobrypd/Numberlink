/**
 * @author piotrek
 * mousedrag
 */
function operateMouse(){
	var lastCell = null;
	$(".cell").mousedown(function(){
		lastCell = this;
	});
	$(".cell").mousemove(function(){
		if ((lastCell != null) && (lastCell != this)){
			if (changeLink($(lastCell).attr('id').substr(4, 7), 
							$(this).attr('id').substr(4, 7))) {
				redrawCell(lastCell);
				redrawCell(this);
				$(lastCell).css('background-color', '#dddddd');
				$(this).css('background-color', '#bbbbbb');
				lastCell = this;
				
			} else {
				lastcell = null;
			}
		}
	});
	$(".cell").mouseup(function(){
		$(this).css('background-color', '#dddddd');
		lastCell = null;
	});
}