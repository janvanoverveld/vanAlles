import * as http from 'http';

function getSumOfDivisors(numberToCheck:number):number{
    let sumDivisors = 0;
    for ( let j=1; j<numberToCheck; j++){
       if (numberToCheck%j===0) sumDivisors += j;
       if (Math.ceil(numberToCheck/2)<j) break;
    }
    return sumDivisors; 
} 

function httpRestServer(req:http.IncomingMessage,res:http.ServerResponse):void {
   const httpHeaders = {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'};
   if ( req.method === 'POST' ) {
      let postData:string;
      req.on('data', (data) => { postData = (postData===undefined)?data: postData+data; });
      req.on('end',  () => { try { console.log(`bericht ontvangen  ${postData}`);
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

var httpServer:http.Server = http.createServer(httpRestServer);

function start(port:number){
    httpServer.listen(port);
}

function terminate(){
        setTimeout(
           () => { httpServer.close();
                   console.log('server is afgebroken, het protocol wordt nu geeindigd');
                 }, 5000 );
}

const receiveMessageServer = {
    start: start
,   terminate:terminate
}

export {receiveMessageServer};
