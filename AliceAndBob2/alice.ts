import {ADD,RES,BYE} from './Message';
import {receiveMessageServer,sendMessage} from './httpCommunication';

const hostBob='localhost';
const portBob=30002;
const value: ()=>number = ()=>Math.floor(Math.random() * 5);

async function startProtocol() {
   for(let i=0;i<5;i++) {
      const add:ADD = new ADD(value(),value());
      sendMessage(hostBob, portBob, add );
      const res = <RES> await receiveMessageServer.waitForMessage();
      console.log(`send an ADD to Bob with values ${add.value1} and ${add.value2}, received ${res.sum}`);
   }
   await sendMessage( hostBob, portBob, new BYE() );
   console.log('the protocol stops for Alice');
   receiveMessageServer.terminate();
}

receiveMessageServer.start(30001);

startProtocol();