"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const sqlite = __importStar(require("sqlite"));
const sqlite3_1 = __importDefault(require("sqlite3"));
let database;
(() => __awaiter(void 0, void 0, void 0, function* () {
    database = yield sqlite.open({
        driver: sqlite3_1.default.Database,
        filename: "mytodo.sqlite",
    });
    yield database.run("PRAGMA foreign_keys = ON");
    console.log("Redo att göra databasanrop");
}))();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Webbtjänsten kan nu ta emot anrop på port ${PORT}`);
});
app.use((0, cors_1.default)({
    origin: [
        "https://fullstack-project-todowebbapp.vercel.app",
        /https:\/\/fullstack-project-todowebbapp.*\.vercel\.app/,
        "http://localhost:5173",
    ],
}));
app.use(express_1.default.json());
//Compare Users table email and password value with frontends email and password
app.post("/Login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let logedInUsers = yield database.all("SELECT * FROM Users WHERE Email = ? AND Password = ?", [request.body.Email, request.body.Password]);
    //Check if email and password value is more than 0 to login
    if (logedInUsers.length > 0) {
        response.status(200).send(logedInUsers);
    }
    else {
        response.status(400).send({ message: "Invalid email or password" });
    }
}));
app.post("/SignUp", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let signedUpUsers = yield database.run("INSERT INTO Users(Email, Password, Name) VALUES(?,?, ?)", [request.body.Email, request.body.Password, request.body.Name]);
    //Check if email, name and password value is more than 0 to sign up
    if (signedUpUsers) {
        response.status(200).json({
            id: signedUpUsers.lastID, // comes from the INSERT metadata
            Email: request.body.Email, // reuse from request
            Password: request.body.Password,
            Name: request.body.Name,
            user_img: request.body.user_img,
        });
    }
    else {
        response.status(401).send({ message: "Invalid email or password" });
    }
}));
//Compare id:s to send user_img and Name of user that is logged in and display on profile page
app.post("/Profile", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let userId = yield database.get("SELECT Name, user_img FROM Users WHERE id=?", [request.body.id]);
    if (userId) {
        response.status(200).send(userId);
    }
    else {
        response.status(400).send({ message: "no such user" });
    }
}));
//Remove user account
app.delete("/removeAccount", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let removeAcc = yield database.run("DELETE FROM Users WHERE id=?", [
        request.body.id,
    ]);
    if (removeAcc) {
        response.status(200).send();
    }
    else {
        response.status(400).send({ message: "Failed to delete" });
    }
}));
//Get all todos of user that is logged in and use inner join to join todoImages table with TODOS table to get images to the TODOS table of the todos that already exists
app.post("/Todos", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let todos = yield database.all("SELECT TODOS.id,TODOS.Todos, TODOS.completed_todo, TODOS.todo_description,TODOS.user_id,TODOS.image_id, TODOS.chosen_date, todoImages.image FROM TODOS INNER JOIN todoImages ON TODOS.image_id = todoImages.id WHERE user_id = ?", [request.body.id]);
    if (todos) {
        console.log(todos);
        response.status(200).send(todos);
    }
    else {
        response.status(400).send({ message: "No such id" });
    }
}));
//Update todos that are checked and send id of user that has the checked todo and the todo id
app.post("/updateCompletedTodos", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let completedTodo = yield database.run("UPDATE TODOS SET completed_todo = ? WHERE id = ? AND user_id=?", [request.body.completed_todo, request.body.id, request.body.user_id]);
    if (completedTodo) {
        response.status(200).send();
    }
    else {
        response.status(400).send({ message: "Failed to check" });
    }
}));
//Delete one todo when clicking on dustbin
app.delete("/DeleteTodo", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let deleteTodo = yield database.run("DELETE FROM TODOS WHERE id=?", [
        request.body.id,
    ]);
    if (deleteTodo) {
        response.status(200).send();
    }
    else {
        response.status(400).send({ message: "Failed to delete" });
    }
}));
//Get all todos of the user that is logged in on home page
app.post("/Home", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let todos = yield database.all("SELECT TODOS.id,TODOS.Todos,TODOS.todo_description,TODOS.user_id, TODOS.image_id,todoImages.image FROM TODOS INNER JOIN todoImages ON TODOS.image_id = todoImages.id WHERE user_id = ?", [request.body.id]);
    if (todos) {
        response.status(200).send(todos);
    }
    else {
        response.status(400).send({ message: "Failed to get todos" });
    }
}));
//Get all images from todoImages table
app.get("/getImages", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let getTodoImages = yield database.all("SELECT * FROM todoImages");
    if (getTodoImages) {
        response.status(200).send(getTodoImages);
    }
    else {
        response.status(400).send({ message: "Failed to get images" });
    }
}));
//Add new todo to TODOS table for the user that is logged in
app.post("/addNewTodo", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let addTodo = yield database.run("INSERT INTO TODOS (Todos, todo_description, image_id, user_id, chosen_date) VALUES(?,?,?,?,?)", [
        request.body.Todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.user_id,
        request.body.chosen_date,
    ]);
    if (addTodo) {
        response.status(200).send(addTodo);
    }
    else {
        response.status(400).send({ message: "Failed to add new todo" });
    }
}));
//Get name of user that is logged in
app.post("/UserName", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let getUserName = yield database.get("SELECT Name FROM Users WHERE id=?", [
        request.body.id,
    ]);
    if (getUserName) {
        response.status(200).send(getUserName);
    }
    else {
        response.status(400).send({ message: "No such user" });
    }
}));
//Edit todo that matches id of user that is logged in and id of todo
app.put("/editTodo", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let editTodo = yield database.run("UPDATE TODOS SET Todos=?, todo_description=?, image_id=?, chosen_date=? WHERE id=? AND user_id=?", [
        request.body.Todos,
        request.body.todo_description,
        request.body.image_id,
        request.body.chosen_date,
        request.body.id,
        request.body.user_id,
    ]);
    if (editTodo) {
        console.log(editTodo);
        response.status(200).send(editTodo);
    }
    else {
        response.status(400).send({ message: "Failed to edit todo" });
    }
}));
