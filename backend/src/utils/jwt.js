const jwt = require('jsonwebtoken');

function signAccessToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { signAccessToken };
