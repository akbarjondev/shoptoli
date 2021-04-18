const helper = require('./../../helper')
const fetch = require('node-fetch')

const text = require('./../../texts')
const CONFIG = require('./../../config/config')
const step = require('./../step/step.model')
const INLINE_KDBS = require('./../../keyboards/inline_keyboards')

const getAction = async (cb) => {

	const dataArr = cb.data.split(':')

	// get to know user's language
	const userLang = await helper.getUserObj(helper.getChatId(cb))

	// get user's step
	const userStep = await step.getStep(cb)
	const currentStep = userStep.data[0].step_name

	// get conpany general info
	const info = await helper.getCompanyInfo()

	// ================ BACK TO BACK ================ //

	if(dataArr[0] === 'back') {

		if(dataArr[2] === 'undefined' || dataArr[1] === 'ct') {

			// if user sits on products page, then he can back to catagories page
			const { step_name } = userStep.data[0]

			if(step_name === 'products') {

				// get catagories
				const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/catagories/${userLang}`)
				const { data } = await rawData.json()

				// generate inline buttons
				let inlineKeyboard = helper.kbdGenerate(data, 'catagory', 1)

				bot.editMessageText(
					`
						<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
					`,
					{
						chat_id: helper.getChatId(cb),
						message_id: helper.getMsgId(cb),
						parse_mode: 'html',
						reply_markup: {
							inline_keyboard: inlineKeyboard
						}
					}
				)

				// edit step from start to catagories
				step.editStep(cb, 'catagories')
			
			} else if(step_name === 'cart') {

				// ================ CLEAR BASKET ================ //

				if(dataArr[3] === 'clear') {

					const [ ,,,, orderId ] = dataArr

					const editOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/orders`,{
						method: 'put',
						headers: {
							'Content-type': 'application/json'
						},
						body: JSON.stringify({
							order_id: orderId,
							edit_code: 6
						})
					})

					const { status } = await editOrder.json()

					if(status === 200) {
						// answer for clear basket
						bot.answerCallbackQuery(cb.id, text.clearBasketModal[userLang], false)
					}

				} // end of clear select

				// send catagories user clean his cart
				// delete message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(cb), 
					helper.getMsgId(cb)
				)

				// get catagories
				const rawData = await fetch(`${CONFIG.SERVER_HOST}/bot/catagories/${userLang}`)
				const { data } = await rawData.json()

				// generate inline buttons
				let inlineKeyboard = helper.kbdGenerate(data, 'catagory', 1)

				// send message with products
				bot.sendMessage(
					helper.getChatId(cb),
					`
						<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
					`,
					{
					reply_markup: {
						inline_keyboard: inlineKeyboard
					},
					parse_mode: 'html'
				})

			}

		} else if(dataArr[1] === 'ps') {

			const catagory_id = dataArr[2]

			// change step
			step.editStep(cb, 'products')

			// get products based on catagory ID
			const getProducts = await fetch(`${CONFIG.SERVER_HOST}/bot/products/${catagory_id}/${userLang}`)
			const { data, status } = await getProducts.json()
		
			// generate inline buttons
			let inlineKeyboard = helper.kbdGenerate(data, 'product', 3, 'ct')

			if(status === 200) {

				// delete message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(cb), 
					helper.getMsgId(cb)
				)

				// send message with products
				bot.sendMessage(
					helper.getChatId(cb),
					`
						<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
					`,
					{
					reply_markup: {
						inline_keyboard: inlineKeyboard
					},
					parse_mode: 'html'
				})

			}
		}

	} // user press back


	// ================ CHANGE LANGUAGE ================ //

	if(dataArr[0] === 'lang') {

		try {
			
			// write user language to the database
			const editClientLang = await fetch(`${CONFIG.SERVER_HOST}/bot/client`, {
				method: 'put',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					tg_user_id: helper.getChatId(cb),
					language_id: dataArr[1]
				})
			})

			// get changed language response
			const response = await editClientLang.json()

			if(response.status === 200 && currentStep === 'change:language') {

				// change step to settings
				step.editStep(cb, 'settings')

				// answer for selecting region
				bot.answerCallbackQuery(cb.id, text.selectLang[dataArr[1]], false)

				// get client info
				const clientInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/client/${helper.getChatId(cb)}`)
				const { data: [ clientObj ], status } = await clientInfo.json()
				const clientInfoText = `<b>${text.clientInfo.name[dataArr[1]]}:</b> ${clientObj?.name || clientObj?.tg_name}\n<b>${text.clientInfo.region[dataArr[1]]}:</b> ${clientObj?.region}\n<b>${text.clientInfo.languageText[dataArr[1]]}:</b> ${text.clientInfo.language[clientObj?.language]}\n\n${text.clientInfo.text[dataArr[1]]}`
		
				// delete message with inline keyboard
				bot.deleteMessage(
					helper.getChatId(cb), 
					helper.getMsgId(cb)
				)
		
				// send main menu
				bot.sendMessage(
					helper.getChatId(cb), 
					text.mainMenu.text[dataArr[1]], 
					{
						parse_mode: 'html',
						reply_markup: {
			  			keyboard: [
								[{ text: text.mainMenu.keyboard.order[dataArr[1]] }],
								[
									{ text: text.mainMenu.keyboard.myOrders[dataArr[1]] }, 
									{ text: text.mainMenu.keyboard.settings[dataArr[1]] }
								]
							],
			  			resize_keyboard: true,
			  			one_time_keyboard: true
			  		}
					}
				) // end of sendMessage

			}

			if(response.status === 200 && currentStep !== 'change:language') {

				// edit step from start to region
				step.editStep(cb, 'region')
				
				// answer to the presed inline button
				bot.answerCallbackQuery(cb.id, text.selectLang[dataArr[1]], false)

				// get all regions based on user language
				const data = await helper.getRegions(dataArr[1])

				// generate inline buttons
				let inlineKeyboard = helper.kbdGenerate(data, 'region', 3)

	      // edit message with select region text and buttons
				bot.editMessageText(
					text.askRegion[dataArr[1]],
					{
					chat_id: helper.getChatId(cb), 
					message_id: helper.getMsgId(cb),
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
				})

			}

		} catch(e) {
			console.log(e)
		}

	} // end of changing Language

	// ================ SELECT REGION ================ //

	if(dataArr[0] === 'region') {

		// set user's region
		const regionRes = await helper.setRegion(helper.getChatId(cb), dataArr[1])

		// works when user select region from settings menu
		if(regionRes.status === 200 && currentStep === 'change:region') {
			// change step to settings
			step.editStep(cb, 'settings')

			// answer for selecting region
			bot.answerCallbackQuery(cb.id, text.selectRegion[userLang], false)

			// get client info
			const clientInfo = await fetch(`${CONFIG.SERVER_HOST}/bot/client/${helper.getChatId(cb)}`)
			const { data: [ clientObj ], status } = await clientInfo.json()
			const clientInfoText = `<b>${text.clientInfo.name[userLang]}:</b> ${clientObj?.name || clientObj?.tg_name}\n<b>${text.clientInfo.region[userLang]}:</b> ${clientObj?.region}\n<b>${text.clientInfo.languageText[userLang]}:</b> ${text.clientInfo.language[clientObj?.language]}\n\n${text.clientInfo.text[userLang]}`
	
			// edit message with select region text and buttons
			bot.editMessageText(
				clientInfoText,
				{
				chat_id: helper.getChatId(cb), 
				message_id: helper.getMsgId(cb),
				reply_markup: {
					inline_keyboard: [
						[
							{ text: text.clientInfo.name[userLang], callback_data: 'change:name' },
							{ text: text.clientInfo.region[userLang], callback_data: 'change:region' },
							{ text: text.clientInfo.languageText[userLang], callback_data: 'change:language' }	
						]
					]
				},
				parse_mode: 'html'
			})		
		}

		if(regionRes.status === 200 && userStep.data[0].step_name === 'region') {

			// change step
			step.editStep(cb, 'contact')

			// answer for selecting region
			bot.answerCallbackQuery(cb.id, text.selectRegion[userLang], false)

			// delete message with inline keyboard
			bot.deleteMessage(
				helper.getChatId(cb), 
				helper.getMsgId(cb)
			)

			// ask user's phone number
			bot.sendMessage(
				helper.getChatId(cb), 
				text.userPhonetext[userLang], 
				{
					parse_mode: 'html',
					reply_markup: {
		  			keyboard: [
		  				[{ text: text.userPhoneBtn[userLang], request_contact: true }]
		  			],
		  			resize_keyboard: true
		  		}
				}
			) // end of sendMessage

		}

	} // end of select region

	// ================ SELECT CATAGORY ================ //

	if(dataArr[0] === 'catagory'){

		// change step
		step.editStep(cb, 'products')

		// get products based on catagory ID
		const getProducts = await fetch(`${CONFIG.SERVER_HOST}/bot/products/${dataArr[1]}/${userLang}`)
		const { data, status } = await getProducts.json()
	
		// generate inline buttons
		let inlineKeyboard = helper.kbdGenerate(data, 'product', 3, 'ct')

		if(status === 200) {

			// edit message with select region text and buttons
			bot.editMessageText(
				`
					<b>${info.name.toUpperCase()}</b>\n\n<a href="${info.link}">📖</a> <b>${text.sendCatalog[userLang]}</b>
				`,
				{
				chat_id: helper.getChatId(cb), 
				message_id: helper.getMsgId(cb),
				reply_markup: {
					inline_keyboard: inlineKeyboard
				},
				parse_mode: 'html'
			})

		}

	} // end of catagory select

	// ================ SELECT PRODUCT ================ //

	if(dataArr[0] === 'product'){

		// change step
		step.editStep(cb, 'product')

		// get client ID
		const clientId = await helper.getUserObj(helper.getChatId(cb), true)

		// create order || open cart
		const orderRes = await fetch(`${CONFIG.SERVER_HOST}/bot/orders`, {
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				client_id: clientId
			})
		})

		// get product by ID
		const getProduct = await fetch(`${CONFIG.SERVER_HOST}/bot/product/${dataArr[1]}/${userLang}`)
		const { data, status } = await getProduct.json()

		// generate inline buttons
		let inlineKeyboard = helper.kbdGenerate(INLINE_KDBS.product_quantity(data[0].cat_id, data[0].id), 'quantity', 3, 'ps')

		if(status === 200) {

			// delete message with inline keyboard
			bot.deleteMessage(
				helper.getChatId(cb), 
				helper.getMsgId(cb)
			)

			const caption = `
			 	<b>${data[0].name.toUpperCase()}</b>\n<b>${text.price[userLang]}:</b> <b>${data[0].price} ${text.currency[userLang]}</b>\n<b>${text.partof[userLang]}:</b> ${data[0].desc}\n\n${text.selectQuantity[userLang]}
			`

			// send message with select quantity of product
			bot.sendPhoto(
				helper.getChatId(cb), 
				data[0].image,
				{
					caption: caption,
					parse_mode: 'html',
					reply_markup: {
		  			inline_keyboard: inlineKeyboard
		  		}
				}
			) // end of sendPhoto

		}

	} // end of product select

	// ================ SELECT QUANTITY ================ //

	if(dataArr[0] === 'quantity'){

		const quantity = dataArr[1]
		const product_id = dataArr[3]

		// change step
		step.editStep(cb, 'cart')

		// get product by ID
		const getClientOrder = await fetch(`${CONFIG.SERVER_HOST}/bot/orders/${helper.getChatId(cb)}`)
		const { data: [ orderObj ] } = await getClientOrder.json()

		// get order_id
		const { order_id } = orderObj

		// add product to the orderitems || cart
		const orderItemRes = await fetch(`${CONFIG.SERVER_HOST}/bot/orderitems`, {
			method: 'post',
			headers: {
				'Content-type': 'application/json'
			},
			body: JSON.stringify({
				order_id: order_id,
				orderitem_quantity: quantity,
				product_id: product_id
			})
		})

		const { status, data: orderData } = await orderItemRes.json()

		// if orderitem added
		if(status === 200 && orderData.length > 0) {

			// get client's all orderitems
			const getClientOrderItems = await fetch(`${CONFIG.SERVER_HOST}/bot/orderitems/${order_id}/${userLang}`)
			const { data: allOrders } = await getClientOrderItems.json()

			// delivery will come from company general info table
			const delivery = info.price

			let countAllProduct = ''
			let productsPrice = 0

			allOrders.forEach(product => {
				productsPrice += product.price * product.quantity
				countAllProduct += product.quantity + ` ${text.cart.piece[userLang]} ` + product.name + `\n`
			})

			const cartText = `<b>${text.cart.inCart[userLang]}</b>\n\n${countAllProduct}\n<b>${text.cart.goods[userLang]}</b> ${productsPrice} ${text.currency[userLang]}\n<b>${text.cart.deliveryText[userLang]}</b> ${delivery} ${text.currency[userLang]}\n<b>${text.cart.sum[userLang]} ${productsPrice + delivery} ${text.currency[userLang]}</b>`

			bot.editMessageMedia(
				{
					type: 'photo',
					media: info.media,
					caption: cartText,
					parse_mode: 'html'
				},
				{
					chat_id: helper.getChatId(cb),
					message_id: helper.getMsgId(cb),
					reply_markup: {
						inline_keyboard: INLINE_KDBS.cart_keyboards(userLang, order_id)
					}
				}
			)
		}

	} // end of quantity select

	// ================ SELECT QUANTITY ================ //

	if(dataArr[0] === 'agree'){

		// change step
		step.editStep(cb, 'location')

		// delete message with inline keyboard
		bot.deleteMessage(
			helper.getChatId(cb), 
			helper.getMsgId(cb)
		)

		// send message with products
		bot.sendMessage(
			helper.getChatId(cb),
			text.location.text[userLang],
			{
			reply_markup: {
				keyboard: [
					[{ text: text.location.btn[userLang], request_location: true }],
					[{ text: '🔙🏡' }]
				],
				resize_keyboard: true
			},
			parse_mode: 'html'
		})

	} // end of order || agree

	// ================ USER SETTINGS ================ //

	// user change
	if(dataArr[0] === 'change') {

		try {

			// change name
			if(dataArr[1] === 'name') {

				// edit step: change his name
				step.editStep(cb, 'change:name')

				bot.editMessageText(
					text.settings.textFullName[userLang],
					{
						chat_id: helper.getChatId(cb),
						message_id: helper.getMsgId(cb),
						parse_mode: 'html'
					}
				)

			} // end of change name

			// change region
			if(dataArr[1] === 'region') {

				// edit step: change his name
				step.editStep(cb, 'change:region')

				// get all regions based on user language
				const data = await helper.getRegions(userLang)

				// generate inline buttons
				let inlineKeyboard = helper.kbdGenerate(data, 'region', 3)

	      // edit message with select region text and buttons
				bot.editMessageText(
					text.askRegion[userLang],
					{
					chat_id: helper.getChatId(cb), 
					message_id: helper.getMsgId(cb),
					reply_markup: {
						inline_keyboard: inlineKeyboard
					}
				})

			} // end of change region

			// change language
			if(dataArr[1] === 'language') {

				// edit step: change his name
				step.editStep(cb, 'change:language')

	      // edit message with select region text and buttons
				bot.editMessageText(
					text.settings.textLanguage[userLang],
					{
					chat_id: helper.getChatId(cb), 
					message_id: helper.getMsgId(cb),
					reply_markup: {
						inline_keyboard: [
							[
								{ text: text.language[userLang].uz_text, callback_data: 'lang:uz' },
								{ text: text.language[userLang].ru_text, callback_data: 'lang:ru' }
							]
						]
					}
				})

			} // end of change language
			
		} catch(e) {
			console.log(e)
		}

	}

} // end of getAction - callback function

module.exports = {
	getAction,
}
