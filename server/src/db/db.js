const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
	user: process.env.user,
	password: process.env.db_secret,
	database: process.env.database,
	port: 5432,
	host: process.env.host
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
