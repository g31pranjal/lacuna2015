
var bxu = 30;
var mapdim = [mapi.length,mapi[0].length];
var startXY = [1,10];
var currentXY = [1,10];

(function() {
	initializeGrid();

	initializeDoors();
	initializeClues();

	initializeWrapper();
	
	setMan();
})();


$(document).ready(function() {
	$.ajax({
		url : "/2015/lacuna/levels/",
		method : "POST",
		dataType : "json", 
		success : function(data) {
			$("#userN").html(data.name);
			$("#userS").html(data.score);
			var obj = data.levels;
			var level = 2;
			var sc = 1;
			var val = 0;
			for(var i=0;i<obj.length;i++) {
				if(sc == obj[i][0] && obj[i][1] == level) {
					val = 1;
					$("#moveIn").fadeIn();
				}
			}
			console.log(val);
			if(val == 0) {
				open_lb(1,"You are not allowed to Open this level !...")
			}
		}
	});
})

$("#moveIn").click(function() {
	removeCover();
	$.ajax({
		url : "/2015/lacuna/cluele/",
		method : "POST",
		data : {no : 1 , level : 2},
		dataType : "json",
		success : function(data) {
			initialize(data.clue_list);
		}
	});
});

function initialize(arr) {
	console.log(arr);
	var no = arr.length;
	for(var i=0;i<no;i++) {
		clCor[i] = arr[i];
		if(arr[i] == 1) {
			$("#cls"+(i+1)).addClass('clSol');
			var d = opGat[i];
			dlock[d] = 0;
		}
	}
}

function removeCover() {
	$(".cover").fadeOut();
}

function initializeGrid() {
	var marginTop = (($(window).height() - (mapdim[1]*bxu))/2)+"px";
	var marginRight = (($(window).width() - (mapdim[0]*bxu) - 350 )/2)+"px";
	$("#grid").css({"margin-top" : marginTop, "margin-left" : marginRight});
	var str = "<table>";
	for(var i=0;i<mapi.length;i++) {
		str += "<tr>\n";
		for(var j=0;j<mapi[0].length;j++) {
			var classname = "cell ";
			if(mapi[i][j] == 1) 
				classname += "cellwall";
			if(mapi[i][j] == 8) 
				classname += "cellIn";
			str += "<td id='cell"+i+""+j+"' class='"+classname+"'></td>\n"
		}
		str += "</tr>\n";
	}
	str += "</table>";
	$("#grid").html(str);
	var TOWidth = (mapdim[1]*bxu/2)+"px";
	var TOHeight = (mapdim[0]*bxu/2)+"px";
	var dif = ((mapdim[0]*bxu/2) - (mapdim[1]*bxu/2))+"px";
	$("#grid").css({"transform-origin" : TOWidth+" "+TOHeight, transform : "translate( "+dif+", -"+dif+") rotate(-90deg)"});

	
}

function initializeWrapper() {
	var wrapper = $("#wrapper");
	var wrapperWidth = (mapdim[0]*bxu)+"px";
	var wrapperHeight = (mapdim[1]*bxu)+"px";
	var TOWidth = (mapdim[1]*bxu/2)+"px";
	var TOHeight = (mapdim[0]*bxu/2)+"px";
	var marginTop = (($(window).height() - (mapdim[1]*bxu))/2)+"px";
	var marginRight = (($(window).width() - (mapdim[0]*bxu) - 350 )/2)+"px";
	var dif = ((mapdim[0]*bxu/2) - (mapdim[1]*bxu/2))+"px";
	$(wrapper).css({"margin-top": marginTop, "margin-left": marginRight, width : wrapperWidth, height : wrapperHeight, "transform-origin" : TOWidth+" "+TOHeight, transform : "translate( "+dif+", -"+dif+") rotate(-90deg)"});
}

