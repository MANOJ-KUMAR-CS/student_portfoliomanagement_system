const express = require('express');

const routes = express.Router();

const {createPortfolio} = require('../controllers/portfolioCreation');
const {getDetails} = require('../controllers/portfolioFind');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

routes.post('/create/:id', verifyToken  , authorization('student') ,createPortfolio);
routes.get('/find/:id' , verifyToken , authorization('student') , getDetails);

module.exports = routes;