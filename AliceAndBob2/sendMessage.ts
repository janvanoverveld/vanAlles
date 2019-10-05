import * as request from 'request';
//import {Message} from './Message';

export async function sendMessage (host:string, port:number,msg:string):Promise<void> {
    //console.log(`send ${msg.name} Message to ${host}:${port}`);
    const options = { url: `http://${host}:${port}`,
                      headers: {'cache-control':'no-cache','Content-Type':'application/json','charset':'utf-8'},
                      body: msg,
                      json: true };
    return new Promise(
        (resolve,reject) => {
                request.post( options,
                    (err:any) => {
                        if (err) {
                            console.log(`error sendMessage ${host}:${port} : ${err}`);
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
