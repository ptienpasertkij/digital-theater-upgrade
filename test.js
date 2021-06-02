const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/dogs', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("We're connected!");
    })
    .catch(err => {
        console.log("Houston we have a problem!");
        console.log(err)
    })

const task_Schema = new mongoose.Schema({
    task: String,
    project: String, 
    category: String,
    due_date: Date
});

const Task = mongoose.model('Task', task_Schema);
const finishtask = new Task({task: "Finish integrating this database.", category: "Others", date: '2021-06-02'})