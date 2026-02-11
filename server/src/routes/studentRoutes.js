const express = require('express');

const routes = express.Router();

const {createPortfolio} = require('../controllers/portfolioCreation');
const {getDetails} = require('../controllers/portfolioFind');
const { updatePortfolio } = require('../controllers/portfolioUpdate');

const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

routes.use(verifyToken, authorization('student'));

routes.post('/createportfolio/:id', createPortfolio);
routes.get('/findportfolio/:id', getDetails);
routes.put('/updateportfolio/:id', updatePortfolio);

module.exports = routes;