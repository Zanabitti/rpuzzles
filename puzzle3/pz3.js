"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var fs = require("fs");
;
function parseSingleRoute(data) {
    var n;
    var coords = data.match(/\S+/)[0].split(',');
    n = { startx: parseInt(coords[0]), starty: parseInt(coords[1]), route: data.match(RegExp(/[A-X]/, 'g')) };
    return n;
}
function mapLimits(n) {
    var maxX = 0, maxY = 0;
    for (var i in n) {
        if (maxX < n[i].startx)
            maxX = n[i].startx;
        if (maxY < n[i].starty)
            maxY = n[i].starty;
    }
    //buffer?
    maxX += 2;
    maxY += 2;
    return [maxX, maxY];
}
var file = fs.readFileSync('routedata.txt', 'utf8');
var neurals = {};
var n;
var line = '';
for (var i = 0; i < file.length; i++) {
    if (file.charAt(i) == '\n' || i == file.length - 1) {
        if (i == file.length - 1)
            line += file.charAt(i);
        n = parseSingleRoute(line);
        Array.prototype.push.call(neurals, n);
        line = '';
    }
    else {
        line += file.charAt(i);
    }
}
var limit = mapLimits(neurals);
var pathedMap = new Array(limit[0]);
var valuedMap;
var mapRow = new Array(limit[1]);
var il = pathedMap.length;
mapRow = mapRow.fill('X');
while (il--) {
    pathedMap[il] = __spreadArrays(mapRow);
}
//routing
var cx = 0, cy = 0;
var cr = '';
for (var i in neurals) {
    if (i == 'length')
        break;
    cx = neurals[i].startx;
    cy = neurals[i].starty;
    pathedMap[cx][cy] = 'V';
    for (var ii in neurals[i].route) {
        cr = (neurals[i].route[ii] || '');
        switch (cr) {
            case 'U':
                cy--;
                if ((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))
                    pathedMap[cx][cy] = 'V';
                break;
            case 'D':
                cy++;
                if ((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))
                    pathedMap[cx][cy] = 'V';
                break;
            case 'L':
                cx--;
                if ((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))
                    pathedMap[cx][cy] = 'V';
                break;
            case 'R':
                cx++;
                if ((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))
                    pathedMap[cx][cy] = 'V';
                break;
            case 'X':
                break;
            case 'F':
                pathedMap[cx][cy] = 'F';
                break;
            case 'S':
                pathedMap[cx][cy] = 'S';
                break;
            default:
                console.log("error or empty route");
                break;
        }
    }
}
//backtrack route
var ix = pathedMap.length;
var iy = pathedMap[0].length;
var pathCount = 0;
var bx, by;
var isStart = false;
while (!(isStart)) {
    while (ix--) {
        while (iy--) {
            if (pathedMap[ix][iy] == 'F' && pathCount == 0)
                pathedMap[ix][iy] = 0;
            if (pathedMap[ix][iy] == pathCount - 1) {
                if ((ix + 1 < limit[0]) && (iy + 1 < limit[1]) && (ix - 1 >= 0) && (iy - 1 >= 0)) {
                    if (pathedMap[ix][iy - 1] == 'V') {
                        pathedMap[ix][iy - 1] = pathCount;
                    }
                    else if (pathedMap[ix][iy - 1] == 'S') {
                        isStart = true;
                        pathedMap[ix][iy - 1] = 'C';
                        bx = ix;
                        by = iy - 1;
                    }
                    if (pathedMap[ix][iy + 1] == 'V') {
                        pathedMap[ix][iy + 1] = pathCount;
                    }
                    else if (pathedMap[ix][iy + 1] == 'S') {
                        isStart = true;
                        pathedMap[ix][iy + 1] = 'C';
                        bx = ix;
                        by = iy + 1;
                    }
                    if (pathedMap[ix + 1][iy] == 'V') {
                        pathedMap[ix + 1][iy] = pathCount;
                    }
                    else if (pathedMap[ix + 1][iy] == 'S') {
                        isStart = true;
                        pathedMap[ix + 1][iy] = 'C';
                        bx = ix + 1;
                        by = iy;
                    }
                    if (pathedMap[ix - 1][iy] == 'V') {
                        pathedMap[ix - 1][iy] = pathCount;
                    }
                    else if (pathedMap[ix - 1][iy] == 'S') {
                        isStart = true;
                        pathedMap[ix - 1][iy] = 'C';
                        bx = ix - 1;
                        by = iy;
                    }
                }
            }
        }
        iy = limit[1];
    }
    ix = limit[0];
    pathCount++;
}
pathCount--;
ix = limit[0], iy = limit[1];
var solution = '';
while (pathCount--) {
    if (pathedMap[bx][by - 1] == pathCount) {
        solution += 'U';
        by--;
    }
    else if (pathedMap[bx][by + 1] == pathCount) {
        solution += 'D';
        by++;
    }
    else if (pathedMap[bx + 1][by] == pathCount) {
        solution += 'R';
        bx++;
    }
    else if (pathedMap[bx - 1][by] == pathCount) {
        solution += 'L';
        bx--;
    }
    else {
        console.log('NO MATCH!! ERROR AT ' + bx + ',' + by);
    }
}
console.log(solution);
fs.writeFileSync('solution.txt', solution, 'utf8');
