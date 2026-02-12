const express = require('express');

const routes = express.Router();

const {userLogin} = require('../controllers/loginController');
const {userRegister} = require('../controllers/registerController');
const {generateOtp} = require('../controllers/otpGeneration');
const { verifyOtp } = require('../controllers/otpVerification');
const { resetPassword } = require('../controllers/passwordUpdate');

const authorization = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');
const verifyResetToken = require('../middleware/verifyResetToken');


routes.post('/login' , userLogin);
routes.post('/register', verifyToken, authorization(['admin']), userRegister);
routes.post('/generateopt' , generateOtp);
routes.post('/verifyotp', verifyOtp );
routes.post('/resetpassword' , verifyToken , verifyResetToken() ,  resetPassword)


module.exports = routes;