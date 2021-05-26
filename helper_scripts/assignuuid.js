const short = require("short-uuid");
const dataFile = require("../data.json");
const fs = require("fs");

console.log(dataFile);
dataFile.forEach((element, index) => {
  element["taskID"] = short.generate();
});
console.log("NEW DATA");
console.log(dataFile);
fs.writeFileSync('./data.json', JSON.stringify(dataFile,null,2));