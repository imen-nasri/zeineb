import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';  // Make sure the path is correct
import { Client } from '../client/client.module'; // Import the Client model

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})
export class AddClientComponent {
  client: Client = {
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
    dateCreation: '',
    commandes: [],
    reclamations: [],
    satisfaction: []  // Set as an empty array to match backend expectations
  };

  constructor(private clientService: ClientService, private router: Router) {}

  addClient() {
    console.log("Client data being sent:", this.client);
    this.clientService.addClient(this.client).subscribe(
      (response) => {
        console.log('Client added successfully!', response);
        this.router.navigate(['/dashboard']); // Redirect to dashboard or another page
      },
      (error) => {
        console.error('Error adding client:', error);
        if (error.status === 400) {
          console.error('Bad Request details:', error.error);
        }
      }
    );
  }
}
