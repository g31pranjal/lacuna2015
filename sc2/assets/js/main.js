
var bxu = 30;
var startXY = [2,12];
var mapdim = [mapi[0].length,mapi.length];

(function() {
	initializeGrid();
	initializeWrapper();
	setOffset();
	for(var i=0;i<world.length;i++) {
		convert(i);
	}
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
			var sc = 2;
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

function setMan() {
	$("#wrapper").append("<div id='man'></div>");
	$("#man").css("transform","translate("+(startXY[0]-1)*bxu+"px,"+(startXY[1]-1)*bxu+"px)");
}

function convert(key) {
	var obj = world[key];
	var objID = 'segment'+(key+1);
	
	$("#wrapper").append("<div class='segment' type='"+obj.type+"' orientation='"+(-1)+"' id='"+objID+"'></div>");
	
	var objref = $("#"+objID);
	
	var trnX = ((obj.pivotx+0.5)*bxu);
	var trnY = ((obj.pivoty+0.5)*bxu);

	$(objref).css("transform-origin",trnX+"px "+trnY+"px");
	$(objref).css({height : (obj.height*bxu)+"px" , width : (obj.width*bxu)+"px" , "transform" :  "translate("+((obj.x-1)*bxu)+"px,"+ ((obj.y-1)*bxu)+"px"+")" });

	var str = "";
	for(var i=0;i<obj.height;i++) {
		str += "<ul>\n";
		for(var j=0;j<obj.width;j++) {
			var id = "cell"+(j+1)+(i+1);
			var cl = "commonChar ";
			if(obj.fill[i][j] == 1)
				cl += "cellGround";
			else if (obj.fill[i][j] == 10)
				cl += "cellTop"
			else if (obj.fill[i][j] == 3)
				cl += "stair1"
			else if (obj.fill[i][j] == 6 || obj.fill[i][j] == 5)
				cl += "stair2"
			else if (obj.fill[i][j] == 8)
				cl += "stair3"

			str = str+"<li class='"+cl+"'></li>"+"\n";
		}
		str += "</ul>\n";
	}
	$(objref).append(str);

	setOrientation(-1,obj.orientation,objref);

	$(objref).click(function(){
		if($(this).attr("type") == "mv") {
			var curor = $(this).attr("orientation");
			setOrientation(parseInt(curor),(parseInt(curor)+1)%4,this);
		}
	});
}

function setOrientation(preor,or,objref) {
	if(or < 0)
		or += 4;
	
	var tr = $(objref).css("transform");
	var values = tr.split('(')[1],
    values = values.split(')')[0],
    values = values.split(',');

	var trX = values[4];
	var trY = values[5];

	var id=parseInt($(objref).attr("id").substring(7));
	if(setOrientationinMap(preor,or,objref,world[id-1])) {
		$(objref).css("transform","translate("+trX+"px,"+trY+"px) rotate("+(or*90)+"deg)");
		$(objref).attr("orientation",(or%4));
		return 0;
	}
	else {
		or++;
		setOrientation(preor,or%4,objref);
	}
}

function setOrientationinMap(preor,or,objref,obj) {
	var Xoffeset = obj.x-1;
	var Yoffeset = obj.y-1;
	var pivotX = obj.pivotx;
	var pivotY = obj.pivoty;
	var refX = Xoffeset + pivotX;
	var refY = Yoffeset + pivotY;

	for(var i=0;i<obj.height;i++) {
		for(var j=0;j<obj.width;j++) {
			var intX = j - pivotX;
			var intY = i - pivotY;
			if(preor == 1) {
				var posX = refX - intY;
				var posY = refY + intX;
			} else if(preor == 2) {
				var posX = refX - intX;
				var posY = refY - intY;
			} else if(preor == 3) {
				var posX = refX + intY;
				var posY = refY - intX;
			} else if(preor == 0) {
				var posX = refX + intX;
				var posY = refY + intY;
			}
			if(preor >= 0 && preor <= 3)
				mapi[posY][posX] = 0;
		}
	}

	var check = 0;

	for(var i=0;i<obj.height;i++) {
		for(var j=0;j<obj.width;j++) {
			var intX = j - pivotX;
			var intY = i - pivotY;
			if(or == 1) {
				var posX = refX - intY;
				var posY = refY + intX;
			} else if(or == 2) {
				var posX = refX - intX;
				var posY = refY - intY;
			} else if(or == 3) {
				var posX = refX + intY;
				var posY = refY - intX;
			} else if(or == 0) {
				var posX = refX + intX;
				var posY = refY + intY;
			}

			if(or != -1){
				if (mapi[posY][posX] != 0){
					check = 1;
					return false;
				}
			}
		}
	}

	if(check != 1) {
		for(var i=0;i<obj.height;i++) {
			for(var j=0;j<obj.width;j++) {
				var intX = j - pivotX;
				var intY = i - pivotY;
				if(or == 1) {
					var posX = refX - intY;
					var posY = refY + intX;
				} else if(or == 2) {
					var posX = refX - intX;
					var posY = refY - intY;
				} else if(or == 3) {
					var posX = refX + intY;
					var posY = refY - intX;
				} else if(or == 0) {
					var posX = refX + intX;
					var posY = refY + intY;
				}

				if(or != -1){
					mapi[posY][posX] = obj.fill[i][j];
				}
			}
		}
	}
	return true;
}

var actTimeStamp = -1;
var timeGap = 50;
var currentKey = -1;
var busyKey = 0;
var currentXY = startXY;

$("body").keydown(function(e){
	keysum(e);
});

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
	var startvalue = mapi[(currentXY[1]-1)][(currentXY[0]-1)];
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
	var pathvalue = mapi[(path[1]-1)][(path[0]-1)];
	
	if(startvalue == 1 && (pathvalue == 1 || pathvalue == 3 || pathvalue == 5))
		valid = 1;
	else if(startvalue == 3 && (pathvalue == 1 || pathvalue == 6))
		valid = 1;
	else if(startvalue == 6 && (pathvalue == 3 || pathvalue == 8))
		valid = 1;
	else if(startvalue == 8 && (pathvalue == 6 || pathvalue == 10))
		valid = 1;
	else if(startvalue == 10 && (pathvalue == 5 || pathvalue == 8 || pathvalue == 10))
		valid = 1;
	else if(startvalue == 5 && (pathvalue == 1 || pathvalue == 10))
		valid = 1;
	else
		open_lb(1,"This is an invalid move ! <br> Movement is allowed along the path only .. ")
	
	//console.log(valid);
	
	if(valid) {
		$("#man").css("transform","translate("+(path[0]-1)*bxu+"px,"+(path[1]-1)*bxu+"px)");
		currentXY[0] = path[0];
		currentXY[1] = path[1];	
	}

	if(isAtClue()) {
		$("#clue"+isAtClue()+"but").css("display","block");
	}
	else
		$(".clueBox").css("display","none");
	
	//console.log(pathvalue);

	busyKey = 0;
}



function isAtClue() {
	for(var i=0;i<clues.length;i++) {
		if(currentXY[0] == clues[i][0] && currentXY[1] == clues[i][1])
			return (i+1);
	}
	return false;
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



function initializeGrid() {
	var str = "<table>";
	for(var i=0;i<mapi[0].length;i++) {
		str += "<tr>\n";
		for(var j=0;j<mapi.length;j++) {
			str += "<td class='gridcell'></td>\n"
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
	var marginTop = (($(window).height() - (mapdim[0]*bxu))/2)+"px";
	var marginRight = (($(window).width() - (mapdim[1]*bxu) - 350 )/2)+"px";
	console.log(marginRight);
	var dif = ((mapdim[1]*bxu/2) - (mapdim[0]*bxu/2))+"px";
	$(wrapper).css({"margin-left" : marginRight, "margin-top" : marginTop, width : wrapperWidth, height : wrapperHeight, "transform-origin" : TOWidth+" "+TOHeight, transform : "translate( "+dif+", -"+dif+") rotate(-90deg)"});
	console.log("translate( -"+dif+", "+dif+") rotate(-90deg)");
	$("#grid").css({"margin-left" : marginRight, "margin-top" : marginTop});
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
