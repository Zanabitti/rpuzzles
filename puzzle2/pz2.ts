import * as fs from 'fs';

interface strmap {
    [key : string]: number;
    
}

function createFreqTable(text : string): strmap {
    let ft: strmap = {};
    let char : string = '';
    let i : number = text.length;
    while(i--){
        char = text.charAt(i);
        ft[char] = (ft[char] || 0) + 1;
    }
    return ft;
}

function createSortTable(ft : strmap) {
    let x = Object.entries(ft).sort(([,a],[,b]) => a-b);
    return x;
}

function regexText(text : string, found : string) {
    let regex =  found+'.{1}';
    let rgx = new RegExp(regex,'g');
    let resultarray = text.match(rgx);
    let result = '';
    if(resultarray){
        result = resultarray != null ? resultarray.join('') : '';
        result = result.replace(RegExp(found,'g'),'');
        return result;
    }
    else return result;
}


const file = fs.readFileSync('signaldata.txt','utf8');

let firstsort = createSortTable(createFreqTable(file));
let found : string = firstsort[firstsort.length-1][0];
let foundc : string = found;
let sort;

while(foundc != ';'){
    sort = createSortTable( 
                createFreqTable(
                    regexText(file,foundc)));
    if(sort.length>0) {
        foundc= sort[sort.length-1][0];
        found += foundc;
        
    }
}

fs.writeFileSync('cleandata.txt', found);