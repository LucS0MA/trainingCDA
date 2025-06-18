-- INSERT INTO "user" (username, password, email, createdAt, updatedAt)
-- VALUES 
--   ('alice', 'hashed_password_1', 'alice@example.com',  datetime('now'),  datetime('now')),
--   ('bob', 'hashed_password_2', 'bob@example.com',  datetime('now'),  datetime('now')),
--   ('charlie', 'hashed_password_3', 'charlie@example.com',  datetime('now'),  datetime('now')),
--   ('diana', 'hashed_password_4', 'diana@example.com',  datetime('now'),  datetime('now')),
--   ('edgar', 'hashed_password_5', 'edgar@example.com',  datetime('now'),  datetime('now'));


-- INSERT INTO "post" (title, description, content, "createdAt", "updatedAt", usersId)
-- VALUES 
--   ('Hello World', 'Mon premier post', 'Contenu du post 1',  datetime('now'),  datetime('now'), 1),
--   ('Guide SQL', 'Un guide simple', 'Voici un guide...',  datetime('now'),  datetime('now'), 2),
--   ('Astuces JS', 'Petites astuces en JavaScript', 'Du contenu intéressant...',  datetime('now'),  datetime('now'), 4),
--   ('Sécurité Web', 'Protéger son appli', 'Utilisez bcrypt et helmet...',  datetime('now'),  datetime('now'), 5);


-- INSERT INTO "comment" (content, "createdAt", "updatedAt", usersId, postsId)
-- VALUES 
--   ('Super post, merci !',  datetime('now'),  datetime('now'), 2, 1),   
--   ('Très utile, bravo.',  datetime('now'),  datetime('now'), 1, 2),   
--   ('Merci pour le partage !',  datetime('now'),  datetime('now'), 3, 2), 
--   ('J ai appris beaucoup.',  datetime('now'),  datetime('now'), 4, 3),  
--   ('Tu devrais développer ce point.',  datetime('now'),  datetime('now'), 5, 3),
--   ('Excellent article sur la sécurité !',  datetime('now'),  datetime('now'), 1, 4); 
