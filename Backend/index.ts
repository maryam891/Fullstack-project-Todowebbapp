import cors from "cors";
import express from "express";
import { request } from "node:http";
import * as sqlite from "sqlite";
import { Database } from "sqlite";
import sqlite3 from "sqlite3";

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

app.use(cors());
app.use(express.json());

//Compare Users table email and password value with frontends email and password
app.post("/Login", async (request, response) => {
  let logedInUsers = await database.all(
    "SELECT * FROM Users WHERE Email = ? AND Password = ?",
    [request.body.Email, request.body.Password]
  );
  //Check if email and password value is more than 0 to login
  if (logedInUsers.length > 0) {
    response.status(200).send(logedInUsers);
  } else {
    response.status(400).send({ message: "Invalid email or password" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

app.post("/SignUp", async (request, response) => {
  let signedUpUsers = await database.run(
    "INSERT INTO Users(Email, Password, Name) VALUES(?,?, ?)",
    [request.body.Email, request.body.Password, request.body.Name]
  );
  //Check if email, name and password value is more than 0 to sign up
  if (signedUpUsers) {
    response.status(200).json({
      id: signedUpUsers.lastID, // comes from the INSERT metadata
      Email: request.body.Email, // reuse from request
      Password: request.body.Password,
      Name: request.body.Name,
      user_img: request.body.user_img,
    });
  } else {
    response.status(401).send({ message: "Invalid email or password" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Compare id:s to send user_img and Name of user that is logged in and display on profile page
app.post("/Profile", async (request, response) => {
  let userId = await database.get(
    "SELECT Name, user_img FROM Users WHERE id=?",
    [request.body.id]
  );
  if (userId) {
    response.status(200).send(userId);
  } else {
    response.status(400).send({ message: "no such user" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Get all todos of user that is logged in and use inner join to join todoImages table with TODOS table to get images to the TODOS table of the todos that already exists
app.post("/Todos", async (request, response) => {
  let todos = await database.all(
    "SELECT TODOS.id,TODOS.Todos, TODOS.completed_todo, TODOS.todo_description,TODOS.user_id,TODOS.image_id, TODOS.chosen_date, todoImages.image FROM TODOS INNER JOIN todoImages ON TODOS.image_id = todoImages.id WHERE user_id = ?",
    [request.body.id]
  );

  if (todos) {
    console.log(todos);
    response.status(200).send(todos);
  } else {
    response.status(400).send({ message: "No such id" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Update todos that are checked and send id of user that has the checked todo and the todo id
app.post("/updateCompletedTodos", async (request, response) => {
  let completedTodo = await database.run(
    "UPDATE TODOS SET completed_todo = ? WHERE id = ? AND user_id=?",
    [request.body.completed_todo, request.body.id, request.body.user_id]
  );
  if (completedTodo) {
    response.status(200).send();
  } else {
    response.status(400).send({ message: "Failed to check" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Delete one todo when clicking on dustbin
app.post("/DeleteTodo", async (request, response) => {
  let deleteTodo = await database.run("DELETE FROM TODOS WHERE id=?", [
    request.body.id,
  ]);
  if (deleteTodo) {
    response.status(200).send();
  } else {
    response.status(400).send({ message: "Failed to delete" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Get all todos of the user that is logged in on home page

app.post("/Home", async (request, response) => {
  let todos = await database.all(
    "SELECT TODOS.id,TODOS.Todos,TODOS.todo_description,TODOS.user_id, TODOS.image_id,todoImages.image FROM TODOS INNER JOIN todoImages ON TODOS.image_id = todoImages.id WHERE user_id = ?",
    [request.body.id]
  );
  if (todos) {
    response.status(200).send(todos);
  } else {
    response.status(400).send({ message: "Failed to get todos" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Get all images from todoImages table
app.get("/getImages", async (request, response) => {
  let getTodoImages = await database.all("SELECT * FROM todoImages");

  if (getTodoImages) {
    response.status(200).send(getTodoImages);
  } else {
    response.status(400).send({ message: "Failed to get images" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Add new todo to TODOS table for the user that is logged in
app.post("/addNewTodo", async (request, response) => {
  let addTodo = await database.run(
    "INSERT INTO TODOS (Todos, todo_description, image_id, user_id, chosen_date) VALUES(?,?,?,?,?)",
    [
      request.body.Todos,
      request.body.todo_description,
      request.body.image_id,
      request.body.user_id,
      request.body.chosen_date,
    ]
  );

  if (addTodo) {
    response.status(200).send(addTodo);
  } else {
    response.status(400).send({ message: "Failed to add new todo" });
  }
});

app.listen(3000, () => {
  console.log("Webbtjänsten kan nu ta emot anrop.");
});

//Get name of user that is logged in
app.post("/UserName", async (request, response) => {
  let getUserName = await database.get("SELECT Name FROM Users WHERE id=?", [
    request.body.id,
  ]);

  if (getUserName) {
    response.status(200).send(getUserName);
  } else {
    response.status(400).send({ message: "No such user" });
  }
});

//Edit todo that matches id of user that is logged in and id of todo
app.put("/editTodo", async (request, response) => {
  let editTodo = await database.run(
    "UPDATE TODOS SET Todos=?, todo_description=?, image_id=?, chosen_date=? WHERE id=? AND user_id=?",
    [
      request.body.Todos,
      request.body.todo_description,
      request.body.image_id,
      request.body.chosen_date,
      request.body.id,
      request.body.user_id,
    ]
  );

  if (editTodo) {
    console.log(editTodo);
    response.status(200).send(editTodo);
  } else {
    response.status(400).send({ message: "Failed to edit todo" });
  }
});
