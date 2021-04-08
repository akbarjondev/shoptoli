const parser = require('body-parser')

const adminRouter = require('./resources/admin/admin.route')
const botRouter = require('./resources/bot/bot.route')

const { fetch } = require('./db/db')

const run = (express) => {
	
	const app = express()
	
	app.use(parser.json())

	// write API request history
	app.use(async (req, res, next) => {
		try {
			let data = req.method === 'GET' ? `${req.url};;${req.method}` : `${req.url};;${req.method};;${JSON.stringify(req.body)}`
			await fetch(`insert into api_history(api_history_text) values($1)`, [data])
			
			next()
		} catch(e) {
			console.log(e)

			next()
		}
	})

	// routers
	app.use('/admin', adminRouter)
	app.use('/bot', botRouter)

	return app
}

module.exports.run = run
