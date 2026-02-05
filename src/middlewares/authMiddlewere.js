const { verifyToken } = require('../utils/jwtUtils');

const authenticateToken = (req, res, next) => {
    // 1. Get the header
    // Standard format: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    
    // 2. Check if header exists
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied: No Token Provided" });
    }

    // 3. Extract the token (Remove "Bearer " from the string)
    // "Bearer eyJ..." -> split(" ") -> ["Bearer", "eyJ..."] -> [1]
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Access Denied: Malformed Token" });
    }

    try {
        // 4. Verify the token using your Day 2 Utility
        const decoded = verifyToken(token);

        // 5. ATTACH USER TO REQUEST
        // This is the magic. Now any route after this knows who 'req.user' is.
        req.user = decoded;

        // 6. Let them pass
        next();

    } catch (err) {
        res.status(403).json({ error: "Invalid Token" });
    }
};

module.exports = authenticateToken;