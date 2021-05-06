-- insert languages
insert into
	languages(language_code, language_status)
values ('uz', 1), ('ru', 1)
;

-- insert regions
insert into
	regions(region_status)
values (1),(1),(1),(1),(1),(1),(1),(1),(1),(1),(1),(1)
;

-- insert regions info
insert into
	regions_info(region_info_name, language_id, region_id)
values ('Bektemir', 1, 1),
			 ('Бектемир', 2, 1),
			 ('Chilonzor', 1, 2),
			 ('Чилонзор', 2, 2),
			 ('Yashnobod', 1, 3),
			 ('Яшнобод', 2, 3),
			 ('Mirobod', 1, 4),
			 ('Миробод', 2, 4),
			 ('Mirzo Ulug''bek', 1, 5),
			 ('Мирзо Улуғбек', 2, 5),
			 ('Sergeli', 1, 6),
			 ('Сергели', 2, 6),
			 ('Shayxontohur', 1, 7),
			 ('Шайхонтоҳур', 2, 7),
			 ('Olmazor', 1, 8),
			 ('Олмазор', 2, 8),
			 ('Uchtepa', 1, 9),
			 ('Учтепа', 2, 9),
			 ('Yakkasaroy', 1, 10),
			 ('Яккасарой', 2, 10),
			 ('Yunusobod', 1, 11),
			 ('Юнусобод', 2, 11),
			 ('Yangihayot', 1, 12),
			 ('Янгиҳайот', 2, 12)
;

-- select lang client
select 
	l.language_code as language
from 
	clients as c
join
	languages as l on l.language_code = c.language_id
where
	c.tg_user_id = 288096386
;

-- select regions
select
	r.region_info_name as name,
	r.region_id as id
from
	regions_info as r
join
	languages as l on l.language_id = r.language_id
where
	l.language_code = 'ru'
;

-- info general
insert into infos(info_company_name, info_catalog_link, info_media, info_delivery_price) 
values('Ajwa', 'https://telegra.ph/Xayrli-tong-02-24', 'https://telegra.ph/file/24f653391eb73effe4f98.jpg', 12000);

-- catagories
insert into catagories(catagory_status) values(1), (1), (1);

-- catagory info
insert into catagories_info(catagory_info_name, language_id, catagory_id)
values ('🍲Bugungi menyu', 1, 1),
			 ('🍲Сегодняшнее меню', 2, 1),
			 ('🥤Ichimliklar', 1, 2),
			 ('🥤Напитки', 2, 2),
			 ('🍔Fast Foodlar', 1, 3),
			 ('🍔Фаст-Фуд', 2, 3)
;

select 
	c.catagory_info_name as name,
	c.catagory_id as id
from
	catagories_info as c
join
	languages as l on l.language_id = c.language_id
where
	l.language_code = 'uz'
;

--insert products
insert into 
	products(product_price, product_status, catagory_id, product_image)
values 
(26000, 1, 1, 'https://telegra.ph/file/0d12283b355829bf7efd6.jpg'),
(26000, 1, 1, 'https://telegra.ph/file/d7363c18024670956c9d6.jpg'),
(12000, 1, 2, 'https://gomart.uz/469-medium_default/dinay-vishnya-1l.jpg'),
(8000, 1, 2, 'https://onlinerasta.uz/wp-content/uploads/2020/08/ip9ipklcm.jpg'),
(8000, 1, 2, 'https://res.cloudinary.com/picked/image/upload/v1603884777/cms/coca-cola-1603884776.png'),
(18000, 1, 3, 'https://static.fanpage.it/wp-content/uploads/sites/22/2020/03/iStock-1152247466-638x425.jpg'),
(10000, 1, 3, 'https://s3.amazonaws.com/cdn.tastesofchicago.com/images/uploads/category_956_8833.jpg')
;

--insert products_info
insert into
	products_info(product_info_name, product_info_desc, language_id, product_id)
values('Sudak', 'Tarkibi boy mahsulotlarga ega', 1, 1),
			('Судак', 'Состав имеет богатые продукты', 2, 1),
			('Kotlet', 'Mol go''shti, tarkibi boy mahsulotlarga ega', 1, 2),
			('Котлет', 'Говядина, имеет богатый состав продуктов', 2, 2),
			('Coca-cola', 'Shakar, kofein )', 1, 3),
			('Coca-cola', 'Сахар, kofein )', 2, 3),
			('Dinay olcha', 'Shakar, olcha, suv', 1, 4),
			('Динай олча', 'Сахар, olcha, suv', 2, 4),
			('Meva sok', 'Shakar, faqat suv', 1, 5),
			('Мева сок', 'Сахар, faqat suv', 2, 5),
			('Gamburger', 'Non, salat, pomidor, kotlet, bodring', 1, 6),
			('Гамбургер', 'Хлеб, салат, помидоры, котлеты, огурцы', 2, 6),
			('Hot dog', 'Non, salat, pomidor, sosiska, bodring', 1, 7),
			('Хот дог', 'Хлеб, салат, помидоры, колбаса, огурцы', 2, 7)
;


--select products based on language and catagory
select
	p.product_id as id,
	p.product_price as price,
	pi.product_info_name as name,
	pi.product_info_desc as desc
from
	products as p
