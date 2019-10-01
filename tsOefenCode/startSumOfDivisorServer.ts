import {sumOfDivisorsServer} from './sumOfDivisorsServer';

function starter(pars:string[]){
  console.log(`start sumOfDivisor ${pars[2]} server for port ${pars[3]}`);
  if (pars[2] && pars[3]) {
    const host:string = pars[2];
    const port:number = Number(pars[3]);
    sumOfDivisorsServer.start(host,port);
  }
}

starter(process.argv);