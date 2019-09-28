import * as request from 'request';
import {sumOfDivisorsServer} from './sumOfDivisorsServer';

const sleep:(ms:number)=>Promise<void> = (m) => new Promise(resolve => setTimeout(resolve, m));

console.log(`start`);

const sumOfDivisorsServerHost = 'localhost';
const sumOfDivisorsServerPort = 30000;

const perfectNumberHost = 'localhost';
const perfectNumberPort = 30001;

sumOfDivisorsServer.start(sumOfDivisorsServerPort);

async function sendNumber (numberToCalculate:number):Promise<void> {
    const msg = `{ "numberToCalculate":${numberToCalculate}, "server":"${perfectNumberHost}", "port": ${perfectNumberPort} }`;
    const messageForSumOfDivisorHost = JSON.parse( msg );
    const options = { url: `http://${sumOfDivisorsServerHost}:${sumOfDivisorsServerPort}`,
                      headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                      body: messageForSumOfDivisorHost,
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

async function starter(){
    await sendNumber(100000);
    console.log(`ff wachten ${new Date()}`);
    await sleep(500);
    sumOfDivisorsServer.terminate();
    console.log(`msg server terminated ${new Date()}`);
}

starter();

console.log(`eind`);