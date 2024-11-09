import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SaleService } from '../sale.service'; // Make sure to import your SaleService

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {
  saleForm: FormGroup;
  currentStep = 1;

  constructor(private fb: FormBuilder, private saleService: SaleService) {
    this.saleForm = this.fb.group({
      dateVente: ['', Validators.required],
      produits: this.fb.array([]), // Initialize the FormArray for products
      idClient: ['', Validators.required],
      idVendeur: ['', Validators.required],
      montantTotal: [{ value: 0, disabled: true }] // Readonly field
    });
  }

  ngOnInit(): void {
    this.addProduct(); // Add an initial product entry
  }

  get produits(): FormArray {
    return this.saleForm.get('produits') as FormArray;
  }

  addProduct() {
    const productGroup = this.fb.group({
      idProduit: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]], // Minimum quantity of 1
      prixUnitaire: [0, [Validators.required, Validators.min(0)]] // Minimum price of 0
    });
    this.produits.push(productGroup);
  }

  removeProduct(index: number) {
    this.produits.removeAt(index);
    this.calculateTotal(); // Recalculate total when a product is removed
  }

  calculateTotal() {
    let total = 0;
    this.produits.controls.forEach(product => {
      const quantity = product.get('quantite')?.value || 0;
      const unitPrice = product.get('prixUnitaire')?.value || 0;
      total += quantity * unitPrice;
    });
    this.saleForm.patchValue({ montantTotal: total });
  }
  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
  onSubmit() {
    if (this.saleForm.valid) {
      const saleData = this.saleForm.value;
      // Here you would typically call your service to add the sale
      this.saleService.addSale(saleData).subscribe(response => {
        console.log('Sale added successfully', response);
        // Reset the form or handle success
        this.saleForm.reset();
        this.addProduct(); // Reset the products
      }, error => {
        console.error('Error adding sale', error);
      });
    }
  }
}
