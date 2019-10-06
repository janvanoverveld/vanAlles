import {Message,ADD,RES,BYE} from './Message';
import {receiveMessageServer,sendMessage} from './httpCommunication';

const hostAlice='localhost';
const portAlice=30001;

async function startProtocol() {
   let msg = <Message> await receiveMessageServer.waitForMessage();
   while ( msg && msg.name === ADD.name ) {
      const add:ADD = <ADD>msg;
      const res = new RES(add.value1+add.value2);
      sendMessage(hostAlice, portAlice, res );
      console.log(`an ADD received with ${add.value1} and ${add.value2}, send a RES with ${res.sum} back`);
      msg = <Message> await receiveMessageServer.waitForMessage();
   }
   console.log('the protocol stops for Bob');
   receiveMessageServer.terminate();
}

receiveMessageServer.start(30002);

startProtocol();

console.log(`bob is gestart  ${new Date()}`);