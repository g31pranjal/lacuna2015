/*
	ORIENTATION
	0- Open Space
	1- Wall
	2- Hides
	3- clues
*/

var hides = [[0,4],[2,3],[2,8],[4,6],[6,0],[6,4],[6,6],[6,8],[8,0],[8,4]];

var clues = [[4,6],[8,4]];
var clCor = [0,0];

var rings = [[8,2],[6,3],[4,7],[2,11]];

var journeyRings = [];

var currentRing = undefined;
var currentRingIndex = undefined;

var completedRings = [];
var numCompletedRings = 0;

var mapi = [
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0]
];

var startXY = [0,8];

var endXY = [8,0];

var currentXY = [];
currentXY[0] = startXY[0];
currentXY[1] = startXY[1];

var mapdim = [mapi[0].length,mapi.length];
