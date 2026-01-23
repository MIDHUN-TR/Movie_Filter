// function formatWithPronunciation(n) {

//   // 1) Produce abbreviated form
//   let short;
//   if (n < 1000) {
//     short = String(n);
//   } else if (n < 1_000_000) {
//     const v = n / 1_000;
//     short = (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "k";
//   } else if (n < 1_000_000_000) {
//     const v = n / 1_000_000;
//     short = (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "M";
//   } else {
//     const v = n / 1_000_000_000;
//     short = (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "B";
//   }

//   // 2) Create English pronunciation
//   function numberToWords(num) {
//     const units = ["zero","one","two","three","four","five","six","seven","eight","nine"];
//     const tens = ["", "", "twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
//     const teens = ["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];

//     if (num < 10) return units[num];
//     if (num < 20) return teens[num - 10];
//     if (num < 100) {
//       const t = Math.floor(num / 10);
//       const u = num % 10;
//       return tens[t] + (u ? " " + units[u] : "");
//     }
//     if (num < 1000) {
//       const h = Math.floor(num / 100);
//       const r = num % 100;
//       return units[h] + " hundred" + (r ? " " + numberToWords(r) : "");
//     }
//     if (num < 1_000_000) {
//       const k = Math.floor(num / 1000);
//       const r = num % 1000;
//       return numberToWords(k) + " thousand" + (r ? " " + numberToWords(r) : "");
//     }
//     if (num < 1_000_000_000) {
//       const m = Math.floor(num / 1_000_000);
//       const r = num % 1_000_000;
//       return numberToWords(m) + " million" + (r ? " " + numberToWords(r) : "");
//     }
//     const b = Math.floor(num / 1_000_000_000);
//     const r = num % 1_000_000_000;
//     return numberToWords(b) + " billion" + (r ? " " + numberToWords(r) : "");
//   }

//   const pronunciation = numberToWords(n);

//   return { short, pronunciation };
// }
// console.log(formatWithPronunciation(179952900));


// console.log(typeof x)
// var x=100

// {
//   console.log(b);
//   let b = 5;
// }

for (var i = 0; i < 3; i++) {}
console.log("i",i)

for (let j = 0; j < 3; j++) {console.log("j",j);}







