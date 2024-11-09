import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: any[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadNewClients();
  }

  loadNewClients(): void {
    this.clientService.getNewClients().subscribe(
      (data) => {
        this.clients = data;
      },
      (error) => {
        console.error('Error loading new clients:', error);
      }
    );
  }
}
