const { fetch } = require('./../../db/db')

// feytch all
const many = async (arr) => {

	const GET_ALL_ORDERS = `
		select * from fetch_orders_pagination($1, $2, $3);
	`

	return await fetch(GET_ALL_ORDERS, arr)

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

module.exports = {
	many,
	editOrder,
}
