const { fetch } = require('./../../db/db')

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

module.exports = {
	many,
	editOrder,
	login,
	getClientOrders,
}
