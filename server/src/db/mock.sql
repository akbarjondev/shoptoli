-- insert clients
insert into 
	clients(client_name, tg_user_id, tg_first_name, tg_last_name, tg_username, tg_phone, region_id)
values 
('Ali', 123546, 'Ali', 'Akbar', 'akbarjondev', '998945562189', 1 ),
('Salim', 456848, 'Salim', '', 'salimdev', '998948895426', 2 )
;

-- insert catagories
insert into 
	catagories(catagory_name)
values 
('Asosiy taomlar'),
('Ichimliklar')
;

-- insert products
insert into 
	products(product_name, product_desc, product_price, product_is_active, catagory_id)
values 
('Sudak', 'Sudak info', 26000, true, 1),
('Teftel', 'Teftel info', 26000, true, 1),
('Cola', 'Coca-cola info', 12000, true, 2)
;

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
values ('Bugungi menyu', 1, 1),
			 ('Сегодняшнее меню', 2, 1),
			 ('Ichimliklar', 1, 2),
			 ('Напитки', 2, 2),
			 ('Fast Foodlar', 1, 3),
			 ('Фаст-Фуд', 2, 3)
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