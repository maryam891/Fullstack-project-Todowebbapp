import cors from "cors";
import express from "express";
import * as sqlite from "sqlite";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";
const bcrypt = require("bcrypt");
let database: Database;
(async () => {
  database = await sqlite.open({
    driver: sqlite3.Database,
    filename: "mytodo.sqlite",
  });

  await database.run("PRAGMA foreign_keys = ON");

  console.log("Redo att göra databasanrop");
})();

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webbtjänsten kan nu ta emot anrop på port ${PORT}`);
});
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
    let user = await database.get("SELECT * FROM Users WHERE Email=?", [
      request.body.Email,
    ]);

    if (!user) {
      response.status(400).send({ message: "User does not exist" });
      return;
    }
    //Check if password that is hashed starts with $2 and compare passwords with bcrypt compare else compare with ===

    const passwordMatch = user.Password.startsWith("$2")
      ? await bcrypt.compare(request.body.Password, user.Password)
      : request.body.Password === user.Password;
    console.log("PASSWORD MATCH:", passwordMatch);

    if (!passwordMatch) {
      response.status(400).send({ message: "passwords does not match" });
      return;
    }

    response.status(200).send({
      id: user.id,
      Email: user.Email,
      Name: user.Name,
    });
  } catch {
    response.status(500).send({ message: "Server error" });
  }
});

//Signup
app.post("/SignUp", async (request, response) => {
  try {
    let hashPassword = await bcrypt.hash(request.body.Password, 10);
    let alreadyExist = await database.get("SELECT * FROM Users WHERE Email=?", [
      request.body.Email,
    ]);
    if (alreadyExist) {
      response.status(409).send({ message: "Email already exists" });
      return;
    }
    let signedUpUsers = await database.run(
      "INSERT INTO Users(Email, Password, Name) VALUES(?,?, ?)",
      [request.body.Email, hashPassword, request.body.Name],
    );
    response.status(200).json({
      id: signedUpUsers.lastID, // comes from the INSERT metadata
      Email: request.body.Email,
      Name: request.body.Name,
      user_img: request.body.user_img,
    });
  } catch {
    response.status(401).send({ message: "Failed to create account" });
  }
});

//Compare id:s to send user_img and Name of user that is logged in and display on profile page
app.post("/Profile", async (request, response) => {
  try {
    let userId = await database.get(
      "SELECT Name, user_img, Email FROM Users WHERE id=?",
      [request.body.id],
    );
    response.status(200).send(userId);
  } catch {
    response.status(400).send({ message: "no such user" });
  }
});

//Remove user account
app.delete("/removeAccount", async (request, response) => {
  try {
    let removeAcc = await database.run("DELETE FROM Users WHERE id=?", [
      request.body.id,
    ]);

    response.status(200).send(removeAcc);
  } catch {
    response.status(400).send({ message: "Failed to remove account" });
  }
});

//Get all todos of user that is logged in and use inner join to join todoImages table with TODOS table to get images to the TODOS table of the todos that already exists
app.get("/todos/:userId", async (request, response) => {
  try {
    let todos = await database.all(
      "SELECT TODOS.id,TODOS.Todos, TODOS.completed_todo, TODOS.todo_description,TODOS.user_id,TODOS.image_id, TODOS.chosen_date, todoImages.image FROM TODOS INNER JOIN todoImages ON TODOS.image_id = todoImages.id WHERE user_id = ?",
      [request.params.userId],
    );
    response.status(200).send(todos);
  } catch {
    response.status(400).send({ message: "Could not get todos" });
  }
});

//Update todos that are checked and send id of user that has the checked todo and the todo id
app.post("/todo/:id", async (request, response) => {
  try {
    let completedTodo = await database.run(
      "UPDATE TODOS SET completed_todo = ? WHERE id = ? AND user_id=?",
      [request.body.completed_todo, request.params.id, request.body.user_id],
    );
    response.status(200).send(completedTodo);
  } catch {
    response.status(400).send({ message: "Failed to check" });
  }
});

//Delete a todo
app.delete("/todo/:id", async (request, response) => {
  try {
    let deleteTodo = await database.run(
      "DELETE FROM TODOS WHERE id= ? AND user_id= ?",
      [request.params.id, request.body.user_id],
    );
    response.status(200).send(deleteTodo);
  } catch {
    response.status(500).send({ message: "Failed to delete todo" });
  }
});

//Get all images from todoImages table
app.get("/get-images", async (request, response) => {
  try {
    let getTodoImages = await database.all("SELECT * FROM todoImages");
    response.status(200).send(getTodoImages);
  } catch {
    response.status(400).send({ message: "Failed to get images" });
  }
});

//Add new todo to TODOS table for the user that is logged in
app.post("/add-new-todo", async (request, response) => {
  try {
    let addTodo = await database.run(
      "INSERT INTO TODOS (Todos, todo_description, image_id, user_id, chosen_date) VALUES(?,?,?,?,?)",
      [
        request.body.Todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.user_id,
        request.body.chosen_date,
      ],
    );
    response.status(200).send(addTodo);
  } catch {
    response.status(400).send({ message: "Failed to add new todo" });
  }
});

//Edit todo that matches id of user that is logged in and id of todo
app.put("/todo/:id", async (request, response) => {
  try {
    let editTodo = await database.run(
      "UPDATE TODOS SET Todos=?, todo_description=?, image_id=?, chosen_date=? WHERE id=? AND user_id=?",
      [
        request.body.Todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.chosen_date,
        request.params.id,
        request.body.user_id,
      ],
    );

    response.status(200).send(editTodo);
  } catch {
    response.status(400).send({ message: "Failed to edit todo" });
  }
});
