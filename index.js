require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Todo = require('./models/todo');
const ejsMate =require('ejs-mate');
const methodOverride = require('method-override');
// const { resourceLimits } = require('worker_threads');


mongoose.connect(process.env.MONGO_ATLAS);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//middleware 
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))



//view engines
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs' );

//homepage 
app.get('/todos',async(req, res) => {
    const todos = await Todo.find({});
    res.render('home', {todos})
})

//create a new todo
app.post('/todos', async(req, res) => {
    const todo = new Todo(req.body)
    await todo.save();
  res.redirect('/todos')
})

//edit todo page 
app.get('/todos/:id/edit', async(req, res) => {
   const id = req.params.id
     const todo = await Todo.findById(id)
    //  console.log(todo)
    res.render('test', {todo})
})

//update todo
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
   await Todo.findByIdAndUpdate(id, {...req.body})
  res.redirect('/todos')
})

//delete todo
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id) 
    res.redirect('/todos');

})


const port = process.env.PORT || 3000;

app.listen(3000, () => {
    console.log(`app is listening on port: ${port}`)
})