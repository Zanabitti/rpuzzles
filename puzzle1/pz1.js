"use strict";
exports.__esModule = true;
var fs = require("fs");
function channelToChar(ca) {
    var result = '';
    var limit = 40;
    var target = 0;
    var isNotFound = true;
    while (isNotFound) {
        if (target == 0) {
            for (var i in ca) {
                if (ca[i] < limit) {
                    target = ca[i];
                    break;
                }
            }
        }
        if (ca[target] < 40)
            target = ca[target];
        else {
            target = ca[target];
            isNotFound = false;
        }
        ;
    }
    result = target.toString() + ' ';
    //result = String.fromCharCode(target);
    return result;
}
var file = fs.readFileSync('bitdata.txt', 'utf8');
var parseData = '';
var parseByte = '';
var byteCount = 0;
var channelArray = [];
for (var i = 0; i < file.length; i++) {
    if (file.charAt(i) == '\n' || i == file.length - 1) {
        parseData += channelToChar(channelArray);
        channelArray = [];
        //parseData+='\n'; 
        byteCount = 0;
        parseByte = '';
    }
    else {
        parseByte += file.charAt(i);
        byteCount++;
        if (byteCount == 8) {
            channelArray.push(parseInt(parseByte, 2));
            //parseData += parseInt(parseByte,2) + ' ';
            byteCount = 0;
            parseByte = '';
        }
    }
}
fs.writeFile('channeldata.txt', parseData, function (err) {
    if (err)
        throw err;
    console.log('Data saved.');
});
