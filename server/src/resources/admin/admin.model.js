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
			sum(oi.orderitem_quantity) as sum_quantity,
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
			c.client_status_badge as badge,
			o.order_status as status,
			loc.location_created_at as created,
			array_agg(oi.orderitem_quantity) as quantity,
			sum(oi.orderitem_quantity) as sum_quantity,
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
		group by id, fullname, first_name, language, latitude, longitude, created, phone, badge
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
			c.client_status_badge as badge,
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
		group by id, fullname, first_name, language, latitude, longitude, created, phone, badge
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
			count(o.order_id)::integer as all_orders,
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
		order by all_orders desc
		limit $2
		offset (($3 - 1) * $2);
		;
	`

	return await fetch(ALL_CLIENTS, arr)

}

//========= CATAGORY =========//

// create
const createCatagories = async (arr) => {

	const ALL_CATS = `
		insert into catagories (catagory_status, catagory_keyword)
		values($1, $2)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setCatagories = async (arr) => {

	const ALL_CATS = `
		update catagories
		set 
			catagory_status = $1, 
			catagory_keyword = $2
		where
			catagory_id = $3
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// read
const getCatagories = async (arr) => {

	const ALL_CATS = `
		select
			c.catagory_id,
			c.catagory_status,
			c.catagory_keyword,
			ci.catagory_info_id,
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

// read
const getOneCatagory = async (arr) => {

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
		where
			ci.catagory_id = $1 and ci.language_id = $2
		;
	`

	return await fetch(ALL_CATS, arr)

}

// delete
const deleteCatagories = async (arr) => {

	const ALL_CATS = `
		delete from catagories
		where catagory_id = $1
		returning *
	`

	return await fetch(ALL_CATS, arr)

}

//========= CATAGORY INFO =========//

// create
const createCatagoriesInfo = async (arr) => {

	const ALL_CATS = `
		insert into catagories_info (catagory_info_name, language_id, catagory_id)
		values($1, $2, $3)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// fetch
const getCatagoriesInfo = async (arr) => {

	const ALL_CATS = `
		select * from catagories_info where catagory_id = $1;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setCatagoriesInfo = async (arr) => {

	const ALL_CATS = `
		update catagories_info
		set 
			catagory_info_name = $1, 
			language_id = $2
		where
			catagory_info_id = $3
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// delete
const deleteCatagoriesInfo = async (arr) => {

	const ALL_CATS = `
		delete from catagories_info
		where
			catagory_info_id = $1
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

//========= PRODUCT =========//

// create
const createProducts = async (arr) => {

	const ALL_CATS = `
		insert into products (product_price, product_image, product_status, catagory_id)
		values($1, $2, $3, $4)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// get
const getProducts = async (arr) => {

	const ALL_CATS = `
		select 
			p.product_id,
			p.product_price,
			p.product_image,
			p.product_status,
			p.catagory_id,
			pi.product_info_id,
			pi.product_info_name,
			pi.product_info_desc,
			pi.language_id
		from 
			products as p
		join
			products_info as pi on pi.product_id = p.product_id
		;
	`

	return await fetch(ALL_CATS, arr)

}

// get one
const getOneProduct = async (arr) => {

	const ALL_CATS = `
		select 
			p.product_id,
			p.product_price,
			p.product_image,
			p.product_status,
			p.catagory_id,
			pi.product_info_id,
			pi.product_info_name,
			pi.product_info_desc,
			pi.language_id
		from 
			products as p
		join
			products_info as pi on pi.product_id = p.product_id
		where
			pi.product_id = $1 and pi.language_id = $2
		;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setProducts = async (arr) => {

	const ALL_CATS = `
		update products
		set 
			product_price = $1, 
			product_image = $2, 
			product_status = $3, 
			catagory_id = $4
		where
			product_id = $5
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// delete
const deleteProducts = async (arr) => {

	const ALL_CATS = `
		delete from products
		where
			product_id = $1
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

//========= PRODUCT INFO =========//

// create
const createProdcutsInfo = async (arr) => {

	const ALL_CATS = `
		insert into products_info (product_info_name, product_info_desc, language_id, product_id)
		values($1, $2, $3, $4)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// get
const getProdcutsInfo = async (arr) => {

	const ALL_CATS = `
		select * from products_info where product_info_id = $1;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setProdcutsInfo = async (arr) => {

	const ALL_CATS = `
		update products_info
		set 
			product_info_name = $1, 
			product_info_desc = $2, 
			language_id = $3, 
			product_id = $4
		where
			product_info_id = $5
		returning
			*
		;

	`

	return await fetch(ALL_CATS, arr)

}

// delete
const deleteProdcutsInfo = async (arr) => {

	const ALL_CATS = `
		delete from products_info
		where
			product_info_id = $1
		returning
			*
		;

	`

	return await fetch(ALL_CATS, arr)

}

//=========== ADMIN ===========//

// create
const createAdmin = async (arr) => {

	const ALL_CATS = `
		insert into admins (admin_username, admin_password)
		values($1, crypt($2, gen_salt('bf')))
		returning
			admin_id,
			admin_username,
			admin_joined_at
		;
	`

	return await fetch(ALL_CATS, arr)

}

// fetch
const getAdmins = async (arr) => {

	const ALL_CATS = `
		select
			admin_id,
			admin_username,
			admin_joined_at
		from
			admins
		;
	`

	return await fetch(ALL_CATS, arr)

}

// delete
const deleteAdmin = async (arr) => {

	const ALL_CATS = `
		delete from admins
		where admin_id = $1
		returning
			admin_id,
			admin_username
		;
	`

	return await fetch(ALL_CATS, arr)

}

//============ SEARCH =============//

// fetch
const search = async (arr) => {

	const ALL_CATS = `
		select
			client_id,
			client_status_badge,
			client_name,
			tg_first_name,
			tg_phone,
			language_id
		from
			clients
		where 
			tg_phone like '%' || $1 || '%'
		;
	`

	return await fetch(ALL_CATS, arr)

}

//============ STATS =============//

// fetch day
const getStatsByDay = async (arr) => {

	const ALL_CATS = `
		select
			extract(year from loc.location_created_at) as created_year,
			extract(month from loc.location_created_at) as created_month,
			extract(week from loc.location_created_at) as created_week,
			extract(day from loc.location_created_at) as created_day,
			extract(hour from loc.location_created_at) as created_hour,
			sum(oi.orderitem_quantity) as sum_quantity
		from
			orders as o
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
			l.language_code = 'uz' and 
			extract(year from loc.location_created_at) = $1 and 
			extract(month from loc.location_created_at) = $2 and 
			extract(day from loc.location_created_at) = $3
		group by created_year, created_month, created_week, created_day, created_hour
		order by created_year desc, created_month desc, created_day desc, created_hour desc
		;
	`

	return await fetch(ALL_CATS, arr)

}

// fetch month
const getStatsByMonth = async (arr) => {

	const ALL_CATS = `
		select
			extract(year from loc.location_created_at) as created_year,
			extract(month from loc.location_created_at) as created_month,
			extract(day from loc.location_created_at) as created_day,
			sum(oi.orderitem_quantity) as sum_quantity
		from
			orders as o
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
			l.language_code = 'uz' and 
			extract(year from loc.location_created_at) = $1 and 
			extract(month from loc.location_created_at) = $2
		group by created_year, created_month, created_day
		order by created_year desc, created_month desc, created_day desc
		;
	`

	return await fetch(ALL_CATS, arr)

}

// fetch year
const getStatsByYear = async (arr) => {

	const ALL_CATS = `
		select
			extract(year from loc.location_created_at) as created_year,
			extract(month from loc.location_created_at) as created_month,
			sum(oi.orderitem_quantity) as sum_quantity
		from
			orders as o
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
			l.language_code = 'uz' and 
			extract(year from loc.location_created_at) = $1 
		group by created_year, created_month
		order by created_year desc, created_month desc
		;
	`

	return await fetch(ALL_CATS, arr)

}

// fetch week
const getStatsByWeek = async (arr) => {

	const ALL_CATS = `
		select
			to_char(loc.location_created_at, 'Day') as created_week,
			extract(day from loc.location_created_at) as created_day,
			sum(oi.orderitem_quantity) as sum_quantity
		from
			orders as o
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
			l.language_code = 'uz' and 
			to_char(loc.location_created_at ,'yyyy-mm-dd') = any(SELECT to_char(generate_series, 'yyyy-mm-dd') FROM generate_series(CURRENT_TIMESTAMP, (select date_trunc('day', NOW() - interval '6 days')), '-24 hours'))
		group by created_week, created_day
		order by created_week desc, created_day desc
		;
	`

	return await fetch(ALL_CATS, arr)

}

//========= COMMENTS =========//

// create
const createComments = async (arr) => {

	const ALL_CATS = `
		insert into comments (comment_text, order_id, admin_id)
		values($1, $2, $3)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setComments = async (arr) => {

	const ALL_CATS = `
		update 
			comments 
		set
			comment_text = $1, 
			admin_id = $2,
			comment_created_at = now()
		where
			order_id = $3
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// get
const getComments = async (arr) => {

	const ALL_CATS = `
		select
			com.comment_text,
			com.comment_created_at,
			ad.admin_username
		from
			comments as com
		join
			admins as ad on ad.admin_id = com.admin_id
		where
			com.order_id = $1
		;
	`

	return await fetch(ALL_CATS, arr)

}

//========= INFOS =========//

// create
const createInfos = async (arr) => {

	const ALL_CATS = `
		insert into infos (info_company_name, info_catalog_link, info_media, info_phone, info_address, info_email, info_delivery_price, info_free_delivery_limit)
		values($1, $2, $3, $4, $5, $6, $7, $8)
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// get
const getInfos = async (arr) => {

	const ALL_CATS = `
		select 
			* 
		from 
			infos  
		order by info_id asc
		limit 1
		;
	`

	return await fetch(ALL_CATS, arr)

}

// update
const setInfos = async (arr) => {

	const ALL_CATS = `
		update 
			infos 
		set
			info_company_name = $1, 
			info_catalog_link = $2, 
			info_media = $3, 
			info_phone = $4, 
			info_address = $5, 
			info_email = $6, 
			info_delivery_price = $7, 
			info_free_delivery_limit = $8
		where
			info_id = $9
		returning
			*
		;
	`

	return await fetch(ALL_CATS, arr)

}

// ======== BADGE ========= //

// update
const setBadge = async (arr) => {

	const ALL_CATS = `
		update 
			clients 
		set
			client_status_badge = $2
		where
			client_id = $1
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
	getOneCatagory,
	setCatagories,
	createCatagories,
	deleteCatagories,
	createCatagoriesInfo,
	getCatagoriesInfo,
	setCatagoriesInfo,
	deleteCatagoriesInfo,
	createProducts,
	getProducts,
	getOneProduct,
	setProducts,
	deleteProducts,
	createProdcutsInfo,
	getProdcutsInfo,
	setProdcutsInfo,
	deleteProdcutsInfo,
	createAdmin,
	getAdmins,
	deleteAdmin,
	search,
	getStatsByDay,
	getStatsByMonth,
	getStatsByYear,
	getStatsByWeek,
	createComments,
	setComments,
	getComments,
	createInfos,
	getInfos,
	setInfos,
	setBadge
}
