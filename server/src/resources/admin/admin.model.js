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

// login
const login = async (arr) => {

	const SELECT_USER = `
		select
			admin_id,
			admin_username
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
}
