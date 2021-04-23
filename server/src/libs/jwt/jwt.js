const jwt = require('jsonwebtoken')

;require('dotenv').config()

module.exports = {
	sign: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }), // payload must be Object {foo: 'bar'}
	verify: (token) => jwt.verify(token, process.env.JWT_SECRET)
}
