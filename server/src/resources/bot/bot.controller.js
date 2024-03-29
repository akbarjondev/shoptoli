const model = require('./bot.model')
const { ee } = require('./../../libs/ee/ee')

//=========================== CLIENT ===========================//

const addClient = async (req, res) => {

	const { tg_user_id, tg_first_name, tg_last_name, tg_username } = req.body

	const dbCleintRes = await model.addClient([ tg_user_id, tg_first_name, tg_last_name, tg_username ])

	res.send(dbCleintRes).end()
}

const getOneClient = async (req, res) => {

	const { tg_user_id } = req.params

	const dbGetOneCleint = await model.getOneClient([ tg_user_id ])

	res.send(dbGetOneCleint).end()

}

const editOneClient = async (req, res) => {

	const { tg_user_id, language_id } = req.body

	const dbEditCleint = await model.editClient([ tg_user_id, language_id ])

	res.send(dbEditCleint).end()
}

const getClientLang = async (req, res) => {

	const { tg_user_id } = req.params

	const getClientLang = await model.knowLang([ tg_user_id ])

	res.send(getClientLang).end()
}

const setClientContact = async (req, res) => {

	const { tg_user_id, phone_number } = req.body

	const modelSetClientContact = await model.setContact([ phone_number, tg_user_id ])

	res.send(modelSetClientContact).end()
}

const setClientName = async (req, res) => {

	const { tg_user_id, name } = req.body

	const modelSetClientName = await model.setName([ name, tg_user_id ])

	res.send(modelSetClientName).end()
}

//=========================== STEP ===========================//

const getStep = async (req, res) => {

	const { tg_user_id } = req.params

	const dbStepRes = await model.getStep([tg_user_id])

	res.send(dbStepRes).end()
}

const addStep = async (req, res) => {

	const { tg_user_id, step_name } = req.body

	const dbStepRes = await model.addStep([step_name, tg_user_id])

	res.send(dbStepRes).end()
}

const editStep = async (req, res) => {

	const { tg_user_id, step_name } = req.body

	const dbStepRes = await model.editStep([step_name, tg_user_id])

	res.send(dbStepRes).end()
}

//=========================== REGIONS ===========================//

const getRegions = async (req, res) => {

	const { language } = req.params

	const dbGetRegions = await model.getRegions([ language ])

	res.send(dbGetRegions).end()
}

const setRegion = async (req, res) => {

	const { region_id, tg_user_id } = req.body

	const dbSetRegion = await model.setRegion([ region_id, tg_user_id ])

	res.send(dbSetRegion).end()
}

//=========================== INFOS ===========================//

const getInfos = async (req, res) => {

	const dbGetInfos = await model.getInfos()

	res.send(dbGetInfos).end()
}

//=========================== CATAGORIES ===========================//

const getCatagories = async (req, res) => {

	const { language } = req.params

	const dbGetCatagories = await model.getCatagories([ language ])

	res.send(dbGetCatagories).end()
}

//=========================== PRODUCTS ===========================//

const getProducts = async  (req, res) => {

	const { catagory_id, language_id } = req.params

	const dbGetProducts = await model.getProducts([ catagory_id, language_id ])

	res.send(dbGetProducts).end()
}

//=========================== PRODUCT ===========================//

const getProduct = async  (req, res) => {

	const { product_id, language_id } = req.params

	const dbGetProduct = await model.getProduct([ product_id, language_id ])

	res.send(dbGetProduct).end()
}

//=========================== ORDERS ===========================//

const createOrder = async  (req, res) => {

	const { client_id } = req.body

	const dbCreateOrder = await model.createOrder([ client_id ])

	res.send(dbCreateOrder).end()
}

const getClientOrder = async  (req, res) => {

	const { tg_user_id } = req.params

	const dbClientOrder = await model.getClientOrder([ tg_user_id ])

	res.send(dbClientOrder).end()
}

const editOrder = async  (req, res) => {

	const { order_id, edit_code } = req.body

	const dbEditOrder = await model.editOrder([ order_id, edit_code ])

	res.send(dbEditOrder).end()
}

//=========================== ORDERITEMS ===========================//

const createOrderItem = async  (req, res) => {

	const { order_id, orderitem_quantity, product_id } = req.body

	const dbCreateOrderItem = await model.createOrderItem([ orderitem_quantity, order_id, product_id ])

	res.send(dbCreateOrderItem).end()
}

const getClientOrderItems = async  (req, res) => {

	const { order_id, language_id } = req.params

	const dbGetAllOrderItems = await model.getClientOrderItems([ order_id, language_id ])

	res.send(dbGetAllOrderItems).end()
}

const getMyOrders = async  (req, res) => {

	const { tg_user_id, language_id } = req.params

	const dbGetMyOrders = await model.getMyOrders([ tg_user_id, language_id ])

	res.send(dbGetMyOrders).end()
}

//=========================== ORDER STEPS ===========================//

const addOrdersteps = async (req, res) => {
	const { tg_user_id, product_id } = req.params

	const dispatcher = await model.addOrdersteps([ tg_user_id, product_id ])

	res.send(dispatcher).end()
}

const getOrdersteps = async (req, res) => {
	const { tg_user_id } = req.params

	console.log(req.params);

	const dispatcher = await model.getOrdersteps([ tg_user_id ])

	res.send(dispatcher).end()
}

//=========================== BOOK ORDER ===========================//

const bookOrder = async  (req, res) => {

	const { tg_user_id, longitude, latitude } = req.body

	const dbBookOrder = await model.bookOrder([ tg_user_id, longitude, latitude ])

	// send order id to the next 
	// req.client_order_res = dbBookOrder

	ee.emit('new_order', dbBookOrder)

	res.send(dbBookOrder).end()
}

module.exports = {
	addClient, // client
	getOneClient, // client
	editOneClient, // client
	getClientLang, // language
	setClientContact, // client contact
	setClientName, // client name
	addStep, // step
	getStep, // step
	editStep, // step
	getRegions, // region
	setRegion, // region
	getInfos, // info general
	getCatagories, // catagories
	getProducts, // products
	getProduct, // product
	createOrder, // orders
	getClientOrder, // orders
	editOrder, // orders
	createOrderItem, // orderitems
	getClientOrderItems, // orderitems
	addOrdersteps, // ordersteps
	getOrdersteps, // ordersteps
	bookOrder, // bookOrder
	getMyOrders, // orders
}
