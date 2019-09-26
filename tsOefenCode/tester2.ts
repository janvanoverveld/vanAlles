import * as fs from 'fs';
import * as ts from "typescript";
import creator, { transformSourceFile } from 'ts-creator';

const generatedFactoryCode = creator(`export class ADD extends Message{
    constructor(public value1:number,public value2:number){
       super(ADD.name);
    }
}`);

console.log('hier de code');
console.log(generatedFactoryCode);

