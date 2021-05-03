const parser = require('body-parser')

const adminRouter = require('./resources/admin/admin.route')
const botRouter = require('./resources/bot/bot.route')

const http = require('http')
const { Server } = require('socket.io')
const { ee } = require('./libs/ee/ee')

const { fetch } = require('./db/db')

const run = (express) => {
	
	const app = express()
	const server = http.createServer(app)
	const io = new Server(server)
	
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

	// socket.io and EventEmitter
	ee.on('select_new_order', (obj) => {

		io.emit('client_order', obj)

	})

	return server
}

module.exports.run = run
