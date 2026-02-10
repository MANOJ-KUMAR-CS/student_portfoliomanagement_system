const express = require('express');

const routes = express.Router();

const {createPortfolio} = require('../controllers/portfolioCreation');
const {getDetails} = require('../controllers/portfolioFind');
const { updatePortfolio } = require('../controllers/portfolioUpdate');

const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

routes.post('/createportfolio/:id', verifyToken  , authorization('student') ,createPortfolio);
routes.get('/findportfolio/:id' , verifyToken , authorization('student') , getDetails);
routes.put('/updateportfolio/:id' , verifyToken , authorization('student') , updatePortfolio);

module.exports = routes;