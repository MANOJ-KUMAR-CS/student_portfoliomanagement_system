const express = require('express');

const routes = express.Router();

const {userLogin} = require('../controllers/loginController');
const {userRegister} = require('../controllers/registerController');

routes.post('/login' , userLogin);
routes.post('/register', userRegister);

module.exports = routes;