const helper = require('./../../helper')
const fetch = require('node-fetch')

const text = require('./../../texts')
const CONFIG = require('./../../config/config')
const step = require('./../step/step.model')
const INLINE_KDBS = require('./../../keyboards/inline_keyboards')

const getAction = async (cb) => {

	const dataArr = cb.data.split(':')

	// get to know user's language
	const userLang = await helper.getUserLang(helper.getChatId(cb))

	// get user's step
	const userStep = await step.getStep(cb)

	// get conpany general info
	const info = await helper.getCompanyInfo()

	console.log(dataArr)

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

			if(response.status === 200) {

				// edit step from start to region
				step.editStep(cb, 'region')
				
				// answer to the presed inline button
				bot.answerCallbackQuery(cb.id, text.selectLang[dataArr[1]], false)

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

			}

		} catch(e) {
			console.log(e)
		}

	} // end of changing Language

	// ================ SELECT REGION ================ //

	if(dataArr[0] === 'region') {

		// set user's region
		const regionRes = await helper.setRegion(helper.getChatId(cb), dataArr[1])

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
		step.editStep(cb, 'quantity')

	} // end of product select

} // end of getAction - callback function

module.exports = {
	getAction,
}
