const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const dataFile = require("./data.json")
const projectCategories = require("./categories.json");
const shortuuid = require("short-uuid")
const methodOverride = require('method-override')
const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// To 'fake' put/patch/delete requests:
app.use(methodOverride('_method'))

app.get("/", (req, res) => {
  console.log("Request made to home!")
  res.render("home", {dataFile});
});


// Test page GET
app.get("/test", (req, res) => {
  res.render("todo.ejs");
})

// Test page POST
app.post("/test", (req, res) => {
  console.log(req.body);
  res.redirect("/test");
})

app.get("/tasks", (req, res) => {
  res.render("tasks/tasks-index", {dataFile, projectCategories})
})

app.post("/tasks", (req, res) => {
  const { task, category, date } = req.body;
  // console.log({"taskID": shortuuid.generate(), task, category, date});
  dataFile.push({"taskID": shortuuid.generate(), task, category, date});
  fs.writeFileSync('data.json', JSON.stringify(dataFile,null,2));
  res.redirect("/tasks");
})

app.get("/tasks/:id/edit", (req, res) => {
  const {id} = req.params;
  const task = dataFile.find(task => task.taskID === id);
  res.render("tasks/tasks-edit", {task});
})

app.patch("/tasks/:id", (req, res) => {
  const {id} = req.params;
  const foundTask = dataFile.find(task => task.taskID === id);

  const { taskID, task, category , date} = req.body
  foundTask = {taskID, task, category , date};

  console.log("You are updating a task");
})

app.get("/data", (req, res) => {
  res.render("data-entry.ejs")
})

app.post("/data", (req, res) => {
  console.log("Someone just tried to post something bro.");
  console.log(req.body)
  const { task, category , date} = req.body
  let write_data = {"task":task, "category":category, "date":date}
  console.log(write_data)
  dataFile.push(write_data)
  // console.log(dataFile)
  meow = JSON.stringify(dataFile, null, 2);
  console.log(meow)
  fs.writeFileSync('data.json', meow)
  res.redirect("/")
  // res.render("data-entry.ejs")
})

app.get("*", (req, res) => {
  res.render("page-not-found");
})

app.listen(PORT, () => console.log(`LISTENING ON PORT ${ PORT }`));
