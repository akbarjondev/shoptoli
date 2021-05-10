const jwt = require('jsonwebtoken')

;require('dotenv').config()

module.exports = {
	sign: (payload) => jwt.sign(payload, 'Ajwa_taomlari!', { expiresIn: '3h' }), // payload must be Object {foo: 'bar'}
	verify: (token) => jwt.verify(token, 'Ajwa_taomlari!')
}
