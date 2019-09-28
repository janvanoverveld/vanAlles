import * as http from 'http';
import {sumOfDivisorsServer} from './sumOfDivisorsServer';

const numberAndSumOfDivisorArray:Map<number,number> = new Map();

const sumOfDivisorsServerHost = 'localhost';
const sumOfDivisorsServerPort = 30000;
const perfectNumberHost       = 'localhost';
const perfectNumberPort       = 30001;

var perfectNumberServerActive:boolean = true;

function httpPerfectNumberServerFunction(req:http.IncomingMessage,res:http.ServerResponse):void {
   const httpHeaders = {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'};
   if ( req.method === 'POST' ) {
      let postData:string;
      req.on('data', (data) => { postData = (postData===undefined)?data: postData+data; });
      req.on('end',  () => { try { console.log(`bericht ontvangen  ${postData}`);
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
                   console.log('server is afgebroken, het protocol wordt nu geeindigd');
                 }, 5000 );
}

const perfectNumberServer = {
    start: start
,   terminate:terminate
}


perfectNumberServer.start(perfectNumberPort);
sumOfDivisorsServer.start(sumOfDivisorsServerPort);

