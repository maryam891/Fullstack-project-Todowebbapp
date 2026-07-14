import cors from "cors";
import express from "express";
import { Pool } from "pg";
const bcrypt = require("bcrypt");
import "dotenv/config";
const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "https://fullstack-project-todowebbapp.vercel.app",
      /https:\/\/fullstack-project-todowebbapp.*\.vercel\.app/,
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);

app.use(express.json());

//Login
app.post("/Login", async (request, response) => {
  try {
    const result = await database.query("SELECT * FROM users WHERE email=$1", [
      request.body.email,
    ]);

    const user = result.rows[0];
    if (!user) {
      response.status(400).send({ message: "User does not exist" });
      return;
    }

    const passwordMatch = await bcrypt.compare(
      request.body.password,
      user.password,
    );
    if (!passwordMatch) {
      response.status(401).send({ message: "passwords does not match" });
      return;
    }

    response.status(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Server error" });
  }
});

//Signup
app.post("/SignUp", async (request, response) => {
  try {
    let hashPassword = await bcrypt.hash(request.body.password, 10);
    let alreadyExist = await database.query(
      "SELECT * FROM users WHERE email=$1",
      [request.body.email],
    );
    if (alreadyExist.rows.length > 0) {
      response.status(409).send({ message: "Email already exists" });
      return;
    }
    const newUser = await database.query(
      `INSERT INTO users(email, password, name) VALUES($1,$2, $3) RETURNING id, email, name`,
      [request.body.email, hashPassword, request.body.name],
    );
    response.status(201).json({
      id: newUser.rows[0].id,
      email: newUser.rows[0].email,
      name: newUser.rows[0].name,
    });
  } catch (error) {
    console.log(error);
    response.status(401).send({ message: "Failed to create account" });
  }
});

//Compare id:s to send user_img and Name of user that is logged in and display on profile page
app.post("/Profile", async (request, response) => {
  try {
    let userId = await database.query(
      "SELECT name, user_img, email FROM users WHERE id=$1",
      [request.body.id],
    );
    if (!userId.rows[0]) {
      response.status(400).send({ message: "no such user" });
      return;
    }
    response.status(200).send(userId.rows[0]);
  } catch {
    response.status(500).send({ message: "Server error" });
  }
});

//Remove user account
app.delete("/removeAccount", async (request, response) => {
  try {
    await database.query("DELETE FROM users WHERE id=$1", [request.body.id]);

    response.status(200).send({ message: "Account removed!" });
  } catch {
    response.status(400).send({ message: "Failed to remove account" });
  }
});

//Get all todos of user that is logged in and use left join todoImages table with TODOS table to get images to the TODOS table of the todos that already exists
app.get("/todos/:userId", async (request, response) => {
  try {
    let todos = await database.query(
      `SELECT todos.id,todos.todos, todos.completed_todo, todos.todo_description,todos.user_id, todos.image_id, todos.chosen_date, todo_images.image FROM todos LEFT JOIN todo_images ON todos.image_id = todo_images.id WHERE todos.user_id= $1`,
      [request.params.userId],
    );
    response.status(200).send(todos.rows);
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Could not get todos" });
  }
});

//Update todos that are checked and send id of user that has the checked todo and the todo id
app.post("/todo/:id", async (request, response) => {
  try {
    let completedTodo = await database.query(
      "UPDATE todos SET completed_todo = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [request.body.completed_todo, request.params.id, request.body.user_id],
    );
    response.status(200).send(completedTodo.rows[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Failed to check" });
  }
});

//Delete a todo
app.delete("/todo/:id", async (request, response) => {
  try {
    let deleteTodo = await database.query(
      "DELETE FROM todos WHERE id= $1 AND user_id= $2",
      [request.params.id, request.body.user_id],
    );
    if (deleteTodo.rowCount === 0) {
      response.status(404).send({ message: "Todo not found" });
    }
    response.status(200).send({ message: "Todo successfully deleted!" });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Failed to delete todo" });
  }
});

//Get all images from todoImages table
app.get("/get-images", async (request, response) => {
  try {
    let getTodoImages = await database.query("SELECT * FROM todo_images");
    response.status(200).send(getTodoImages.rows);
  } catch {
    response.status(500).send({ message: "Failed to get images" });
  }
});

//Add new todo to TODOS table for the user that is logged in
app.post("/add-new-todo", async (request, response) => {
  try {
    let addTodo = await database.query(
      "INSERT INTO todos (todos, todo_description, image_id, user_id, chosen_date) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [
        request.body.todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.user_id,
        request.body.chosen_date,
      ],
    );
    response.status(201).send(addTodo.rows[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Failed to add new todo" });
  }
});

//Edit todo that matches id of user that is logged in and id of todo
app.put("/todo/:id", async (request, response) => {
  try {
    let editTodo = await database.query(
      "UPDATE todos SET todos=$1, todo_description=$2, image_id=$3, chosen_date=$4 WHERE id=$5 AND user_id=$6 RETURNING *",
      [
        request.body.todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.chosen_date,
        request.params.id,
        request.body.user_id,
      ],
    );
    if (editTodo.rows.length === 0) {
      response.status(404).send({ message: "Todo not found" });
      return;
    }
    response.status(200).send(editTodo.rows[0]);
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Failed to edit todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Webbtjänsten kan nu ta emot anrop på port ${PORT}`);
});
