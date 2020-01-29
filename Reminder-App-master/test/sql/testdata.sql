use reminder_app;

-- add users
insert into user values (1,'test', 'testpw', 'test@kent.edu');

-- add notes
insert into note (user_id, title, content) values (1, 'Remove Task', 'Add the ability for the user to be able to delete a task they are completed with or that is no longer needed on the ToDo list.');
insert into note (user_id, title, content) values (1, 'Edit Task', 'Update the code so that the user is able to edit their ToDo list. i.e. change the time or description.');
insert into note (user_id, title, content) values (1, 'Parsing', 'Parsing user input into tokens.');
insert into note (user_id, title, content) values (1, 'Timeline', 'Creating a timeline on the users page for easier visibility of a persons schedule.');
insert into note (user_id, title, content) values (1, 'Reminder/Expiration', 'Remind the user of an upcoming event and when the event is about to expire.');
insert into note (user_id, title, content) values (1, 'Categorizing / Coloring Events', 'Update the code to allow the user to create categories and place items in the proper categories. Adding a coloring option to that would be nice as well.');
insert into note (user_id, title, content) values (1, 'Sharing', 'Allow a person to share an event they created with another user.');
insert into note (user_id, title, content) values (1, 'Encryption', 'update security on our website to ensure safety and privacy of users');
insert into note (user_id, title, content) values (1, 'Weather', 'Add the weather for a specific day that an event is being created (that day or in the future)');
insert into note (user_id, title, content) values (1, 'Archive / Check Off', 'Allow user to check off of their ToDo list and send it to an archive. This allows the user to pull up old events they didn\'t mean to delete.');
insert into note (user_id, title, content) values (1, 'Clock', 'Set up a clock for easy access to the time.');
insert into note (user_id, title, content) values (1, 'Spellcheck', 'Spellcheck will help users with their spelling.');
insert into note (user_id, title, content) values (1, 'Location', 'Allow the user to add a location to an event they create.');
insert into note (user_id, title, content) values (1, 'Event Time', 'Keep track of the time that the user created an event?');
insert into note (user_id, title, content) values (1, 'Python script to parse out a \'to-do item\' string', 'This feature will take a string such as \'Movie this Friday at 7pm\' and extract keywords so that a reminder can be created in form:\n*Movie\n*7pm\n*Friday\nAlgorithm will need to be able to handle multiple corner cases.');
insert into note (user_id, title, content) values (1, 'Add a Task to ToDo list', 'Give the user the ability to add to their ToDo list.');