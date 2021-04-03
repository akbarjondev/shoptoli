create database shoptoli;

create extension "pgcrypto";

create table clients(
	client_id serial primary key,
	client_name varchar(72),
	client_status_badge int default 0,
	client_joined_at timestamp with time zone default current_timestamp,
	tg_user_id int,
	tg_first_name varchar(150),
	tg_last_name varchar(150),
	tg_username varchar(150),
	tg_phone varchar(20),
	region_id int,
	language_id varchar(2) default 'uz'
);

-----------------------------------------------

create table regions(
	region_id serial primary key,
	region_status int
);

create table regions_info(
	region_info_id serial primary key,
	region_info_name varchar(20),
	language_id int,
	region_id int
);

-----------------------------------------------

create table admins(
	admin_id serial primary key,
	admin_username varchar(50),
	admin_password varchar(72),
	admin_joined_at timestamp with time zone default current_timestamp
);

-----------------------------------------------

create table catagories(
	catagory_id serial primary key,
	catagory_status int
);

create table catagories_info(
	catagory_info_id serial primary key,
	catagory_info_name varchar(50),
	language_id int,
	catagory_id int
);

-----------------------------------------------

create table products(
	product_id serial primary key,
	product_price int,
	product_status int,
	catagory_id int
);

create table products_info(
	product_info_id serial primary key,
	product_info_name varchar(50),
	product_info_desc text,
	language_id int,
	product_id int
);

-----------------------------------------------

create table orders(
	order_id serial primary key,
	order_status int default 0,
	order_created_at timestamp with time zone default current_timestamp,
	client_id int
);

create table orderitems(
	orderitem_id serial primary key,
	orderitem_created_at timestamp with time zone default current_timestamp,
	orderitem_quantity int,
	order_id int,
	product_id int
);

create table locations(
	location_id serial primary key,
	location_created_at timestamp with time zone default current_timestamp,
	location_latitude varchar(50),
	location_longitude varchar(50),
	order_id int
);

create table steps(
	step_id serial primary key,
	step_name varchar(50),
	step_last_action timestamp with time zone default current_timestamp,
	tg_user_id int
);

create table comments(
	comment_id serial primary key,
	comment_text text,
	order_id int,
	admin_id int
);

create table languages(
	language_id serial primary key,
	language_code varchar(5),
	language_status int default 1 -- 0 | 1
);
