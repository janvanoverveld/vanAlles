
console.log(`start`);

const totalNumbers = 10000;

console.time("perfectNumberTiming");

for ( let i=1; i<totalNumbers; i++){
   let sumDivisors = 0;
   for ( let j=1; j<i; j++){
       if (i%j===0) sumDivisors += j;
       if (Math.ceil(i/2)<j) break;
   }
   if (sumDivisors === i){
       console.log(`Perfect number ${i}`);
   }
}

console.timeEnd("perfectNumberTiming");

console.log(`eind`);