const text = require('./../texts.js')

module.exports = {
	product_quantity: (cat_id, id) => {

		return [
			{ name: 1, id: 1, cat_id, product_id: id },
			{ name: 2, id: 2, cat_id, product_id: id },
			{ name: 3, id: 3, cat_id, product_id: id },
			{ name: 4, id: 4, cat_id, product_id: id },
			{ name: 5, id: 5, cat_id, product_id: id },
			{ name: 6, id: 6, cat_id, product_id: id },
			{ name: 7, id: 7, cat_id, product_id: id },
			{ name: 8, id: 8, cat_id, product_id: id },
			{ name: 9, id: 9, cat_id, product_id: id }
		]

	},

	cart_keyboards: (userLang, orderId) => {

		return [
			[ { text: text.cart.buttons.agree[userLang], callback_data: 'agree' + orderId } ],
			[ 
				{ text: text.cart.buttons.back_home[userLang], callback_data: 'back:ct:undefined' }, 
				{ text: text.cart.buttons.clear[userLang], callback_data: 'back:ct:undefined:clear:' + orderId } 
			]
		]

	}
}
