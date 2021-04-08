const parser = require('body-parser')

const adminRouter = require('./resources/admin/admin.route')
const botRouter = require('./resources/bot/bot.route')

const run = (express) => {
	
	const app = express()
	
	app.use(parser.json())

	app.use((req, res, next) => {
		console.log(`====== ${req.url} || ${req.method} ======`)
		next()
	})

	app.use('/admin', adminRouter)
	app.use('/bot', botRouter)

	return app
}

module.exports.run = run
