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