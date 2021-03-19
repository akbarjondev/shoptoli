const { fetch } = require('./../../db/db')

const many = async () => {

	const GET_ALL_CARTS = `
		select
			*
		from
			carts
		;
	`

	return await fetch(GET_ALL_CARTS)

}

module.exports = {
	many,
}
