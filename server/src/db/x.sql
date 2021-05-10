select
	o.order_id as id,
	-- o.client_id as client_id,
	c.client_name as fullname,
	-- c.tg_first_name as first_name,
	-- c.tg_phone as phone,
	-- c.language_id as language,
	-- o.order_status as status,
	-- loc.location_created_at as created,
	array_agg(

		jsonb_build_object(
			'name', pi.product_info_name, 'quantity', oi.orderitem_quantity
			)
	) as obj,

	array_agg(pi.product_info_name || ';' || oi.orderitem_quantity || ';' || p.product_price || ';' || cat.catagory_keyword) as client_orders
	-- sum(p.product_price * oi.orderitem_quantity) as price,
	-- (
	-- 	select info_delivery_price from infos limit 1
	-- ) as delivery,
	-- (
	-- 	select info_free_delivery_limit from infos limit 1
	-- ) as free_delivery_limit,
	-- loc.location_latitude as latitude, 
	-- loc.location_longitude as longitude
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
	catagories as cat on cat.catagory_id = p.catagory_id
join
	languages as l on l.language_id = pi.language_id
join
	locations as loc on loc.order_id = o.order_id
where
	l.language_code = 'uz' and o.order_id = 123
group by id, fullname
-- order by id
;