const { Router } = require('express')
const controller = require('./admin.controller')
const { verify } = require('./../../libs/jwt/jwt')
const cors = require('cors')

const router = Router()

router.use(cors())

// { 
// 	origin: 'http://localhost',
// 	optionsSuccessStatus: 200
// }

router.use((req, res, next) => {
	const { token } = req.headers

	if(req.path !== '/login') {
		
		// here we check the token in header
		try {
			const decoded = verify(token)

			next()
		} catch(e) {
			console.log(e)

			res.send({
				code: 401,
				message: e.message
			}).status(401)
		}

	} else {
		next()
	}

})

// /admin/login
router
	.route('/login')
	.post(controller.login)

// /admin/orders
router
	.route('/orders')
	.put(controller.editOne)

// fetch all orders by pagination and language
router
	.route('/orders/:language/:page_size/:page_number')
	.get(controller.getAll)

// get one Client's all orders
router
	.route('/orders/:language/:client_id')
	.get(controller.getClientOrders)

// /admin/orders/:id
router
	.route('/order/:language/:order_id')
	.get(controller.getOne)

// get all clients with count orders
router
	.route('/clients/:language/:page_size/:page_number')
	.get(controller.getAllClients)

// catagories
// get cat info
router
	.route('/catagories/:catagory_id/:language')
	.get(controller.getOneCatagory)

router
	.route('/catagories')
	.get(controller.getCatagories)
	.put(controller.setCatagories)
	.delete(controller.deleteCatagories)
	.post(controller.createCatagories)

// catagoriesinfo
router
	.route('/catagoriesinfo')
	.get(controller.getCatagoriesInfo)
	.put(controller.setCatagoriesInfo)
	.delete(controller.deleteCatagoriesInfo)
	.post(controller.createCatagoriesInfo)

// products
router
	.route('/products/:product_id/:language')
	.get(controller.getOneProduct)

router
	.route('/products')
	.get(controller.getProducts)
	.put(controller.setProducts)
	.delete(controller.deleteProducts)
	.post(controller.createProducts)

// productsinfo
router
	.route('/productsinfo')
	.get(controller.getProdcutsInfo)
	.put(controller.setProdcutsInfo)
	.delete(controller.deleteProdcutsInfo)
	.post(controller.createProdcutsInfo)

// admin
router
	.route('/admins')
	.post(controller.createAdmin)
	.get(controller.getAdmins)
	.delete(controller.deleteAdmin)

// search
router
	.route('/search')
	.get(controller.search)

// stats
router
	.route('/stats')
	.get(controller.getStats)

// comments
router
	.route('/comments')
	.get(controller.getComments)
	.put(controller.setComments)
	.post(controller.createComments)

// infos
router
	.route('/infos')
	.get(controller.getInfos)
	.put(controller.setInfos)
	.post(controller.createInfos)

// badge
router
	.route('/badge')
	.put(controller.setBadge)


module.exports = router
