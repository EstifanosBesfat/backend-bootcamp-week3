const jwt = require('jsonwebtoken');

// generate token 
function generateToken(user) {
    const payload = {
        id: user.id,
        username: user.name,
        role: user.role
    };

    // sign the token with our secret
    // expiresIn: '1h' means the user must sign in after one hour JWT expires.
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '1h'}); 
}

// verify token (bouncer)
// returns the decoded data if valid, or throws error if fake/expired
function verifyToken (token){
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {generateToken, verifyToken};