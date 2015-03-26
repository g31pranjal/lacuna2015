/*
	ORIENTATION
	0-original
	1- +90
	2- +180
	3- +270
*/

var clues = [[8,2],[6,22],[18,5],[17,26]];
var clCor = [0,0,0,0];

var world = [
{ 'type' : 'mv', 'height' : 2, 'width' : 2, 'x' : 2, 'y' : 2, 'fill' : [[1,1],[1,0]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 3 },
{ 'type' : 'mv', 'height' : 1, 'width' : 3, 'x' : 4, 'y' : 2, 'fill' : [[3,6,8]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 1, 'width' : 3, 'x' : 7, 'y' : 2, 'fill' : [[10,10,10]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1}, 
{ 'type' : 'mv', 'height' : 2, 'width' : 2, 'x' : 10, 'y' : 2, 'fill' : [[5,1],[0,1]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1 },
{ 'type' : 'fx', 'height' : 3, 'width' : 1, 'x' : 11, 'y' : 4, 'fill' : [[1],[1],[1]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 0 },
{ 'type' : 'mv', 'height' : 2, 'width' : 3, 'x' : 8, 'y' : 6, 'fill' : [[1,1,1],[1,0,0]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 2},
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 11, 'y' : 7, 'fill' : [[3],[6],[8]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 2, 'y' : 4, 'fill' : [[3],[6],[8]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 2, 'width' : 2, 'x' : 2, 'y' : 7, 'fill' : [[10,0],[10,10]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 3},
{ 'type' : 'mv', 'height' : 1, 'width' : 3, 'x' : 4, 'y' : 8, 'fill' : [[8,6,3]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 2, 'width' : 2, 'x' : 7, 'y' : 8, 'fill' : [[1,1],[0,1]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 1, 'width' : 1, 'x' : 8, 'y' : 10, 'fill' : [[5]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 0},
{ 'type' : 'mv', 'height' : 3, 'width' : 2, 'x' : 7, 'y' : 11, 'fill' : [[0,10],[10,10],[0,10]], 'pivotx' : 1, 'pivoty' : 1, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 1, 'width' : 3, 'x' : 4, 'y' : 12, 'fill' : [[3,6,8]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1},
{ 'type' : 'fx', 'height' : 1, 'width' : 2, 'x' : 2, 'y' : 12, 'fill' : [[1,1]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 0 },
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 11, 'y' : 10, 'fill' : [[10],[10],[10]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 11, 'y' : 13, 'fill' : [[8],[6],[3]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 3 },
{ 'type' : 'mv', 'height' : 3, 'width' : 2, 'x' : 10, 'y' : 16, 'fill' : [[0,1],[5,1],[0,1]], 'pivotx' : 1, 'pivoty' : 1, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 4, 'width' : 5, 'x' : 5, 'y' : 17 , 'fill' : [[10,10,10,10,10],[0,8,0,0,0],[0,6,0,0,0],[0,3,0,0,0]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 2, 'width' : 3, 'x' : 6, 'y' : 21, 'fill' : [[1,0,0],[1,1,1]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 2},
{ 'type' : 'mv', 'height' : 1, 'width' : 3, 'x' : 9, 'y' : 22, 'fill' : [[3,6,8]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 2, 'width' : 2, 'x' : 12, 'y' : 21, 'fill' : [[0,10],[10,10]], 'pivotx' : 1, 'pivoty' : 1, 'orientation' : 2},
{ 'type' : 'mv', 'height' : 7, 'width' : 4, 'x' : 14, 'y' : 18 , 'fill' : [[0,0,0,8],[0,0,0,6],[0,0,0,3],[8,6,3,1],[0,0,0,3],[0,0,0,6],[0,0,0,8]], 'pivotx' : 3, 'pivoty' : 3, 'orientation' : 1 },
{ 'type' : 'fx', 'height' : 3, 'width' : 3, 'x' : 16, 'y' : 25 , 'fill' : [[10,10,10],[10,10,10],[10,10,10]], 'pivotx' : 1, 'pivoty' : 1, 'orientation' : 0},
{ 'type' : 'mv', 'height' : 3, 'width' : 3, 'x' : 12, 'y' : 10, 'fill' : [[0,0,5],[10,10,10],[0,0,10]], 'pivotx' : 2, 'pivoty' : 1, 'orientation' : 1},
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 14, 'y' : 7, 'fill' : [[1],[1],[1]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 2, 'width' : 3, 'x' : 14, 'y' : 5, 'fill' : [[1,1,5],[1,0,0]], 'pivotx' : 0, 'pivoty' : 0, 'orientation' : 3},
{ 'type' : 'fx', 'height' : 3, 'width' : 3, 'x' : 17, 'y' : 4 , 'fill' : [[10,10,10],[10,10,10],[10,10,10]], 'pivotx' : 1, 'pivoty' : 1, 'orientation' : 0},
{ 'type' : 'mv', 'height' : 3, 'width' : 1, 'x' : 14, 'y' : 13, 'fill' : [[8],[6],[3]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1 },
{ 'type' : 'mv', 'height' : 3, 'width' : 2, 'x' : 14, 'y' : 16, 'fill' : [[1,0],[1,5],[1,0]], 'pivotx' : 0, 'pivoty' : 1, 'orientation' : 1},
{ 'type' : 'fx', 'height' : 1, 'width' : 3, 'x' : 16, 'y' : 17, 'fill' : [[10,10,10]], 'pivotx' : 1, 'pivoty' : 0, 'orientation' : 0},

];

var mapi = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];