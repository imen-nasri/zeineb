const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nom: String,
  categorie: String,
  prixUnitaire: Number,
  ventesTotales: Number,
  revenuTotal: Number
});

module.exports = mongoose.model('Product', productSchema);
