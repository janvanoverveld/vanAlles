interface MyObj {
    myString: string;
    myNumber: number;
}

let obj: MyObj = JSON.parse('{ "myString": "string", "myNumber": 4 }');
console.log(obj.myString);
console.log(obj.myNumber);

interface MyObj2 {
    name: string;
    value1: number;
    value2: number;    
}

let obj2: MyObj2 = JSON.parse("{\"name\":\"ADD\",\"value1\":4,\"value2\":0}");
console.log(obj2.name);
console.log(obj2.value1);
