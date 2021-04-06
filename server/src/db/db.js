const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
	user: process.env.DB_USER,
	password: process.env.DB_SECRET,
	database: process.env.DB_DATABASE,
	port: 5432,
	host: process.env.DB_HOST
})

const fetch = async (SQL, params) => {
	const client = await pool.connect()
	console.log('connect db')
	
	try {
		
		const { rows } = await client.query(SQL, params)
		return rows

	} catch(e) {
		console.log(e)
	} finally {
		client.release()
		console.log('db disconnect...')
	}

}

module.exports.fetch = fetch
