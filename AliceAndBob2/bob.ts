import {Message,ADD,RES,BYE} from './Message';
import {receiveMessageServer} from './receiveMessageServer';
import {sendMessage} from './sendMessage';

const hostAlice='localhost';
const portAlice=30001;

interface badd{
   name:string;
   value1: number;
   value2: number;
}

async function startProtocol() {
   let msgTxt = await receiveMessageServer.waitForMessage();
   console.log(`bla1 ${msgTxt}`);
   let msg:badd = JSON.parse(msgTxt);
   console.log(`bla2 ${msg}   ${msg.name}   ${msg.value1}   ${msg.value2}`);
   while ( msg && msg.name === ADD.name ) {
      const add:{name:string,value1:number,value2:number} = JSON.parse(msgTxt);
      const resValue = add.value1+add.value2;
      console.log(`stuur ${RES.name} ${resValue} naar Alice`);
      sendMessage(hostAlice, portAlice, JSON.stringify(new RES(resValue)) );
      msgTxt = await receiveMessageServer.waitForMessage();
      msg = JSON.parse(msgTxt);
   }
   receiveMessageServer.terminate();
}

receiveMessageServer.start(30002);

startProtocol();

console.log(`bob is gestart  ${new Date()}`);