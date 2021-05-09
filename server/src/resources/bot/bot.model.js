const { fetch } = require('./../../db/db')

//=========================== CLIENT ===========================//

const addClient = async (arr) => {

	try {
		
		const CREATE_ONE_CLIENT = `
			insert into clients
				(tg_user_id, tg_first_name, tg_last_name, tg_username)
			values
				($1, $2, $3, $4)
			returning
				client_id,
				tg_user_id
		`

		const data = await fetch(CREATE_ONE_CLIENT, arr)

		return {
			status: 200,
			message: 'client added',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getOneClient = async (arr) => {

	try {
		
		const getOneClient = await fetch(`
			select
				c.client_name as name,
				c.tg_first_name as tg_name,
				ri.region_info_name as region,
				c.language_id as language
			from
				clients as c
			join
				regions_info as ri on ri.region_id = c.region_id
			join
				languages as l on l.language_code = c.language_id
			where
				tg_user_id = $1 and ri.language_id = l.language_id
			;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getOneClient
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const editClient = async (arr) => {

	try {
		
		const setLangRes = await fetch(`
			update 
				clients
			set
				language_id = $2
			where
				tg_user_id = $1
			returning
				client_id,
				language_id
		`, arr)

		return {
			status: 200,
			message: 'client language edited',
			data: setLangRes
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const setName = async (arr) => {

	try {
		
		const setNameRes = await fetch(`
			update 
				clients
			set
				client_name = $1
			where
				tg_user_id = $2
			returning
				client_id
		`, arr)

		return {
			status: 200,
			message: 'client name edited',
			data: setNameRes
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const knowLang = async (arr) => {

	try {

		const getLang = await fetch(`
			select 
				c.client_id as id,
				l.language_code as language
			from 
				clients as c
			join
				languages as l on l.language_code = c.language_id
			where
				c.tg_user_id = $1
			;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getLang
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

//=========================== STEP ===========================//

const addStep = async (arr) => {

	try {
		
		const ADD_STEP = `
			insert into steps
				(step_name, tg_user_id)
			values
				($1, $2)
			returning
				step_id
		`

		const data = await fetch(ADD_STEP, arr)

		return {
			status: 200,
			message: 'step added',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getStep = async (arr) => {

	try {
		
		const GET_STEP = `
			select
				step_id,
				step_name
			from
				steps
			where
				tg_user_id = $1
		`

		const data = await fetch(GET_STEP, arr)

		if(data.length > 0) {
			
			return {
				status: 200,
				message: 'ok',
				data: data
			}

		} else {
			return {
				status: 404,
				message: 'step not found',
			}			
		}


	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const editStep = async (arr) => {

	try {
		
		const EDIT_STEP = `
			update 
				steps
			set
				step_name = $1,
				step_last_action = now()
			where
				tg_user_id = $2
			;
		`

		const data = await fetch(EDIT_STEP, arr)

		return {
			status: 200,
			message: 'ok',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

//=========================== REGIONS ===========================//


const getRegions = async (arr) => {

	try {

		const getRegions = await fetch(`
			select
				r.region_info_name as name,
				r.region_id as id
			from
				regions_info as r
			join
				languages as l on l.language_id = r.language_id
			where
				l.language_code = $1;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getRegions
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

const setRegion = async (arr) => {

	try {

		const setRegion = await fetch(`
			update
				clients
			set
				region_id = $1
			where
				tg_user_id = $2
			returning
				client_id
			;
		`, arr)

		return {
			status: 200,
			message: 'region changed',
			data: setRegion
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

const setContact = async (arr) => {

	try {

		const setContact = await fetch(`
			update
				clients
			set
				tg_phone = $1
			where
				tg_user_id = $2
			returning
				client_id
			;
		`, arr)

		return {
			status: 200,
			message: 'phone changed',
			data: setContact
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

//=========================== INFOS ===========================//

const getInfos = async (arr) => {

	try {

		const getInfos = await fetch(`
			select
				info_company_name as name,
				info_catalog_link as link,
				info_phone as phone,
				info_address as address,
				info_email as email,
				info_created_at as joined_platform,
				info_delivery_price as price,
				info_media as media,
				info_free_delivery_limit as free_delivery_limit
			from
				infos
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getInfos
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

//=========================== CATAGORIES ===========================//

const getCatagories = async (arr) => {

	try {

		const getCatagories = await fetch(`
			select 
				c.catagory_info_name as name,
				c.catagory_id as id
			from
				catagories_info as c
			join
				catagories as cat on cat.catagory_id = c.catagory_id
			join
				languages as l on l.language_id = c.language_id
			where
				l.language_code = $1 and cat.catagory_status = 1
			;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getCatagories
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

//=========================== PRODUCTS ===========================//

const getProducts = async (arr) => {

	try {

		const getProducts = await fetch(`
			select
				p.product_id as id,
				p.catagory_id as cat_id,
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
				l.language_code = $2 and p.catagory_id = $1
			;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getProducts
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}


//=========================== PRODUCT ===========================//

const getProduct = async (arr) => {

	try {

		const getProduct = await fetch(`
			select
				p.product_id as id,
				p.catagory_id as cat_id,
				p.product_price as price,
				p.product_image as image,
				pi.product_info_name as name,
				pi.product_info_desc as desc
			from
				products as p
			join
				products_info as pi on pi.product_id = p.product_id
			join
				languages as l on l.language_id = pi.language_id
			where
				l.language_code = $2 and p.product_id = $1
			;
		`, arr)

		return {
			status: 200,
			message: 'ok',
			data: getProduct
		}

	} catch(e) {
		console.log(e)
		
		return {
			status: 500,
			message: e.message
		}

	}

}

//=========================== ORDERS ===========================//

const createOrder = async (arr) => {

	try {
		
		const ADD_ORDER = `
			insert into 
				orders(client_id)
			values ($1)
			returning
				order_id
			;
		`

		const data = await fetch(ADD_ORDER, arr)

		let msgData = data.length > 0 ? 'order added' : 'order exist'

		return {
			status: 200,
			message: msgData,
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getClientOrder = async (arr) => {

	try {
		
		const GET_ORDER = `
			select 
				o.order_id
			from
				clients as c
			join
				orders as o on o.client_id = c.client_id
			where
				c.tg_user_id = $1 and o.order_status = 0
			;
		`

		const data = await fetch(GET_ORDER, arr)

		return {
			status: 200,
			message: 'ok',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const editOrder = async (arr) => {

	try {
		
		const ADD_ORDER = `
			update
				orders
			set
				order_status = $2
			where
				order_id = $1 and order_status = 0 or order_id = $1 and order_status = 1
			returning
				order_id,
				order_status
			;
		`

		const data = await fetch(ADD_ORDER, arr)

		let response

		if(data.length > 0) {
			response = {
				status: 200,
				message: 'cleaned',
				data: data
			}
		} else {
			response = {
				status: 210,
				message: 'already cleaned',
				data: data
			}
		}

		return response

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

//=========================== ORDERITEMS ===========================//

const createOrderItem = async (arr) => {

	try {
		
		const ADD_ORDER_ITEM = `
			select dont_duplicate_orderitems($1, $2, $3) as result;
		`

		const data = await fetch(ADD_ORDER_ITEM, arr)

		return {
			status: 200,
			message: 'orderitem created',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getClientOrderItems = async (arr) => {

	try {
		
		const GET_ORDER_ITEM = `
			select 
				oi.orderitem_quantity as quantity,
				p.product_price as price,
				pi.product_info_name as name,
				cat.catagory_keyword as keyword
			from
				orderitems as oi
			join
				orders as o on o.order_id = oi.order_id
			join
				products_info as pi on pi.product_id = oi.product_id
			join
				products as p on p.product_id = oi.product_id
			join
				catagories as cat on p.catagory_id = cat.catagory_id
			join 
				languages as l on l.language_id = pi.language_id 
			where
				oi.order_id = $1 and l.language_code = $2 and o.order_status = 0
			order by oi.orderitem_created_at asc
			;
		`

		const data = await fetch(GET_ORDER_ITEM, arr)

		return {
			status: 200,
			message: 'ok',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

const getMyOrders = async (arr) => {

	try {
		
		const MY_ORDER = `
			select
				o.order_id as id,
				o.order_id as name,
				o.order_status as status,
				to_char(o.order_created_at, 'dd-mm-yyyy') as created,
				array_agg(pi.product_info_name) as product_name,
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
				c.tg_user_id = $1 and l.language_code = $2 and o.order_status <> 0 and o.order_status <> 5
			group by id
			order by id desc
			limit 5
			;
		`

		const data = await fetch(MY_ORDER, arr)

		return {
			status: 200,
			message: 'ok',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

//=========================== BOOKORDER ===========================//

const bookOrder = async (arr) => {

	try {
		
		const BOOKORDER = `
			select make_order_pending($1, $2, $3) as order_id;

		`

		const data = await fetch(BOOKORDER, arr)

		return {
			status: 200,
			message: 'order booked',
			data: data
		}

	} catch(e) {
		console.log(e)
		return {
			status: 500,
			message: e.message
		}
	}

}

module.exports = {
	addClient, // client
	getOneClient, // client
	editClient, // client
	setContact, // client
	setName, // client name
	addStep, // step
	getStep, // step
	editStep, // step
	knowLang, // language
	getRegions, // region
	setRegion, // region
	getInfos, // infos
	getCatagories, // catagories
	getProducts, // products
	getProduct, // product
	createOrder, // orders
	getClientOrder, // orders
	editOrder, // orders
	createOrderItem, // orderitems
	getClientOrderItems, // orderitems
	bookOrder, // bookorder
	getMyOrders, // orders
}
