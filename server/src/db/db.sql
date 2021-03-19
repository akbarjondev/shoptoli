create database shoptoli;

create extension "pgcrypto";

create table clients(
	client_id serial primary key,
	client_name varchar(72),
	client_status_badge int default 0,
	client_joined_at timestamp with time zone default current_timeshtamp,
	tg_user_id int,
	tg_first_name varchar(150),
	tg_last_name varchar(150),
	tg_username varchar(150),
	tg_phone varchar(20),
	region_id int
);


create table regions(
	region_id serial primary key,
	region_name varchar(50)
);

create table admins(
	admin_id serial primary key,
	admin_username varchar(50),
	admin_password varchar(72),
	admin_joined_at timestamp with time zone default current_timeshtamp
);

create table catagories(
	catagory_id serial primary key,
	catagory_name varchar(50)
);

create table products(
	product_id serial primary key,
	product_name varchar(50),
	product_desc text,
	product_price int,
	product_is_active boolean default true,
	catagory_id
);

create table cart(
	cart_id serial primary key,
	cart_status int,
	cart_created_at timestamp with time zone default current_timeshtamp,
	client_id int
);

create table cartitems(
	cartitem_id serial primary key,
	cartitem_created_at timestamp with time zone default current_timeshtamp,
	cartitem_quantity int,
	cart_id int,
	product_id int
);

create table locations(
	location_id serial primary key,
	location_created_at timestamp with time zone default current_timeshtamp,
	location_latitude varchar(50),
	location_longitude varchar(50),
	cart_id int
);

create table steps(
	step_id serial primary key,
	step_name varchar(50),
	tg_user_id int
);

create table comments(
	comment_id serial primary key,
	comment_text text,
	cart_id int,
	admin_id int
);
