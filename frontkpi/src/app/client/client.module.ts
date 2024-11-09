export interface Client {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  dateCreation: string;
  commandes: any[];         // Replace 'any' with the correct type if you have a structure for commands
  reclamations: any[];      // Replace 'any' with the correct type if you have a structure for complaints
  satisfaction: any[];      // An array since the backend expects this to be an array
}
