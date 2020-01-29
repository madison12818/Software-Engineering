-- create database
create database if not exists reminder_app collate = utf8mb4_general_ci;
use reminder_app;

-- create user table
create table if not exists user (
	id int(11) not null auto_increment,
	username varchar(50) unique,
	password varchar(50),
	email varchar(50) unique,
	primary key(id)
);

-- create note table
create table if not exists note (
	id int(11) not null auto_increment,
	user_id int(11),
	title varchar(50),
	date_due_d date,
	date_due_t time,
	date_created_d date,
	date_created_t time,
	date_modified_d date,
	date_modified_t time,
	content varchar(1000),
	primary key(id),
	foreign key (user_id) references user(id)
);