import { stdout } from 'process';
import { WriteStream } from 'tty';
import * as Canvas from '../node_modules/drawille';
import * as fs from 'fs';
import { pathToFileURL } from 'url';

;

interface neural {
    startx: number;
    starty: number;
    route: string[];
    
}
interface neuralArray {
    [index: number]: neural;
}
function parseSingleRoute(data: string): neural {
    let n: neural;
    let coords = data.match(/\S+/)[0].split(',');
    n = {startx: parseInt(coords[0]), starty: parseInt(coords[1]), route: data.match(RegExp(/[A-X]/,'g'))};
    return n;
}
function mapLimits(n: neuralArray): number[] {
    let maxX:number = 0, maxY:number = 0;
    for(let i in n){
        if(maxX < n[i].startx) maxX = n[i].startx; 
        if(maxY < n[i].starty) maxY = n[i].starty; 
    }
    //buffer?
    maxX += 2;
    maxY += 2;
    return [maxX, maxY];
}
const file = fs.readFileSync('routedata.txt', 'utf8');
let neurals: neuralArray = {};
let n: neural;
let line: string = '';

for(let i=0;i<file.length;i++){
    if(file.charAt(i) == '\n' || i == file.length-1){
        if(i == file.length-1) line += file.charAt(i);
        n = parseSingleRoute(line);
        Array.prototype.push.call(neurals,n);
        line = '';
    }
    else {
        line += file.charAt(i);
    }
}

let limit = mapLimits(neurals);

let pathedMap = new Array(limit[0]);
let valuedMap: number[][];

let mapRow = new Array(limit[1]);
let il = pathedMap.length;
mapRow = mapRow.fill('X');
while(il--){
    pathedMap[il] = [...mapRow];
}

//routing
let cx:number = 0, cy:number = 0;
let cr:string = '';


for(let i in neurals){
    if(i == 'length') break; 
    cx = neurals[i].startx;
    cy = neurals[i].starty;
    pathedMap[cx][cy] = 'V';
    for(let ii in neurals[i].route) {
         
        cr = (neurals[i].route[ii] || '');
        switch(cr) {
            case 'U':
                cy--;
                if((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))pathedMap[cx][cy] = 'V';
                break;
            case 'D':
                cy++;
                if((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))pathedMap[cx][cy] = 'V';
                break;
            case 'L':
                cx--;
                if((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))pathedMap[cx][cy] = 'V';
                break;
            case 'R':
                cx++;
                if((cx >= 0 && cx <= limit[0]) && (cy >= 0 && cy <= limit[1]))pathedMap[cx][cy] = 'V';
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
let ix = pathedMap.length;
let iy = pathedMap[0].length;
let pathCount = 0;
let bx:number, by:number;
let isStart:boolean = false;

while(!(isStart)){
    while(ix--){
        while(iy--){
            if(pathedMap[ix][iy] == 'F' && pathCount == 0) pathedMap[ix][iy] = 0;
            if(pathedMap[ix][iy] == pathCount-1) {
                if((ix+1 < limit[0] ) && (iy+1 < limit[1]) && (ix-1 >= 0 ) && (iy-1 >= 0)){
                    if(pathedMap[ix][iy-1] == 'V') { pathedMap[ix][iy-1] = pathCount; 
                    } else if(pathedMap[ix][iy-1] == 'S') {
                        isStart = true;
                        pathedMap[ix][iy-1] = 'C';
                        bx = ix;
                        by = iy-1;
                    }
                    if(pathedMap[ix][iy+1] == 'V') { pathedMap[ix][iy+1] = pathCount; 
                    } else if(pathedMap[ix][iy+1] == 'S') {
                        isStart = true;
                        pathedMap[ix][iy+1] = 'C';
                        bx = ix;
                        by = iy+1;
                    }
                    if(pathedMap[ix+1][iy] == 'V') { pathedMap[ix+1][iy] = pathCount; 
                    } else if(pathedMap[ix+1][iy] == 'S') {
                        isStart = true;
                        pathedMap[ix+1][iy] = 'C';
                        bx = ix+1;
                        by = iy;
                    }
                    if(pathedMap[ix-1][iy] == 'V') { pathedMap[ix-1][iy] = pathCount; 
                    } else if(pathedMap[ix-1][iy] == 'S') {
                        isStart = true;
                        pathedMap[ix-1][iy] = 'C';
                        bx = ix-1;
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
let solution:string = '';

while(pathCount--) {
   if(pathedMap[bx][by-1] == pathCount){
       solution += 'U';
       by--;
   }
   else if(pathedMap[bx][by+1] == pathCount){
       solution += 'D';
       by++;
   }
   else if(pathedMap[bx+1][by] == pathCount){
       solution += 'R';
       bx++;
   }
   else if(pathedMap[bx-1][by] == pathCount){
       solution += 'L';
       bx--;
   }
   else {
       console.log('NO MATCH!! ERROR AT '+bx+','+by);
   }
}

console.log(solution);
fs.writeFileSync('solution.txt',solution,'utf8');
