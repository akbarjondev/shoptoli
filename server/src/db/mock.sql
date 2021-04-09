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
insert into infos(info_company_name, info_catalog_link) values('Ajwa', 'https://telegra.ph/Xayrli-tong-02-24');

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
	products(product_price, product_status, catagory_id)
values 
(26000, 1, 1),
(26000, 1, 1),
(12000, 1, 2),
(8000, 1, 2),
(8000, 1, 2),
(18000, 1, 3),
(10000, 1, 3)
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

-- select 
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