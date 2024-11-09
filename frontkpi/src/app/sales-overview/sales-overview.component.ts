import { Component, OnInit } from '@angular/core';
import { SalesService } from '../sales.service';

@Component({
  selector: 'app-sales-overview',
  templateUrl: './sales-overview.component.html',
  styleUrls: ['./sales-overview.component.css']
})
export class SalesOverviewComponent implements OnInit {
  salesData: any[] = [];  // Sales data to display in the Dashboard
  loading = true;
  error: string | null = null;

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.fetchSalesData();
  }

  fetchSalesData(): void {
    this.salesService.getSalesOverview().subscribe({
      next: (data) => {
        this.salesData = data; // Fetch the data from the service
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }
}
