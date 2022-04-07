const Pool = require('pg').Pool
require('dotenv').config()

const pool = new Pool({
	user: 'postgres',
	password: '123',
	database: 'shoptoli',
	port: 5432,
	host: 'localhost'
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
