import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      nom: ['', Validators.required],
      categorie: ['', Validators.required],
      prixUnitaire: [0, [Validators.required, Validators.min(0)]],
      ventesTotales: [0, [Validators.required, Validators.min(0)]],
      revenuTotal: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService.addProduct(productData).subscribe(response => {
        console.log('Product added successfully', response);
        this.productForm.reset(); // Reset the form
      }, error => {
        console.error('Error adding product', error);
      });
    }
  }
}
