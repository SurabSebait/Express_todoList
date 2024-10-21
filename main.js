import mongoose from "mongoose";
import express from "express";
import { Todo } from "./models/Todo.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));


// Connect to MongoDB
await mongoose.connect("mongodb://localhost:27017/Todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create
app.post('/todo', async (req, res) => {
  const { name, desc, isDone, days } = req.body;
  const todo = new Todo({ name, desc, isDone, days });
  await todo.save();
  res.status(201).json(todo);
});

// Get all todos
app.get('/todos', async (req, res) => {
  const todos = await Todo.find({});
  res.json(todos);
});

// Update
app.put('/todo/:id', async (req, res) => {
  const { name, desc, isDone, days } = req.body;
  const todo = await Todo.findByIdAndUpdate(
    req.params.id,
    { name, desc, isDone, days },
    { new: true }
  );
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json(todo);
});

// Delete
app.delete('/todo/:id', async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ message: "Todo deleted" });
});


app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
