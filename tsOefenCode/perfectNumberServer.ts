import * as child from 'child_process';
import * as http from 'http';
import {sumOfDivisorsServer} from './sumOfDivisorsServer';
import * as request from 'request';

const sumOfDivisorsServerHost = 'localhost';
const sumOfDivisorsServerPort = 30000;
const perfectNumberHost       = 'localhost';
const perfectNumberPort       = 30001;

type numberToCalculateMessageType = {
   numberToCalculate:number,
   server:string,
   port:number
}

type numberWithSumOfDivisorsType = {
   numberToCalculate:number,
   sumOfDivisors:number
}

export {numberToCalculateMessageType,numberWithSumOfDivisorsType}

const numberAndSumOfDivisorArray:numberWithSumOfDivisorsType[] = [];

var perfectNumberServerActive:boolean = true;

function httpPerfectNumberServerFunction(req:http.IncomingMessage,res:http.ServerResponse):void {
   const httpHeaders = {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'};
   if ( req.method === 'POST' ) {
      let postData:string;
      req.on('data', (data) => { postData = (postData===undefined)?data: postData+data; });
      req.on('end',  () => { try { console.log(`perfectNumberServer, bericht ontvangen  ${postData}`);
                                   const numberWithSumOfDivisors:numberWithSumOfDivisorsType = JSON.parse(postData);
                                   numberAndSumOfDivisorArray.push(numberWithSumOfDivisors);
                                   tryResolver();
                                   //numberArray.push(JSON.parse(postData).numberToCalculate);
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

var httpServerPerfectNumber:http.Server = http.createServer(httpPerfectNumberServerFunction);

function start(port:number){
   httpServerPerfectNumber.listen(port);
}

function terminate(){
        setTimeout(
           () => { perfectNumberServerActive = false;
                   httpServerPerfectNumber.close();
                   console.log('perfectNumberServer, server is afgebroken, het protocol wordt nu geeindigd');
                 }, 5000 );
}

const perfectNumberServer = {
    start: start
,   terminate:terminate
}

async function sendNumberToCalculate ( host:string, port:number, numberToCalculate:number):Promise<void> {
   const msg:numberToCalculateMessageType = { numberToCalculate:numberToCalculate, server:perfectNumberHost, port: perfectNumberPort };
   const options = { url: `http://${host}:${port}`,
                     headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                     body: msg,
                     json: true };
   return new Promise(
       (resolve,reject) => {
               request.post( options,
                   (err) => {
                       if (err) {
                           console.log(`perfectNumberServer, error sendMessage ${err}`);
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

let resolver: ((item: numberWithSumOfDivisorsType) => void) | null = null;

function tryResolver() {
   if ( resolver ) {
      const item = numberAndSumOfDivisorArray.shift();
      if (item) resolver(item);
   }
}

async function getNumberWithDivisor(): Promise<numberWithSumOfDivisorsType> {
   let promise = new Promise<numberWithSumOfDivisorsType>( resolve => resolver = resolve );
   tryResolver();
   return promise;
}

function executeNodeProcess(exeString:string){
   console.log(`start ${fileName}   ${new Date()} `);
   const parameters = [`${__dirname}/${fileName}`];
   child.execFile( 'node'
   , parameters
   , (err,data) => { if (err){
                        console.log(`error bij ${fileName}`);
                        console.log(`${err}`);
                        writeLogFile(fileName,err.message);
                     }
                        else writeLogFile(fileName,data);
                   } );
   console.log(`eind executeNodeProcess ${fileName}`);
};

async function starter(){
   perfectNumberServer.start(perfectNumberPort);

   sumOfDivisorsServer.start(sumOfDivisorsServerPort);
   console.log(`perfectNumberServer, versturen van getallen`);
   for ( let i=0; i<10; i++ ){
      console.log(`perfectNumberServer, sending ${i}`);
      await sendNumberToCalculate(sumOfDivisorsServerHost,sumOfDivisorsServerPort,i);
   }
   console.log(`perfectNumberServer, wachten op getallen`);
   for ( let i=0; i<10; i++ ){
      console.log(`perfectNumberServer, wachten op ${i}`);
      const numberWithDivisor = await getNumberWithDivisor();
      console.log(`perfectNumberServer, getal ${numberWithDivisor.numberToCalculate}  heeft als sommatie van delers ${numberWithDivisor.sumOfDivisors}`);
   }
   sumOfDivisorsServer.terminate();
   perfectNumberServer.terminate();
}

starter();