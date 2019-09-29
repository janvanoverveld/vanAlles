
import * as http from 'http';
import * as request from 'request';
import {numberWithSumOfDivisorsType,numberToCalculateMessageType} from './perfectNumberServer';

function getSumOfDivisors(numberToCheck:number):number{
    const halfOfNumberToCheck = Math.ceil(numberToCheck/2);
    let   sumDivisors = 0;
    for ( let j=1; j<numberToCheck; j++){
       if (numberToCheck%j===0) sumDivisors += j;
       if (halfOfNumberToCheck<j) break;
    }
    return sumDivisors;
}

var sumOfDivisorsServerActive:boolean = true;

const numberArray:numberToCalculateMessageType[] = [];

async function sendSumOfDivisors ( host:string, port:number, calculatedNumber:number, sumOfDivisors:number):Promise<void> {
    const msg:numberWithSumOfDivisorsType = { numberToCalculate:calculatedNumber, sumOfDivisors:sumOfDivisors};
    const options = { url: `http://${host}:${port}`,
                      headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                      body: msg,
                      json: true };
    return new Promise(
        (resolve,reject) => {
                request.post( options,
                    (err) => {
                        if (err) {
                            console.log(`sumOfDivisorServer, error sendMessage ${err}`);
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

function processNumbers(){
   const numberToProcess = numberArray.shift();
   if (numberToProcess){
      const sumOfDivisors = getSumOfDivisors(numberToProcess.numberToCalculate);
      console.log(`sumOfDivisorServer, sending calculated number ${numberToProcess.numberToCalculate}  and the summation of divisors is ${sumOfDivisors}`);
      sendSumOfDivisors(numberToProcess.server,numberToProcess.port,numberToProcess.numberToCalculate,sumOfDivisors);
      setImmediate( () => processNumbers() );
   } else {
      if (!sumOfDivisorsServerActive) return;
      setTimeout( () => processNumbers(), 2000 );
   }
}

function httpSumOfDivisorServerFunction(req:http.IncomingMessage,res:http.ServerResponse):void {
   const httpHeaders = {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'};
   if ( req.method === 'POST' ) {
      let postData:string;
      req.on('data', (data) => { postData = (postData===undefined)?data: postData+data; });
      req.on('end',  () => { try { console.log(`sumOfDivisorServer, bericht ontvangen  ${postData}`);
                                   numberArray.push(JSON.parse(postData));
                                   res.writeHead(200, "OK", httpHeaders);
                                   res.end();
                             }
                             catch (err) {
                                   res.writeHead(400, "wrong message", httpHeaders);
                             } } );
      return;
   }
   res.writeHead(404, "page not found", httpHeaders);
}

const httpSumOfDivisorServer:http.Server = http.createServer(httpSumOfDivisorServerFunction);

function start(port:number){
    httpSumOfDivisorServer.listen(port);
    processNumbers();
}

function terminate(){
        setTimeout(
           () => { sumOfDivisorsServerActive = false;
            httpSumOfDivisorServer.close();
                   console.log('sumOfDivisorServer, server is afgebroken, het protocol wordt nu geeindigd');
                 }, 5000 );
}

const sumOfDivisorsServer = {
    start: start
,   terminate:terminate
}

export {sumOfDivisorsServer};
