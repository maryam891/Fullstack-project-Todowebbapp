-- CREATE TABLE Users(id INTEGER PRIMARY KEY, Name TEXT NOT NULL, Email TEXT NOT NULL UNIQUE,
-- Password TEXT NOT NULL, user_img TEXT);

-- INSERT INTO Users (Name, Email, Password, user_img) VALUES ('Alice', 'Alice@gmail.com','Secret123', 'Alice.svg' );

-- INSERT INTO Users (Name, Email, Password, user_img) VALUES ('Bob', 'Bob@gmail.com','Secret222', 'Bob.svg');

-- CREATE TABLE TODOS (Todos TEXT NOT NULL, todo_description, completed_todo INTEGER DEFAULT 0, id INTEGER PRIMARY KEY, chosen_date TEXT, user_id INTEGER, image_id INTEGER, FOREIGN KEY(user_id) REFERENCES Users(id), FOREIGN KEY(image_id) REFERENCES todoImages(id));


-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Buy groceries', 1, 3);

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Workout', 1, 29);

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Have meeting at 12', 1, 37 );

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Meditate', 1, 13);

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Clean up room', 2, 12);

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Walk my dog', 2, 14);

-- INSERT INTO TODOS (Todos, user_id, image_id ) VALUES ('Work on code problem', 2,11);

-- INSERT INTO TODOS (Todos, user_id,image_id ) VALUES ('Workout', 2, 15);


-- CREATE TABLE todoImages (id INTEGER primary key, image TEXT);

-- INSERT INTO todoImages(image) VALUES ('basketball.svg');
-- INSERT INTO todoImages(image) VALUES ('gotowork.svg');
-- INSERT INTO todoImages(image) VALUES ('groceryImage.svg');
-- INSERT INTO todoImages(image) VALUES ('groceries.svg');
-- INSERT INTO todoImages(image) VALUES ('interview.svg');
-- INSERT INTO todoImages(image) VALUES ('camping.svg');
-- INSERT INTO todoImages(image) VALUES ('homeWork.svg');
-- INSERT INTO todoImages(image) VALUES ('music.svg');
-- INSERT INTO todoImages(image) VALUES ('soccer.svg');
-- INSERT INTO todoImages(image) VALUES ('travel.svg');
-- INSERT INTO todoImages(image) VALUES ('codeImg.svg');
-- INSERT INTO todoImages(image) VALUES ('cleanupImage.svg');
-- INSERT INTO todoImages(image) VALUES ('meditateImg.svg');
-- INSERT INTO todoImages(image) VALUES ('walkdogImg.svg');
-- INSERT INTO todoImages(image) VALUES ('workoutImage.svg');
-- INSERT INTO todoImages(image) VALUES ('surf.svg');
-- INSERT INTO todoImages(image) VALUES ('coffe.svg');
-- INSERT INTO todoImages(image) VALUES ('halloween.svg');
-- INSERT INTO todoImages(image) VALUES ('cat.svg');
-- INSERT INTO todoImages(image) VALUES ('dog.svg');
-- INSERT INTO todoImages(image) VALUES ('designer.svg');
-- INSERT INTO todoImages(image) VALUES ('onlineShopping.svg');
-- INSERT INTO todoImages(image) VALUES ('prepare.svg');
-- INSERT INTO todoImages(image) VALUES ('project.svg');
-- INSERT INTO todoImages(image) VALUES ('readbook.svg');
-- INSERT INTO todoImages(image) VALUES ('relax.svg');
-- INSERT INTO todoImages(image) VALUES ('select.svg');
-- INSERT INTO todoImages(image) VALUES ('trip.svg');
-- INSERT INTO todoImages(image) VALUES ('workoutImg2.svg');
-- INSERT INTO todoImages(image) VALUES ('MeetingImg.svg');
-- INSERT INTO todoImages(image) VALUES ('barber.svg');
-- INSERT INTO todoImages(image) VALUES ('coffe.svg');
-- INSERT INTO todoImages(image) VALUES ('workout3.svg');
-- INSERT INTO todoImages(image) VALUES ('takePhotos.svg');
-- INSERT INTO todoImages(image) VALUES ('mindmap.svg');
-- INSERT INTO todoImages(image) VALUES ('decorate-christmas-tree.svg');
-- INSERT INTO todoImages(image) VALUES ('birthdayCake.svg');
