import * as request from 'request';
import {receiveMessageServer} from './perfectNumberServer';

console.log(`start`);

receiveMessageServer.start(30000);

function getSumOfDivisors(numberToCheck:number):number{
   let sumDivisors = 0;
   for ( let j=1; j<numberToCheck; j++){
      if (numberToCheck%j===0) sumDivisors += j;
      if (Math.ceil(numberToCheck/2)<j) break;
   }
   return sumDivisors; 
}

const totalNumbers2 = 50000;

console.time("perfectNumberTiming2");

for ( let i=1; i<totalNumbers2; i++){
   const sumDivisors = getSumOfDivisors(i);
   if (sumDivisors === i) console.log(`Perfect number ${i}`);
}

console.timeEnd("perfectNumberTiming2");

async function sendNumber (numberToCalculate:number):Promise<void> {
    const host = 'localhost';
    const port = 30000;
    const numberToCalculateJson = JSON.stringify( {numberToCalculate:numberToCalculate } );
    const options = { url: `http://${host}:${port}`,
                      headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                      body: numberToCalculateJson,
                      json: true };
    return new Promise(
        (resolve,reject) => {
                request.post( options,
                    (err) => {
                        if (err) {
                            console.log(`error sendMessage ${err}`);
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    }
                )
        }
    );
}

sendNumber(100000);

console.log(`eind`);
