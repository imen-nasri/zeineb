const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    adresse: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true },
    dateCreation: { type: Date, required: true },
    commandes: [
      {
        idCommande: { type: String, required: true },
        dateCommande: { type: Date, required: true },
        produits: [
          {
            idProduit: { type: String, required: true },
            quantite: { type: Number, required: true },
            prixUnitaire: { type: Number, required: true },
          }
        ],
        montantTotal: { type: Number, required: true }
      }
    ],
    reclamations: [
      {
        idReclamation: { type: String, required: true },
        dateReclamation: { type: Date, required: true },
        type: { type: String, required: true },
        description: { type: String, required: true },
        statut: { type: String, required: true },
        dateResolution: { type: Date }
      }
    ],
    satisfaction: [
      {
        dateEnquete: { type: Date, required: true },
        score: { type: Number, required: true },
        commentaire: { type: String, required: true },
        typeContact: { type: String, required: true }
      }
    ]
  });
  module.exports = mongoose.model('Client', clientSchema); 