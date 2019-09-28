
console.log(`start`);

const totalNumbers = 50000;

console.time("perfectNumberTiming");

for ( let i=1; i<totalNumbers; i++){
   const halfOfI = Math.ceil(i/2);
   let sumDivisors = 0;
   for ( let j=1; j<i; j++){
       if (i%j===0) sumDivisors += j;
       if (halfOfI<j) break;
   }
   if (sumDivisors === i){
       console.log(`Perfect number ${i}`);
   }
}

console.timeEnd("perfectNumberTiming");

console.log(`eind`);