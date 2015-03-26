
var bxu = 60;

(function() {
	initializeGrid();
	initializeHide();
	initializeClue();

	initializeWrapper();
	initializeAvailableRings();
	setOffset();
	
	setMan();
})();


$(document).ready(function() {
	$.ajax({
		url : "/2015/lacuna/levels/",
		method : "POST",
		dataType : "json", 
		success : function(data) {
			var obj = data.levels;
			var level = 2;
			var sc = 3;
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
		data : {no : 3 , level : 2},
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
		}
	}
}

function removeCover() {
	$(".cover").fadeOut();
}


function initializeGrid() {
	var marginTop = (($(window).height() - (mapdim[1]*bxu))/2)+"px";
	var marginRight = (($(window).width() - (mapdim[0]*bxu) - 350 )/2)+"px";
	$("#grid").css({"margin-top" : "140px", "margin-left" : marginRight});
	var str = "<table>";
	for(var i=0;i<mapi.length;i++) {
		str += "<tr>\n";
		for(var j=0;j<mapi[0].length;j++) {
			var classname = "cell ";
			if(mapi[i][j] == 1) 
				classname += "cellWall";
			str += "<td id='cell"+i+""+j+"' class='"+classname+"'></td>\n"
		}
		str += "</tr>\n";
	}
	str += "</table>";
	$("#grid").html(str);
}

function initializeWrapper() {
	var wrapper = $("#wrapper");
	var wrapperWidth = (mapdim[0]*bxu)+"px";
	var wrapperHeight = (mapdim[1]*bxu)+"px";
	var TOWidth = (mapdim[0]*bxu/2)+"px";
	var TOHeight = (mapdim[1]*bxu/2)+"px";
	var marginTop = (($(window).height() - (mapdim[1]*bxu))/2)+"px";
	var marginRight = (($(window).width() - (mapdim[0]*bxu) - 350 )/2)+"px";
	var dif = ((mapdim[1]*bxu/2) - (mapdim[0	]*bxu/2))+"px";
	$(wrapper).css({"margin-top" : "140px", "margin-left" : marginRight, width : wrapperWidth, height : wrapperHeight});
}

function initializeHide() {
	for(var i=0;i<hides.length;i++) {
		var coords = hides[i];
		mapi[coords[1]][coords[0]] = 2;
		var cellid = "cell"+coords[1]+""+coords[0];
		var classname = $("#"+cellid).attr("class");
		classname += " cellhide";
		$("#"+cellid).attr("class",classname);
		$("#"+cellid).attr("isHide",1);
	}
}

function initializeClue() {
	for(var i=0;i<clues.length;i++) {
		var coords = clues[i];
		mapi[coords[1]][coords[0]] = 3;
		var cellid = "cell"+coords[1]+""+coords[0];
		$("#"+cellid).attr("isHide",1);
	}
}

function initializeAvailableRings() {
	var count = 1;
	for(var i=0;i<rings.length;i++) {
		if(rings[i][1] != -1) {
			$("#availableRingsWrapper>#aRW"+count).attr("ringIndex",i);
			$("#availableRingsWrapper>#aRW"+count+">#weight").html(rings[i][0]);
			$("#availableRingsWrapper>#aRW"+count+">#number").html(rings[i][1]);
			count++;
		}
		else {
			$("#availableRingsWrapper>#aRW"+count).attr("ringIndex","");
			$("#availableRingsWrapper>#aRW"+count+">#weight").html("");
			$("#availableRingsWrapper>#aRW"+count+">#number").html("");
			count++;
		}
	}
}

$(".availableRing").click(function() {
	var ringIndex = $(this).attr("ringIndex");
	if(!(ringIndex == journeyRings[0] ||ringIndex == journeyRings[1]))
		setJourneyRings($(this).attr("ringIndex"));
});

$(".use").click(function() {
	var ringIndex = $(this).parent().attr("ringIndex");
	if(!((ringIndex == undefined) || (ringIndex == ""))) {
			changeCurrentRing(ringIndex);
	}
});

$(".leave").click(function() {
	var ringIndex = $(this).parent().attr("ringIndex");
	var localclass = $(this).parent().attr("id");
	var indexPos = parseInt(localclass.substring(3)) - 1;
	journeyRings[indexPos] = undefined;
	$("#journeyRingsWrapper>#"+localclass).attr("ringIndex","");
	$("#journeyRingsWrapper>#"+localclass+">#weight").html("");
	$("#journeyRingsWrapper>#"+localclass+">#number").html("");

	rings[ringIndex][1] = -1;
	initializeAvailableRings();
	completedRings[numCompletedRings++] = ringIndex;
	
	$("#completedRingsWrapper>#aRW"+numCompletedRings).attr("ringIndex",ringIndex);
	$("#completedRingsWrapper>#aRW"+numCompletedRings+">#weight").html(rings[ringIndex][0]);

	if(numCompletedRings == 4 && checkAll()) {
		closeGame(1);
	}

});

function setJourneyRings(num) {
	if((currentXY[0] == startXY[0]) && (currentXY[1] == startXY[1])) {
		var r1 = $("#journeyRingsWrapper>#aRW1").attr("recent");
		var r2 = $("#journeyRingsWrapper>#aRW2").attr("recent");
		if(r1 == 1) {
			var r1 = $("#journeyRingsWrapper>#aRW1").attr("recent","0");
			var r2 = $("#journeyRingsWrapper>#aRW2").attr("recent","1");
			$("#journeyRingsWrapper>#aRW2").attr("ringIndex",num);
			$("#journeyRingsWrapper>#aRW2>#weight").html(rings[num][0]);
			$("#journeyRingsWrapper>#aRW2>#number").html(rings[num][1]);
			journeyRings[1] = num;
		}
		else if(r2 == 1) {
			var r1 = $("#journeyRingsWrapper>#aRW1").attr("recent","1");
			var r2 = $("#journeyRingsWrapper>#aRW2").attr("recent","0");
			$("#journeyRingsWrapper>#aRW1").attr("ringIndex",num);
			$("#journeyRingsWrapper>#aRW1>#weight").html(rings[num][0]);
			$("#journeyRingsWrapper>#aRW1>#number").html(rings[num][1]);
			journeyRings[0] = num;
		}
	}
	else {
		open_lb(1,"Sorry!! You cannot change the rings in the middle of the path !. <br> Return to the Start point to do so..");
	}
}

function updateJourneyRings() {
	for(var i=0;i<2;i++) {
		if(journeyRings[i] != undefined)
			if(rings[journeyRings[i]][1] != -1) {
				$("#journeyRingsWrapper>#aRW"+(i+1)+">#weight").html(rings[journeyRings[i]][0]);
				$("#journeyRingsWrapper>#aRW"+(i+1)+">#number").html(rings[journeyRings[i]][1]);
			}
	}
}

function changeCurrentRing(num) {
	if(rings[num][1] > 0) {
		$("#currentRingWrapper>#aRW1>#movesLeft").html(rings[num][0]);
		currentRingIndex = num;
		currentRing = rings[num][0];
		rings[num][1] -= 1;
		initializeAvailableRings();
		updateJourneyRings();
	}
}

function updateCurrentRing(num) {
	$("#currentRingWrapper>#aRW1>#movesLeft").html(currentRing);
}

function setMan() {
	$("#wrapper").append("<div id='man'></div>");
	$("#man").css("transform","translate("+(startXY[0])*bxu+"px,"+(startXY[1])*bxu+"px)");
}

function updateMan(futurePath) {
	$("#man").css("transform","translate("+(futurePath[0])*bxu+"px,"+(futurePath[1])*bxu+"px)");
}


var actTimeStamp = -1;
var timeGap = 50;
var currentKey = -1;
var busyKey = 0;

$("body").keydown(function(e){
	keysum(e);
});

function isHiding() {
	for(var i=0;i<hides.length;i++) {
		if(currentXY[0] == hides[i][0] && currentXY[1] == hides[i][1])
			return true;
	}
	return false;
}

function isAtStart() {
	if((currentXY[0] == startXY[0]) && (currentXY[1] == startXY[1]))
		return true;
	return false;
}

function isAtEnd() {
	if((currentXY[0] == endXY[0]) && (currentXY[1] == endXY[1]))
		return true;
	return false;
}

function isAtClue() {
	for(var i=0;i<clues.length;i++) {
		if(currentXY[0] == clues[i][0] && currentXY[1] == clues[i][1])
			return (i+1);
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
	if(isAtStart() && ((journeyRings[0] == undefined) || (journeyRings[1] == undefined))){
		open_lb(1,"Please select atleast two Rings for the journey before leaving the starting point !");
	}
	else if(currentRing == undefined || currentRing == 0) 
		open_lb(1,"Select new Rings for moves from 2 Journey Rings to continue Journey !..");
	else {
		var futurePath = [];
		futurePath[0] = currentXY[0];
		futurePath[1] = currentXY[1];

		if(currentKey == 37){
			futurePath[0] -= 1;
		} //left
		else if(currentKey == 39){
			futurePath[0] += 1;
		} //right
		else if(currentKey == 40){
			futurePath[1] += 1;
		} //down
		else if(currentKey == 38) {
			futurePath[1] -= 1;
		} //up
		
		if(futurePath[0] == -1 || futurePath[0] == 9 || futurePath[1] == -1 || futurePath[1] == 9) {
			open_lb(1,"Invalid Path !");
		}
		else if(isHiding() && (currentXY[1]-1 == futurePath[1]) ) {
			open_lb(1,"You cannot proceed upward from a hiding space !");
		} 
		else {
			currentRing -= 1;
			updateCurrentRing();
			updateMan(futurePath);
			currentXY[0] = futurePath[0];
			currentXY[1] = futurePath[1];
			if(currentRing == 0) {
				var localleft = rings[currentRingIndex][1];
				if(localleft > 0 && (!(isAtStart()))) {
					changeCurrentRing(currentRingIndex);
				}
				else {
					if(!(isHiding() || isAtStart())) {
						closeGame(0);
					}
				} 
			}
			
			if(isAtEnd()) {
				$(".leave").css("display","block");
			}
			else if (!(isAtEnd())) {
				$(".leave").css("display","none");
			}

			if(isAtClue()) {
				$("#clue"+isAtClue()+"but").css("display","block");
			}
			else if (!(isAtEnd())) {
				$(".clueBox").css("display","none");
			}
		}



	}


	busyKey = 0;
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
	$("#cls"+clno).addClass('clsol')
}

function checkAll() {
	var yes = 0;
	for(var i=0;i<clCor.length;i++) {
		if(clCor[i] == 0)
			return false;
	}
	return true;
}




function setOffset() {
	
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
