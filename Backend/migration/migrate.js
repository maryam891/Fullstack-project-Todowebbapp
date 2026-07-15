const sqlite3 = require("sqlite3");
const { Pool } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");

const sqlite = new sqlite3.Database("./mytodo.sqlite");
//One time migration script used to transfer data
//from the previous SQLite database to PostgreSQL.
//Kept for documentation purposes after migration.
const postgres = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function migrateUsers() {
  return new Promise((resolve, reject) => {
    sqlite.all("Select * FROM Users", async (error, users) => {
      if (error) {
        console.log(error, "could not get data from Users");
        reject(error);
        return;
      }
      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.Password, 10);
        await postgres.query(
          "INSERT INTO users (id,name, email, password) VALUES($1, $2, $3, $4) ",
          [user.id, user.Name, user.Email, hashedPassword],
        );
      }
      console.log("Users migrated!");
      resolve();
    });
  });
}

async function migrateTodoImages() {
  return new Promise((resolve, reject) => {
    sqlite.all("Select * FROM todoImages", async (error, todo_images) => {
      if (error) {
        reject(error);
        console.log(error, "could not get data from todoImages");
        return;
      }
      for (const todoImage of todo_images) {
        await postgres.query(
          "INSERT INTO todo_images (id, image) VALUES($1, $2)",

          [todoImage.id, todoImage.image],
        );
      }
      console.log("Todo images migrated!");
      resolve();
    });
  });
}

async function migrateTodos() {
  return new Promise((resolve, reject) => {
    sqlite.all("Select * FROM TODOS", async (error, todos) => {
      if (error) {
        console.log(error, "could not get data from TODOS");
        reject(error);
        return;
      }
      for (const todo of todos) {
        let completedtodo = todo.completed_todo === 0 ? false : true;

        await postgres.query(
          "INSERT INTO todos (todos, todo_description, completed_todo, id, chosen_date, user_id, image_id) VALUES($1, $2, $3, $4, $5, $6, $7)",

          [
            todo.Todos,
            todo.todo_description,
            completedtodo,
            todo.id,
            todo.chosen_date,
            todo.user_id,
            todo.image_id,
          ],
        );
      }
      console.log("Todos migrated!");
      resolve();
    });
  });
}

async function migrate() {
  await migrateUsers();
  await migrateTodoImages();
  await migrateTodos();

  console.log("migration completed!");
}
migrate();
