$(function() {
	$mountain = $('#mountain');
	$abr1 = $('#abr1');
	$abr2 = $('#abr2');


	$('header').mousemove(function(e){
	    amountMovedX = (e.pageX * 1 / 20);
		// $mountain.css({'background-position': (e.pageX * 1 / 10 + 'px ' + 0)});    
		$abr1.css({'background-position': (e.pageX * 1 / 10 + 'px ' + 0)});    
		$abr2.css({'background-position': (e.pageX * 1 / 30 + 'px ' + 0)});    
	});




	function getBackgroundPos(obj) {
		var pos = obj.css("background-position");
		if (pos == 'undefined' || pos == null) {
			pos = [obj.css("background-position-x"),obj.css("background-position-y")];//i hate IE!!
		} else {
			pos = pos.split(" ");
		}
		return {
			x: parseFloat(pos[0]),
			xUnit: pos[0].replace(/[0-9-.]/g, ""),
			y: parseFloat(pos[1]),
			yUnit: pos[1].replace(/[0-9-.]/g, "")
		};
	}
});