join
	products_info as pi on pi.product_id = p.product_id
join
	languages as l on l.language_id = pi.language_id
where
	l.language_code = 'uz' and p.catagory_id = 1
;

-- select one product based on ID and lang
select
	p.product_id as id,
	p.product_price as price,
	pi.product_info_name as name,
	pi.product_info_desc as desc
from
	products as p
join
	products_info as pi on pi.product_id = p.product_id
join
	languages as l on l.language_id = pi.language_id
where
	l.language_code = 'uz' and p.product_id = 1
;

insert into orders(client_id)
values(1)

-- select client order
select 
	c.client_id,
	o.order_id,
	o.order_status
from
	clients as c
join
	orders as o on o.client_id = c.client_id
where
	c.tg_user_id = 288096386
;

-- select orderitems for cart
select 
	oi.orderitem_quantity as quantity,
	p.product_price as price,
	pi.product_info_name as name
from
	orderitems as oi
join
	products_info as pi on pi.product_id = oi.product_id
join
	products as p on p.product_id = oi.product_id
join 
	languages as l on l.language_id = pi.language_id 
where
	oi.order_id = 36 and l.language_code = 'uz'
;

--update order when location send
update
	orders
set 
	order_status = 1
from
	clients as c
where
	c.tg_user_id = 288096386 and order_status = 0
returning
	order_id
;

delete from clients where tg_user_id = 288096386; --1179811412 -- 723676878
delete from steps where tg_user_id = 288096386;

delete from clients where tg_user_id = 1631848090;
delete from steps where tg_user_id = 1631848090;

insert into 
	clients(client_name, client_status_badge, tg_user_id, tg_first_name, tg_last_name, tg_username, tg_phone, region_id, language_id)
values ('', 0, 1179811412, 'Oybek', '', '', '998977061939', 9, 'uz'),
	('', 0, 60921952, 'Sherzod', 'Sharopov', 'Sherzod_Sharopov', '+998999898877', 2, 'uz'),
	('Akbarjon Tojiyev', 0, 1631848090, 'Kelajak Yoshlari', '', 'kygrant', '998334818152', 5, 'ru')
;

insert into 
	steps(step_name, tg_user_id)
values ('catagories', 1179811412),
			 ('location', 60921952),
			 ('product', 1631848090)
;

-- select all my orders
select
	o.order_id as id,
	o.order_status as status,
	to_char(o.order_created_at, 'dd-mm-yyyy') as created,
	array_agg(oi.orderitem_quantity) as quantity,
	array_agg(pi.product_info_name) as name,
	sum(p.product_price * oi.orderitem_quantity) as price
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
where
	c.tg_user_id = 288096386 and l.language_code = 'uz' and o.order_status <> 0 and o.order_status <> 5
group by id
order by id asc
limit 10
;

-- select client data
select
	c.client_name,
	c.tg_first_name,
	ri.region_info_name,
	c.language_id
from
	clients as c
join
	regions_info as ri on ri.region_id = c.region_id
join
	languages as l on l.language_code = c.language_id
where
	tg_user_id = 288096386 and ri.language_id = l.language_id
;

-- update order
update
	orders
set
	order_status = 6
where
	exists(
		select 
			c.client_id
		from
			orders as o
		join
			clients as c on c.client_id = o.client_id
		where
			order_id = 59 and c.tg_user_id = 1288096386
	) and order_status = 0 or order_status = 1 or order_status = 2
	returning
		order_id,
		order_status
;


select exists(
	select 
		c.client_id
	from
		orders as o
	join
		clients as c on c.client_id = o.client_id
	where
		order_id = 59 and c.tg_user_id = 1288096386
);

-- ADMIN
-- select all my orders
select
	o.order_id as id,
	o.client_id as client_id,
	c.client_name as client_name,
	c.language_id as language,
	o.order_status as status,
	o.order_created_at as created,
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
	l.language_code = 'uz'
group by id
order by id, c.client_name desc
limit 10
;

CREATE OR REPLACE FUNCTION udf_GetRowsByPageNumberAndSize(
 PageNumber INTEGER = NULL,
 PageSize INTEGER = NULL
 )
 RETURNS SETOF public.customer AS
 $BODY$
 BEGIN
  RETURN QUERY
   SELECT *
   FROM public.customer
   ORDER BY customerid
   LIMIT PageSize
   OFFSET ((PageNumber-1) * PageSize);
END;
$BODY$
LANGUAGE plpgsql;

-- admin
insert into admins(admin_username, admin_password) 
	values('muhammad', crypt('muhammad1', gen_salt('bf')));

insert into admins(admin_username, admin_password) 
	values('ilhomjon', crypt('ilhomjon1', gen_salt('bf')));

insert into admins(admin_username, admin_password) 
	values('akbarjon', crypt('akbarjon1', gen_salt('bf')));

insert into admins(admin_username, admin_password) 
	values('shuhratbek', crypt('shuhratbek1', gen_salt('bf')));


-- get client orders
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
	l.language_code = 'uz' and c.client_id = 37
group by id, fullname, first_name, language, latitude, longitude, created, phone
order by id desc
;

-- select by order_id
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
	l.language_code = 'uz' and o.order_id = 99
group by id, fullname, first_name, language, latitude, longitude, created, phone
-- order by id
;