const authService = require('../services/authService');

const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await authService.registerUser(username, email, password);
        
        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error); // Pass to global error handler
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };