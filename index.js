const express = require("express");
const fs = require("fs");
const app = express();
const path = require("path");
const dataFile = require("./data.json");
const projectCategories = require("./categories.json");
const shortuuid = require("short-uuid");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// To 'fake' put/patch/delete requests:
app.use(methodOverride("_method"));

// Make local copy of dataFile to prevent overwriting of real database
local_data_file = dataFile;

// HELPER FUNCTIONS
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];
function formatDate() {
  var d = new Date();
  month = "0" + (d.getMonth() + 1);
  day = "0" + d.getDate();
  year = d.getFullYear();
  return [year, month.slice(-2), day.slice(-2)].join("-");
}

function getMinDate(tasks_array) {
  let min_date = tasks_array.reduce(
    (current_min_date, i_task) =>
      i_task.date < current_min_date ? i_task.date : current_min_date,
    tasks_array[0].date
  );
  min_date = {
    year: parseInt(min_date.slice(0, 4)),
    month: parseInt(min_date.slice(5, 7)),
  };
  return min_date;
}

function getMaxDate(tasks_array) {
  max_date = tasks_array.reduce(
    (current_max_date, i_task) =>
      i_task.date > current_max_date ? i_task.date : current_max_date,
    tasks_array[0].date
  );
  max_date = {
    year: parseInt(max_date.slice(0, 4)),
    month: parseInt(max_date.slice(5, 7)),
  };
  return max_date;
}
//////////

// HOME PAGE
app.get("/", (req, res) => {
  if (local_data_file != []) {
    local_data_file.sort((a, b) => (a.date > b.date ? 1 : -1));
    let min_date = getMinDate(local_data_file);
    console.log("Request made to home!");
    // res.send("1")
    let max_date = getMaxDate(local_data_file);
    res.render("home", {local_data_file, projectCategories, min_date, max_date, months});

  }
  // if(local_data_file != []) {
  // local_data_file.sort((a, b) => (a.date > b.date) ? 1:-1);
  // console.log("Request made to home!")
  // let min_date = getMinDate(local_data_file);
  // let max_date = getMaxDate(local_data_file);
  // }
  // else {
  //   res.render("home", {local_data_file, projectCategories, min_date, max_date, months});
  // }
});

app.get("/tasks", (req, res) => {
  local_data_file.sort((a, b) => (a.date > b.date ? 1 : -1));
  today = formatDate();
  fs.writeFileSync("data.json", JSON.stringify(local_data_file, null, 2));
  res.render("tasks/tasks-index", {
    local_data_file,
    projectCategories,
    today,
  });
});

app.post("/tasks", (req, res) => {
  const { task, category, date } = req.body;
  local_data_file.push({ taskID: shortuuid.generate(), task, category, date });
  res.redirect("/tasks");
});

app.get("/tasks/:id/edit", (req, res) => {
  const { id } = req.params;
  const task = local_data_file.find((task) => task.taskID === id);
  console.log(task.date);
  res.render("tasks/tasks-edit", { task, projectCategories });
});

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index_found_task = local_data_file.findIndex(
    (task) => task.taskID === id
  );
  const { task, category, date } = req.body;
  console.log(date);
  local_data_file[index_found_task] = { taskID: id, task, category, date };
  console.log("You are updating a task");
  res.redirect("/tasks");
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  local_data_file = local_data_file.filter((task) => task.taskID !== id);
  res.redirect("/tasks");
});

// TEST PAGE SECTION
// Test page GET
app.get("/test", (req, res) => {
  res.render("todo.ejs");
});

// Test page POST
app.post("/test", (req, res) => {
  console.log(req.body);
  res.redirect("/test");
});

app.get("/download", (req, res) => {
  res.download("./data.json");
});

app.get("*", (req, res) => {
  res.render("page-not-found");
});

app.listen(PORT, () => console.log(`LISTENING ON PORT ${PORT}`));
