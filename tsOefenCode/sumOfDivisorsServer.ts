import * as http from 'http';
import * as request from 'request';

const numberArray:number[] = [];
var sumOfDivisorsServerActive:boolean = true;

async function sendSumOfDivisors ( host:string, port:number, calculatedNumber:number, sumOfDivisors:number):Promise<void> {
    const msg = `{ "calculatedNumber":${calculatedNumber}, "sumOfDivisors":${sumOfDivisors}"}`;
    const messageForPerfectNumberServer = JSON.parse( msg );
    const options = { url: `http://${host}:${port}`,
                      headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                      body: messageForPerfectNumberServer,
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

function getSumOfDivisors(numberToCheck:number):number{
    const halfOfNumberToCheck = Math.ceil(numberToCheck/2);
    let   sumDivisors = 0;
    for ( let j=1; j<numberToCheck; j++){
       if (numberToCheck%j===0) sumDivisors += j;
       if (halfOfNumberToCheck<j) break;
    }
    return sumDivisors;
}

function processNumbers(){
   const numberToProcess = numberArray.shift();
   console.log(`processing number ${numberToProcess}      ${new Date()}`);
   if (numberToProcess){
      const sumOfDivisors = getSumOfDivisors(numberToProcess);
      console.log(`of ${numberToProcess}  to summation of divisors is ${sumOfDivisors}`);
      //await sendSumOfDivisors()
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
      req.on('end',  () => { try { console.log(`bericht ontvangen  ${postData}`);
                                   numberArray.push(JSON.parse(postData).numberToCalculate);
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
                   console.log('server is afgebroken, het protocol wordt nu geeindigd');
                 }, 5000 );
}

const sumOfDivisorsServer = {
    start: start
,   terminate:terminate
}

export {sumOfDivisorsServer};
