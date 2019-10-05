import {ADD,RES,BYE} from './Message';
import {receiveMessageServer} from './receiveMessageServer';
import {sendMessage} from './sendMessage';

const hostBob='localhost';
const portBob=30002;

async function startProtocol() {
   for(let i=0;i<5;i++) {
      const val1 = Math.floor(Math.random() * 5);
      const val2 = Math.floor(Math.random() * 5);
      const addMessage = `{"name":"ADD","value1":${val1},"value2":${val2}}`;//new ADD(val1,val2);
      console.log(`${i} stuur een add naar Bob met waarden ${val1}  ${val2}`);
      sendMessage(hostBob, portBob, addMessage );
      const msgTxt = await receiveMessageServer.waitForMessage();
      const msg = <RES>(JSON.parse(msgTxt));
      if ( msg && msg.name === RES.name) {
         const res = <RES> msg;
         console.log(`RES heeft waarde van ${res.sum}`);
      }
   }
   await sendMessage( hostBob, portBob, JSON.stringify(new BYE()) );
   receiveMessageServer.terminate();
}

receiveMessageServer.start(30001);

startProtocol();

console.log(`alice is gestart  ${new Date()}`);