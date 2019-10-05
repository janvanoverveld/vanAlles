import * as child from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

//const sleep: (ms:number)=>Promise<void> = (m) => new Promise(resolve => setTimeout(resolve, m ));

function executeNodeProcess(fileName:string){
    console.log(`start executeNodeProcess ${fileName}`);
    const nodeExecutable = `node`;
    const exeFileName = `${__dirname}\\${fileName}`;
    const parameters = [exeFileName];
    const exeFileDir = path.dirname(exeFileName);
    const logFileName=`${exeFileDir}\\..\\log\\${fileName.substr(0,fileName.indexOf('.'))}.log`;
    child.execFile(nodeExecutable
        , parameters
        , (err,data) => {
            if (err){
                console.log(`error bij ${fileName}`);
                console.log(`${err}`);
            }
            fs.writeFile( logFileName
            ,             data
            ,             (err) => { if(err) { console.log(`fs error bij ${fileName}`);
                                               console.log(`${err}`); }
                                    else {
                                        console.log(`The file ${logFileName} was saved!`);
                                    }
                                }
            );
        }
    );
    console.log(`eind executeNodeProcess ${fileName}`);
};

console.log(`start  ${new Date()} `);

const logDir = './log';
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

global.setTimeout( () => { executeNodeProcess('bob.js'); }, 100 );
global.setTimeout( () => { executeNodeProcess('alice.js'); }, 500 );

console.log('eind');
