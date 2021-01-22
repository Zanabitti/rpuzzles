import * as fs from 'fs';
import { parse } from 'path';

function channelToChar(ca : number[]): string {
    let result : string = '';
    let limit : number = 40;
    let target : number = 0;
    let isNotFound : boolean = true;
    while(isNotFound){
        if(target == 0){
            for(let i in ca){
                if(ca[i] < limit) {
                    target = ca[i];
                    break;
                }
            }
        }

        if(ca[target] < 40) target = ca[target];
        else {
            target = ca[target];
            isNotFound = false;
        };

    }
    result = target.toString() + ' ';
    //result = String.fromCharCode(target);
    return result;
}

const file = fs.readFileSync('bitdata.txt','utf8');
let parseData : string = '';
let parseByte : string = '';
let byteCount : number = 0;
let channelArray : number[] = []; 

for(let i = 0;i<file.length;i++){
    if(file.charAt(i) == '\n' || i == file.length-1) {
        parseData+=channelToChar(channelArray);
        channelArray = [];
        
        //parseData+='\n'; 
        byteCount = 0; 
        parseByte = '';
    }
    else {
        parseByte += file.charAt(i);
        byteCount++;
        if(byteCount==8) {
            channelArray.push(parseInt(parseByte,2));
            //parseData += parseInt(parseByte,2) + ' ';
            byteCount = 0;
            parseByte = '';
        }
    }
    
}

fs.writeFile('channeldata.txt', parseData, (err) =>{
    if(err) throw err;
    console.log('Data saved.');
    
});

