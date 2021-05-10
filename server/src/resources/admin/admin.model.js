const { fetch } = require('./../../db/db')
const { ee } = require('../../libs/ee/ee')

// catch new order when bot make new order
ee.on('new_order', async ({ data: [ order ] }) => {

	const { order_id } = order

	const NEW_ORDER_SQL = `
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
			l.language_code = $1 and o.order_id = $2
		group by id, fullname, first_name, language, latitude, longitude, created, phone
		;
	`

	const select_new_order = await fetch(NEW_ORDER_SQL, ['uz', order_id])

	// emit for server.js file
	ee.emit('select_new_order', select_new_order)
})

// feytch all
const many = async (arr) => {

	const GET_ALL_ORDERS = `
		select * from fetch_orders_pagination($1, $2, $3);
	`

	return await fetch(GET_ALL_ORDERS, arr)

}

// get on client's orders
const getClientOrders = async (arr) => {

	const GET_ORDERS = `
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
			l.language_code = $1 and c.client_id = $2
		group by id, fullname, first_name, language, latitude, longitude, created, phone
		order by id desc
		;
	`

	return await fetch(GET_ORDERS, arr)

}

// get one order
const getOneOrder = async (arr) => {

	const GET_ORDER = `
		select
			o.order_id as id,
			o.client_id as client_id,
			c.client_name as fullname,
			c.tg_first_name as first_name,
			c.tg_phone as phone,
			c.language_id as language,
			o.order_status as status,
			loc.location_created_at as created,
			array_agg(

				jsonb_build_object(
					'name', pi.product_info_name, 'quantity', oi.orderitem_quantity, 'price', p.product_price, 'keyword', cat.catagory_keyword
					)
			) as orders,
			sum(p.product_price * oi.orderitem_quantity) as price,
			(
				select info_delivery_price from infos limit 1
			) as delivery,
			(
				select info_free_delivery_limit from infos limit 1
			) as free_delivery_limit,
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
			catagories as cat on cat.catagory_id = p.catagory_id
		join
			languages as l on l.language_id = pi.language_id
		join
			locations as loc on loc.order_id = o.order_id
		where
			l.language_code = $1 and o.order_id = $2
		group by id, fullname, first_name, language, latitude, longitude, created, phone
		-- order by id
		;


	`

	return await fetch(GET_ORDER, arr)

}

// edit one order
const editOrder = async (arr) => {

	const EDIT_ORDER = `
		update
			orders
		set
			order_status = $2
		where
			order_id = $1
		returning
			order_id,
			order_status
		;
	`

	return await fetch(EDIT_ORDER, arr)

}

// login
const login = async (arr) => {

	const SELECT_USER = `
		select
			admin_id as id,
			admin_username as username
		from
			admins
		where
			admin_username = $1 and admin_password = crypt($2, admin_password);
	`

	return await fetch(SELECT_USER, arr)

}

// getAllClients
const getAllClients = async (arr) => {

	const ALL_CLIENTS = `
		select
			o.client_id as client_id,
			count(o.order_id) as id,
			c.client_name as fullname,
			c.tg_first_name as first_name,
			c.tg_phone as phone,
			c.language_id as language,
			array_agg(o.order_status) as status
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
			l.language_code = $1
		group by o.client_id, fullname, first_name, language, phone
		order by o.client_id desc
		limit $2
		offset (($3 - 1) * $2);
		;
	`

	return await fetch(ALL_CLIENTS, arr)

}

//========= CATAGORY =========//

const getCatagories = async (arr) => {

	const ALL_CATS = `
		select
			c.catagory_id,
			c.catagory_status,
			c.catagory_keyword,
			ci.catagory_info_name,
			ci.language_id
		from
			catagories as c
		join
			catagories_info as ci on c.catagory_id = ci.catagory_id
		;
	`

	return await fetch(ALL_CATS, arr)

}

const setCatagories = async (arr) => {

	const ALL_CATS = `
		update catagories
		set 
			catagory_status = $1, 
			catagory_keyword = $2
		where
			catagory_id = $5
		returning
			*
		;

		update catagories_info
		set 
			catagory_info_name = $3, 
			language_id = $4
		where
			catagory_id = $5
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

module.exports = {
	many,
	editOrder,
	login,
	getClientOrders,
	getAllClients,
	getOneOrder,
	getCatagories,
	setCatagories,
}