function initializeDoors() {
	for(var i=0;i<doors.length;i++) {
		var coords = doors[i];
		mapi[coords[1]][coords[0]] = 2;
		var cellid = "cell"+coords[1]+""+coords[0];
		$("#"+cellid).attr("isDoor",1);
		$("#"+cellid).removeClass("cellwall").addClass("celldoor");
	}
}

function initializeClues() {
	for(var i=0;i<clues.length;i++) {
		var coords = clues[i];
		mapi[coords[1]][coords[0]] = 3;
		var cellid = "cell"+coords[1]+""+coords[0];
		$("#"+cellid).attr("isClue",1);
		$("#"+cellid).addClass("cellclue");
	}
}

function setMan() {
	$("#wrapper").append("<div id='man'></div>");
	$("#man").css("transform","translate("+(startXY[0])*bxu+"px,"+(startXY[1])*bxu+"px)");
}

function updateMan(futurePath) {
	$("#man").css("transform","translate("+(futurePath[0])*bxu+"px,"+(futurePath[1])*bxu+"px)");
}


function closeGame(comp) {
	$("#blackout").fadeIn();
	if(comp==1)
	{
		$('#closeGame_lb').fadeIn();
		$('#cg_info').html("Congratulation ! You have completed the level. Return to Main Page to play another level..");
	}
	else
	{
		$('#closeGame_lb').fadeIn();
		$('#cg_info').html("You could not complete the level. Please try again...");
	}
}

var actTimeStamp = -1;
var timeGap = 50;
var currentKey = -1;
var busyKey = 0;

$("body").keydown(function(e){
	keysum(e);
});

function isAtClue(x,y) {
	for(var i=0;i<clues.length;i++) {
		if(x == clues[i][0] && y == clues[i][1])
			return (i+1);
	}
	return false;
}

function isDoorOpen(path) {
	for(var i=0;i<doors.length;i++) {
		if(path[0] == doors[i][0] && path[1] == doors[i][1]) {
			console.log("gate match");
			if(dlock[i] == 0)
				return true;
		}
	}
	return false;
}

function keysum(e){
	var key = e.keyCode;
	if(key == 38 || key == 40 || key == 37 || key == 39) {
		//console.log("my key :: "+key);
		if((e.timeStamp - actTimeStamp >= timeGap) || (key != currentKey)) {
			actTimeStamp = e.timeStamp;
			currentKey = key;
			if(!busyKey)
				fireMovement();
		}
	}
}


function fireMovement() {
	busyKey = 1;
	var path;
	var valid = 0;
	//console.log("executing movement !");
	var startvalue = mapi[(currentXY[1])][(currentXY[0])];
	//console.log(startvalue);
	if(currentKey == 37){
		path = [currentXY[0],currentXY[1]-1];
	} //up
	else if(currentKey == 39){
		path = [currentXY[0],currentXY[1]+1];
	} //down
	else if(currentKey == 40){
		path = [currentXY[0]-1,currentXY[1]];
	} //left
	else if(currentKey == 38) {
		path = [currentXY[0]+1,currentXY[1]];
	} //right
	
	if(!(path[0] == -1 || path[1] == -1 || path[0] == mapdim[1] || path[1] == mapdim[0])) {
		var pathvalue = mapi[(path[1])][(path[0])];
		valid = 0;
		if(startvalue == 0 && (pathvalue == 2)) {
			console.log("doorahead");
			if(isDoorOpen(path))
				valid = 1;
			else 
				open_lb(1,"This door is locked !!.. Get this door by solving the accessible clues ... ")
		}
		else if(startvalue == 8 && (pathvalue == 2)) {
			console.log("doorahead");
			if(isDoorOpen(path))
				valid = 1;
			else 
				open_lb(1,"This door is locked !!.. Get this door by solving the accessible clues ... ")
		}
		else if(startvalue == 0 && (pathvalue == 0))
			valid = 1; 

		else if(startvalue == 8 && (pathvalue == 8))
			valid = 1; 
		
		else if(startvalue == 2 && (pathvalue == 0))
			valid = 1;
		else if(startvalue == 2 && (pathvalue == 8))
			valid = 1;
		
		else if(startvalue == 0 && (pathvalue == 2))
			valid = 1;
		else if(startvalue == 8 && (pathvalue == 2))
			valid = 1;
		
		else if(startvalue == 0 && (pathvalue == 3))
			valid = 1;
		else if(startvalue == 3 && (pathvalue == 0))
			valid = 1;
		
		else if(startvalue == 8 && (pathvalue == 3))
			valid = 1;
		else if(startvalue == 3 && (pathvalue == 8))
			valid = 1;
		
		console.log(path +"   "+pathvalue);
		console.log(currentXY +"   "+startvalue);
		
	}
		
	//console.log(valid);
	
	if(valid) {
		$("#man").css("transform","translate("+(path[0])*bxu+"px,"+(path[1])*bxu+"px)");
		currentXY[0] = path[0];
		currentXY[1] = path[1];
		if(isAtClue(path[0],path[1])){
			$("#clue"+isAtClue(path[0],path[1])+"but").css("display","block");
		}
		else
			$(".clueBox").css("display","none");
	}
	
	//console.log(pathvalue);

	busyKey = 0;
}


