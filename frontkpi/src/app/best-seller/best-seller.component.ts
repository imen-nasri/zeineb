import { Component, OnInit } from '@angular/core';

import { SaleService } from '../sale.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css']
})
export class BestSellerComponent implements OnInit {
  bestSeller: any = null;
  errorMessage: string | null = null;

  constructor(private saleService: SaleService) {}

  ngOnInit(): void {
    this.fetchBestSeller();
  }

  fetchBestSeller() {
    this.saleService.getBestSeller().subscribe(
      (data) => {
        this.bestSeller = data;
      },
      (error) => {
        console.error('Error:', error);
        this.errorMessage = 'Failed to load best seller data.';
      }
    );
  }
}
