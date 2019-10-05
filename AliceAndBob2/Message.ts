export abstract class Message {
    constructor(public name:string){};
}

export class ADD extends Message{
    constructor(public value1:number, public value2:number){
        super(ADD.name);
    }
}

export class RES extends Message {
    constructor(public sum:number){
        super(RES.name);
    }
}

export class BYE extends Message {
    constructor(){
        super(BYE.name);
    }
}