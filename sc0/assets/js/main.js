(function(){
	arrangeCircles();
	setOffset();	
})();

arrangeCircles();

function setOffset() {
	var ml = ($(window).width() - 500 - 350)/2;
	var mt = ($(window).height() - 500)/2;
	$("#wrapper").css({ "margin-top" : mt+"px" , "margin-left" : ml+"px" });
}

function arrangeCircles() {
	var no = cirData.length;
	for(var i=0;i<no;i++) {
		var cr = cirData[i];
		var mgT = (500 - cr.size)/2;
		$("#cir"+(i+1)).css({"border-radius" : cr.size+"px" ,  "z-index" : (5-i),margin : mgT, width : (cr.size+"px"), height : (cr.size+"px")});
	}
}

$(".innerC").click(function() {
	var no = $(this).attr("cr");
	var or = cirData[no].ort;
	$(this).css({ "transform" : "rotate("+((or+1)%3)*120+"deg)"});
	cirData[no].ort += 1;
	if(isAtSol()) {
		$("#clue"+(isAtSol())+"but").css("display","block");
	}
	else
		$(".clueBox").css("display","none");
});



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
	clSeq = isAtSol();
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
				$.ajax({
					url : "/2015/lacuna/round-up/",
					method : "POST",
					success : function(data) {
						if(data.status == 1) {
							open_lb(1,clmsg[isAtSol()-1]);
						}
					}
				});
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

$(document).ready(function() {
	$.ajax({
		url : "/2015/lacuna/levels/",
		method : "POST",
		dataType : "json", 
		success : function(data) {
			$("#userN").html(data.name);
			$("#userS").html(data.score);
			var obj = data.levels;
			var level = 1;
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
		data : {no : 1 , level : 1},
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

function isAtSol() {
	var omap = [(cirData[0].ort%3),(cirData[1].ort%3),(cirData[2].ort%3),(cirData[3].ort%3)];
	var val = false;
	for(var i=0;i<scr.length;i++) {
		for(var j=0;j<scr[i].length;j++) {
			if(checkSol(i,j,omap)) 
				return (i+1);
		}
	}
	return false;
}

function checkSol(i,j,omap) {
	for(var m=0;m<scr[i][j].length;m++) {
		if(scr[i][j][m] != omap[m])
			return false;
	}
	return true;
}
