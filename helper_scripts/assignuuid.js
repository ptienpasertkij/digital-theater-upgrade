const short = require("short-uuid");
const local_data_file = require("../data.json");
const fs = require("fs");

console.log(local_data_file);
local_data_file.forEach((element, index) => {
  element["taskID"] = short.generate();
});
console.log("NEW DATA");
console.log(local_data_file);
fs.writeFileSync('./data.json', JSON.stringify(local_data_file,null,2));