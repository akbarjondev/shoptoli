const adminRouter = require('./resources/admin/admin.route')

const run = (express) => {
	
	const app = express()
	
	app.use('/admin', adminRouter)

	return app
}

module.exports.run = run
