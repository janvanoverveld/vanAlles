import * as child from 'child_process';
import {getNumberWithDivisor,perfectNumberServer} from './perfectNumberServer';
import {Message,TO_CALC,SUM_OF_DIVISORS} from './Messages';
import {sendMessage} from './sendMessage';

function executeSumOfDivisorServers(host:string, ports:number[]){
    for ( let i=0; i<ports.length; i++ ) {
       //console.log(`start sumOfDivisor ${host} server for port ${ports[i]}   ${new Date()} `);
       child.exec( `node startSumOfDivisorServer.js ${host} ${ports[i]}`
       , {cwd:`./js`}
       , (err,data) => { if (err){
                            console.log(`error with port ${ports}`);
                            console.log(`${err}`);
                         } else {
                            console.log(`${data}`);
                         }
                       } );
       //console.log(`eind sumOfDivisor server for port ${ports[i]}   ${new Date()} `);
    }
 };

async function starter(){
   const perfectNumberHost       = 'localhost';
   const perfectNumberPort       = 30000;
   const sumOfDivisorsServerHost = 'localhost';
   const sumOfDivisorsServerPort1 = 30001;
   const sumOfDivisorsServerPort2 = 30002;
   const sumOfDivisorServers:number[] = [];
   sumOfDivisorServers.push(sumOfDivisorsServerPort1);
   sumOfDivisorServers.push(sumOfDivisorsServerPort2);
   executeSumOfDivisorServers(sumOfDivisorsServerHost,sumOfDivisorServers);
   perfectNumberServer.start(perfectNumberPort);
   console.log(`perfectNumberServer, versturen van getallen`);
   for ( let i=0; i<10; i++ ){
      //console.log(`perfectNumberServer, sending ${i}`);
      const msg = new TO_CALC(perfectNumberHost,perfectNumberPort,i);
      if (i%2===0) await sendMessage(sumOfDivisorsServerHost,sumOfDivisorsServerPort1,msg);
      else await sendMessage(sumOfDivisorsServerHost,sumOfDivisorsServerPort2,msg);
   }
   console.log(`perfectNumberServer, wachten op getallen`);
   for ( let i=0; i<10; i++ ){
      console.log(`perfectNumberServer, wachten op ${i}`);
      const numberWithDivisor = await getNumberWithDivisor();
      console.log(`perfectNumberServer, getal ${numberWithDivisor.valueToCalculate}  heeft als sommatie van delers ${numberWithDivisor.sumOfDivisors}`);
   }
   await sendMessage(sumOfDivisorsServerHost,sumOfDivisorsServerPort1, new TO_CALC(perfectNumberHost, perfectNumberPort,-1) );
   await sendMessage(sumOfDivisorsServerHost,sumOfDivisorsServerPort2, new TO_CALC(perfectNumberHost, perfectNumberPort,-1) );
   perfectNumberServer.terminate();
}

starter();