const Client = require('../models/Client');
const Product = require('../models/Product');
const Sale = require('../models/Sale');


// Get total turnover
exports.getTurnover = async (req, res) => {
  try {
    const ventes = await Sale.aggregate([
      { $group: { _id: null, totalTurnover: { $sum: "$montantTotal" } } }
    ]);
    res.json({ turnover: ventes[0]?.totalTurnover || 0 });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get sales overview
exports.getSalesOverview = async (req, res) => {
  try {
    const salesOverview = await Product.find({}, { nom: 1, ventesTotales: 1 });
    res.json(salesOverview);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get best seller
exports.getBestSeller = async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ ventesTotales: -1 });
    res.json(bestSeller);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get customer reclamations
exports.getReclamations = async (req, res) => {
  try {
    const reclamations = await Client.aggregate([
      { $unwind: "$reclamations" },
      { $project: { _id: 1, nom: 1, "reclamations.description": 1, "reclamations.statut": 1 } }
    ]);
    res.json(reclamations);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get client satisfaction
exports.getSatisfaction = async (req, res) => {
  try {
    const satisfaction = await Client.aggregate([
      { $unwind: "$satisfaction" },
      { $group: { _id: null, avgSatisfaction: { $avg: "$satisfaction.score" } } }
    ]);
    res.json({ avgSatisfaction: satisfaction[0]?.avgSatisfaction || 0 });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// Insert a new client
exports.addClient = async (req, res) => {
    console.log(req.body);  // Log the request body
    const newClient = new Client(req.body);
    try {
      await newClient.save();
      res.status(201).json(newClient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Insert a new product
  exports.addProduct = async (req, res) => {
    const newProduct = new Product(req.body);
    try {
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  // Insert a new sale
  exports.addSale = async (req, res) => {
    const newSale = new Sale(req.body);
    try {
      await newSale.save();
      res.status(201).json(newSale);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
  
   // Get new clients (who made their first order recently)
  exports.getNewClients = async (req, res) => {
    try {
      const daysAgo = req.query.days || 30; // You can adjust the number of days as needed
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - daysAgo);
  
      // Query to find clients whose first order or account creation is within the defined period
      const newClients = await Client.find({
        $or: [
          { "commandes.dateCommande": { $gte: dateThreshold } }, // First order within the period
          { dateCreation: { $gte: dateThreshold } } // Account created within the period
        ]
      });
  
      res.status(200).json(newClients);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  