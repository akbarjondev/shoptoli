-- know timezone
show timezone;

set timezone = 'Asia/Tashkent';

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
	product_image text,
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
	order_status int default 0 not null,
	order_created_at timestamp with time zone default current_timestamp,
	client_id int
);

-- select all orders with pagination
create or replace function fetch_orders_pagination(lang varchar = 'uz', page_number int = 1, page_size int = 7) 
	returns table(id int, client_id int, fullname varchar, first_name varchar, phone varchar, language varchar, status int, created timestamp with time zone, quantity int [], name varchar [], price bigint, latitude varchar, longitude varchar) language plpgsql as $$

	begin

		return query 
			select
				o.order_id as id,
				o.client_id as client_id,
				c.client_name as fullname,
				c.tg_first_name as first_name,
				c.tg_phone as phone,
				c.language_id as language,
				o.order_status as status,
				loc.location_created_at as created,
				array_agg(oi.orderitem_quantity) as quantity,
				array_agg(pi.product_info_name) as name,
				sum(p.product_price * oi.orderitem_quantity) as price,
				loc.location_latitude as latitude, 
				loc.location_longitude as longitude
			from
				orders as o
			join
				clients as c on c.client_id = o.client_id
			join
				orderitems as oi on o.order_id = oi.order_id
			join
				products as p on p.product_id = oi.product_id
			join
				products_info as pi on pi.product_id = p.product_id
			join
				languages as l on l.language_id = pi.language_id
			join
				locations as loc on loc.order_id = o.order_id
			where
				l.language_code = lang
			group by id, fullname, first_name, language, latitude, longitude, created, phone
			order by id desc
			limit page_size
			offset ((page_number - 1) * page_size);

	end;

$$;

-- trigger func for avoiding duplicate order status = cart
create or replace function check_order_exist() returns trigger language plpgsql as $$

	declare
		order_is_exist int := (select order_id from orders where client_id = new.client_id and order_status = 0) 
	;

	begin
		
		if order_is_exist > 0 then
			return null;
		else
			return new;
		end if;

	end;

$$;

-- make order status 1
create or replace function make_order_pending(_user_id int, _long float, _lat float) returns int language plpgsql as $$

	declare
		_order_id int := (select o.order_id from orders as o join clients as c on c.client_id = o.client_id where c.tg_user_id = _user_id and o.order_status = 0)
	;

	begin
		
		if _order_id > 0 then
				update orders set order_status = 1 where order_id = _order_id;
				
				insert into locations (location_latitude, location_longitude, order_id) values (_lat, _long, _order_id);
				
			return _order_id;
		else

			return 0;
		end if;

	end;

$$;

-- trigger
create trigger before_insert_order
before insert
on orders
for each row
execute procedure check_order_exist();


create table orderitems(
	orderitem_id serial primary key,
	orderitem_created_at timestamp with time zone default current_timestamp,
	orderitem_quantity int,
	order_id int,
	product_id int
);

-- function for don't duplicate orderitems | returns 1 if created; returns 2 if updated
create or replace function dont_duplicate_orderitems(_oiq int, _oi int, _pi int) returns int language plpgsql as $$

	begin

		if exists(
			select oi.orderitem_id from orderitems as oi join orders as o on o.order_id = oi.order_id where o.order_status = 0 and oi.product_id = _pi and o.order_id = _oi
		) then
				update orderitems set orderitem_quantity = (orderitem_quantity + _oiq) from orders where order_status = 0 and product_id = _pi and orderitems.order_id = _oi;
			return 2;
		else
				insert into	orderitems(orderitem_quantity, order_id, product_id) values(_oiq, _oi, _pi);
			return 1;
		end if;

	end;

$$;

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

------------------------------------------
create table infos(
	info_id serial primary key,
	info_company_name varchar(150) not null,
	info_catalog_link text not null,
	info_media text not null,
	info_phone varchar(10),
	info_address varchar(255),
	info_email varchar(50),
	info_delivery_price int default 0,
	info_created_at timestamptz default current_timestamp
);

create table api_history(
	api_history_id serial primary key,
	api_history_text text,
	api_history_created_at timestamptz default current_timestamp
);
