const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  dateVente: Date,
  produits: [
    {
      idProduit: String,
      quantite: Number,
      prixUnitaire: Number
    }
  ],
  idClient: String,
  idVendeur: String,
  montantTotal: Number
});

module.exports = mongoose.model('Sale', saleSchema);
