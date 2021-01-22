"use strict";
exports.__esModule = true;
var fs = require("fs");
function createFreqTable(text) {
    var ft = {};
    var char = '';
    var i = text.length;
    while (i--) {
        char = text.charAt(i);
        ft[char] = (ft[char] || 0) + 1;
    }
    return ft;
}
function createSortTable(ft) {
    var x = Object.entries(ft).sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return a - b;
    });
    return x;
}
function regexText(text, found) {
    var regex = found + '.{1}';
    var rgx = new RegExp(regex, 'g');
    var resultarray = text.match(rgx);
    var result = '';
    if (resultarray) {
        result = resultarray != null ? resultarray.join('') : '';
        result = result.replace(RegExp(found, 'g'), '');
        return result;
    }
    else
        return result;
}
var file = fs.readFileSync('signaldata.txt', 'utf8');
var firstsort = createSortTable(createFreqTable(file));
var found = firstsort[firstsort.length - 1][0];
var foundc = found;
var sort;
while (foundc != ';') {
    sort = createSortTable(createFreqTable(regexText(file, foundc)));
    if (sort.length > 0) {
        foundc = sort[sort.length - 1][0];
        found += foundc;
    }
}
fs.writeFileSync('cleandata.txt', found);