function viewMap() {
	var line = "";
	for(var i=0;i<mapi.length;i++) {
		line = "";
		for(var j=0;j<mapi[0].length;j++) {
			line += mapi[i][j]+"\t";
		}
		console.log(line+"\n");
	}
}


function open_lb(x,str){
	$('#blackout').fadeIn();
	if(x==1)
	{
		$('#notification').fadeIn();
		$('#info').html(str);
	}
	else
	{
		$('#clues').fadeIn();
		$('#clues_data').attr("clueno",str);
		$('#clues_ans').attr("clueno",str);
		$('#clues_data').html("<img src='assets/img/"+str+".jpg'>");
	}
}

function close_lb(){
	$('#blackout').fadeOut();
	$('#notification').fadeOut();
	$('#clues').fadeOut();
	$('#closeGame_lb').fadeOut();
}

function closeGame(comp) {
	$("#blackout").fadeIn();
	if(comp==1)
	{
		$('#closeGame_lb').fadeIn();
		$('#cg_info').html("Congratulation ! You have completed the level. Return to Main Page to play another level..");
	}
	else
	{
		$('#closeGame_lb').fadeIn();
		$('#cg_info').html("You could not complete the level. Please try again...");
	}
}

var clSeq;

$(".clueBox").click(function() {
	$("#cl_ans").val("");
	var clueID = $(this).attr("clue");
	open_lb(0,clueID);
	clSeq = isAtClue(currentXY[0],currentXY[1]);
})

$("#submit_ans").click(function() {
	var clueID=$(this).parent().attr("clueno");
	var ans = $("#cl_ans").val();
	$.ajax({
		url : "/2015/lacuna/writeorwrong/",
		dataType : "json",
		data : { no : clueID , answer : ans }, 
		method : "POST", 
		success : function(data) {
			$("#userN").html(data.name);
			$("#userS").html(data.score);
			if(data.status == 2) {
				close_lb();
				open_lb(1,"Sorry ! Wrong Answer... Try Again.");
			}
			if(data.status == 1) {
				markCorrect();
			}
			if(data.status == 0) {
				close_lb();
				open_lb(1,"You are not allowed to access this question at this moment of time...");
			}
		}
	});
});

function markCorrect() {
	close_lb();
	var clno = clSeq;
	clCor[clno-1] = 1;
	var gateOp = opGat[clno-1];
	dlock[gateOp] = 0;
	open_lb(1,clmsg[clno-1]);
	$("#cls"+clno).addClass('clsol')

	if(checkAll()) {
		closeGame(1);

	}
}

function checkAll() {
	var yes = 0;
	for(var i=0;i<clCor.length;i++) {
		if(clCor[i] == 0)
			return false;
	}
	return true;
}
