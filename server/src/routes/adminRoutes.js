const express = require('express');
const {searchStudent} = require('../controllers/adminSearch');
const { portfolioDetails } = require('../controllers/portfolioDetails');
const {skillBasedSearch} = require('../controllers/skillBasedSearch')
const authorization = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');

const routes = express.Router();

routes.get('/studentsearch', verifyToken ,authorization('admin') , searchStudent);

routes.get('/getdetails', verifyToken , authorization('admin') , portfolioDetails);

routes.post('/getstudent', verifyToken , authorization('admin') , skillBasedSearch);



module.exports = routes;