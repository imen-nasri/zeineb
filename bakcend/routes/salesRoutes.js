const express = require('express');
const salesController = require('../controllers/sales.controller');
const router = express.Router();


router.route('/addClient').post(salesController.addClient); // Insert a new client
router.route('/addProduct').post(salesController.addProduct); // Insert a new product
router.route('/addSale').post(salesController.addSale); // Insert a new sale

router.route('/getTurnover').get( salesController.getTurnover);
router.route('/getSalesOverview').get( salesController.getSalesOverview);
router.route('/getBestSeller').get( salesController.getBestSeller);
router.route('/getReclamations').get(salesController.getReclamations);
router.route('/getSatisfaction').get( salesController.getSatisfaction);
router.route('/clients/getNewClients').get( salesController.getNewClients); // Fetch new clients 


module.exports = router;
